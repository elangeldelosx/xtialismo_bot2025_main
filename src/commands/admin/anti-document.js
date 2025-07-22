const {
  updateIsActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { isActiveGroupRestriction } = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-document",
  description:
    "Activa/desactiva la función de anti-documento en XTIALISMO, eliminando el mensaje de documento si está activo.",
  commands: ["anti-document", "anti-doc", "anti-documento", "anti-documentos"],
  usage: `${PREFIX}anti-document (1/0)`,
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo debe ser usado en XTIALISMO.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const antiDocumentOn = args[0] == "1";
    const antiDocumentOff = args[0] == "0";

    if (!antiDocumentOn && !antiDocumentOff) {
      throw new InvalidParameterError(
        "Necesitas escribir 1 o 0 (activar o desactivar)."
      );
    }

    const hasActive =
      antiDocumentOn && isActiveGroupRestriction(remoteJid, "anti-document");

    const hasInactive =
      antiDocumentOff && !isActiveGroupRestriction(remoteJid, "anti-document");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `La función de anti-documento ya está ${
          antiDocumentOn ? "activa" : "desactivada"
        }.`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-document", antiDocumentOn);

    const status = antiDocumentOn ? "activa" : "desactivada";

    await sendSuccessReply(`Anti-documento ${status}.`);
  },
};
