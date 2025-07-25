const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { menuMessage } = require(`${BASE_DIR}/menu`);
const path = require("path");

module.exports = {
  name: "menu-x",
  description: "Menu de comandos",
  commands: ["menu-x", "help"],
  usage: `${PREFIX}menu-x`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendImageFromFile, sendSuccessReact }) => {
    await sendSuccessReact();

    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", "icon-xtialismo.png"),
      `\n\n${menuMessage()}`
    );
  },
};
