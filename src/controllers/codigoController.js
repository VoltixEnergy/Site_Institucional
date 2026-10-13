const mailerController = require("./mailerController");
const codeModel = require("../models/codeModel")
const companyModel = require("../models/empresaModel")

const sendCode = async (req, res) => {
    const { companyId, role } = req.token // cargo do usuário da requisição
    const { email, codeRole } = req.body // cargo do novo código

    if (role !== 1) {
      responseBody.message = "Somente Gestores de TI têm acesso aos usuários do sistema."
      res.status(401).json(responseBody)
    }

    console.log("email: " + email, "companyId: " + companyId, "role: " + role)

    const code = generateCode()

    const responseBody = {
      message: "Não foi possível enviar o código."
    }

    if (!email || !companyId || codeRole == null) {
      responseBody.message = "Credenciais inválidas.";
      return res.status(400).json(responseBody);
    }

    const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

    if (!isEmailValid) {
      responseBody.message = "Informe um e-mail válido.";
      return res.status(400).json(responseBody);
    }

    try {
        const dbResponse = await companyModel.buscarNomePeloId(companyId)

        if (dbResponse.length !== 1) {
          responseBody.message = "Não foi possível encontrar a empresa.";
          return res.status(500).json(responseBody);
        }

        const companyName = dbResponse[0].nome_fantasia
        console.log("Nome da empresa: " + companyName)

        const infoEmail = await mailerController.sendVerificationCode(email, code, companyName, codeRole);
        
        if (infoEmail.rejected && infoEmail.rejected.length > 0) {
            responseBody.message = "Não foi possível enviar o e-mail.";
            return res.status(500).json(responseBody);
        }

        codeModel.create(code, companyId, codeRole)

        responseBody.isError = false;
        responseBody.message = "Código enviado com sucesso!";

        return res.status(200).json(responseBody);


    } catch (e) {
      console.error(e)
        responseBody.message =
            "Algo deu errado. Tente novamente mais tarde.";

        return res.status(500).json(responseBody);
    }
};

const generateCode = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""

  for (let i = 0; i < 6; i++) {
    const random = Math.floor(Math.random() * 36)

    code += chars[random]
  }

  return code
}

const editCode = async (req, res) => {
  const { id, role, email, isRenewal } = req.body

  const responseBody = {
    message: ""
  }

  if (!id) {
    responseBody.message = "Id do código está inválido"
    return res.status(400).json(responseBody)
  }

  if (!role && !isRenewal && !email) {
    responseBody.message = "Dados inválidos"
    return res.status(400).json(responseBody)
  }

  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  if (isEmailValid && email && !isEmailValid) {
    responseBody.message = "Email está inválido"
    return res.status(400).json(responseBody)
  }
  
  try {

    if (role !== null && typeof role !== "undefined") {
      console.log("cargo: " + role)
      const response = await codeModel.updateRoleById(id, role)

      if (response.affectedRows !== 1) {
        responseBody.message = "Não foi possível alterar o cargo relacionado ao código. Tente novamente mais tarde"
        return res.status(500).json(responseBody);
      } 

      responseBody.message = "O cargo do código foi alterado com sucesso"
      return res.status(200).json(responseBody)
    }

    else if (isEmailValid && email !== null && typeof email !== "undefined" && email !== "") {
      console.log("email: " + email)

      const response = await codeModel.updateExpiresAtById(id)

      if (response.affectedRows !== 1) {
        responseBody.message = "Não foi possível renovar data de expiração do código. Tente novamente mais tarde"
        return res.status(500).json(responseBody);
      } 

      const dbResponse = await codeModel.getCodeDataByCodeId(id)
      if (dbResponse.length !== 1) {
        responseBody.message = "Não foi possível encontrar o código de ativação";
        return res.status(500).json(responseBody);
      }
      
      const { cargo, nome_fantasia, codigo } = dbResponse[0]
      const mailerResponse = await mailerController.sendVerificationCode(email, codigo, nome_fantasia, cargo)

      if (mailerResponse.rejected && mailerResponse.rejected.length > 0) {
        responseBody.message = "Não foi possível enviar o e-mail. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
      }

      responseBody.message = "O email foi reenviado com sucesso"
      return res.status(200).json(responseBody)
    }

    else {
      responseBody.message = "Credenciais inválidas"
      return res.status(400).json(responseBody)
    }

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody);
  }
}

const disableCode = async (req, res) => {
  const { id } = req.body

  const responseBody = {
    message: "Id do código de ativação inválido"
  }

  if (!id) 
    return res.status(400).json(responseBody)

  try {
    const dbResponse = await codeModel.disableCodeById(id)
    console.log(dbResponse)
  
    if (dbResponse.affectedRows !== 1) {
      responseBody.message = "Código de ativação não encontrado"
      return res.status(404).json(responseBody)
    }

    responseBody.message = "Código de ativação foi desativado com sucesso"
    return res.status(200).json(responseBody)

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody)
  }
  
}

const getAllCodes = async (req, res) => {
  const { id, companyId } = req.token

  const responseBody = {
    message: "Credenciais inválidas",
    data: {}
  }

  if (!id || !companyId)
    return res.status(400).json(responseBody)

  try {
    const dbResponse = await codeModel.getAllCodesByUserAndCompanyId(id, companyId)

    if (dbResponse.length === 0) 
      return res.status(204).json(responseBody)
    
    responseBody.message = ""
    responseBody.data = dbResponse
    return res.status(200).json(responseBody)

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody)
  }
} 

module.exports = {
  sendCode,
  editCode,
  disableCode,
  getAllCodes
}