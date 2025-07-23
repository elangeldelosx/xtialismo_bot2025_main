const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "delete",
  description: "Elimina mensajes.",
  commands: ["delete", "d"],
  usage: `${PREFIX}delete (mencione un mensaje)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ deleteMessage, webMessage, remoteJid }) => {
    if (!webMessage?.message?.extendedTextMessage?.contextInfo) {
      throw new InvalidParameterError(
        "xX| Se debe mencionar un mensaje para eliminar |Xx"
      );
    }

    const { stanzaId, participant } =
      webMessage?.message?.extendedTextMessage?.contextInfo;

    if (!stanzaId || !participant) {
      throw new InvalidParameterError(
        "xX| Se debe mencionar un mensaje para eliminar |Xx"
      );
    }

    await deleteMessage({
      remoteJid,
      fromMe: false,
      id: stanzaId,
      participant,
    });
  },
};
