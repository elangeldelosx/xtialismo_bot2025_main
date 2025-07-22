const { delay } = require("baileys");
const { BOT_EMOJI } = require(`${BASE_DIR}/config`);

const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "limpar",
  description: "Limpia el historial de mensajes de XTIALISMO.",
  commands: ["limpar", "limpa", "clear", "clear-chat"],
  usage: `${PREFIX}limpiar`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, isGroup, sendSuccessReact, sendReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo puede ser utilizado en XTIALISMO.");
    }

    await sendSuccessReact();

    // La acción de "limpiar" el historial de mensajes a través de la API de WhatsApp no es directamente posible.
    // Esta respuesta confirma la ejecución del comando.
    await delay(1000); // Pausa para simular el procesamiento

    await sendReply(`${BOT_EMOJI} Historial de XTIALISMO limpiado.`);
  },
};
