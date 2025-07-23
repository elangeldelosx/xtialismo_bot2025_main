const fs = require("node:fs");
const { PREFIX, BOT_NAME, BOT_EMOJI } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { addStickerMetadata } = require(`${BASE_DIR}/services/sticker`);
const { getRandomName } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "sticker",
  description: "Crea stickers de imagen, gif o video (máximo 10 segundos).",
  commands: ["f", "s", "sticker", "fig"],
  usage: `${PREFIX}sticker (marca o responde una imagen/gif/video)`,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendWaitReact,
    sendSuccessReact,
    sendStickerFromFile,
    userJid,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        `¡Necesitas marcar o responder a una imagen/gif/video!`
      );
    }

    await sendWaitReact();

    const username =
      webMessage.pushName ||
      webMessage.notifyName ||
      userJid.replace(/@s.whatsapp.net/, "");

    const metadata = {
      username: username,
      botName: `${BOT_EMOJI} ${BOT_NAME}`,
    };

    const outputPath = getRandomName("webp");
    let inputPath = null;

    try {
      if (isImage) {
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            inputPath = await downloadImage(webMessage, getRandomName());
            break;
          } catch (downloadError) {
            console.error(
              `Intento ${attempt} de descarga de imagen falló:`,
              downloadError.message
            );

            if (attempt === 3) {
              throw new Error(
                `Fallo al descargar imagen después de 3 intentos: ${downloadError.message}`
              );
            }

            await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
          }
        }

        await new Promise((resolve, reject) => {
          const { exec } = require("child_process");

          const cmd = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -f webp -quality 90 "${outputPath}"`;

          exec(cmd, (error, _, stderr) => {
            if (error) {
              console.error("Error de FFmpeg:", stderr);
              reject(error);
            } else {
              resolve();
            }
          });
        });
      } else {
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            inputPath = await downloadVideo(webMessage, getRandomName());
            break;
          } catch (downloadError) {
            console.error(
              `Intento ${attempt} de descarga de video falló:`,
              downloadError.message
            );

            if (attempt === 3) {
              throw new Error(
                `Fallo al descargar video después de 3 intentos. Problema de conexión con WhatsApp.`
              );
            }

            await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
          }
        }

        const maxDuration = 10;
        const seconds =
          webMessage.message?.videoMessage?.seconds ||
          webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage?.seconds;

        if (!seconds || seconds > maxDuration) {
          if (inputPath && fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
          }
          return sendErrorReply(
            `xX| El video enviado tiene más de ${maxDuration} segundos, mal ahí |Xx`
          );
        }

        await new Promise((resolve, reject) => {
          const { exec } = require("child_process");

          const cmd = `ffmpeg -y -i "${inputPath}" -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512, fps=30, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" -f webp "${outputPath}"`;

          exec(cmd, (error, _, stderr) => {
            if (error) {
              console.error("Error de FFmpeg:", stderr);
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }

      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
        inputPath = null;
      }

      if (!fs.existsSync(outputPath)) {
        throw new Error("Archivo de salida no fue creado por FFmpeg");
      }

      const stickerPath = await addStickerMetadata(
        await fs.promises.readFile(outputPath),
        metadata
      );

      await sendSuccessReact();

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await sendStickerFromFile(stickerPath);
          break;
        } catch (stickerError) {
          console.error(
            `Intento ${attempt} de envío de sticker falló:`,
            stickerError.message
          );

          if (attempt === 3) {
            throw new Error(
              `Fallo al enviar sticker después de 3 intentos: ${stickerError.message}`
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      if (fs.existsSync(stickerPath)) {
        fs.unlinkSync(stickerPath);
      }
    } catch (error) {
      console.error("Error detallado en el comando sticker:", error);

      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      if (
        error.message.includes("ETIMEDOUT") ||
        error.message.includes("AggregateError") ||
        error.message.includes("getaddrinfo ENOTFOUND") ||
        error.message.includes("connect ECONNREFUSED") ||
        error.message.includes("mmg.whatsapp.net")
      ) {
        throw new Error(
          `Error de conexión al descargar multimedia de WhatsApp. Intenta de nuevo en unos segundos.`
        );
      }

      if (error.message.includes("FFmpeg")) {
        throw new Error(
          `Error al procesar multimedia con FFmpeg. Verifica si el archivo no está corrupto.`
        );
      }

      throw new Error(`Error al procesar el sticker: ${error.message}`);
    }
  },
};
