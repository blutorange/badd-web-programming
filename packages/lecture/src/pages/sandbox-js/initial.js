/**
 * Sums all the given numbers and returns the result.
 * @param {number[]} numbers Numbers to add.
 * @returns {number} The sum of all numbers.
 */
function sum(...numbers) {
  return numbers.reduce((sum, x) => sum + x, 0);
}

sum(1,2,3);
