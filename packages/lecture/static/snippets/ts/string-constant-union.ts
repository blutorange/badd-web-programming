type Severity = "info" | "warn" | "error";

function showMessage(message: string, severity: Severity): void {
  switch (severity) {
    case "error":
      console.error(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "info":
      console.info(message);
      break;
  }
}

showMessage("Hallo Info", "info");
showMessage("Hallo Warnung", "warn");
showMessage("Hallo Fehler", "error");