let digits = [];
let operations = [];
let state = "after-operator";

$(".calc__buttons").addEventListener("click", e => {
  const button = getButtonType(e.target);
  if (button.type === "unknown") return;
  switch (button.type) {
    case "number":
      if (state === "after-operator" || state === "after-equal") {
        digits = [];
        state = "expect-number-or-op";
      }
      if (state === "expect-number-or-op") {
        digits.push(String(button.value));
        updateOutput(digits);
      }
      break;
    case "operator":
      if (state === "expect-number-or-op" || state === "after-equal") {
        pushNumber();
        digits = []
        operations.push(button.value);
        state = "after-operator";    
      }
      break;
    case "equal":
      if (state === "expect-number-or-op") {
        pushNumber();
        updateOutput([String(evalOperations())]);
        digits = [];
        operations = [];
        state = "after-equal";
      }
      break;
  }
});

function updateOutput(digits) {
  $(".calc__output").textContent = digits.join("");
}

function pushNumber() {
  if (digits.length > 0) {
    operations.push(Number.parseFloat(digits.join("")));  
  }
}

function evalOperations() {
  if (operations.length === 0) return 0;
  let result = operations[0];
  for (let i = 1; i < operations.length - 1; i += 2) {
    switch (operations[i]) {
      case "add": result += operations[i+1]; break;
      case "sub": result -= operations[i+1]; break;
    }
  }
  return result;
} 