
document.querySelector("#picker").addEventListener("emoji-click", event => {
  const input = document.querySelector("input");
  input.setRangeText(event.detail.unicode, input.selectionStart, input.selectionEnd, "end");
  input.focus();
});