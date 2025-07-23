const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`); // Asegúrate de importar WarningError

module.exports = {
  name: "agendar-mensagem",
  description: "Agenda un mensaje para ser enviado después de un tiempo definido.",
  commands: ["agendar", "agendar-mensagem"],
  usage: `${PREFIX}agendar-mensagem mensaje / tiempo
 
Ejemplo: ${PREFIX}agendar-mensagem Reunión mañana / 10m`,
  handle: async ({ args, sendErrorReply, sendSuccessReply, sendText }) => {
    if (args.length !== 2) {
      return await sendErrorReply(
        `Formato incorrecto. Usa: ${PREFIX}agendar-mensagem mensaje / tiempo
        
Ejemplo: ${PREFIX}agendar-mensagem Reunión mañana / 10m`
      );
    }

    const rawTime = args[1].trim();

    const message = args[0].trim();

    let timeInMs = 0;

    if (/^\d+s$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 1000;
    } else if (/^\d+m$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 1000;
    } else if (/^\d+h$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 60 * 1000;
    } else {
      return await sendErrorReply(
        `Formato de tiempo inválido.
Usa:\n• 10s para 10 segundos\n• 5m para 5 minutos\n• 2h para 2 horas`
      );
    }

    if (!message || message.trim() === "" || isNaN(timeInMs) || timeInMs <= 0) {
      return await sendErrorReply(
        "xX| Mensaje inválido o tiempo no especificado correctamente |Xx"
      );
    }

    await sendSuccessReply(`Mensaje agendado para dentro de ${rawTime}...`);

    setTimeout(async () => {
      await sendText(`*Mensaje agendado:*\n\n${message}`);
    }, timeInMs);
  },
};
