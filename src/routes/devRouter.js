const express = require("express");
const router = express.Router();

const devController = require("../controllers/devController");

router.get("/BuscarServidor", devController.BuscarServidor);

router.post("/comparacao", function(req, res){
    devController.buscarComparacaoBucket(req, res);
});



module.exports = router;