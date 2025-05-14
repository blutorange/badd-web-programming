import { factorial } from "./factorial.js";

const factorialList = document.querySelector(".factorial-list");

for (let i = 0n; i <= 20n; i++) {
	const item = document.createElement("li");
	item.textContent = `${i}! = ${factorial(i)}`;
	factorialList.append(item);
}
