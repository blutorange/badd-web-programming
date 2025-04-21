class HelloWorld extends HTMLElement{
  connectedCallback() {
    const span = document.createElement("span");
    span.textContent = "Hallo Welt!";
    this.appendChild(span);
  }
}

customElements.define("hello-world", HelloWorld);