async function main() {
  const response = await fetch("https://dummyjson.com/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "BMW Pencil",
    }),  
  });
  const text = await response.text();
  return `HTTP-Request-Antwort ist: ${text}`;
}

main();