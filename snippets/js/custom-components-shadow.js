class HelloWorld extends HTMLElement {
  #internals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.attachShadow({ mode: "closed" });

    const span = document.createElement("span");
    span.textContent = "Hallo Welt!";

    this.#internals.shadowRoot.append(span);
  }
}

customElements.define("hello-world", HelloWorld);
