const dog = {
  bark: () => console.log("woof"),
  sleep: () => console.log("zzzz"),
};

handleDogAction(dog.sleap);

function handleDogAction(action) {
  console.log("Performing dog action...");
  action();
  console.log("Dog action success");
}
