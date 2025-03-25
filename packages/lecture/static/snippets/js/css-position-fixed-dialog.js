document.getElementById("open").addEventListener("click", () => {
  document.getElementById("dialog").classList.remove("hidden");
});
document.getElementById("close").addEventListener("click", () => {
  document.getElementById("dialog").classList.add("hidden");
});