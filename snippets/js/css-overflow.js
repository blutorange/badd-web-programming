for (const radio of document.getElementsByName("overflow")) {
  radio.addEventListener("change", () => {
    document.querySelector(".container").style.overflow = radio.value;
  });
}