document.querySelector("#textContent").addEventListener("click", () => {
  document.querySelector("#output").textContent = document.querySelector("#input").value;
});

document.querySelector("#innerHtml").addEventListener("click", () => {
  document.querySelector("#output").innerHTML = document.querySelector("#input").value;
});