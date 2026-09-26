const jwt = require("jsonwebtoken")
const blacklist = {}

const generate = (req) => {
  const { id, role, companyId } = req.body

  if (!id || !role || !companyId)
    return null

  const token = jwt.sign({ id, role, companyId }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES),
    algorithm: "HS256"
  })

  return token
}

const verify = (req, res, next) => {
  const authToken = req.headers["authorization"]

  if (!authToken)
    return res.status(403).json({ message: "A autenticação é necessária para proceguir." })

  const token = authToken.replace("Bearer ", "")
  if (blacklist[token])
    return res.status(403).json({ message: "Sessão inválida. Faça login novamente." })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded)
      return res.status(403).json({ message: "Sessão inválida. Faça login novamente." })

    res.locals.token = decoded
    return next()
  } catch (e) {
    console.error(e)
    res.status(403).json({ message: "Sessão inválida. Faça login novamente." })
  }
  
}

const addToBlacklist = (req) => {
  const { token } = req.body

  blacklist[token] = true

  setInterval(() => delete blacklist[token], process.env.JWT_EXPIRES * 1000)
}

module.exports = {
  generate,
  verify,
  addToBlacklist
}