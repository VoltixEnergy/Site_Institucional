const serverModel = require("../models/devModel");

async function buscarComparacaoBucket(req, res) {
    try {

        // Se quiser usar uma chave dinâmica por servidor, pode usar:
        // const key = process.env.BUCKET_FILE_KEY || `dados/${servidor.toLowerCase()}.json`;
        const key = process.env.BUCKET_FILE_KEY;
        const url = process.env.BUCKET_URL;

        const comando = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        });

        const respostaS3 = await fetch(`${url}/${key}`);
        const dadosJson = JSON.parse(respostaS3);

        // Caso o JSON no bucket já tenha o formato { cpu: {...}, ram: {...}, disco: {...} }
        // ou venha aninhado por servidor { "SRV-APP-01": { cpu: {...}, ... } }
        const payload = dadosJson;

        return res.status(200).json(payload);
    } catch (erro) {
        console.error("Erro ao buscar predição no bucket:", erro);
        return res.status(500).json({
            mensagem: "Erro ao consultar dados no bucket",
            detalhe: erro.message
        });
    }
}

async function BuscarServidor(req, res) {

    try {
        const instancias = await serverModel.listar_instancias();

        res.status(200).json(instancias);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao listar servidores."
        });
    }
}

module.exports = {
 buscarComparacaoBucket,
 BuscarServidor,
}