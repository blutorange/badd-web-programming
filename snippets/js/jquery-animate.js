$("#animate").on("click", () => {
  $("#book").animate(
    {
      opacity: 0.25,
      left: "+=50",
      height: "toggle",
    },
    5000, // time in milliseconds
    () => console.log("animation complete"),
  );
});
