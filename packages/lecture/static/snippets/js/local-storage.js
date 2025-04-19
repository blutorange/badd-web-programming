const textarea = document.querySelector(".note-book");

// Wert beim Laden aus localStorage wiederherstellen
textarea.value = localStorage.getItem("demo-note-book") ?? "";

// Wert bei Änderungen im localStorage speichern
textarea.addEventListener("input", () => {
  localStorage.setItem("demo-note-book", textarea.value)
});
