/**
 * Desarrollado por: Mkg
 * Refactorizado por: Dev Gui
 *
 * @author Dev Gui
 */
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  unmuteMember,
} = require(`${BASE_DIR}/utils/database`);
const { PREFIX } = require(`${BASE_DIR}/config`);

const { DangerError, WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "unmute",
  description: "Desactiva el silencio de un miembro de XTIALISMO.",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    remoteJid,
    sendSuccessReply,
    args,
    isGroup,
    isGroupWithLid,
    socket,
  }) => {
    if (!isGroup) {
      throw new DangerError("xX| Este comando solo puede ser utilizado en XTIALISMO |Xx");
    }

    if (!args.length) {
      throw new DangerError(
        `xX| Se requiere mencionar a un usuario para desactivar el silencio.\n\nEjemplo: ${PREFIX}unmute @fulano |Xx`
      );
    }

    const targetUserNumber = onlyNumbers(args[0]);
    let targetUserJid = toUserJid(targetUserNumber);

    if (isGroupWithLid) {
      const [result] = await socket.onWhatsApp(targetUserNumber);
      targetUserJid = result?.lid;
    }

    if (!checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      throw new WarningError("xX| Este usuario no está silenciado |Xx");
    }

    unmuteMember(remoteJid, targetUserJid);

    await sendSuccessReply("xX| Silencio de usuario desactivado |Xx");
  },
};
