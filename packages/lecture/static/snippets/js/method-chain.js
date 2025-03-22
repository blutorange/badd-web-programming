const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Summe der dritten Potenzen ersten n Zahlen, deren 3. Potenzen < 500 sind
const sum = numbers
  .map((x) => x * x * x)
  .filter((x) => x < 500)
  .reduce((sum, x) => sum + x, 0);

console.log(sum);