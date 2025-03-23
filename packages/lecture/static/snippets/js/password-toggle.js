for (const input of document.getElementsByClassName("toggle-pass")) {
  const toggler = document.createElement("button");
  toggler.classList.add("toggler");
  toggler.type = "button";
  toggler.textContent = "Password anzeigen";
  toggler.addEventListener("click", () => {
    if (input.type === "password") {
      toggler.textContent = "Passwort verbergen";
      input.type = "text";
    } else {
      input.type = "password";
      toggler.textContent = "Passwort anzeigen";
    }
  })
  input.after(toggler);
}