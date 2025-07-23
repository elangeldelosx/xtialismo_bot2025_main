const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getProfileImageData } = require(`${BASE_DIR}/services/baileys`);
const fs = require("node:fs"); // Necesario para eliminar archivos temporales

module.exports = {
  name: "perfil",
  description: "Muestra información de un usuario.",
  commands: ["perfil", "profile"],
  usage: `${PREFIX}perfil o ${PREFIX}perfil @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
    sendImageFromFile, // Usar esta función para enviar imágenes desde un archivo local
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError(
        "xX| Este comando solo puede ser usado en grupo |Xx"
      );
    }

    const targetJid = args[0]
      ? args[0].replace(/[@ ]/g, "") + "@s.whatsapp.net"
      : userJid;

    await sendWaitReply("xX| Cargando perfil... Permiso brindando por El Angel de Los X... Desencriptando... |Xx");

    let profilePicPath = null; // Para almacenar la ruta temporal de la imagen de perfil

    try {
      let userName;
      let userRole = "Miembro de XTIALISMO";

      const { profileImage, success } = await getProfileImageData(socket, targetJid);
      profilePicPath = profileImage; // Guarda la ruta temporal o la ruta de la imagen por defecto

      try {
        const contactInfo = await socket.onWhatsApp(targetJid);
        userName = contactInfo[0]?.name || contactInfo[0]?.verifiedName || targetJid.split("@")[0];
      } catch (error) {
        errorLog(`xX| Error al obtener nombre de usuario para ${targetJid}: ${error.message} |Xx`);
        userName = targetJid.split("@")[0]; // Fallback a JID si no se puede obtener el nombre
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);

      const participant = groupMetadata.participants.find(
        (participant) => participant.id === targetJid
      );

      if (participant?.admin) {
        userRole = "Administrador de XTIALISMO";
      } else if (groupMetadata.owner === targetJid) {
        userRole = "El Angel de Los X, mi creador.";
      }

      // Generar datos "inventados"
      const latitude = (Math.random() * 180 - 90).toFixed(6); // -90 a +90
      const longitude = (Math.random() * 360 - 180).toFixed(6); // -180 a +180
      const connectionSpeed = (Math.random() * (1000 - 10) + 10).toFixed(2); // 10 a 1000 Mbps
      const pingLatency = (Math.random() * (150 - 10) + 10).toFixed(0); // 10 a 150 ms
      const securityScore = (Math.random() * (100 - 60) + 60).toFixed(0); // 60 a 100
      const deviceType = Math.random() > 0.5 ? "Móvil" : "Escritorio";
      const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;


      const mensaje = `
Usuario: ${userName}
JID: ${targetJid}
Rol: ${userRole}

--- SE REBELA ANTE TODOS ---
Latitud: ${latitude}
Longitud: ${longitude}
Velocidad de Conexión: ${connectionSpeed} Mbps
Latencia de Ping: ${pingLatency} ms
Puntuación de Seguridad: ${securityScore}/100
Tipo de Dispositivo: ${deviceType}
Dirección IP: ${ipAddress}
`;

      const mentions = [targetJid];

      await sendSuccessReact(); // Mantener el react visualmente, pero se puede quitar si se desea un output completamente sin emojis.

      // Usar sendImageFromFile para enviar la imagen desde la ruta local
      await sendImageFromFile(profilePicPath, mensaje, mentions);

    } catch (error) {
      console.error(error);
      sendErrorReply("xX| Ocurrió un error al intentar verificar el perfil |Xx");
    } finally {
      // Limpiar el archivo de imagen temporal si no es la imagen por defecto
      if (profilePicPath && !profilePicPath.includes("default-user.png") && fs.existsSync(profilePicPath)) {
        fs.unlinkSync(profilePicPath);
      }
    }
  },
};
