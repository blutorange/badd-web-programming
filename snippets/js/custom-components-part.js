class HelloWorld extends HTMLElement {
  #internals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.attachShadow({ mode: "closed" });

    const hello = document.createElement("span");
    const world = document.createElement("span");
    const exclamation = document.createElement("span");

    hello.textContent = "Hallo ";
    world.textContent = "Welt";
    exclamation.textContent = "!";
    exclamation.part = "exclamation"

    this.#internals.shadowRoot.append(hello, world, exclamation);
  }
}

customElements.define("hello-world", HelloWorld);
