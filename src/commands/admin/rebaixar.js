const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`); // Asegurarse de importar los errores necesarios

module.exports = {
  name: "rebaixar",
  description: "Rebaja a un administrador a miembro común de XTIALISMO.",
  commands: ["rebaixar", "rebaixa", "demote"],
  usage: `${PREFIX}rebaixar @usuario`,
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
      throw new InvalidParameterError("xX| Por favor, marque un administrador para rebajar |Xx");
    }

    const userId = args[0].replace("@", "") + "@s.whatsapp.net";

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "demote");
      await sendSuccessReply("xX| Usuario rebajado a la basura |Xx");
    } catch (error) {
      errorLog(`Error al rebajar administrador: ${error.message}`);
      await sendErrorReply(
        "xX| Ocurrió un error al intentar rebajar al usuario. Se requiere ser administrador de XTIALISMO para rebajar a otros administradores |Xx"
      );
    }
  },
};
