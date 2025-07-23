const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");
const {
  verifyPrefix,
  hasTypeAndCommand,
  isLink,
  isAdmin,
} = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
  isActiveOnlyAdmins,
} = require("./database");
const { errorLog } = require("../utils/logger");
const { ONLY_GROUP_ID } = require("../config");
const { badMacHandler } = require("./badMacHandler");

exports.dynamicCommand = async (paramsHandler, startProcess) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    remoteJid,
    sendReply,
    socket,
    userJid,
    fullMessage,
    webMessage,
  } = paramsHandler;

  const activeGroup = isActiveGroup(remoteJid);

  if (activeGroup && isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userJid) {
      return;
    }

    if (!(await isAdmin({ remoteJid, userJid, socket }))) {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

      await sendReply(
        "xX| Anti-enlace activado, El Angel de Los X te ha eliminado |Xx"
      );

      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
        },
      });

      return;
    }
  }

  const { type, command } = findCommandImport(commandName);

  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  if (activeGroup) {
    if (!verifyPrefix(prefix) || !hasTypeAndCommand({ type, command })) {
      if (isActiveAutoResponderGroup(remoteJid)) {
        const response = getAutoResponderResponse(fullMessage);

        if (response) {
          await sendReply(response);
        }
      }

      return;
    }

    if (!(await checkPermission({ type, ...paramsHandler }))) {
      await sendErrorReply(
        "xX| No tiene permiso para ejecutar este comando |Xx"
      );
      return;
    }

    if (
      isActiveOnlyAdmins(remoteJid) &&
      !(await isAdmin({ remoteJid, userJid, socket }))
    ) {
      await sendWarningReply(
        "xX| Solo los administradores |Xx"
      );
      return;
    }
  }

  if (!activeGroup) {
    if (verifyPrefix(prefix) && hasTypeAndCommand({ type, command })) {
      if (command.name !== "on") {
        await sendWarningReply(
          "xX| Un administrador o El Angel de Los X debe accionar este bot |Xx"
        );
        return;
      }

      if (!(await checkPermission({ type, ...paramsHandler }))) {
        await sendErrorReply(
          "xX| Cualquiera no puede usar este comando |Xx"
        );
        return;
      }
    } else {
      return;
    }
  }

  try {
    await command.handle({
      ...paramsHandler,
      type,
      startProcess,
    });
  } catch (error) {
    if (badMacHandler.handleError(error, `command:${command?.name}`)) {
      await sendWarningReply(
        "xX| Error temporal de sincronización |Xx"
      );
      return;
    }

    if (badMacHandler.isSessionError(error)) {
      errorLog(
        `xX| Error de sesión durante la ejecución del comando ${command?.name}: ${error.message} |Xx`
      );
      await sendWarningReply(
        "xX| Error de comunicación. Intenta ejecutar el comando de nuevo |Xx"
      );
      return;
    }

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`--NO PERMITIDO-- ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else if (error.isAxiosError) {
      const messageText = error.response?.data?.message || error.message;
      const url = error.config?.url || "URL no disponible";

      const isSpiderAPIError = url.includes("api.spiderx.com.br");

      await sendErrorReply(
        `xX| No permitido por El Angel de Los X |Xx`
      );
    } else {
      errorLog("xX| Error al ejecutar comando |Xx", error);
      await sendErrorReply(
        `xX| No permitido por El Angel de Los X ${command.name} |Xx`
      );
    }
  }
};
