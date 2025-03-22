const a = undefined;
const b = null;
const c = () => "success";

console.log(a?.() ?? "failure");
console.log(b?.() ?? "failure");
console.log(c?.() ?? "failure");
