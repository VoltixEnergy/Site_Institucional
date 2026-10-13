const codeController = require("../controllers/codigoController")
const router = require("express").Router()
const jwtMiddleware = require("../middlewares/jwt.middleware")

router.get("/getAll", jwtMiddleware.verify,  (req, res) => {
  codeController.getAllCodes(req, res)
})

router.post("/send", jwtMiddleware.verify, (req, res) => {
  codeController.sendCode(req, res)
})

router.put("/edit", jwtMiddleware.verify, (req, res) => {
  codeController.editCode(req, res)
})

router.delete("/disable", (req, res) => {
  codeController.disableCode(req, res)
})

module.exports = router