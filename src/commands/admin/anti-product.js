const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-product",
  description:
    "Activa/desactiva la función de anti-producto en XTIALISMO, eliminando el mensaje de producto si está activo.",
  commands: ["anti-product", "anti-produto", "anti-productos"],
  usage: `${PREFIX}anti-product (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const antiProductOn = args[0] == "1";
    const antiProductOff = args[0] == "0";

    if (!antiProductOn && !antiProductOff) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const hasActive =
      antiProductOn && isActiveGroupRestriction(remoteJid, "anti-product");

    const hasInactive =
      antiProductOff && !isActiveGroupRestriction(remoteJid, "anti-product");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `La función de anti-producto ya está ${
          antiProductOn ? "activa" : "desactivada"
        }.`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-product", antiProductOn);

    const status = antiProductOn ? "activa" : "desactivada";

    await sendSuccessReply(`Anti-producto ${status}.`);
  },
};
