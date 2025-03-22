// Superklasse für alle Formen
// Hat einen Namen und eine Position, die geändert werden kann.
class Shape {
  // Statischer Felder, die für jede Instanz gleich sind
  static #DEFAULT_NAME = "";

  // Private Felder, auf die von außen nicht zugegriffen werden kann
  // Dient dem Prinzip der Kapselung von Daten.
  #name;
  #x = 0;
  #y = 0;

  // Konstruktor zum Erstellen eines neuen Objekts.
  constructor(name, width, height) {
    // Zugriff auf statisches Feld erfolgt mittels Klassenname
    this.#name = name ?? Shape.#DEFAULT_NAME;
  }

  // Getter für eine Eigenschaft.
  // Ohne Setter schreibgeschützt.
  get name() {
    return this.#name;
  }

  // Mit Setter veränderbar
  get x() {
    return this.#x;
  }

  set x(x) {
    this.#x = x;
  }

  get y() {
    return this.#y;
  }

  set y(y) {
    this.#y = y;
  }

  // Instanzmethode zum Verschieben einer Format
  translate(dx, dy) {
    this.#x += dx;
    this.#y += dy;
  }

  // Ausgabe der Details der Form als String
  toString() {
    return `Shape[${this.#name},x=${this.#x},x=${this.#y}]`;
  }
}

// Rechteck mit Position und Ausdehnung, sowie einem Namen.
// Rechteck erbt von der Shape-Superklasse
// Die Position kann geändert werden, Höhe und Breite nicht.
class Rectangle extends Shape {
  // Weitere private Felder der Subklasse
  #width = 0;
  #height = 0;

  // Konstruktor zum Erstellen eines neuen Objekts.
  constructor(name, width, height) {
    // Aufruf des Konstruktors der Superklasse
    super(name);

    // Belegung der Felder der Subklasse
    this.#width = width;
    this.#height = height;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  // Checks if this rectangle intersects another rectangle
  intersects(r2) {
    return !(
      this.x + this.width <= r2.x || // Komplett links von r2
      r2.x + r2.width <= this.x || // Komplett rechts von r2
      this.y + this.height <= r2.y || // Komplett überhalb von r2
      r2.y + r2.height <= this.y // Komplett unterhalb von r2
    );
  }

  // Überschreiben einer Methode der Superklasse
  toString() {
    // Aufruf der Methode einer Superklasse
    const superString = super.toString();
    return `Rectangle[${superString},width=${this.#width},height=${this.#height}]`;
  }

  // Statische Factory-Methode zum Erstellen eines neuen Objekts
  // Erstellt ein Rechteck mit Höhe und Breite 0
  static minimal() {
    return new Rectangle("minimal", 0, 0);
  }
}

// Hitboxes für Player und Enemy
const player = new Rectangle("Hakurei Reimu", 1, 1);
const enemy = new Rectangle("Bullet", 30, 20);

console.log(player);
console.log(enemy);
console.log(`Player intersects enemy: ${player.intersects(enemy)}`);

// Move player and enemy, e.g. in response to mouse movement / AI
player.translate(200, 100);
enemy.translate(150, 50);

// Log player and enemy
console.log(player);
console.log(enemy);
console.log(`Player intersects enemy: ${player.intersects(enemy)}`);
