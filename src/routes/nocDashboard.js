const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwt.middleware")
const nocDashboardController = require("../controllers/nocDashboardController");




router.get(
    "/AddComponentes",
    jwtMiddleware.verify,
    function (req, res) {

        nocDashboardController.AddComponentes(
            req,
            res
        );

    }
);


router.get("/buscarAlertasPorEmpresa/", jwtMiddleware.verify, function (req, res) {
  nocDashboardController.buscarAlertasPorEmpresa(req, res);
});


router.get(
    "/pesquisar/:nome",
    jwtMiddleware.verify,
    function (req, res) {

        nocDashboardController.pesquisar(
            req,
            res
        );

    }
);

router.get(
    "/buscarserverPorEmpresa/:idEmpresa",
    jwtMiddleware.verify,
    function (req, res) {

        nocDashboardController.buscarserverPorEmpresa(
            req,
            res
        );

    }
);




module.exports = router;