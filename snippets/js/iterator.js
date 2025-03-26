const elements = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F"];

// Iterator, mit dem manuell über die Elemente iteriert werden kann
const iterator = elements[Symbol.iterator]();

let next;
while (true) {
  // Hole das nächste Element
  next = iterator.next();
  // Höre auf, wenn es keins mehr gibt
  if (next.done) {
    break;
  }
  console.log(next.value);
}
