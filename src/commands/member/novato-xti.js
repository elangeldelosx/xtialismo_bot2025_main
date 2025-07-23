const { createClient } = require('@supabase/supabase-js');
const { PREFIX } = require(`${BASE_DIR}/config`);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qmsjsxtkjkhesbeefixa.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtc2pzeHRramtoZXNiZWVmaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzMwNDksImV4cCI6MjA2NTMwOTA0OX0.tugE79enW2vo5v0zgocHNvwgpsLtqXyehfXlX3AFaio';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = {
  name: "novato-xti",
  description: "Encuentra el X con el menor Puntaje Total (XTI) en Los X (ALL THE WORLD).",
  commands: ["novato-xti"],
  usage: `${PREFIX}novato-xti`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendText, remoteJid, isGroup }) => {
    try {
      const { data, error } = await supabase
        .from('user_register_x')
        .select('nombre_user_x, xti_user_x')
        .order('xti_user_x', { ascending: true })
        .limit(1);

      if (error) {
        console.error("Error al consultar datos del X más novato:", error);
        await sendText(remoteJid, `xX| Error al consultar el X más novato: ${error.message} |Xx`);
        return;
      }

      if (!data || data.length === 0) {
        await sendText(remoteJid, `xX| No se encontraron al X más novato. |Xx`);
        return;
      }

      const noviceXData = data[0];
      const nombreNovatoX = noviceXData.nombre_user_x;
      const noviceXtiScore = noviceXData.xti_user_x;

      const responseMessage = `xX| El X más novato es ${nombreNovatoX} con un XTI de ${noviceXtiScore} |Xx`;

      await sendText(remoteJid, responseMessage);

    } catch (e) {
      console.error("Ocurrió un error inesperado al procesar el comando novato-xti:", e);
      await sendText(remoteJid, `xX| Ocurrió un error inesperado al consultar el X más novato: ${e.message} |Xx`);
    }
  },
};
