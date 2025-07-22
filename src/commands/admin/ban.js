const { OWNER_NUMBER, BOT_NUMBER } = require("../../config");
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "ban",
  description: "Remueve a un miembro de XTIALISMO.",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @marcar_miembro 
 
o 

${PREFIX}ban (mencionando un mensaje)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
    isGroup, // Asegúrate de que isGroup esté disponible en props
  }) => {
    if (!isGroup) {
      throw new InvalidParameterError("Este comando solo debe ser utilizado en XTIALISMO.");
    }

    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Se requiere mencionar o marcar a un miembro."
      );
    }

    const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

    if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
      throw new InvalidParameterError("Número inválido.");
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError("No es posible remover a sí mismo.");
    }

    if (memberToRemoveNumber === OWNER_NUMBER) {
      throw new DangerError("No es posible remover al propietario de XTIALISMO.");
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToRemoveJid === botJid) {
      throw new DangerError("No es posible remover al bot.");
    }

    await socket.groupParticipantsUpdate(
      remoteJid,
      [memberToRemoveJid],
      "remove"
    );

    await sendSuccessReact();

    await sendReply("E L I M I N A D O");
  },
};
