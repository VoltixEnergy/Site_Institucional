const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
  usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res);
});

router.post("/autenticarCodigo", function (req, res) {
  usuarioController.autenticarCodigo(req, res);
});

router.post("/adicionarCodigo", function (req, res) {
  usuarioController.adicionarCodigo(req, res);
});

router.get("/buscarUsuarioPorEmpresa/:idEmpresa", function (req, res) {
  usuarioController.buscarUsuarioPorEmpresa(req, res);
});

router.get("/listar/:idEmpresa", function (req, res) {
  usuarioController.listar(req, res);
});

router.get("/pesquisar/:nome", function (req, res) {
  usuarioController.pesquisar(req, res);
});

router.get("/:id", function (req, res) {
  usuarioController.buscarPorId(req, res);
});

router.put("/atualizar/:id", function (req, res) {
  usuarioController.atualizar(req, res);
});

router.put("/editarNome/:idUsuario", function (req, res) {
  usuarioController.editarNome(req, res);
});

router.delete("/excluir/:id", function (req, res) {
  usuarioController.deletarUsuario(req, res);
});

router.delete("/deletarUsuario/:idUsuario", function (req, res) {
  usuarioController.deletarUsuario(req, res);
});

router.get("/buscarUsuarioPorCPF/:cpf", function (req, res) {
  usuarioController.buscarUsuarioPorCPF(req, res);
});

module.exports = router;