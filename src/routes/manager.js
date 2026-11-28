const express = require("express");
const router = express.Router();

const managerController = require("../controllers/managerController");
const { verify } = require("../middlewares/jwt.middleware");

router.get("/dashboard", verify, function (req, res) {
    managerController.obterDadosDashboard(req, res);
});

module.exports = router;