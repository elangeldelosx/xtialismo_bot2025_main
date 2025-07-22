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
      throw new WarningError("Este comando debe ser usado dentro de un grupo.");
    }

    activateGroup(remoteJid);

    await sendSuccessReply("¡Bot activado en el grupo!");
  },
};
