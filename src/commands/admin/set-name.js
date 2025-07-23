const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "set-name",
  description: "Altera el nombre de XTIALISMO y guarda el nombre anterior.",
  commands: ["set-name", "set-group-name", "mudar-nome-grupo", "nome-grupo"],
  usage: `${PREFIX}set-name nuevo nombre de XTIALISMO`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    remoteJid,
    socket,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new WarningError("xX| Este comando solo puede ser utilizado en XTIALISMO |Xx");
    }

    if (!fullArgs) {
      throw new InvalidParameterError(
        "xX| Se requiere proporcionar un nuevo nombre para XTIALISMO |Xx"
      );
    }

    const minLength = 3;
    const maxLength = 40;

    if (fullArgs.length < minLength || fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `xX| El nombre de XTIALISMO debe tener entre ${minLength} y ${maxLength} caracteres |Xx`
      );
    }

    try {
      await sendWaitReply("Alterando el nombre de XTIALISMO...");

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const oldName = groupMetadata.subject;

      await socket.groupUpdateSubject(remoteJid, fullArgs);

      await sendSuccessReply(
        `xX| Nombre de XTIALISMO alterado.\n\n*Anterior*: ${oldName}\n\n*Nuevo*: ${fullArgs} |Xx`
      );
    } catch (error) {
      errorLog("Error al alterar el nombre de XTIALISMO:", error);
      await sendErrorReply(
        "xX| Fallo al alterar el nombre de XTIALISMO. Verifique si se poseen permisos de administrador |Xx"
      );
    }
  },
};
