const { createClient } = require('@supabase/supabase-js');
const { PREFIX } = require(`${BASE_DIR}/config`);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qmsjsxtkjkhesbeefixa.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtc2pzeHRramtoZXNiZWVmaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzMwNDksImV4cCI6MjA2NTMwOTA0OX0.tugE79enW2vo5v0zgocHNvwgpsLtqXyehfXlX3AFaio';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = {
  name: "los-x",
  description: "Muestra todos los X registrados en Los X (ALL THE WORLD).",
  commands: ["los-x"],
  usage: `${PREFIX}los-x`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendText, remoteJid, isGroup }) => {
    try {
      const { data, error } = await supabase
        .from('user_register_x')
        .select('nombre_user_x')
        .order('nombre_user_x', { ascending: true });

      if (error) {
        console.error("Error al consultar a todos Los X:", error);
        await sendText(remoteJid, `xX| Error al consultar Los X: ${error.message} |Xx`);
        return;
      }

      if (!data || data.length === 0) {
        await sendText(remoteJid, `xX| No se encontraron X registrados en Los X (ALL THE WORLD). |Xx`);
        return;
      }

      let responseMessage = "xX| Los X (ALL THE WORLD): |Xx\n\n";
      data.forEach((x, index) => {
        responseMessage += `${index + 1}. ${x.nombre_user_x}\n`;
      });

      await sendText(remoteJid, responseMessage);

    } catch (e) {
      console.error("Ocurrió un error inesperado al procesar el comando los-x:", e);
      await sendText(remoteJid, `xX| Ocurrió un error inesperado al listar los X: ${e.message} |Xx`);
    }
  },
};
