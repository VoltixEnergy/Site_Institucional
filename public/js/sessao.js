// sessão
function validarSessao() {
  var email = sessionStorage.EMAIL_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;

  var b_usuario = document.getElementById("b_usuario");

  if (email != null && nome != null) {
    b_usuario.innerHTML = nome;
  } else {
    window.location = "../login";
  }
}

function limparSessao() {
  sessionStorage.clear();
  window.location = "/login";
}

// carregamento (loading)
function aguardar() {
  var divAguardar = document.getElementById("div_aguardar");
  divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
  var divAguardar = document.getElementById("div_aguardar");
  divAguardar.style.display = "none";

  var divErrosLogin = document.getElementById("div_erros_login");

}

function carregarInformacoesUsuario () {
  const nome = sessionStorage.NOME_USUARIO;
  const email = sessionStorage.EMAIL_USUARIO;
  
  const nameElements = document.querySelectorAll(".nomeUsuario");
  nameElements.forEach(element => {
    element.innerHTML = nome
  });

  const emailElements = document.querySelectorAll(".emailUsuario");
  emailElements.forEach(element => {
    element.innerHTML = email
  });

  const avatarElements = document.querySelectorAll(".avatarUsuario");
  avatarElements.forEach(element => {
    const nameSplitted = nome.split(" ")
    element.innerHTML = nameSplitted.length == 1 ? 
                        nome[0].toUpperCase() + nome[1].toUpperCase() :
                        nameSplitted[0][0] + nameSplitted[nameSplitted.length -1][0]
  });

  const role = sessionStorage.getItem("CARGO")

  if (role == 1)
    return
  
  const items = {
    user: document.querySelector("#navUser"),
    server: document.querySelector("#navServer"),
    code: document.querySelector("#navCode")
  }

  items.user.classList.add("hidden")
  items.server.classList.add("hidden")
  items.code.classList.add("hidden")
}

function abrir_navbar() {
  document.getElementById("navbar_celular").classList.toggle("ativo");
}

function loadCompanyName(){
  const companyName = sessionStorage.getItem("COMPANY_NAME")
  const companyNameElement = document.getElementById("companyName")

  companyNameElement.innerText = `@ ${companyName}`
}