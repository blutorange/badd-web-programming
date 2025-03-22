// Findet die ersten 20 durch 3 teilbaren Quadratzahlen
const first200SquareNumbersDivisibleBy3 = limit(
  filter(
    map(integers(), (x) => x * x),
    (x) => x % 3 === 0,
  ),
  20,
);
for (const x of first200SquareNumbersDivisibleBy3) {
  console.log(x);
}

// Nimmt eine Menge von Elementen und eine Mapping-Funktion.
// Liefert ein Iterator zurück über die Elemente mit der Mapping-Funktion angewandt
function* map(elements, fn) {
  for (const element of elements) {
    yield fn(element);
  }
}

// Nimmt eine Menge von Elementen und eine Test-Funktion.
// Liefert einen Iterator zurück über die Elemente, wo die Test-Funktion true ist
function* filter(elements, test) {
  for (const element of elements) {
    if (test(element)) {
      yield element;
    }
  }
}

// Nimmt eine Menge von Elementen und eine Höchstzahl.
// Liefert einen Iterator zurück über höchstens soviele Elemente.
function* limit(elements, limit) {
  let count = 0;
  for (const element of elements) {
    if (count >= limit) {
      break;
    }
    yield element;
    count += 1;
  }
}

// Liefert einen Iterator über alle positiven Ganzzahlen zurück
function* integers() {
  let i = 0;
  while (true) {
    yield i++;
  }
}
