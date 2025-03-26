async function insertProducts() {
  const productList = document.getElementById("products");
  const skip = productList.childElementCount;

  // URL erstellen
  const url = new URL("https://dummyjson.com/products");
  url.searchParams.append("limit", "10");
  url.searchParams.append("select", "title,price");
  url.searchParams.append("skip", skip);

  // Request ausführen
  const response = await fetch(url);

  // DOM-Element für jedes Produkt erzeugen
  const result = await response.json();
  for (const product of result.products) {
    const li = document.createElement("li");
    li.dataset.productId = product.id;
    li.textContent = `${product.title} at ${product.price}€`;
    productList.append(li);
  }
}

// Initial einige Produkte laden
insertProducts();

// Bei Klick mehr Produkte laden
document.getElementById("load-more").addEventListener("click", insertProducts);