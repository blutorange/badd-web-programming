const user = { name: "Paula", age: 26, hobby: "Schwimmen" };

const anotherUser = {...user};
const yetAnotherUser = {...user, age: 29};

console.log(anotherUser);
console.log(yetAnotherUser);