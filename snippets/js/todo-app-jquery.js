const todoTemplate = $(".todo-list-item-template");
const todoList = $(".todo-list");
const newTodoInput = $(".new-todo");
const toggleAll = $(".toggle-all-container");
const todoCount = $(".todo-count");
const filterAll = $(".filter-all");
const filterActive = $(".filter-active");
const filterCompleted = $(".filter-completed");
const clearCompleted = $(".clear-completed");
const footer = $(".footer");

loadItems();

// Alle TODOs erledigt oder unerledigt markieren bei Toggle-All-Button
toggleAll.on("pointerup", () => {
  const someCompleted = todoList.find(".toggle").filter(":checked").length > 0;
  const newCompleted = someCompleted ? false : true;
  todoList.find(".todo-list-item").toggleClass("completed", newCompleted);
  todoList.find(".toggle").prop("checked", newCompleted);
  updateFooterAndFilter();
  storeItems();
});

// Neues TODO erzeugen bei Enter im Input
newTodoInput.on("keydown", (e) => {
  if (e.key === "Enter") {
    const todoText = $(".new-todo").val().trim();
    if (todoText.length === 0) {
      return;
    }

    // Create and add new TODO
    createNewTodo(todoText, false);

    // Clear new TODO input
    newTodoInput.val("");

    updateFooterAndFilter();
    storeItems();
  }
});

// Bei Klick auf Radiobutton am TODO-Item
// Wenn TODO als erledigt / offen markiert wird
todoList.on("change", ".toggle", (e) => {
  const completed = $(e.target).prop("checked");
  $(e.target).closest(".todo-list-item").toggleClass("completed", completed);
  updateFooterAndFilter();
  storeItems();
});

// Bei Klick auf Lösch-Button am TODO-Item
todoList.on("pointerup", ".destroy", (e) => {
  $(e.target).closest(".todo-list-item").remove();
  updateFooterAndFilter();
  storeItems();
});

// In Bearbeitungsmodus wechseln, wenn TODO doppelt geklickt wird
todoList.on("dblclick", ".todo-list-item-content", (e) => {
  // Alle anderen Bearbeitungen abbrechen
  todoList.find(".todo-list-item").removeClass("editing");

  // Neue Bearbeitung starten
  const item = $(e.target).closest(".todo-list-item").addClass("editing");
  const todoText = item.find(".todo-list-item-content").text();
  item.find(".edit").val(todoText).trigger("focus");
});

// TODO aktualisieren, wenn Bearbeitung fertig ist
todoList.on("keydown", (e) => {
  if ($(e.target).is(".edit") && e.key === "Enter") {
    const item = $(e.target).closest(".todo-list-item");
    const itemContent = item.find(".todo-list-item-content");
    const oldText = itemContent.text();
    const newText = $(e.target).val().trim();
    item.removeClass("editing");
    itemContent.text(newText.length > 0 ? newText : oldText);
    storeItems();
  }
});

// Alle erledigten Löschen bei Klick auf diesen Button
clearCompleted.on("pointerup", () => {
  todoList.find(".toggle").filter(":checked").closest(".todo-list-item").remove();
  storeItems();
  updateFooterAndFilter();
});

// Filter für alle, aktive, erledigte TODOs
filterAll.on("pointerup", () => {
  filterActive.removeClass("selected");
  filterCompleted.removeClass("selected");
  updateFooterAndFilter();
});
filterActive.on("pointerup", () => {
  filterActive.addClass("selected");
  filterCompleted.removeClass("selected");
  updateFooterAndFilter();
});
filterCompleted.on("pointerup", () => {
  filterActive.removeClass("selected");
  filterCompleted.addClass("selected");
  updateFooterAndFilter();
});

function createNewTodo(content, completed) {
  const newTodo = $(todoTemplate.prop("content")).find(".todo-list-item").clone(true, false);
  newTodo.find(".todo-list-item-content").text(content);
  newTodo.find(".toggle").prop("checked", completed);
  todoList.append(newTodo);
}

function updateFooterAndFilter() {
  // Anzahl offener TODOs
  const uncheckedCount = todoList.find(".toggle").not(":checked").length;
  todoCount.text(`${uncheckedCount} TODOs verbleibend!`);

  // Footer ausblenden, wenn keine TODOs
  const hasAnyItems = todoList.find(".toggle").length > 0;
  footer.toggleClass("hidden", !hasAnyItems);

  // Filter-Option anwenden
  const items = todoList.find(".todo-list-item").removeClass("hidden");
  if (filterActive.hasClass("selected")) {
    items.find(".toggle").filter(":checked").closest(".todo-list-item").addClass("hidden");
  } else if (filterCompleted.hasClass("selected")) {
    items.find(".toggle").not(":checked").closest(".todo-list-item").addClass("hidden");
  }
}

// Aktuelle TODOs im localStorage speichern
function storeItems() {
  const itemData = todoList.find(".todo-list-item").toArray()
    .map((item) => {
      const content = $(item).find(".todo-list-item-content").text();
      const completed = $(item).find(".toggle").is(":checked");
      return { completed, content };
    });
  localStorage.setItem("todo-app-items-jquery", JSON.stringify(itemData));
}

// TODOs aus localeStorage laden, entfernt bestehende TODOs
function loadItems() {
  todoList.empty();

  try {
    const itemDataString = localStorage.getItem("todo-app-items-jquery");
    const itemData = itemDataString ? JSON.parse(itemDataString) : [];
    for (const item of itemData) {
      createNewTodo(item.content, item.completed);
    }
  } catch (e) {
    console.error(
      "Could not load items from local storage -- corrupted data?",
      e,
    );
  }

  updateFooterAndFilter();
}