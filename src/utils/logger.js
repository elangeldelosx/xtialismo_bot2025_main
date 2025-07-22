const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[XTIALISMO_BOT2025 | HABLA]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[XTIALISMO_BOT2025 | ENTRADA]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[XTIALISMO_BOT2025 | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[XTIALISMO_BOT2025 | ÉXITO]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[XTIALISMO_BOT2025 | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[XTIALISMO_BOT2025 | ADVERTENCIA]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log(`\x1b[35m
██╗  ██╗████████╗██╗
╚██╗██╔╝╚══██╔══╝██║
 ╚███╔╝    ██║   ██║
 ██╔██╗    ██║   ██║
██╔╝╚██╗   ██║   ██║
╚═╝  ╚═╝   ╚═╝   ╚═╝
\x1b[0m`);
  console.log(`\x1b[36m❌ Versión: \x1b[0m${version}\n`);
};
