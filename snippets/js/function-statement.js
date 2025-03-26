function sum(x = 0, y = 0) {
  return x + y;
}

console.log(sum(2, 3));
console.log(sum(undefined, 3));
console.log(sum(2, undefined));
console.log(sum(undefined, undefined));