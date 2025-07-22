const fs = require("node:fs");
const { upload } = require(`${BASE_DIR}/services/upload`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getRandomNumber } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "gerar-link",
  description: "Sube imágenes.",
  commands: ["to-link", "up", "upload", "gera-link", "gerar-link"],
  usage: `${PREFIX}gerar-link (marca la imagen) o ${PREFIX}gerar-link (responde a la imagen)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isImage,
    downloadImage,
    sendSuccessReact,
    sendWaitReact,
    sendReply,
    webMessage,
  }) => {
    if (!isImage) {
      throw new InvalidParameterError(
        "¡Debes marcar o responder una imagen!"
      );
    }

    await sendWaitReact();

    const fileName = getRandomNumber(10_000, 99_999).toString();
    const filePath = await downloadImage(webMessage, fileName);

    const buffer = fs.readFileSync(filePath);

    const link = await upload(buffer, `${fileName}.png`);

    if (!link) {
      throw new Error(
        "Error al subir la imagen. Intenta de nuevo más tarde."
      );
    }

    await sendSuccessReact();

    await sendReply(`¡Aquí está el enlace de tu imagen!\n\n- ${link}`);

    fs.unlinkSync(filePath);
  },
};
