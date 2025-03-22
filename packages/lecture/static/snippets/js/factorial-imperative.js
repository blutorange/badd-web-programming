function factorial(x) {
  if (Number.isNaN(x)) return x;
  if (x === 0) return 1;
  if (x > 170) return Number.POSITIVE_INFINITY;
  if (x < 0) throw new Error("Cannot compute factorial for negative numbers!");
  let fac = x;
  while (--x > 0) {
    fac *= x;
  }
  return fac;
}

factorial(5) * factorial(5)