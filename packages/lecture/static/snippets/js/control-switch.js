const message = "Hello world!";
const logLevel = "warn";
switch (logLevel) {
  case "error":
    console.error(message);
    break;
  case "warn":
    console.warn(message);
    break;
  case "info":
    console.info(message);
    break;
  default:
    throw new Error("Unknown log level!");
}
