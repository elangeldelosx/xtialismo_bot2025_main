const { PREFIX, TEMP_DIR } = require(`${BASE_DIR}/config`);
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getRandomNumber } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "to-image-x",
  description: "Transforma stickers estáticos en imagen.",
  commands: ["to-image-x", "toimg"],
  usage: `${PREFIX}to-image-x (marcar sticker) o ${PREFIX}to-image-x (responder sticker)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendWaitReact,
    sendSuccessReact,
    sendImageFromFile,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("xX| Envíe un sticker |Xx");
    }

    await sendWaitReact();

    const inputPath = await downloadSticker(webMessage, "input");
    const outputPath = path.resolve(
      TEMP_DIR,
      `${getRandomNumber(10_000, 99_999)}.png`
    );

    exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
      if (error) {
        console.log(error);
        throw new Error(error);
      }

      await sendSuccessReact();

      await sendImageFromFile(outputPath);

      // Limpiar archivos temporales
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });
  },
};
