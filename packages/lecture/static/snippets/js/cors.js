// Siehe auch die Fehler und die Netzwerk-Requests in den Dev-Tools

document.getElementById("cors-good").addEventListener("click", async () => {
  const response = await fetch("https://api.restful-api.dev/objects/7");
  const text = await response.text();
  document.getElementById("output").textContent = text;
});

document.getElementById("cors-bad").addEventListener("click", async () => {
  try {
    await fetch("https://example.com");
  } catch (e) {
    document.getElementById("output").textContent = e;
  }
});
