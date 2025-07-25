const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const path = require("path");
const fs = require("node:fs");

module.exports = {
    name: "los-x",
    description: "Entrar a Los X (ALL THE WORLD).",
    commands: ["los-x"],
    usage: `${PREFIX}los-x`,
    /**
     * @param {CommandHandleProps} props
     * @returns {Promise<void>}
     */
    handle: async ({
        sendImageFromFile,
        sendSuccessReact,
        userJid,
        sendTextReply,
    }) => {
        const url = "https://losxalltheworld.vercel.app/";

        await sendSuccessReact();

        const imagePath = path.join(ASSETS_DIR, "images", "icon-xtialismo.png");
        const message = `xX| ${userJid} ha ingresado a Los X (ALL THE WORLD): ${url} |Xx`;

        if (fs.existsSync(imagePath)) {
            await sendImageFromFile(imagePath, message);
        } else {
            await sendTextReply(`xX| Error: No se encontró la imagen en '${imagePath}'. ${message} |Xx`);
            console.error(`Error: Image file not found at ${imagePath} for 'los-x' command.`);
        }
    },
};
