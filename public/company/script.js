const getToastTypeByStatus = status => {
  if (status >= 200 && status < 300) return "success";
  if (status >= 400 && status < 500) return "warning";
  return "error";
}

const registerCompany = async () => {
  const tradeName = document.querySelector("#tradeName").value.trim()
  const legalName = document.querySelector("#legalName").value.trim()
  const cnpj = document.querySelector("#cnpj").value.trim()
  const code = document.querySelector("#code").value.trim()

  if (!validateCompanyData(tradeName, legalName, cnpj, code))
    return

  const body = { 
    "cnpj": cnpj,
    "tradeName": tradeName, 
    "legalName": legalName,
    "code": code
  }

  const responseBody = await fetch("/empresas/cadastrarEmpresa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  const response = await responseBody.json()
  showToast(response.message || "Algo deu errado. Tente novamente mais tarde.", getToastTypeByStatus(responseBody.status))

  if (responseBody.status != 201)
    return

  localStorage.setItem("ADM_CODE", response.data.admCode)

  showCreateAccountDialog(response.data.admCode)
}

const validateCompanyData = (tradeName, legalName, cnpj, code) => {
  if (!tradeName || tradeName.length < 3) {
    showToast("Nome comercial inválido!", "error")
    return false
  }
  if (!legalName || tradeName.length < 3) {
    showToast("Nome jurídico inválido!", "error")
    return false
  }

  const isCnpjValid = !(/^[A-Z0-9]{2}\.?[A-Z0-9]{3}\.?[A-Z0-9]{3}\/?[A-Z0-9]{4}-?\d{2}$/.test(cnpj))
  if (!cnpj || isCnpjValid) {
    showToast("CNPJ inválido!", "error")
    return false
  }

  if (!code || code.length !== 6){
    showToast("Código de ativação inválido!", "error")
    return false
  }

  return true
}

const showCreateAccountDialog = (code) => {
  const dialogBody = `
    <div class="confirm-details">
      <p>Sua empresa foi registrada! Faça agora mesmo sua conta de administrador com o código abaixo:</p>
      <div class="details-info">
        <p class="detail-label">${code}</span>
      </div>
      <div class="details-actions">
        <button onclick="redirectToLogin()" class="confirm-button">
          <span class="button-label">Criar conta</span>
        </button>
      </div>
    </div>
  `

  showDialog("Crie sua conta", dialogBody)
}

const redirectToLogin = () => {
  window.location.href = "../register"
}