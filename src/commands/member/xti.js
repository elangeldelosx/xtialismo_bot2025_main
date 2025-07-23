const { createClient } = require('@supabase/supabase-js');
const { PREFIX } = require(`${BASE_DIR}/config`);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qmsjsxtkjkhesbeefixa.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtc2pzeHRramtoZXNiZWVmaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzMwNDksImV4cCI6MjA2NTMwOTA0OX0.tugE79enW2vo5v0zgocHNvwgpsLtqXyehfXlX3AFaio';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = {
  name: "xti",
  description: "Consulta el Puntaje Total (XTI) de un X específico en Los X (ALL THE WORLD).",
  commands: ["xti"],
  usage: `${PREFIX}xti <nombre_del_X>`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendText, remoteJid, isGroup }) => {
    if (!fullArgs) {
      await sendText(remoteJid, `xX| No puso el nombre del X a buscar... Pongase serio: ${PREFIX}xti <nombre_del_X> |Xx`);
      return;
    }

    const userNameToSearch = fullArgs.trim();

    try {
      const { data, error } = await supabase
        .from('user_register_x')
        .select('nombre_user_x, xti_user_x')
        .eq('nombre_user_x', userNameToSearch);

      if (error) {
        console.error("xX| Error al consultar, El Angel de Los X no lo ha permitido |Xx", error);
        await sendText(remoteJid, `xX| Error al consultar datos: ${error.message} |Xx`);
        return;
      }

      if (!data || data.length === 0) {
        await sendText(remoteJid, `xX| No se encontró el X '${userNameToSearch}' en Los X (ALL THE WORLD). |Xx`);
        return;
      }

      const userData = data[0];
      const nombreUserX = userData.nombre_user_x;
      const xtiUserX = userData.xti_user_x;

      const responseMessage = `xX| en Los X (ALL THE WORLD), el X conocido cómo ${nombreUserX} tiene un Puntaje Total (XTI) o (Tasa de Implante X) de ${xtiUserX} |Xx`;

      await sendText(remoteJid, responseMessage);

    } catch (e) {
      console.error("xX| Ocurrió un error inesperado al procesar el comando |Xx", e);
      await sendText(remoteJid, `xX| Ocurrió un error inesperado: ${e.message} |Xx`);
    }
  },
};
