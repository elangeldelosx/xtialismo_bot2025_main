const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-sticker",
  description:
    "Activa/desactiva la función de anti-sticker en XTIALISMO, eliminando el sticker si está activo.",
  commands: ["anti-sticker", "anti-figu", "anti-figurinha", "anti-figurinhas"],
  usage: `${PREFIX}anti-sticker (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const antiStickerOn = args[0] == "1";
    const antiStickerOff = args[0] == "0";

    if (!antiStickerOn && !antiStickerOff) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const hasActive =
      antiStickerOn && isActiveGroupRestriction(remoteJid, "anti-sticker");

    const hasInactive =
      antiStickerOff && !isActiveGroupRestriction(remoteJid, "anti-sticker");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `xX| La función de anti-sticker ya está ${
          antiStickerOn ? "activa" : "desactivada"
        } |Xx`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-sticker", antiStickerOn);

    const status = antiStickerOn ? "activa" : "desactivada";

    await sendSuccessReply(`xX| Anti-sticker ${status} |Xx`);
  },
};
