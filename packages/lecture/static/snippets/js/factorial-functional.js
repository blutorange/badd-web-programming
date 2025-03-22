// Failure monad for handling operations that can fail
const liftValue = (value) => ({ success: true, value });
const liftError = (error) => ({ success: false, error });
const bind = (a, f) => (a.success ? f(a.value) : a);

// Matches a number dependent on its properties
function matchNumber(x, cases) {
  if (Number.isNaN(x)) return cases.NaN(x);
  if (x === Number.NEGATIVE_INFINITY) return cases.negativeInfinity(x);
  if (x < 0) return cases.negative(x);
  if (x === 0) return cases.zero(x);
  if (x > 0) return cases.positive(x);
  if (Number.POSITIVE_INFINITY) return cases.positiveInfinity(x);
}

// Composes two functions f and g
const compose = (f, g) => (x) => g(f(x));

// Computes the factorial of a number
const factorial = (x) =>
  matchNumber(x, {
    NaN: y => liftValue(Number.NaN),
    negativeInfinity: y =>
      liftError("Cannot compute factorial for negative numbers!"),
    negative: y =>
      liftError("Cannot compute factorial for negative numbers!"),
    zero: y => liftValue(1),
    positive: y =>
      liftValue(
        y > 170
          ? Number.POSITIVE_INFINITY
          : bind(factorial(y - 1), (z) => z * y),
      ),
    positiveInfinity: y => liftValue(Number.POSITIVE_INFINITY),
  });

// Squares a number
const square = (x) => x * x;

// Chains multiple IO actions into one
const sequence = (ioActions) => (io) => ioActions.reduce((x, f) => f(io, x), undefined);

// Main program that reads a number, computes the square of its factorial
// and then prints it
const main = sequence([
  (io, _) => io.readInt(),
  (io, x) => factorial(x),
  (io, y) => bind(y, compose(square, liftValue)),
  (io, z) => io.putValue(z.success ? z.value : z.error),
]);

// Simulates the runtime that execute the IO actions
function runtime(io) {
  const impl = {
    readInt: () => 5,
    putValue: (v) => console.log(v),
  };
  io(impl);
}

// Should print 5! * 5! = 14400
runtime(main);
