const express = require("express");
const router = express.Router();
const JWT = require("../middlewares/jwt.middleware");

const previsaoController = require("../controllers/previsaoController");

router.get("/historico/:empresaId", JWT.verify ,function (req, res) {
  previsaoController.buscarHistorico(req, res);
});

module.exports = router;
