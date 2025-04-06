class Answer {
  constructor(text) {
    this.answerText = text;
    this.points = ko.observable(1);
  }
}

class SurveyViewModel {
  constructor(question, pointsBudget, answers) {
    this.question = question;
    this.pointsBudget = pointsBudget;
    this.answers = answers.map((text) => new Answer(text));
    this.pointsUsed = ko.computed(() =>
      this.answers.reduce((sum, answer) => sum + answer.points(), 0),
    );
  }

  save() {
    console.warn("Saving not yet implemented");
  }
}

ko.applyBindings(
  new SurveyViewModel("Wonach suchen Sie Technik aus?", 10, [
    "Funktionalität, Kompatibilität, Preis - solch langweilige Sachen",
    "Wie oft es auf Hacker News erwähnt wird",
    "Anzahl der Farbgradienten und Schatteneffekt auf der Homepage",
    "Superglaubwürdige Erfahrungsberichte auf der Produkt-Homepage",
  ]),
);
