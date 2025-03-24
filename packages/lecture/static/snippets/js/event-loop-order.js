console.log("a")
setTimeout(() => console.log("b"), 0);
Promise.resolve().then(() => console.log("c"));
setTimeout(() => console.log("d"), 0);
console.log("e");
