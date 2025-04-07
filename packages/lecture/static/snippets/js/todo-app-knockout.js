class TodoAppModel {
  constructor() {
    this.newTodo = ko.observable("");
    this.todoItems = ko.observableArray();
    this.filter = ko.observable("all");
    this.activeCount = ko.pureComputed(
      () => this.todoItems().filter((x) => !x.completed()).length,
    );
    this.filteredTodoItems = ko.pureComputed(() =>
      this._computeFilteredTodoItems(),
    );

    // Store in localStorage whenever persistent state changes
    ko.pureComputed(() => this.toJS()).subscribe((data) => storeTodoItems(data));

    bindMethods(this);
  }

  addTodo(_, event) {
    if (event.key === "Enter") {
      const newContent = this.newTodo().trim();
      if (newContent) {
        const newItem = new TodoItem(this.newTodo());
        this.todoItems.push(newItem);
        this.newTodo("");
      }
    }
    return true;
  }

  editTodo(itemToEdit) {
    for (const item of this.todoItems()) {
      item.stopEdit(false);
    }
    itemToEdit.startEdit();
  }

  removeTodo(itemToRemove) {
    this.todoItems.remove(itemToRemove);
  }

  removeCompletedTodos() {
    this.todoItems.remove((item) => item.completed());
  }

  toggleAll() {
    const allCompleted = this.todoItems().every((x) => x.completed());
    for (const item of this.todoItems()) {
      item.completed(!allCompleted);
    }
  }

  filterAll() {
    this.filter("all");
  }

  filterActive() {
    this.filter("active");
  }

  filterCompleted() {
    this.filter("completed");
  }

  toJS() {
    return {
      items: this.todoItems().map((item) => item.toJS()),
    };
  }

  _computeFilteredTodoItems() {
    switch (this.filter()) {
      case "all":
        return [...this.todoItems()];
      case "active":
        return this.todoItems().filter((x) => !x.completed());
      case "completed":
        return this.todoItems().filter((x) => x.completed());
    }
  }

  static fromJS(data) {
    const model = new TodoAppModel();
    if (data && typeof data === "object") {
      for (const item of data.items) {
        const todoItem = TodoItem.fromJS(item);
        model.todoItems.push(todoItem);
      }
    }
    return model;
  }
}

class TodoItem {
  constructor(text) {
    this.completed = ko.observable(false);
    this.content = ko.observable(text);
    this.newContent = ko.observable("");
    this.editing = ko.observable(false);
    this.classNames = ko.pureComputed(() => this._computeClassNames());
    bindMethods(this);
  }

  startEdit() {
    this.editing(true);
    this.newContent(this.content());
  }

  stopEdit() {
    this.editing(false);
  }

  onKeyDown(_, event) {
    if (event.key === "Enter") {
      const newContent = this.newContent().trim();
      this.editing(false);
      this.content(newContent || this.content());
    }
    if (event.key === "Escape") {
      this.editing(false);
    }
    return true;
  }

  toJS() {
    return { completed: this.completed(), content: this.content() };
  }

  _computeClassNames() {
    const classes = [];
    this.completed() && classes.push("completed");
    this.editing() && classes.push("editing");
    return classes.join(" ");
  }

  static fromJS(data) {
    const todoItem = new TodoItem();
    todoItem.completed(data.completed);
    todoItem.content(data.content);
    return todoItem;
  }
}

ko.applyBindings(TodoAppModel.fromJS(loadTodoItems()));

// Speichern und Laden im localStorage
function storeTodoItems(todoData) {
  localStorage.setItem("todo-app-items-knockout", JSON.stringify(todoData));
}

function loadTodoItems() {
  try {
    const itemDataString = localStorage.getItem("todo-app-items-knockout");
    return itemDataString ? JSON.parse(itemDataString) : undefined;
  } catch (e) {
    console.error(
      "Could not load items from local storage -- corrupted data?",
      e,
    );
    return undefined;
  }
}

// Helper that binds all class methods of an instance to the instance, so that
// this always refers to the instance.
function bindMethods(instance) {
  const proto = Object.getPrototypeOf(instance);
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (typeof proto[key] === "function" && key !== "constructor") {
      instance[key] = instance[key].bind(instance);
    }
  }
}
