const express = require("express");

const router = express.Router();

const usuarioController =
    require("../controllers/usuarioController");


/* =========================================================
   CADASTRO
   ========================================================= */

router.post(
    "/cadastrar",
    function (req, res) {
        usuarioController.cadastrar(req, res);
    }
);


/* =========================================================
   LOGIN
   ========================================================= */

router.post(
    "/autenticar",
    function (req, res) {
        usuarioController.autenticar(req, res);
    }
);


/* =========================================================
   CÓDIGOS
   ========================================================= */

router.post(
    "/autenticarCodigo",
    function (req, res) {
        usuarioController.autenticarCodigo(req, res);
    }
);


router.post(
    "/adicionarCodigo",
    function (req, res) {
        usuarioController.adicionarCodigo(req, res);
    }
);


/* =========================================================
   USUÁRIO POR EMPRESA
   ========================================================= */

router.get(
    "/buscarUsuarioPorEmpresa/:idEmpresa",
    function (req, res) {

        usuarioController.buscarUsuarioPorEmpresa(
            req,
            res
        );

    }
);


/* =========================================================
   LISTAR
   ========================================================= */

router.get(
    "/listar/:idEmpresa",
    function (req, res) {

        usuarioController.listar(
            req,
            res
        );

    }
);


/* =========================================================
   PESQUISAR
   ========================================================= */

router.get(
    "/pesquisar/:nome",
    function (req, res) {

        usuarioController.pesquisar(
            req,
            res
        );

    }
);


/* =========================================================
   BUSCAR POR ID
   ========================================================= */

router.get(
    "/:id",
    function (req, res) {

        usuarioController.buscarPorId(
            req,
            res
        );

    }
);


/* =========================================================
   ATUALIZAR
   ========================================================= */

router.put(
    "/atualizar/:id",
    function (req, res) {

        usuarioController.atualizar(
            req,
            res
        );

    }
);


/* =========================================================
   EDITAR NOME — ANTIGO
   ========================================================= */

router.put(
    "/editarNome/:idUsuario",
    function (req, res) {

        usuarioController.editarNome(
            req,
            res
        );

    }
);


/* =========================================================
   EXCLUIR — NOVO
   ========================================================= */

router.delete(
    "/excluir/:id",
    function (req, res) {

        usuarioController.deletarUsuario(
            req,
            res
        );

    }
);


/* =========================================================
   EXCLUIR — ANTIGO
   ========================================================= */

router.delete(
    "/deletarUsuario/:idUsuario",
    function (req, res) {

        usuarioController.deletarUsuario(
            req,
            res
        );

    }
);


/* =========================================================
   BUSCAR CPF
   ========================================================= */

router.get(
    "/buscarUsuarioPorCPF/:cpf",
    function (req, res) {

        usuarioController.buscarUsuarioPorCPF(
            req,
            res
        );

    }
);


module.exports = router;