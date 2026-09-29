const roleHash = {
  0: "Novo parceiro",
  1: "Gestor TI",
  2: "Analista NOC",
}

const fillRolesAtNewCode = () => {
  const newPartnerOpt = document.getElementById("newPartnerOpt")

  const userRole = sessionStorage.getItem("ID_USUARIO")
  const userCompanyId = sessionStorage.getItem("ID_EMPRESA")

  if (userRole == 1 && userCompanyId == 1) 
    newPartnerOpt.classList.remove("hidden")
  
}

const getCodes = async () => {
  const userId = sessionStorage.getItem("ID_USUARIO")
  const companyId = sessionStorage.getItem("ID_EMPRESA")

  if (!userId || !companyId) 
    return showToast("Sessão inválida, faça login novamente", "warning")

  const response = await fetch(`/code/getAll?userId=${userId}&companyId=${companyId}`)

  if (response.status === 204)
    return showToast("Não há nenhum código de ativação", "warning")

  const { message, data } = await response.json()
  
  if (response.status === 400)
    return showToast(message, "warning")
  
  if (response.status === 500)
    return showToast(message, "error")

  const codesContainer = document.getElementById("codesContainer")

  const userRole = sessionStorage.getItem("ID_USUARIO")
  const userCompanyId = sessionStorage.getItem("ID_EMPRESA")
  data.forEach(code => {
    const { atualizado_em, cargo, codigo, criado_em, deletado_em, expira_em, id, usado_em } = code

    console.log(atualizado_em, cargo, codigo, criado_em, deletado_em, expira_em, id, usado_em)
    const elementId = `${codigo}-${id}`

    const element = `
      <div id="${elementId}" class="code-card">
        <div class="card-header">
          <div class="role-select-group">
            <i class="ph-bold ph-briefcase role-icon"></i>
            <select id="roleSelect-${elementId}" class="role-select" onchange="editRole('${elementId}')">
              <option value="0" ${cargo === 0 ? "selected" : ""} ${userRole == 1 && userCompanyId == 1 ? "" : "hidden disabled"}>Novo parceiro</option>
              <option value="1" ${cargo === 1 ? "selected" : ""}>Gestor TI</option>
              <option value="2" ${cargo === 2 ? "selected" : ""}>Analista NOC</option>
            </select>
          </div>
      
          <h1 class="code-title">${codigo}</h1>
      
          <div class="card-actions">
            <i
              onclick="copyCode('${elementId}')"
              tabindex="0"
              class="ph-bold ph-copy-simple action-icon action-copy ${usado_em ? "is-disabled" : ""}"
            ></i>
            <i
              onclick="refreshCode('${elementId}')"
              tabindex="0"
              class="ph-bold ph-arrows-clockwise action-icon action-refresh ${usado_em ? "is-disabled" : ""}"
            ></i>
            <i
              onclick="disableCode('${elementId}')"
              tabindex="0"
              class="ph-bold ph-trash-simple action-icon action-delete"
            ></i>
          </div>
        </div>
      
        <div class="card-divider"></div>
      
        <div class="card-info">
          <span class="info-row">
            <i class="ph ph-calendar-dot info-icon"></i>
            <p>Criado há ${dateToTime(criado_em)} atrás</p>
          </span>
      
          ${
            usado_em
              ? `
            <span class="info-row info-row-used">
              <i class="ph ph-calendar-check info-icon"></i>
              <p>Usado há ${dateToTime(usado_em)} atrás</p>
            </span>
          `
              : new Date(expira_em) > new Date()
              ? `
            <span class="info-row info-row-expiring">
              <i class="ph ph-calendar-x info-icon"></i>
              <p>Expirará em ${dateToTime(expira_em)}</p>
            </span>
          `
              : `
            <span class="info-row info-row-expired">
              <i class="ph ph-calendar-x info-icon"></i>
              <p>Expirou há ${dateToTime(expira_em)} atrás</p>
            </span>
          `
          }
      
          ${
            !atualizado_em
              ? ""
              : `
            <span class="info-row">
              <i class="ph ph-calendar-plus info-icon"></i>
              <p>Última atualização há ${dateToTime(atualizado_em)} atrás</p>
            </span>
          `
          }
        </div>
      </div>
    `

    codesContainer.innerHTML += element
  })
  
}

// parte da função abaixo foi reutilizada do meu projeto passado (CompostEco)
const dateToTime = (date) => {
  const incomingDate = new Date(date)
  const nowDate = new Date()

  const diferenceMs = Math.abs(nowDate.getTime() - incomingDate.getTime())

  const seconds = (diferenceMs / 1000).toFixed(0)
  const minutes = (diferenceMs / (1000 * 60)).toFixed(0)
  const hours = (diferenceMs / (1000 * 60 * 60)).toFixed(0)
  const days = (diferenceMs / (1000 * 60 * 60 * 24)).toFixed(0)

  if (seconds < 60) 
    return seconds + " segundo" + (seconds > 1 ? "s" : "")
  else if (minutes < 60) 
    return minutes + " minuto" + (minutes > 1 ? "s" : "")
  else if (hours < 24) 
    return hours + " hora" + (hours > 1 ? "s" : "")
  else 
    return days + " dia" + (days > 1 ? "s" : "")
}

const copyCode = (elementId) => {
  navigator.clipboard.writeText(elementId.substring(0, 6))
  showToast("Código copiado para sua área de transferência.", "success")
}

const refreshCode = (elementId) => {
  const dialogBody = `
    <div class="resend-form">
      <div class="form-field">
        <label for="emailReceiver" class="form-label">Email</label>
        <input type="email" id="emailReceiver" placeholder="Digite o email a receber o código" class="form-input">
      </div>
      <button onclick="resendCode('${elementId}')" id="resendCodeButton" class="resend-button">
        <i class="ph ph-paper-plane-tilt resend-icon"></i><span class="resend-label">Reenviar código</span>
      </button>
    </div>
  `

  showDialog("Reenviar código", dialogBody)
}

const resendCode = async (elementId) => {
  const emailReceiverElement = document.getElementById("emailReceiver")
  const emailReceiver = emailReceiverElement.value.trim()

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
  if (!emailReceiver || !emailRegex.test(emailReceiver))
    return showToast("Email inválido", "warning")

  const codeId = elementId.split("-")[1]
  const body = { 
    id: codeId, 
    role: null, 
    email: emailReceiver, 
    isRenewal: true
  }

  const resendCodeButton = document.getElementById("resendCodeButton")
  try {
    toggleLoadingSendButton(resendCodeButton)
    const response = await fetch("/code/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
    console.log(responseJson)
  
    toggleLoadingSendButton(resendCodeButton)
    if (response.status === 500) 
      return showToast(responseJson.message, "error")
  
    if (response.status === 400) 
      return showToast(responseJson.message, "warning")
  
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    emailReceiverElement.innerHTML = ""
    showToast(responseJson.message, "success")
    
    closeDialog()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const disableCode = (elementId) => {
  const dialogBody = `
    <div class="dialog-actions">
      <button onclick="closeDialog()" class="cancel-button">
        <span class="button-label">Cancelar</span>
      </button>
      <button onclick="disableCodeConfirmed('${elementId}')" id="disableCodeConfirmedButton" class="disable-button">
        <span class="button-label">Desativar código</span>
      </button>
    </div>
  `

  showDialog(`Desativar código: <span class="font-bold">${elementId.split("-")[0]}</span>`, dialogBody)
}

const disableCodeConfirmed = async (elementId) => {
  const button = document.getElementById("disableCodeConfirmedButton")
  toggleDisableButton(button)

  const codeId = elementId.split("-")[1]
  const body = { 
    id: codeId
  }

  try {
    const response = await fetch("/code/disable", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
  
    toggleDisableButton(button)
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    showToast(responseJson.message, "success")
    
    closeDialog()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const editRole = (elementId) => {
  const dialogBody = `
    <div class="dialog-actions">
      <button onclick="closeDialog()" class="cancel-button">
        <span class="button-label">Cancelar</span>
      </button>
      <button onclick="editRoleConfirmed('${elementId}')" id="editRoleConfirmedButton" class="confirm-button">
        <span class="button-label">Alterar cargo</span>
      </button>
    </div>
  `

  const roleSelected = document.getElementById(`roleSelect-${elementId}`).value
  showDialog(`Alterar cargo: <span class="font-bold">${roleHash[roleSelected]}</span>`, dialogBody)
}

const editRoleConfirmed = async (elementId) => {
  const button = document.getElementById("disableCodeConfirmedButton")
  const roleSelected = document.getElementById(`roleSelect-${elementId}`).value
  toggleDisableButton(button)

  const codeId = elementId.split("-")[1]

  const body ={ 
    "id": codeId, 
    "role": roleSelected, 
    "email": null, 
    "isRenewal": false
  }

  try {
    const response = await fetch("/code/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
  
    toggleDisableButton(button)
    if (response.status === 500) 
      return showToast(responseJson.message, "error")
  
    if (response.status === 400) 
      return showToast(responseJson.message, "warning")
  
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    showToast(responseJson.message, "success")
    
    closeDialog()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const sendCode = () => {
  const newRoleSelect = document.getElementById("newRoleSelect").value
  const newEmailReceiver = document.getElementById("newEmailReceiver").value.trim()

  if (!newRoleSelect)
    return showToast("Selecione um cargo", "warning")

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
  if (!newEmailReceiver || !emailRegex.test(newEmailReceiver))
    return showToast("Digite um email válido", "warning")

  const dialogBody = `
    <div class="confirm-details">
      <div class="details-info">
        <span class="detail-row"><p class="detail-label">Cargo:</p> ${roleHash[newRoleSelect]}</span>
        <span class="detail-row"><p class="detail-label">Email:</p> ${newEmailReceiver}</span>
      </div>
      <div class="details-actions">
        <button onclick="closeDialog()" class="cancel-button">
          <span class="button-label">Cancelar</span>
        </button>
        <button onclick="sendCodeConfirmed()" id="sendCodeConfirmedButton" class="confirm-button">
          <span class="button-label">Confirmar</span>
        </button>
      </div>
    </div>
  `

  showDialog("Confirme as informações:", dialogBody)
}

const sendCodeConfirmed = async () => {
  const button = document.getElementById("sendCodeConfirmed")
  const roleSelected = document.getElementById(`newRoleSelect`).value
  const newEmailReceiver = document.getElementById("newEmailReceiver").value.trim()

  toggleDisableButton(button)

  const body = { 
    "companyId": sessionStorage.getItem("COMPANY_ID"), 
    "role": roleSelected, 
    "email": newEmailReceiver
  }

  try {
    const response = await fetch("/code/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
  
    toggleDisableButton(button)
    if (response.status === 500) 
      return showToast(responseJson.message, "error")
  
    if (response.status === 400) 
      return showToast(responseJson.message, "warning")
  
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    showToast(responseJson.message, "success")
    
    closeDialog()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const toggleLoadingSendButton = (button) => {
  if(!button) return

  if (button.disabled) {
    button.disabled = false
    button.innerHTML = `<i class="ph ph-paper-plane-tilt send-icon"></i><span class="button-label">Enviar código</span>`
  } else {
    button.disabled = true
    button.innerHTML = `<i class="ph ph-spinner send-icon spinner"></i><span class="button-label">Enviando...</span>`
  }
}

const toggleDisableButton = (button) => {
  if(!button) return

  button.disabled = !button.disabled
}