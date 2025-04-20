const btnEnable = document.querySelector(".enable-notification");
const btnShow = document.querySelector(".show-notification");
const note = document.querySelector(".denied-notification");

function updateUi() {
  const p = Notification.permission;
  btnShow.classList.toggle("hidden", p === "denied" || p === "default");
  btnEnable.classList.toggle("hidden", p === "denied" || p === "granted");
  note.classList.toggle("hidden", p === "default" || p === "granted");
}

btnShow.addEventListener("click", () => {
  if (Notification.permission === "granted") {
    new Notification("Nun bist du informiert");
  }
});

btnEnable.addEventListener("click", async () => {
  await Notification.requestPermission();
  updateUi();
});

updateUi();