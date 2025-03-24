console.log("Please wait 5s....");

// Promise zum Test, welches lange dauert
const promise = waitMs(120_000).then(() => "Waited 120s");

// Abbruch nach 5 Sekunden
timeout(promise, 5_000);

// Erstellt ein Promise, welches nach x Millisekunden erfüllt wird.
function waitMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Bricht das übergebene Promise ab, wenn es länger als x Millisekunden dauert. 
function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    waitMs(ms).then(() => reject(`Max time of ${ms}ms exceeded`));
  });
}
