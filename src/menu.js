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
║  ✦  B A S E   D E   M A N D O
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
║  ✦  U S U A R I O S   X
║  ───────────────────────────────
║  ✖  ${PREFIX}los-x
║  ✖  ${PREFIX}new-x-system
║  ✖  ${PREFIX}xti
║  ✖  ${PREFIX}xti-creator
║  ✖  ${PREFIX}top-xti
║  ✖  ${PREFIX}novato-xti
║  ✖  ${PREFIX}get-lid
║  ✖  ${PREFIX}menu
║  ✖  ${PREFIX}perfil
║  ✖  ${PREFIX}sticker
║  ✖  ${PREFIX}to-image
║
║
╚═══════════════════════════╝${readMore()}
`;
};
