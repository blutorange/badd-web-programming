// For-Schleifen zum Summieren der Zahlen von 1 bis 100
let sum = 0;
for (let i = 0; i <= 100; i += 1) {
  sum += i;
}
console.log(`Sum of 1...100 is ${sum}`);

// Familienbaum von Axel, Person und ihre Eltern
const axel = {
  name: "Axel",
  parents: [
    {
      name: "Manfred",
      parents: [
        {
          name: "Jonathan",
          parents: [
            { name: "Jakob", parents: [] },
            { name: "Roselinde", parents: [] },
          ],
        },
        {
          name: "Magdalena",
          parents: [
            { name: "Heinrich", parents: [] },
            { name: "Hildegard", parents: [] },
          ],
        },
      ],
    },
    {
      name: "Anna",
      parents: [
        {
          name: "Heinrich",
          parents: [
            { name: "Christian", parents: [] },
            { name: "Caroline", parents: [] },
          ],
        },
        {
          name: "Theresa",
          parents: [
            { name: "Balthasar", parents: [] },
            { name: "Yvonne", parents: [] },
          ],
        },
      ],
    },
  ],
};

// Jetzt geben wir Axel und alle Eltern aus
// (Technisch: Iteratives Depth-First-Traversal einer Baumstruktur)
const stack = [axel];
while (stack.length > 0) {
  const person = stack.pop();
  console.log(`Visiting ${person.name}`);
  for (let i = person.parents.length - 1; i >= 0; i--) {
    stack.push(person.parents[i]);
  }
}
