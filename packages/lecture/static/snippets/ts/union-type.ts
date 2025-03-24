interface Apple {
  kind: "apple";
  radius: number;
}

interface Banana {
  kind: "banana";
  length: number;
}

function printFruit(fruit: Apple | Banana): void {
  switch (fruit.kind) {
    case "apple":
      console.log(`Apple with radius ${fruit.radius}`);
      break;
    case "banana":
      console.log(`Banana with length ${fruit.length}`);
      break;
  }
}

printFruit({ kind: "apple", radius: 6 });
printFruit({ kind: "banana", length: 9 });
