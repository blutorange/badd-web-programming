const todoTemplate = document.querySelector(".todo-list-item-template");
const todoList = document.querySelector(".todo-list");
const newTodoInput = document.querySelector(".new-todo");
const toggleAll = document.querySelector(".toggle-all");
const todoCount = document.querySelector(".todo-count");
const filterAll = document.querySelector(".filter-all");
const filterActive = document.querySelector(".filter-active");
const filterCompleted = document.querySelector(".filter-completed");
const clearCompleted = document.querySelector(".clear-completed");
const footer = document.querySelector(".footer");

loadItems();

// Neues TODO erzeugen bei Enter im Input
newTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const todoText = document.querySelector(".new-todo").value.trim();
    if (todoText.length === 0) {
      return;
    }

    // Create and add new TODO
    createNewTodo(todoText, false);

    // Clear new TODO input
    newTodoInput.value = "";

    updateFooterAndFilter();
    storeItems();
  }
});

// Bei Klick auf Radiobutton am TODO-Item
todoList.addEventListener("change", (e) => {
  const item = e.target.closest(".todo-list-item");

  // Wenn TODO als erledigt / offen markiert wird
  if (e.target.matches(".toggle")) {
    item.classList.toggle("completed", e.target.checked);
    updateFooterAndFilter();
    storeItems();
  }
});

// Bei Klick auf Lösch-Button am TODO-Item
todoList.addEventListener("pointerdown", (e) => {
  const item = e.target.closest(".todo-list-item");
  if (e.target.matches(".destroy")) {
    item.remove();
    updateFooterAndFilter();
    storeItems();
  }
});

// Alle TODOs erledigt oder unerledigt markieren bei Toggle-Button
toggleAll.addEventListener("pointerdown", () => {
  const someCompleted = [...todoList.querySelectorAll(".toggle")].some(
    (item) => item.checked,
  );
  const newCompleted = someCompleted ? false : true;
  for (const item of todoList.querySelectorAll(".toggle")) {
    item.checked = newCompleted;
  }
  for (const item of todoList.querySelectorAll(".todo-list-item")) {
    item.classList.toggle("completed", newCompleted);
  }
  updateFooterAndFilter();
  storeItems();
});

// In Bearbeitungsmodus wechseln, wenn TODO doppelt geklickt wird
todoList.addEventListener("dblclick", (e) => {
  const view = e.target.closest(".view");
  if (view) {
    // Alle anderen Bearbeitungen abbrechen
    for (const item of todoList.querySelectorAll(".todo-list-item")) {
      item.classList.remove("editing");
    }

    // Neue Bearbeitung starten
    const item = view.closest(".todo-list-item");
    const edit = item.querySelector(".edit");
    const todoText = item.querySelector(".todo-list-item-content").textContent;
    item.classList.add("editing");
    edit.value = todoText;
    edit.focus();
  }
});

// TODO aktualisieren, wenn Bearbeitung fertig ist
todoList.addEventListener("keydown", (e) => {
  if (e.target.matches(".edit")) {
    if (e.key === "Enter") {
      const item = e.target.closest(".todo-list-item");
      const itemContent = item.querySelector(".todo-list-item-content");
      const oldText = itemContent.textContent;
      const newText = e.target.value.trim();
      item.classList.remove("editing");
      itemContent.textContent = newText.length > 0 ? newText : oldText;
      storeItems();
    }
  }
});

// Alle erledigten Löschen bei Klick auf diesen Button
clearCompleted.addEventListener("pointerdown", () => {
  for (const item of todoList.querySelectorAll(".todo-list-item")) {
    const completed = item.querySelector(".toggle").checked;
    if (completed) {
      item.remove();
    }
  }
  storeItems();
  updateFooterAndFilter();
});

// Filter für alle, aktive, erledigte TODOs
filterAll.addEventListener("pointerdown", () => {
  filterActive.classList.remove("selected");
  filterCompleted.classList.remove("selected");
  updateFooterAndFilter();
});
filterActive.addEventListener("pointerdown", () => {
  filterActive.classList.add("selected");
  filterCompleted.classList.remove("selected");
  updateFooterAndFilter();
});
filterCompleted.addEventListener("pointerdown", () => {
  filterActive.classList.remove("selected");
  filterCompleted.classList.add("selected");
  updateFooterAndFilter();
});

function createNewTodo(content, completed) {
  const newTodo = todoTemplate.content
    .cloneNode(true)
    .querySelector(".todo-list-item");
  newTodo.querySelector(".todo-list-item-content").textContent = content;
  newTodo.querySelector(".toggle").checked = completed;
  todoList.append(newTodo);
}

function updateFooterAndFilter() {
  // Anzahl offener TODOs
  const uncheckedCount = [...todoList.querySelectorAll(".toggle")].filter(item => !item.checked).length;
  todoCount.textContent = `${uncheckedCount} TODOs verbleibend!`;

  // Footer ausblenden, wenn keine TODOs
  const hasAnyItems = todoList.querySelector(".toggle") !== null;
  footer.classList.toggle("hidden", !hasAnyItems);

  // Filter-Option anwenden
  if (filterActive.classList.contains("selected")) {
    for (const item of todoList.querySelectorAll(".todo-list-item")) {
      const completed = item.querySelector(".toggle").checked;
      item.classList.toggle("hidden", completed);
    }
  } else if (filterCompleted.classList.contains("selected")) {
    for (const item of todoList.querySelectorAll(".todo-list-item")) {
      const completed = item.querySelector(".toggle").checked;
      item.classList.toggle("hidden", !completed);
    }
  } else {
    for (const item of todoList.querySelectorAll(".todo-list-item")) {
      item.classList.remove("hidden");
    }
  }
}

// Aktuelle TODOs im localStorage speichern
function storeItems() {
  const itemData = [...todoList.querySelectorAll(".todo-list-item")].map(
    (item) => {
      const content = item.querySelector(".todo-list-item-content").textContent;
      const completed = item.querySelector(".toggle").checked;
      return { completed, content };
    },
  );
  localStorage.setItem("todo-app-items-native", JSON.stringify(itemData));
}

// TODOs aus localeStorage laden, entfernt bestehende TODOs
function loadItems() {
  todoList.innerHTML = "";
  
  try {
    const itemDataString = localStorage.getItem("todo-app-items-native");
    const itemData = itemDataString ? JSON.parse(itemDataString) : [];
    for (const item of itemData) {
      createNewTodo(item.content, item.completed);
    }
  } catch (e) {
    console.error("Could not load items from local storage -- corrupted data?", e);
  }

  updateFooterAndFilter();
}
