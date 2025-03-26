const url = new URL("https://example.com/foo/bar?value=3")

console.log(`protocol = ${url.protocol}`);
console.log(`hostname = ${url.hostname}`);
console.log(`pathname  = ${url.pathname}`);
console.log(`parameter value = ${url.searchParams.get("value")}`);

url.searchParams.set("limit", "10");
url.hash = "content";

console.log(`modified URL = ${url.toString()}`);