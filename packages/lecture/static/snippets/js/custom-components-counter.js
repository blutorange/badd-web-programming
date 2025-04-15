class CounterWidget extends HTMLElement {
  static observedAttributes = [
    "value",
    "min",
    "max",
    "textIncrement",
    "textDecrement",
  ];

  #internals;
  #shadowRoot;
  #callbacks;

  #value = 0;
  #min = Number.NEGATIVE_INFINITY;
  #max = Number.POSITIVE_INFINITY;
  #textIncrement;
  #textDecrement;

  constructor() {
    super();

    this.#internals = this.attachInternals();
    this.attachShadow({ mode: "closed" });

    this.#callbacks = {
      click: (e) => this.#onClick(e),
    };

    CounterWidget.#setupShadowRoot(this.#internals.shadowRoot);

    this.value = 0;
    this.textIncrement = "increment";
    this.textDecrement = "decrement";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "min":
        this.min = newValue;
        break;
      case "max":
        this.max = newValue;
        break;
      case "textIncrement":
        this.textIncrement = newValue;
        break;
      case "textDecrement":
        this.textDecrement = newValue;
        break;
      case "value":
        this.value = newValue;
        break;
    }
  }

  connectedCallback() {
    this.#internals.shadowRoot.addEventListener("click", this.#callbacks.click);
  }

  disconnectedCallback() {
    this.#internals.shadowRoot.removeEventListener(
      "click",
      this.#callbacks.click,
    );
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    const valueNumber = this.#parseNumber(newValue, 0);
    if (valueNumber >= this.#min && valueNumber <= this.#max) {
      this.#value = valueNumber;
      if (this.#internals.shadowRoot) {
        this.#internals.shadowRoot.querySelector("output").textContent =
          this.#value.toString();
      }
    }
  }

  get min() {
    return this.#min;
  }

  set min(newValue) {
    const valueNumber = this.#parseNumber(newValue, 0);
    this.#min = Math.min(valueNumber, this.#max);
    if (this.#value < this.#min) {
      this.value = this.#min;
    }
  }

  get max() {
    return this.#min;
  }

  set max(newValue) {
    const valueNumber = this.#parseNumber(newValue, 0);
    this.#max = Math.max(valueNumber, this.#min);
    if (this.#value > this.#max) {
      this.value = this.#max;
    }
  }

  get textDecrement() {
    return this.#textDecrement;
  }

  set textDecrement(newValue) {
    this.#textDecrement = newValue;
    if (this.#internals.shadowRoot) {
      this.#internals.shadowRoot.querySelector(".btn-decrement").textContent =
        this.#textDecrement.toString();
    }
  }

  get textIncrement() {
    return this.#textDecrement;
  }

  set textIncrement(newValue) {
    this.#textIncrement = newValue;
    if (this.#internals.shadowRoot) {
      this.#internals.shadowRoot.querySelector(".btn-increment").textContent =
        this.#textIncrement.toString();
    }
  }

  /**
   * @param {Event} event
   */
  #onClick(event) {
    if (event.target instanceof HTMLElement) {
      if (event.target.classList.contains("btn-increment")) {
        this.#handleIncrement();
      } else if (event.target.classList.contains("btn-decrement")) {
        this.#handleDecrement();
      }
    }
  }

  #handleIncrement() {
    this.value = this.value + 1;
  }

  #handleDecrement() {
    this.value = this.value - 1;
  }

  #parseNumber(value, defaultValue) {
    const asNumber =
      typeof value === "number" ? value : Number.parseFloat(String(value));
    return Number.isNaN(asNumber) ? defaultValue : asNumber;
  }

  static #setupShadowRoot(shadowRoot) {
    const style = document.createElement("style");

    const output = document.createElement("output");

    const buttonBar = document.createElement("div");
    const increment = document.createElement("button");
    const customButtons = document.createElement("slot");
    const decrement = document.createElement("button");

    style.textContent = `
    output {
      display: block;
    }
    .btn, ::slotted(button) {
      cursor: pointer;
    }
    .btn-bar {
      display: flex;
      flex-direction: row;
      column-gap: 0.5em;
    }
    `;

    output.part = "counter";

    buttonBar.classList.add("btn-bar");

    increment.type = "button";
    increment.classList.add("btn", "btn-increment");
    increment.part = "increment";

    customButtons.name = "buttons";
    customButtons.classList.add("btn-custom");

    decrement.type = "button";
    decrement.classList.add("btn", "btn-decrement");
    decrement.part = "decrement";

    buttonBar.append(decrement, customButtons, increment);
    shadowRoot.append(style, output, buttonBar);
  }
}

customElements.define("counter-widget", CounterWidget, {});

document.querySelector(".double").addEventListener("click", (e) => {
  const counter = e.target.parentElement;
  counter.value *= 2;
});

document.querySelector(".halve").addEventListener("click", (e) => {
  const counter = e.target.parentElement;
  counter.value /= 2;
});
