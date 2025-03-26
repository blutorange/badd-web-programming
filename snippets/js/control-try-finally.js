// Wir wollen console.log-Aufrufe abfangen. Dazu überschreiben wir console.log
// und stellen sicher, am Ende dies wieder rückgängig zu machen.

const logs = [];
const originalLog = console.log;
console.log = (...args) => logs.push(...args); 

try {
  console.log("Hello");
  console.log("World");
  console.log("How");
  console.log("are");
  console.log("you");
} finally {
  console.log = originalLog;
}

console.log("Abgefangene Nachrichten", logs);