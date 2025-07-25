const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { InvalidParameterError, WarningError, DangerError } = require(`${BASE_DIR}/errors`); // Asegurarse de importar los errores necesarios

module.exports = {
  name: "promover",
  description: "Promueve a un usuario a administrador de XTIALISMO.",
  commands: ["promover", "promove", "promote", "add-adm"],
  usage: `${PREFIX}promover @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    socket,
    sendWarningReply,
    sendSuccessReply,
    sendErrorReply,
    isGroup // Asegurarse de que isGroup esté disponible en props
  }) => {
    if (!isGroup(remoteJid)) {
      throw new WarningError("xX| Este comando solo puede ser utilizado en XTIALISMO |Xx");
    }

    if (!args.length || !args[0]) {
      throw new InvalidParameterError("xX| Por favor, marque un usuario para promover |Xx");
    }

    const userId = args[0].replace("@", "") + "@s.whatsapp.net";

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "promote");
      await sendSuccessReply("xX| Usuario ha dejado de ser normal |Xx");
    } catch (error) {
      errorLog(`Error al promover usuario: ${error.message}`);
      await sendErrorReply(
        "xX| Ocurrió un error al intentar promover al usuario. Se requiere ser administrador de XTIALISMO para promover a otros usuarios |Xx"
      );
    }
  },
};
