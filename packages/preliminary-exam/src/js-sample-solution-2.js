let digits = [];
let operations = [];
let state = "initial";

$(".calc__buttons").addEventListener("click", e => {
  let button = getButtonType(e.target);
  if (button.type === "unknown") return;
  if (button.type === "operator" && button.value === "sub" && digits.length === 0) {
    button = {type: "number", value: "-"};
  }
  switch (button.type) {
    case "number":
      updateStateBeforeNumberOrDot();
      if (state === "expect-number-or-op") {
        digits.push(String(button.value));
        updateOutput();
      }
      break;
    case "dot":
      updateStateBeforeNumberOrDot();
      if (state === "expect-number-or-op" && !digits.join("").includes(".")) {
        digits.push(".");        
        updateOutput();
      }
      break;
    case "operator":
      if (state === "expect-number-or-op" || state === "after-equal") {
        if (button.value === "sqrt") {
          pushNumber();
          digits = [String(Math.sqrt(evalOperations()))];
          operations = [];
          updateOutput();
        } else {
          pushNumber();
          operations.push(button.value);
          digits = []
          state = "after-operator";    
        }
      }
      break;
    case "equal":
      if (state === "expect-number-or-op") {
        pushNumber();
        digits = [String(evalOperations())];
        operations = [];
        state = "after-equal";
        updateOutput();
      }
      break;
    case "clear":
      updateOutput(["0"]);
      digits = [];
      operations = [];
      state = "initial";
      break;
  }
});

function updateOutput(d = digits) {
  $(".calc__output").textContent = d.join("");
}

function pushNumber() {
  if (digits.length > 0) {
    const num = digits.length === 1 && digits[0] === "." ? 0 : Number.parseFloat(digits.join(""));
    operations.push(num);  
  }
}

function updateStateBeforeNumberOrDot() {
  if (state === "after-equal") {
    operations = [];
  }
  if (state === "after-operator" || state === "initial" || state === "after-equal") {
    digits = [];
    state = "expect-number-or-op";
  }
}

function evalOperations() {
  if (operations.length === 0) return 0;
  let result = operations[0];
  for (let i = 1; i < operations.length - 1; i += 2) {
    switch (operations[i]) {
      case "add": result += operations[i+1]; break;
      case "sub": result -= operations[i+1]; break;
      case "mul": result *= operations[i+1]; break;
      case "div": result /= operations[i+1]; break;
    }
  }
  return result;
}