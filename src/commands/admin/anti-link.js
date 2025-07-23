const { isActiveAntiLinkGroup } = require("../../utils/database");

const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateAntiLinkGroup,
  deactivateAntiLinkGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "anti-link",
  description: "Activa/desactiva la función de anti-enlace en XTIALISMO.",
  commands: ["anti-link"],
  usage: `${PREFIX}anti-link (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("xX| Este comando solo debe ser usado en XTIALISMO |Xx");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const antiLinkOn = args[0] == "1";
    const antiLinkOff = args[0] == "0";

    if (!antiLinkOn && !antiLinkOff) {
      throw new InvalidParameterError(
        "¿(1,0)?"
      );
    }

    const hasActive = antiLinkOn && isActiveAntiLinkGroup(remoteJid);
    const hasInactive = antiLinkOff && !isActiveAntiLinkGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `xX| La función de anti-enlace ya está ${
          antiLinkOn ? "activa" : "desactivada"
        } |Xx`
      );
    }

    if (antiLinkOn) {
      activateAntiLinkGroup(remoteJid);
    } else {
      deactivateAntiLinkGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = antiLinkOn ? "activada" : "desactivada";

    await sendReply(`xX| Anti-enlace ${context} |Xx`);
  },
};
