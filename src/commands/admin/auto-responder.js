const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`); // Asegúrate de importar WarningError
const {
  activateAutoResponderGroup,
  deactivateAutoResponderGroup,
  isActiveAutoResponderGroup // Necesario para verificar el estado actual
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "auto-responder",
  description: "Activa/desactiva la función de auto-responder en XTIALISMO.",
  commands: ["auto-responder"],
  usage: `${PREFIX}auto-responder (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const autoResponderOn = args[0] == "1";
    const autoResponderOff = args[0] == "0";

    if (!autoResponderOn && !autoResponderOff) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const hasActive = autoResponderOn && isActiveAutoResponderGroup(remoteJid);
    const hasInactive = autoResponderOff && !isActiveAutoResponderGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `La función de auto-responder ya está ${
          autoResponderOn ? "activa" : "desactivada"
        }.`
      );
    }

    if (autoResponderOn) {
      activateAutoResponderGroup(remoteJid);
    } else {
      deactivateAutoResponderGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = autoResponderOn ? "activa" : "desactivada";

    await sendReply(`Función de auto-responder ${context}.`);
  },
};
