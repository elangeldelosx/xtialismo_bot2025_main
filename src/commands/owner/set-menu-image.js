const fs = require("node:fs");
const path = require("node:path");
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "set-menu-image",
  description: "Cambia la imagen del menú del bot.",
  commands: [
    "set-menu-image",
    "set-image",
    "set-imagem-menu",
    "set-img-menu",
    "set-menu-imagem",
    "set-menu-img",
  ],
  usage: `${PREFIX}set-menu-image (responde a una imagen)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isImage,
    isReply,
    downloadImage,
    sendSuccessReply,
    sendErrorReply,
    webMessage,
  }) => {
    if (!isReply || !isImage) {
      throw new InvalidParameterError(
        "xX| Necesita algo que contenga una imagen |Xx"
      );
    }

    try {
      const menuImagePath = path.join(ASSETS_DIR, "images", "xtialismo-bot2025.png");

      let backupPath = "";

      if (fs.existsSync(menuImagePath)) {
        backupPath = path.join(ASSETS_DIR, "images", "xtialismo-bot2025-backup.png");

        fs.copyFileSync(menuImagePath, backupPath);
      }

      const tempPath = await downloadImage(webMessage, "new-menu-image-temp");

      if (fs.existsSync(menuImagePath)) {
        fs.unlinkSync(menuImagePath);
      }

      fs.renameSync(tempPath, menuImagePath);

      await sendSuccessReply("xX| Imagen actualizada con éxito |Xx");
    } catch (error) {
      errorLog(`Error al cambiar la imagen del menú: ${error}`);
      await sendErrorReply(
        "xX| Ocurrió un error al intentar cambiar la imagen del menú. Por favor, intenta de nuevo |Xx"
      );
    }
  },
};
