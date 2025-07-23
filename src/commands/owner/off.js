const { PREFIX } = require(`${BASE_DIR}/config`);
const { deactivateGroup } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "off",
  description: "Desactiva el bot en el grupo.",
  commands: ["off"],
  usage: `${PREFIX}off`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("xX| Este comando debe ser usado dentro de un grupo |Xx");
    }

    deactivateGroup(remoteJid);

    await sendSuccessReply("xX| Bot desactivado en el grupo |Xx");
  },
};
