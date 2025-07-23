const { getContent, compareUserJidWithOtherNumber } = require("../utils");
const { errorLog } = require("../utils/logger");
const {
  readGroupRestrictions,
  readRestrictedMessageTypes,
} = require("../utils/database");
const { BOT_NUMBER, OWNER_NUMBER, OWNER_LID } = require("../config");

exports.messageHandler = async (socket, webMessage) => {
  try {
    if (!webMessage?.key) {
      return;
    }

    const { remoteJid, fromMe, id: messageId } = webMessage.key;

    if (fromMe) {
      return;
    }

    const userJid = webMessage.key?.participant;

    if (!userJid) {
      return;
    }

    const isBotOrOwner =
      compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER }) ||
      compareUserJidWithOtherNumber({ userJid, otherNumber: BOT_NUMBER }) ||
      userJid === OWNER_LID;

    if (isBotOrOwner) {
      return;
    }

    const antiGroups = readGroupRestrictions();

    const messageType = Object.keys(readRestrictedMessageTypes()).find((type) =>
      getContent(webMessage, type)
    );

    if (!messageType) {
      return;
    }

    const isAntiActive = !!antiGroups[remoteJid]?.[`anti-${messageType}`];

    if (!isAntiActive) {
      return;
    }

    await socket.sendMessage(remoteJid, {
      delete: {
        remoteJid,
        fromMe,
        id: messageId,
        participant: userJid,
      },
    });
  } catch (error) {
    errorLog(
      `Error al procesar mensaje restringido. Detalles: ${error.message}`
    );
  }
};
