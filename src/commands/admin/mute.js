const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  muteMember,
} = require(`${BASE_DIR}/utils/database`);
const {
  PREFIX,
  BOT_NUMBER,
  OWNER_NUMBER,
  OWNER_LID,
} = require(`${BASE_DIR}/config`);

const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "mute",
  description:
    "Silencia a un usuario en XTIALISMO (elimina automáticamente los mensajes del usuario).",
  commands: ["mute", "mutar"],
  usage: `${PREFIX}mute @usuario o (responda al mensaje del usuario que desea silenciar)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    replyJid,
    userJid,
    sendErrorReply,
    sendSuccessReply,
    getGroupMetadata,
    socket,
    isGroupWithLid,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo puede ser utilizado en XTIALISMO.");
    }

    if (!args.length && !replyJid) {
      throw new DangerError(
        `Se requiere mencionar a un usuario o responder al mensaje del usuario que se desea silenciar.\n\nEjemplo: ${PREFIX}mute @fulano`
      );
    }

    const targetUserNumber = args.length
      ? onlyNumbers(args[0])
      : isGroupWithLid
      ? replyJid
      : onlyNumbers(replyJid);

    if ([OWNER_NUMBER, OWNER_LID].includes(targetUserNumber)) {
      throw new DangerError("No es posible silenciar al propietario de XTIALISMO.");
    }

    const targetUserJid = isGroupWithLid
      ? targetUserNumber
      : toUserJid(targetUserNumber);

    if (targetUserJid === toUserJid(BOT_NUMBER)) {
      throw new DangerError("No es posible silenciar al bot.");
    }

    const [result] =
      replyJid && isGroupWithLid
        ? [{ jid: targetUserJid, lid: targetUserJid }]
        : await socket.onWhatsApp(targetUserNumber);

    if (result.jid === userJid) {
      throw new DangerError("No es posible silenciar a sí mismo.");
    }

    const groupMetadata = await getGroupMetadata();

    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `El usuario @${targetUserNumber} no se encuentra en XTIALISMO.`,
        [targetUserJid]
      );
    }

    const isTargetAdmin = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid && participant.admin
    );

    if (isTargetAdmin) {
      throw new DangerError("No es posible silenciar a un administrador.");
    }

    if (checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      return sendErrorReply(
        `El usuario @${targetUserNumber} ya se encuentra silenciado en XTIALISMO.`,
        [targetUserJid]
      );
    }

    muteMember(remoteJid, targetUserJid);

    await sendSuccessReply(
      `@${targetUserNumber} ha sido silenciado en XTIALISMO.`,
      [targetUserJid]
    );
  },
};
