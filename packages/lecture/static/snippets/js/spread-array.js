const handA = ["Max C", "Ash Blossom", "Effect Veiler"];
const handB = ["Perlereino", "Reinoheart", "Scheiren"];

const anotherHand = [...handA, ...handB];
const yetAnotherHand = [...handA, "Stardust", ...handB];

console.log(anotherHand);
console.log(yetAnotherHand);
