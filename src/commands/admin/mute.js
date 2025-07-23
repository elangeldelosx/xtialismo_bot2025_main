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
      throw new DangerError("xX| Este comando solo puede ser utilizado en XTIALISMO |Xx");
    }

    if (!args.length && !replyJid) {
      throw new DangerError(
        `xX| Se requiere mencionar al usuario que hay que silenciar.\n\nEjemplo: ${PREFIX}mute @retobo |Xx`
      );
    }

    const targetUserNumber = args.length
      ? onlyNumbers(args[0])
      : isGroupWithLid
      ? replyJid
      : onlyNumbers(replyJid);

    if ([OWNER_NUMBER, OWNER_LID].includes(targetUserNumber)) {
      throw new DangerError("xX| No es posible silenciar al propietario de XTIALISMO |Xx");
    }

    const targetUserJid = isGroupWithLid
      ? targetUserNumber
      : toUserJid(targetUserNumber);

    if (targetUserJid === toUserJid(BOT_NUMBER)) {
      throw new DangerError("xX| No es posible silenciar al bot |Xx");
    }

    const [result] =
      replyJid && isGroupWithLid
        ? [{ jid: targetUserJid, lid: targetUserJid }]
        : await socket.onWhatsApp(targetUserNumber);

    if (result.jid === userJid) {
      throw new DangerError("xX| No es posible silenciar a sí mismo |Xx");
    }

    const groupMetadata = await getGroupMetadata();

    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `xX| El usuario @${targetUserNumber} no se encuentra en XTIALISMO |Xx`,
        [targetUserJid]
      );
    }

    const isTargetAdmin = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid && participant.admin
    );

    if (isTargetAdmin) {
      throw new DangerError("xX| Imposible silenciar a un administrador, así de injusta es tu amarga vida |Xx");
    }

    if (checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      return sendErrorReply(
        `xX| El usuario @${targetUserNumber} ya se encuentra silenciado en XTIALISMO |Xx`,
        [targetUserJid]
      );
    }

    muteMember(remoteJid, targetUserJid);

    await sendSuccessReply(
      `xX| @${targetUserNumber} ha sido silenciado en XTIALISMO |Xx`,
      [targetUserJid]
    );
  },
};
