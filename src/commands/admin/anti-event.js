const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-event",
  description:
    "Activa/desactiva la función de anti-evento en XTIALISMO, eliminando el mensaje de evento si está activo.",
  commands: ["anti-event", "anti-evento", "anti-eventos"],
  usage: `${PREFIX}anti-event (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const antiEventOn = args[0] == "1";
    const antiEventOff = args[0] == "0";

    if (!antiEventOn && !antiEventOff) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const hasActive =
      antiEventOn && isActiveGroupRestriction(remoteJid, "anti-event");

    const hasInactive =
      antiEventOff && !isActiveGroupRestriction(remoteJid, "anti-event");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `xX| La función de anti-evento ya está ${
          antiEventOn ? "activa" : "desactivada"
        } |Xx`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-event", antiEventOn);

    const status = antiEventOn ? "activa" : "desactivada";

    await sendSuccessReply(`xX| Anti-evento ${status} |Xx`);
  },
};
