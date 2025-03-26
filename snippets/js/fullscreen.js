document.querySelector("img").addEventListener("click", (event) => {
  if (event.target instanceof Element) {
    event.target.requestFullscreen({ navigationUI: "show" });
  }
});
