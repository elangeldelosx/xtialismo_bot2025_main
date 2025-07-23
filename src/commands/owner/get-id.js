const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "get-id",
  description: "Retorna el ID completo de un grupo en formato JID.",
  commands: ["get-id", "get-group-id", "id-get", "id-group"],
  usage: `${PREFIX}get-id`,
  handle: async ({ remoteJid, sendSuccessReply, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("xX| Este comando debe ser usado dentro de un grupo |Xx");
    }

    await sendSuccessReply(`xX| ID de XTIALISMO: ${remoteJid} |Xx`);
  },
};
