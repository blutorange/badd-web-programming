function writeFile(name, content) {
  throw new Error("No file system available!");
}

try {
  writeFile("out.txt", "Hello world");
} catch (e) {
  console.error("Unable to write file", e);
}
