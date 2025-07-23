const { BOT_NAME, PREFIX } = require("./config");
const packageInfo = require("../package.json");
const { readMore } = require("./utils");

exports.menuMessage = () => {
  const date = new Date();

  return `
╔═══《 X T I A L I S M O _ B O T 2 0 2 5 》
║                                          
║  ───────────────────────────────
║  ✖  ${BOT_NAME}
║  ✖  ${date.toLocaleDateString("es-es")}
║  ✖  ${date.toLocaleTimeString("es-es")}
║  ✖  ${PREFIX}
║  ✖  ${packageInfo.version}
║
║  ✦  C R E A D O R
║  ───────────────────────────────
║  ✖  ${PREFIX}exec
║  ✖  ${PREFIX}get-id
║  ✖  ${PREFIX}off
║  ✖  ${PREFIX}on
║  ✖  ${PREFIX}set-menu-image
║
║  ✦  A D M I N S
║  ───────────────────────────────
║  ✖  ${PREFIX}abrir
║  ✖  ${PREFIX}agendar-mensagem
║  ✖  ${PREFIX}anti-audio (1/0)
║  ✖  ${PREFIX}anti-document (1/0)
║  ✖  ${PREFIX}anti-event (1/0)
║  ✖  ${PREFIX}anti-image (1/0)
║  ✖  ${PREFIX}anti-link (1/0)
║  ✖  ${PREFIX}anti-product (1/0)
║  ✖  ${PREFIX}anti-sticker (1/0)
║  ✖  ${PREFIX}anti-video (1/0)
║  ✖  ${PREFIX}auto-responder (1/0)
║  ✖  ${PREFIX}ban
║  ✖  ${PREFIX}delete
║  ✖  ${PREFIX}exit (1/0)
║  ✖  ${PREFIX}fechar
║  ✖  ${PREFIX}hidetag
║  ✖  ${PREFIX}limpar
║  ✖  ${PREFIX}link-grupo
║  ✖  ${PREFIX}mute
║  ✖  ${PREFIX}only-admin (1/0)
║  ✖  ${PREFIX}promover
║  ✖  ${PREFIX}rebaixar
║  ✖  ${PREFIX}revelar
║  ✖  ${PREFIX}unmute
║  ✖  ${PREFIX}welcome (1/0)
║
║  ✦  U S U A R I O S
║  ───────────────────────────────
║  ✖  ${PREFIX}attp
║  ✖  ${PREFIX}cep
║  ✖  ${PREFIX}exemplos-de-mensagens
║  ✖  ${PREFIX}fake-chat
║  ✖  ${PREFIX}gerar-link
║  ✖  ${PREFIX}get-lid
║  ✖  ${PREFIX}google-search
║  ✖  ${PREFIX}perfil
║  ✖  ${PREFIX}ping
║  ✖  ${PREFIX}raw-message
║  ✖  ${PREFIX}rename
║  ✖  ${PREFIX}sticker
║  ✖  ${PREFIX}to-image
║  ✖  ${PREFIX}ttp
║  ✖  ${PREFIX}yt-search
║
║  ✦  D E S C A R G A S
║  ───────────────────────────────
║  ✖  ${PREFIX}play-audio
║  ✖  ${PREFIX}play-video
║  ✖  ${PREFIX}tik-tok
║  ✖  ${PREFIX}yt-mp3
║  ✖  ${PREFIX}yt-mp4
║
║  ✦  I A
║  ───────────────────────────────
║  ✖  ${PREFIX}gemini
║  ✖  ${PREFIX}ia-sticker
║  ✖  ${PREFIX}pixart
║  ✖  ${PREFIX}stable-diffusion-turbo
║
║  ✦  C A N V A S
║  ───────────────────────────────
║  ✖  ${PREFIX}blur
║  ✖  ${PREFIX}bolsonaro
║  ✖  ${PREFIX}cadeia
║  ✖  ${PREFIX}contraste
║  ✖  ${PREFIX}espelhar
║  ✖  ${PREFIX}gray
║  ✖  ${PREFIX}inverter
║  ✖  ${PREFIX}pixel
║  ✖  ${PREFIX}rip
║
╚═════════════════════════════════════╝${readMore()}
`;
};
