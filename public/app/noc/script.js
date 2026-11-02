const redirectByRole = () => {
  const role = sessionStorage.getItem("CARGO")

  if (role == 1)
    return

  window.location.href = "./noc/"
}