const welcomeMessages = [
  "Un nuevo registro en XTIALISMO: @member.",
  "Se ha incorporado @member a XTIALISMO.",
  "XTIALISMO reconoce la presencia de @member.",
  "La entrada de @member ha sido registrada en XTIALISMO.",
  "Se notifica la adición de @member a XTIALISMO.",
];

const additionalInfoContent = `
Aquí se hace Tasa de Implante (XTI) y Dinero.
Se implanta un estilo de vida... no una religión, no una cultura... solo una Convicción.

Enlaces:

Los X (ALL THE WORLD):
https://losxalltheworld.vercel.app/

Creador del XTIALISMO:
https://www.tiktok.com/@el_angel_de_los_x?_t=ZS-8y8po22yixE&_r=1

https://youtube.com/@el_angel_de_los_x?si=zgFm-yQIHVAg4Ivf

https://www.instagram.com/elangeldelosx?igsh=a2d3MGJpZzlqNm9h

https://www.facebook.com/share/1AqyZ3eq5t/

https://x.com/elangeldelosx?t=YKS8_0qlCq0QCTdorpRFRw&s=09
`;

module.exports = {
  getWelcomeMessage: (memberName) => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    const selectedMessage = welcomeMessages[randomIndex].replace("@member", memberName);
    return `${selectedMessage}\n\n${additionalInfoContent}`;
  },
  exitMessage: "@member salió del grupo... Da igual, no tiene importancia.",
  additionalInfo: additionalInfoContent,
};
