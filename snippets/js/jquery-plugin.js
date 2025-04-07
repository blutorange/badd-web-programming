$.fn.visible = function(...args) {
  // $("div").visible() soll true/false zurückgeben, ob 1. Element sichtbar ist
  if (args.length === 0) {
    return this.eq(0).is("visible");
  }

  // $("div").visible(true) soll alle Elemente sichtbar machen
    for (const element of this) {
      const $element = $(element);
      if (args[0]) {
        $element.show();
      } else {
        $element.hide();
      }
    }
  
    // Fall ein Plugin keinen anderen Rückgabewert hat, sollte es immer
    // "this" zurückgeben. Damit ist sichergestellt, dass weitere Methoden
    // aufgerufen werden können, z.B. $("div").visible(false).addClass("...")
    return this;
};

$(".btnFalse").on("click", () => $("div").visible(false));
$(".btnTrue").on("click", () => $("div").visible(true));