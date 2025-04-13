"svelte";

// file: Counter.js
let count = $state(0);

function increment() {
  count = count + 1;
}

// file: App.js
import Counter from "@sandbox/Counter.js"; 