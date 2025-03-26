async function main() {
  const response = await fetch("https://dummyjson.com/products?limit=2&skip=10&select=title,price");
  const text = await response.text();
  return `HTTP-Request-Antwort ist: ${text}`;
}

main();