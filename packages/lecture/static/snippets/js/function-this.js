class Squarer {
  squareNumbersArrow(numbers) {
    return numbers.map((x) => this.square(x));
  }
  squareNumbersFunction(numbers) {
    return numbers.map(function (x) {
      return this.square(x);
    });
  }
  square(x) {
    return x * x;
  }
}

const squarer = new Squarer();
console.log(squarer.squareNumbersArrow([1, 2, 3]));
console.log(squarer.squareNumbersFunction([1, 2, 3]));
