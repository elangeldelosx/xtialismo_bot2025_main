const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { consultarCep } = require("correios-brasil");

module.exports = {
  name: "cep",
  description: "Consulta CEP",
  commands: ["cep"],
  usage: `${PREFIX}cep 01001-001`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    const cep = args[0];

    if (!cep || ![8, 9].includes(cep.length)) {
      throw new InvalidParameterError(
        "¡Necesitas enviar un CEP en el formato 00000-000 o 00000000!"
      );
    }

    try {
      const data = await consultarCep(cep);

      if (!data.cep) {
        await sendWarningReply("¡CEP no encontrado!");
        return;
      }

      await sendSuccessReply(`*Resultado*
        
*CEP*: ${data.cep}
*Calle*: ${data.logradouro}
*Complemento*: ${data.complemento}
*Barrio*: ${data.bairro}
*Localidad*: ${data.localidade}
*Estado*: ${data.uf}
*IBGE*: ${data.ibge}`);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
};
