const { createClient } = require('@supabase/supabase-js');
const { PREFIX } = require(`${BASE_DIR}/config`);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qmsjsxtkjkhesbeefixa.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtc2pzeHRramtoZXNiZWVmaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzMwNDksImV4cCI6MjA2NTMwOTA0OX0.tugE79enW2vo5v0zgocHNvwgpsLtqXyehfXlX3AFaio';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = {
  name: "xti-creator",
  description: "Consulta el Puntaje Total (XTI) del creador de XTIALISMO.",
  commands: ["xti-creator"],
  usage: `${PREFIX}xti-creator`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendText, remoteJid, isGroup }) => {
    const creatorName = "El Angel de Los X";

    try {
      const { data, error } = await supabase
        .from('user_register_x')
        .select('nombre_user_x, xti_user_x')
        .eq('nombre_user_x', creatorName);

      if (error) {
        console.error("Error al consultar datos del creador:", error);
        await sendText(remoteJid, `xX| Error al consultar el XTI del creador: ${error.message} |Xx`);
        return;
      }

      if (!data || data.length === 0) {
        await sendText(remoteJid, `xX| No se encontró al creador '${creatorName}', ¿Habrá muerto? |Xx`);
        return;
      }

      const creatorData = data[0];
      const nombreUserX = creatorData.nombre_user_x;
      const xtiUserX = creatorData.xti_user_x;

      const responseMessage = `xX| El Puntaje Total (XTI) o (Tasa de Implante X) de ${nombreUserX} es ${xtiUserX} |Xx`;

      await sendText(remoteJid, responseMessage);

    } catch (e) {
      console.error("Ocurrió un error inesperado al procesar el comando xti-creator:", e);
      await sendText(remoteJid, `xX| Ocurrió un error inesperado al consultar el XTI del creador: ${e.message} |Xx`);
    }
  },
};
