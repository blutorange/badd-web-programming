const a = undefined;
const b = null;
const c = { age: 42 };

console.log(a?.age ?? 18);
console.log(b?.age ?? 18);
console.log(c?.age ?? 18);
