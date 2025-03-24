interface Named {
  name: string;
}

interface NumberAge {
  name: string;
  age?: number;
}

interface StringAge {
  name: string;
  age?: string;
}

function roundAge(user: NumberAge, precision: number): string {
  return user.age?.toPrecision(precision) ?? "";
}

const stringAge: StringAge = { name: "John", age: "20" };
const named: Named = stringAge;
const numberAge: NumberAge = named;

console.log(roundAge({ name: "Mary", age: 20.4297 }, 3));
console.log(roundAge(numberAge, 3));
