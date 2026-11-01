const express = require("express");

const router = express.Router();

const serverController =
    require("../controllers/servidorController");

const jwtMiddleware = require("../middlewares/jwt.middleware")

/* =========================================================
   CADASTRO
   ========================================================= */

router.post(
    "/cadastrar-instancia",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_instancia(req, res);
    }
);

// COMEÇO METRICAS
router.post(
    "/cadastrar-cpu",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_cpu(req, res);
    }
);

router.post(
    "/cadastrar-metrica",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_metrica(req, res);
    }
);

router.get(
    "/dados-instancia/:id",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.buscarDadosInstancia(req, res);
    }
);


//Rede

router.post(
    "/cadastrar-rede",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_rede(req, res);
    }
);

router.post(
    "/cadastrar-metrica-rede",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_metrica_rede(req, res);
    }
);

// router.get(
//     "/list",
//     jwtMiddleware.verify,
//     function (req, res) {
//         serverController.listServers(req, res);
//     }
// );

//perda pacotes

router.post(
    "/cadastrar-perda-pacote",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_perda_pacote(req, res);
    }
);

router.post(
    "/cadastrar-metrica-perda-pacote",
    jwtMiddleware.verify,
    function (req, res) {
        serverController.cadastrar_metrica_perda_pacote(req, res);
    }
);

// FIM CPU

router.get(
    "/buscarserverPorEmpresa/:idEmpresa",
    jwtMiddleware.verify,
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
    jwtMiddleware.verify,
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
    jwtMiddleware.verify,
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
    jwtMiddleware.verify,
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
    "/pesquisar/:nome",
    jwtMiddleware.verify,
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

// router.get(
//     "/:id",
//     jwtMiddleware.verify,
//     function (req, res) {

//         serverController.buscarPorId(
//             req,
//             res
//         );

//     }
// );


/* =========================================================
   ATUALIZAR
   ========================================================= */

router.put(
    "/atualizar/:id",
    jwtMiddleware.verify,
    function (req, res) {

        serverController.atualizar(
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
    jwtMiddleware.verify,
    function (req, res) {

        serverController.deletarServidor(
            req,
            res
        );

    }
);


router.get(
    "/AddComponentes",
    jwtMiddleware.verify,
    function (req, res) {

        serverController.AddComponentes(
            req,
            res
        );

    }
);


module.exports = router;