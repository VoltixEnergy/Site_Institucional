const express = require("express");
const router = express.Router();

const empresaController = require("../controllers/empresaController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrarEmpresa", function (req, res) {
  empresaController.cadastrarEmpresa(req, res);
})

router.post("/desativarCodigo", function (req, res) {
  empresaController.desativarCodigo(req, res);
})

module.exports = router;