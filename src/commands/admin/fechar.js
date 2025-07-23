const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "fechar",
  description: "Cierra XTIALISMO.",
  commands: [
    "fechar",
    "fecha",
    "fechar-xtialismo",
    "fecha-xtialismo",
    "close",
    "close-xtialismo",
  ],
  usage: `${PREFIX}fechar`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "announcement");
      await sendSuccessReply("xX| XTIALISMO cerrado |Xx");
    } catch (error) {
      await sendErrorReply(
        "xX| Para cerrar XTIALISMO, se requiere que sea administrador de este XTIALISMO |Xx"
      );
      errorLog(
        `xX| Ocurrió un error al cerrar XTIALISMO. Causa: ${JSON.stringify(
          error,
          null,
          2
        )} |Xx`
      );
    }
  },
};
