const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-video",
  description:
    "Activa/desactiva la función de anti-video en XTIALISMO, eliminando el mensaje de video si está activo.",
  commands: ["anti-video", "anti-videos"],
  usage: `${PREFIX}anti-video (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const antiVideoOn = args[0] == "1";
    const antiVideoOff = args[0] == "0";

    if (!antiVideoOn && !antiVideoOff) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const hasActive =
      antiVideoOn && isActiveGroupRestriction(remoteJid, "anti-video");

    const hasInactive =
      antiVideoOff && !isActiveGroupRestriction(remoteJid, "anti-video");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `xX| La función de anti-video ya está ${
          antiVideoOn ? "activa" : "desactivada"
        } |Xx`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-video", antiVideoOn);

    const status = antiVideoOn ? "activa" : "desactivada";

    await sendSuccessReply(`xX| Anti-video ${status} |Xx`);
  },
};
