const values = [
  undefined,
  false,
  3,
  1000n,
  "Welt",
  Symbol.iterator,
  function foo() {},
  { name: "Mary" },
];

for (const value of values) {
  console.log(`Typ ist ${typeof value}`);
}
