const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "abrir",
  description: "Abre XTIALISMO.",
  commands: [
    "abrir",
    "abri",
    "abre",
    "abrir-xtialismo",
    "abri-xtialismo",
    "abre-xtialismo",
    "open",
    "open-xtialismo",
  ],
  usage: `${PREFIX}abrir`,
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "not_announcement");
      await sendSuccessReply("XTIALISMO abierto.");
    } catch (error) {
      await sendErrorReply(
        "Para abrir XTIALISMO, necesito ser administrador de este XTIALISMO."
      );
      errorLog(
        `Error al abrir XTIALISMO. Causa: ${JSON.stringify(
          error,
          null,
          2
        )}`
      );
    }
  },
};
