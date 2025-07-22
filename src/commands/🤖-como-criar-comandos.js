const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "comando",
  description: "Descripción del comando",
  commands: ["comando1", "comando2"],
  usage: `${PREFIX}comando`,
  handle: async ({ sendAudioFromBuffer }) => {
    // código del comando
  },
};
