$("input").on("input", function() {
  const currentColor = $(this).val();
  $("output").text(`Gewählte Outfit-Farbe: ${currentColor}`);
});