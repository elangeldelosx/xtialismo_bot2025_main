const path = require("path");

exports.PREFIX = "/";

exports.BOT_EMOJI = "❌";

exports.BOT_NAME = "xtialismo_bot2025";

exports.BOT_NUMBER = "573025641309";

exports.OWNER_NUMBER = "573003296320";

exports.OWNER_LID = "219999999999999@lid";

exports.COMMANDS_DIR = path.join(__dirname, "commands");

exports.DATABASE_DIR = path.resolve(__dirname, "..", "database");

exports.ASSETS_DIR = path.resolve(__dirname, "..", "assets");

exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 300;

exports.SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api";

exports.SPIDER_API_TOKEN = "seu_token_aqui";

exports.ONLY_GROUP_ID = "";

exports.DEVELOPER_MODE = false;

exports.BASE_DIR = path.resolve(__dirname);

exports.PROXY_PROTOCOL = "http";
exports.PROXY_HOST = "ip";
exports.PROXY_PORT = "porta";
exports.PROXY_USERNAME = "usuário";
exports.PROXY_PASSWORD = "senha";
