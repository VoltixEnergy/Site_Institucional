const showDialog = (title, dialogBody) => {
  const dialogContainer = document.getElementById("dialogContainer")
  const dialogContent = document.getElementById("dialogContent")

  dialogContainer.classList.remove("hidden")
  dialogContainer.classList.add("flex")

  dialogContent.innerHTML = `
    <h1 class="dialog-title">${title}</h1>
    <button type="button" onclick="closeDialog()" class="dialog-close-button">
      <i class="ph ph-x dialog-close-icon"></i>
    </button>
  `

  dialogContent.innerHTML += dialogBody
}

const closeDialog = () => {
  document.getElementById("dialogContainer").classList.add("hidden")
  document.getElementById("dialogContainer").classList.remove("flex")
  document.getElementById("dialogContent").innerHTML = ""
}