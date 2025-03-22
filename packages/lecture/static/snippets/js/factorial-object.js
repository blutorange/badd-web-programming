class ComponentRegistry {
  static #instance = new ComponentRegistry();
  #bound;
  #calculator;
  #logger;

  get calculator() {
    return this.#calculator;
  }

  get logger() {
    return this.#logger;
  }

  bind(services) {
    if (this.#bound) {
      throw new Error("Illegal attempt to rebind components!");
    }
    this.#bound = true;
    this.#calculator = services.calculator;
    this.#logger = services.logger;
  }

  static get instance() {
    return ComponentRegistry.#instance;
  }
}

class NativeLogger {
  #name;

  constructor(name) {
    this.#name = name;
  }

  get level() {
    return this.level;
  }

  info(message) {
    console.info(this.#name, message);
  }

  debug(message) {
    console.debug(this.#name, message);
  }

  warn(message) {
    console.warn(this.#name, message);
  }

  error(message) {
    console.error(this.#name, message);
  }
}

class NativeCalculator {
  factorial(x) {
    if (Number.isNaN(x)) return x;
    if (x === 0) return 1;
    if (x > 170) {
      ComponentRegistry.instance.logger.debug(`Number exceed limit for factorial ${x}`);
      return Number.POSITIVE_INFINITY;
    }
    if (x < 0) throw new Error("Cannot compute factorial for negative numbers!");
    let fac = x;
    while (--x > 0) {
      fac *= x;
    }
    return fac;
  }

  square(x) {
    return x * x;
  }
}

ComponentRegistry.instance.bind({
  calculator: new NativeCalculator(),
  logger: new NativeLogger("[factorial-object.js]"),
});

// Logs a debug message
ComponentRegistry.instance.calculator.factorial(300);

// Should print 5! * 5! = 14400
ComponentRegistry.instance.calculator.square(
  ComponentRegistry.instance.calculator.factorial(5)
)