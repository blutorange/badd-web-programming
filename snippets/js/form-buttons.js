document.getElementsByName("colorizeBtn")[0].addEventListener("click", () => {
  const color = Math.ceil(Math.random() * 0x1000000);
  const hex = color.toString(16).padStart(6, "0");
  const hexInverse = (0xffffff - color).toString(16).padStart(6, "0");
  document.body.style.color = `#${hex}`;
  document.body.style.backgroundColor = `#${hexInverse}`;
});
