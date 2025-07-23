const FormData = require("form-data");
const axios = require("axios");

exports.upload = async (imageBuffer, filename) => {
  try {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error("xX| Buffer inválido |Xx");
    }

    if (typeof filename !== "string" || filename.trim() === "") {
      throw new Error("xX| Nombre del archivo inválido |Xx");
    }

    if (imageBuffer.length === 0) {
      throw new Error("xX| El buffer de la imagen está vacío |Xx");
    }

    const API_KEY = "6d207e02198a847aa98d0a2a901485a5";
    const API_URL = "https://freeimage.host/api/1/upload";

    const formData = new FormData();
    formData.append("key", API_KEY);
    formData.append("action", "upload");
    formData.append("source", imageBuffer, {
      filename: filename,
      contentType: "image/jpeg",
    });
    formData.append("format", "json");

    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const result = response.data;

    if (result.status_code !== 200) {
      throw new Error(
        `Error en la API: ${result.error?.message || "Error desconocido"}`
      );
    }

    return result.image.url;
  } catch (error) {
    console.error("Error en la subida de la imagen:", error.message);

    if (error.response) {
      return {
        success: false,
        error: `Error HTTP ${error.response.status}: ${error.response.statusText}`,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "xX| Error de red: No se pudo comunicar con El Angel de Los X |Xx",
      };
    } else {
      return {
        success: false,
        error: error.message,
      };
    }
  }
};
