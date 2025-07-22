const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateWelcomeGroup,
  deactivateWelcomeGroup,
  isActiveWelcomeGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "welcome",
  description: "Activa/desactiva la función de bienvenida en XTIALISMO.",
  commands: [
    "welcome",
    "bemvindo",
    "boasvinda",
    "boasvindas",
    "boavinda",
    "boavindas",
    "welkom",
    "welkon",
  ],
  usage: `${PREFIX}welcome (1/0)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo puede ser utilizado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "Se requiere ingresar 1 o 0 (activar o desactivar)."
      );
    }

    const welcomeOn = args[0] == "1";
    const welcomeOff = args[0] == "0";

    if (!welcomeOn && !welcomeOff) {
      throw new InvalidParameterError(
        "Se requiere ingresar 1 o 0 (activar o desactivar)."
      );
    }

    const hasActive = welcomeOn && isActiveWelcomeGroup(remoteJid);
    const hasInactive = welcomeOff && !isActiveWelcomeGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `La función de bienvenida ya se encuentra ${
          welcomeOn ? "activa" : "desactivada"
        }.`
      );
    }

    if (welcomeOn) {
      activateWelcomeGroup(remoteJid);
    } else {
      deactivateWelcomeGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = welcomeOn ? "activa" : "desactivada";

    await sendReply(`Función de bienvenida ${context}.`);
  },
};
