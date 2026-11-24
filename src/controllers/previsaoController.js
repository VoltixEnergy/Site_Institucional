const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });


async function buscarHistorico(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const { companyId } = req.token;

  try {

    const resposta = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_GOLD,
      Key: `previsao/${companyId}.json`,
    }));

    const texto = await resposta.Body.transformToString();
    responseBody.data = JSON.parse(texto);
    return res.status(200).json(responseBody);

  } catch (erro) {

    if (erro.name === "NoSuchKey") {
      responseBody.message = "Ainda não há histórico de previsão para essa empresa.";
      return res.status(404).json(responseBody);
    }

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}

module.exports = {
  buscarHistorico,
};