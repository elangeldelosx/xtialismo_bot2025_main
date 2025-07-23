const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "abrir",
  description: "xX Abre XTIALISMO Xx",
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
      await sendSuccessReply("xX| XTIALISMO abierto |Xx");
    } catch (error) {
      await sendErrorReply(
        "xX| Para abrir XTIALISMO hay que ser administrador |Xx"
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
