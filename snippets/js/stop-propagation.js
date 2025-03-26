// Listener für Mail-Details
for (const mail of document.querySelectorAll(".mail")) {
  mail.addEventListener("click", (event) => {
    const name = event.currentTarget.querySelector(".name").textContent;
    document.querySelector(".detail-name").textContent = name;
    document.querySelector(".detail-content").textContent = event.currentTarget.dataset.content;
    document.querySelector(".detail").classList.remove("hidden");
  });
}

// Listener für Zurück-Button
document.querySelector(".detail-back").addEventListener("click", () => {
  document.querySelector(".detail").classList.add("hidden");
});

// Listener für Lösch-Button
for (const deleteButton of document.querySelectorAll(".delete")) {
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const mail = event.target.closest(".mail");
    mail.remove();
  });
}
