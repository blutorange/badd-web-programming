function *createSomePeople() {
  yield "James";
  yield "Jessy";
  yield "Meowth";
}

// Spread-Operator funktioniert allgemein für Iterable
const people = [...createSomePeople()];

console.log(people);
