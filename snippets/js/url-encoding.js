document.getElementById("encode").addEventListener("click", () => {
  const input = document.getElementById("input").value;
  const output = encodeURIComponent(input);
  document.getElementById("output").textContent = output;
});

document.getElementById("decode").addEventListener("click", () => {
  const input = document.getElementById("input").value;
  const output = decodeURIComponent(input);
  document.getElementById("output").textContent = output;
});