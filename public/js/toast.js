let counter = 0
const showToast = (message, type) => {
  const types = {
    "success": {
      "icon": "ph ph-check-fat"
    },
    "error": {
      "icon": "ph-bold ph-x"
    },
    "warning": {
      "icon": "ph ph-warning"
    }
  }

  if (!["success", "error", "warning"].includes(type)) 
    return alert(message)

  const toastContainer = document.getElementById("toast-container")
  
  const toastId = `toast-${counter}`
  toastContainer.innerHTML += `
    <div id="${toastId}" class="toast toast-${type}">
      <i class="${types[type].icon} toast-icon"></i>
      <span>
        <p>${message}</p>
      </span>
    </div>
  `
  
  
  setTimeout(() => cleanToast(toastId), 5000)
  counter++
}

const cleanToast = (elementId) => {
  const toastElement = document.getElementById(elementId)
  toastElement.classList.add("hidden")
}