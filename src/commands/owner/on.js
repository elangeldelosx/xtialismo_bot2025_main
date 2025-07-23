const { PREFIX } = require(`${BASE_DIR}/config`);
const { activateGroup } = require(`${BASE_DIR}/utils/database`);
const { WarningError } = require(`${BASE_DIR}/errors`); // Asegúrate de importar WarningError

module.exports = {
  name: "on",
  description: "Activa el bot en el grupo.",
  commands: ["on"],
  usage: `${PREFIX}on`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("xX| Este comando debe ser usado dentro de un grupo |Xx");
    }

    activateGroup(remoteJid);

    await sendSuccessReply("xX| BOT2025 activado en el grupo |Xx");
  },
};
