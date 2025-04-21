class HelloWorld extends HTMLElement {
  #internals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.attachShadow({ mode: "closed" });

    const before = document.createElement("slot");
    const within = document.createElement("slot");
    const after = document.createElement("slot");

    before.name = "before";
    within.name = "within";
    after.name = "after";

    const hello = document.createElement("span");
    const world = document.createElement("span");

    hello.textContent = "Hallo ";
    world.textContent = " Welt";

    this.#internals.shadowRoot.append(before, hello, within, world, after);
  }
}

customElements.define("hello-world", HelloWorld);
