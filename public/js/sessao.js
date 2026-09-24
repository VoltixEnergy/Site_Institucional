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
  window.location = "../login";
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
  if (texto) {
    divErrosLogin.style.display = "flex";
    divErrosLogin.innerHTML = texto;
  }
}

function carregarInformacoesUsuario () {
  let nome = sessionStorage.NOME_USUARIO;
  let email = sessionStorage.EMAIL_USUARIO;
  
  document.getElementById("nomeUsuario").innerHTML = nome;
  document.getElementById("emailUsuario").innerHTML = email;
  document.getElementById("avatarUsuario").innerHTML = nome[0].toUpperCase() + nome[1].toUpperCase();
  document.getElementById("avatarUsuario_celular").innerHTML = nome[0].toUpperCase() + nome[1].toUpperCase();

}

function abrir_navbar() {
  document.getElementById("navbar_celular").classList.toggle("ativo");
}