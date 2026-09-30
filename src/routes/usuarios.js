const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwt.middleware")

const usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
  usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res);
});

router.get("/buscarUsuarioPorEmpresa/:idEmpresa", jwtMiddleware.verify, function (req, res) {
  usuarioController.buscarUsuarioPorEmpresa(req, res);
});

router.get("/listar/:idEmpresa", jwtMiddleware.verify, function (req, res) {
  usuarioController.listar(req, res);
});

router.get("/pesquisar/:nome", jwtMiddleware.verify, function (req, res) {
  usuarioController.pesquisar(req, res);
});

router.get("/:id", jwtMiddleware.verify, function (req, res) {
  usuarioController.buscarPorId(req, res);
});

router.put("/atualizar/:id", jwtMiddleware.verify, function (req, res) {
  usuarioController.atualizar(req, res);
});

router.put("/editarNome/:idUsuario", jwtMiddleware.verify, function (req, res) {
  usuarioController.editarNome(req, res);
});

router.delete("/excluir/:id", jwtMiddleware.verify, function (req, res) {
  usuarioController.deletarUsuario(req, res);
});

router.delete("/deletarUsuario/:idUsuario", jwtMiddleware.verify, function (req, res) {
  usuarioController.deletarUsuario(req, res);
});

module.exports = router;