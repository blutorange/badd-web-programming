document.getElementById("width").addEventListener("input", (e) => {
  const percentage = e.target.value;
  document.querySelector(".container").style.width = `${percentage}%`;
});
