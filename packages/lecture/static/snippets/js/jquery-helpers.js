// true
console.log($.isArray([1, 2, 3]));

// false
console.log($.isArray({ foo: 3 }));

// [2, 4, 6]
console.log($.map([1, 2, 3], (item) => item * 2));

// [2] (alle geraden Zahlen)
console.log($.grep([1, 2, 3], (item) => item % 2 === 0));
