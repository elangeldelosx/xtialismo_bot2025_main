/**
 * Comando para obtener el enlace de XTIALISMO
 *
 * @author Valéria
 */
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`); // Asegúrate de importar InvalidParameterError

module.exports = {
  name: "link-grupo",
  description: "Obtiene el enlace de XTIALISMO.",
  commands: ["link-grupo", "link-gp"],
  usage: `${PREFIX}link-grupo`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    socket,
    sendReact,
    sendReply,
    sendErrorReply,
    remoteJid,
    isGroup // Asegúrate de que isGroup esté disponible en props
  }) => {
    if (!isGroup) {
      throw new InvalidParameterError("Este comando solo debe ser utilizado en XTIALISMO.");
    }

    try {
      const groupCode = await socket.groupInviteCode(remoteJid);

      if (!groupCode) {
        throw new DangerError("Se requiere ser administrador de XTIALISMO.");
      }

      const groupInviteLink = `https://chat.whatsapp.com/${groupCode}`;

      await sendReact("❌");
      await sendReply(groupInviteLink);
    } catch (error) {
      errorLog(error);
      await sendErrorReply("Se requiere ser administrador de XTIALISMO.");
    }
  },
};
