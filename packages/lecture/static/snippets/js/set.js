const set = new Set();

function serveRarePromoItemToCustomer(customer) {
  if (set.has(customer)) {
    throw new Error(`Sorry ${customer}, only 1 item allowed per customer!`);
  }
  set.add(customer);
  // ...
}

serveRarePromoItemToCustomer("Tom");
serveRarePromoItemToCustomer("Tabby");
serveRarePromoItemToCustomer("Tom");
