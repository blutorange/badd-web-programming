// Script, was im Worker ausgeführt wird
function workerScript() {
  globalThis.addEventListener("message", (event) => {
    const data = event.data;
    switch (data.type) {
      case "ping":
        globalThis.postMessage({ type: "pong", message: data.message });
        break;
      case "findPrimes": {
        const primes = findPrimes(data.limit);
        primes.splice(50, primes.length - 100, "...");
        globalThis.postMessage({ type: "foundPrimes", primes });
        break;
      }
      default:
        console.warn(`Unknown message type from main thread: ${data.type}`);
        break;
    }
  });

  // Rechenintensive Operation
  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  function findPrimes(limit) {
    const primes = [];
    let progress = 0;
    for (let i = 2; i <= limit; i++) {
      const newProgress = Math.floor(100 * i / limit);
      if (newProgress !== progress) {
        progress = newProgress;
        globalThis.postMessage({
          type: "progress",
          operation: "findPrimes",
          progress,
        });
      }
      if (isPrime(i)) primes.push(i);
    }
    return primes;
  }
}

// Neuen Worker erstellen
const workerBlob = new Blob([`(${workerScript.toString()})()`], {
  type: "text/javascript",
});
const url = URL.createObjectURL(workerBlob);
const worker = new Worker(url, { name: "Demo Worker" });

// Auf Messages vom Worker reagieren
worker.addEventListener("message", (event) => {
  const data = event.data;
  switch (data.type) {
    case "pong":
      console.log(`Received pong from worker: ${data.message}`);
      document.getElementById("ping-output").value = data.message;
      document.getElementById("ping").disabled = false;
      break;
    case "foundPrimes": {
      document.getElementById("prime-output").value = data.primes.join(", ");
      document.getElementById("prime").disabled = false;
      break;
    }
    case "progress": {
      if (data.progress % 10 === 0) {
        console.log(`Progress on ${data.operation}: ${data.progress}%`);
      }
      break;
    }
    default:
      console.warn(`Unknown message type from worker: ${data.type}`);
      break;
  }
});

// Bei Knopfdruck Message an Worker senden
document.getElementById("ping").addEventListener("click", () => {
  const message = document.getElementById("ping-message").value;
  document.getElementById("ping").disabled = true;
  worker.postMessage({ type: "ping", message });
});

document.getElementById("prime").addEventListener("click", () => {
  const limit = Number.parseInt(document.getElementById("prime-count").value);
  document.getElementById("prime").disabled = true;
  worker.postMessage({ type: "findPrimes", limit });
});

// Worker beenden, wenn die Seite beendet ist
window.onbeforeunload = () => {
  worker.terminate();
  URL.revokeObjectURL(url);
};
