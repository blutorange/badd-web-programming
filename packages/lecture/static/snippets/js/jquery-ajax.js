const newData = {
  "name": "Apple MacBook Pro 16",
  "data": { year: 2019, price: 1849.99, "CPU model": "Intel Core i9", "Hard disk size": "1 TB" },
};

$.ajax("https://api.restful-api.dev/objects", {
  method: "GET",
  data: newData,
  success: (data) => console.error("New data uploaded", data),
  error: (_, error) => console.error("Failed to upload new data", error),
});