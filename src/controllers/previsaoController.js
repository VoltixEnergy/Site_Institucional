const BUCKET_URL = process.env.S3_BUCKET_GOLD_URL || "https://voltix-s3-bucket-sptech-gold.s3.amazonaws.com";

async function buscarHistorico(req, res) {

  const responseBody = { message: "", data: {} };
  const { companyId } = req.token;

  try {
    const resposta = await fetch(`${BUCKET_URL}/previsao/${companyId}.json`);

    if (resposta.status === 404 || resposta.status === 403) {
      responseBody.message = "Ainda não há histórico de previsão para essa empresa";
      return res.status(404).json(responseBody);
    }
    if (!resposta.ok) throw new Error(`S3 respondeu ${resposta.status}`);

    responseBody.data = await resposta.json();
    return res.status(200).json(responseBody);
  } catch (erro) {
    console.error(erro);
    responseBody.message = "Algo deu errado. Tente novamente mais tarde";
    return res.status(500).json(responseBody);
  }
}

module.exports = {
  buscarHistorico,
};
