var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/autenticarCodigo", function (req, res) {
    usuarioController.autenticarCodigo(req, res);
});

router.post("/adicionarCodigo", function(req, res){
    usuarioController.adicionarCodigo(req, res);
})
router.get("/buscarUsuarioPorEmpresa/:idEmpresa", function (req, res) {
    usuarioController.buscarUsuarioPorEmpresa(req, res);
});

router.put("/editarNome/:idUsuario", function (req, res) {
    usuarioController.editarNome(req, res);
});

router.delete("deletarUsuario/idUsuario", function(req, res){
    usuarioController.deletarUsuario(req, res)
})

module.exports = router;