const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "hide-tag",
  description: "Este comando etiquetará a todos los miembros de XTIALISMO.",
  commands: ["hide-tag", "to-tag"],
  usage: `${PREFIX}hidetag motivo`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact, isGroup }) => {
    if (!isGroup) {
      throw new InvalidParameterError("xX| Este comando solo debe ser utilizado en XTIALISMO |Xx");
    }

    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendText(`xX| LLAMADO GENERAL de XTIALISMO |Xx \n\n${fullArgs}`, mentions);
  },
};
