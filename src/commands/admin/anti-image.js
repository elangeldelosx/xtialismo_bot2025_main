const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-image",
  description:
    "Activa/desactiva la función de anti-imagen en XTIALISMO, eliminando el mensaje de imagen si está activo.",
  commands: ["anti-image", "anti-img", "anti-imagem", "anti-imagens"],
  usage: `${PREFIX}anti-image (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const antiImageOn = args[0] == "1";
    const antiImageOff = args[0] == "0";

    if (!antiImageOn && !antiImageOff) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const hasActive =
      antiImageOn && isActiveGroupRestriction(remoteJid, "anti-image");

    const hasInactive =
      antiImageOff && !isActiveGroupRestriction(remoteJid, "anti-image");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `xX| La función de anti-imagen ya está ${
          antiImageOn ? "activa" : "desactivada"
        } |Xx`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-image", antiImageOn);

    const status = antiImageOn ? "activa" : "desactivada";

    await sendSuccessReply(`Anti-imagen ${status}.`);
  },
};
