const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwt.middleware")
const alertaController = require("../controllers/alertaController");


router.get("/buscarAlertasPorEmpresa/", jwtMiddleware.verify, function (req, res) {
  alertaController.buscarAlertasPorEmpresa(req, res);
});

router.get("/listar/:idAlerta", jwtMiddleware.verify, function (req, res) {
  alertaController.listar(req, res);
});


module.exports = router;