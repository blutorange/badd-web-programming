document.getElementById("toggle").addEventListener("click", () => {
  const select = document.querySelector(".choices__input");
  if (select.hasAttribute("hidden")) {
    select.removeAttribute("hidden");
  } else {
    select.setAttribute("hidden", "");
  }
});
