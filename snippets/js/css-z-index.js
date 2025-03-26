document.getElementById("generate").addEventListener("click", () => {
  for (const block of document.querySelectorAll(".block")) {
    block.remove();
  }

  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < 100; i++) {
    const zIndex = Math.floor(Math.random() * 1000);
    const width = 1 + Math.round(Math.random() * 40);
    const height = 1 + Math.round(Math.random() * 40);
    const top = Math.round(Math.random() * (100 - width));
    const left = Math.round(Math.random() * (100 - height));
    const color = Math.round(Math.random() * 0xFFFFFF).toString(16);

    const div = document.createElement("div");
    div.classList.add("block");
    div.textContent = `z-index=${zIndex}`;
    div.style.width = `${width}vw`;
    div.style.height = `${height}vh`;
    div.style.left = `${left}vw`;
    div.style.top = `${top}vh`;
    div.style.zIndex = `${zIndex}`;
    div.style.backgroundColor = `#${color}`;
    fragment.append(div);
  }
  
  document.body.append(fragment);
});

document.getElementById("shuffle").addEventListener("click", () => {
  for (const block of document.querySelectorAll(".block")) {
    const zIndex = Math.floor(Math.random() * 1000);
    block.textContent = `z-index=${zIndex}`;
    block.style.zIndex = `${zIndex}`;
  }
});