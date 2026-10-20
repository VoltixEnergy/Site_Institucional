const express = require("express");

const router = express.Router();

const serverController =
    require("../controllers/servidorController");


/* =========================================================
   CADASTRO
   ========================================================= */

router.post(
    "/cadastrar-instancia",
    function (req, res) {
        serverController.cadastrar_instancia(req, res);
    }
);

// COMEÇO METRICAS
router.post(
    "/cadastrar-cpu",
    function (req, res) {
        serverController.cadastrar_cpu(req, res);
    }
);
router.post(
    "/cadastrar-metrica",
    function (req, res) {
        serverController.cadastrar_metrica(req, res);
    }
);


//Rede

router.post(
    "/cadastrar-rede",
    function (req, res) {
        serverController.cadastrar_rede(req, res);
    }
);

router.post(
    "/cadastrar-metrica-rede",
    function (req, res) {
        serverController.cadastrar_metrica_rede(req, res);
    }
);

//perda pacotes

router.post(
    "/cadastrar-perda-pacote",
    function (req, res) {
        serverController.cadastrar_perda_pacote(req, res);
    }
);

router.post(
    "/cadastrar-metrica-perda-pacote",
    function (req, res) {
        serverController.cadastrar_metrica_perda_pacote(req, res);
    }
);

// FIM CPU

router.get(
    "/buscarserverPorEmpresa/:idEmpresa",
    function (req, res) {

        serverController.buscarserverPorEmpresa(
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

        serverController.listar(
            req,
            res
        );

    }
);

/* =========================================================
   Desativar
   ========================================================= */

router.get(
    "/update_desativar/:idServidor",
    function (req, res) {

        serverController.update_desativar(
            req,
            res
        );

    }
);

/* =========================================================
   Ativar
   ========================================================= */

router.get(
    "/update_ativar/:idServidor",
    function (req, res) {

        serverController.update_ativar(
            req,
            res
        );

    }
);


/* =========================================================
   PESQUISAR
   ========================================================= */

router.get(
    "/pesquisar/:nome/:empresaId",
    function (req, res) {

        serverController.pesquisar(
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

        serverController.buscarPorId(
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

        serverController.atualizar(
            req,
            res
        );

    }
);


/* =========================================================
   EDITAR NOME — ANTIGO
   ========================================================= */

router.put(
    "/editarNome/:idserver",
    function (req, res) {

        serverController.editarNome(
            req,
            res
        );

    }
);


/* =========================================================
   EXCLUIR — ANTIGO
   ========================================================= */

router.delete(
    "/deletarservidor/:idServidor",
    function (req, res) {

        serverController.deletarServidor(
            req,
            res
        );

    }
);


router.get(
    "/AddComponentes/:empresaId",
    function (req, res) {

        serverController.AddComponentes(
            req,
            res
        );

    }
);


module.exports = router;