const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateExitGroup,
  deactivateExitGroup,
  isActiveExitGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "exit",
  description:
    "Activa/desactiva la función de envío de mensaje al salir de XTIALISMO.",
  commands: ["exit", "saida"],
  usage: `${PREFIX}exit (1/0)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser utilizado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "Se requiere ingresar 1 o 0 (activar o desactivar)."
      );
    }

    const exitOn = args[0] == "1";
    const exitOff = args[0] == "0";

    if (!exitOn && !exitOff) {
      throw new InvalidParameterError(
        "Se requiere ingresar 1 o 0 (activar o desactivar)."
      );
    }

    const hasActive = exitOn && isActiveExitGroup(remoteJid);
    const hasInactive = exitOff && !isActiveExitGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `La función de salida ya se encuentra ${exitOn ? "activa" : "desactivada"}.`
      );
    }

    if (exitOn) {
      activateExitGroup(remoteJid);
    } else {
      deactivateExitGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = exitOn ? "activa" : "desactivada";

    await sendReply(
      `Función de envío de mensaje de salida ${context}.`
    );
  },
};
