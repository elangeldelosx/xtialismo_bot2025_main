const { exec } = require("child_process");
const { isBotOwner } = require(`${BASE_DIR}/middlewares`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "exec",
  description: "Ejecuta comandos del terminal directamente desde el bot.",
  commands: ["exec"],
  usage: `${PREFIX}exec comando`,
  handle: async ({
    fullArgs,
    sendSuccessReply,
    sendErrorReply,
    userJid,
    isLid,
  }) => {
    if (!isBotOwner({ userJid, isLid })) {
      throw new DangerError("xX| Solo El Angel de Los X puede usar este comando |Xx");
    }

    if (!fullArgs) {
      throw new DangerError(`xX| Uso correcto: ${PREFIX}exec comando |Xx`);
    }

    exec(fullArgs, (error, stdout) => {
      if (error) {
        return sendErrorReply(`Error al ejecutar: ${error.message}`);
      }

      const output = stdout || "xX| Comando ejecutado sin salida |Xx";

      return sendSuccessReply(
        `xX| Resultado:\n\`\`\`\n${output.trim().slice(0, 4000)}\n\`\`\` |Xx`
      );
    });
  },
};
