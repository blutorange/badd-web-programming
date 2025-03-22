const a = 10;
const b = 20;
if ( b > a ) {
  const c = a * b;
}
// c ist hier nicht mehr gültig.
// Das folgende resultiert in einem Fehler.
console.log(c);
