"svelte";

// ================
// file: TodoApp.js
// ================
import TodoHeader from "@sandbox/TodoHeader.js";
import TodoMain from "@sandbox/TodoMain.js";
import TodoFooter from "@sandbox/TodoFooter.js";

let items = $state(loadTodoItems());
let filter = $state("all");

const activeCount = $derived(items.filter((item) => !item.completed).length);

$effect(() => storeTodoItems(items));

function handleClearCompleted() {
  items = items.filter(item => !item.completed);
}

function handleFilterChange(newFilter) {
  filter = newFilter;
}

function handleItemAdd(newTodoName) {
  const id = crypto.randomUUID();
  items.push({ id, name: newTodoName, completed: false });
}

function handleItemCompletionChange(itemId, newItemCompleted) {
  const item = items.find((item) => item.id === itemId);
  if (item) {
    item.completed = newItemCompleted;
  }
}

function handleItemRemove(itemId) {
  items = items.filter(item => item.id !== itemId);
}

function handleItemRename(itemId, newTodoName) {
  const item = items.find((item) => item.id === itemId);
  if (item) {
    item.name = newTodoName;
  }
}

function handleToggleAll(newAllCompleted) {
  for (const item of items) {
    item.completed = newAllCompleted;
  }
}

function storeTodoItems(todoItems) {
  localStorage.setItem("todo-app-items-svelte", JSON.stringify(todoItems));
}

function loadTodoItems() {
  try {
    const itemDataString = localStorage.getItem("todo-app-items-svelte");
    return itemDataString ? JSON.parse(itemDataString) : [];
  } catch (e) {
    console.error(
      "Could not load items from local storage -- corrupted data?",
      e,
    );
    return [];
  }
}

// ===================
// file: TodoHeader.js
// ===================
let { onNewTodo } = $props();
let newName = $state("");

function onKeydownNewInput(event) {
  if (event.key === "Enter" && newName.length > 0) {
    onNewTodo(newName);
    newName = "";
  }
}

// =================
// file: TodoMain.js
// =================
import TodoToggleAll from "@sandbox/TodoToggleAll.js";
import TodoList from "@sandbox/TodoList.js";

let { items, filter, onItemCompletionChange, onItemRename, onItemRemove, onToggleAll } = $props();

const allCompleted = $derived(items.every((item) => item.completed));

// ======================
// file: TodoToggleAll.js
// ======================

let { allCompleted, onToggleAll } = $props();

function onChangeToggleAll(event) {
  onToggleAll(event.target.checked);
}

// =================
// file: TodoList.js
// =================
import TodoItem from "@sandbox/TodoItem.js";

let { items, filter, onItemCompletionChange, onItemRename, onItemRemove } = $props();

const filteredItems = $derived(items.filter(item => {
  switch (filter) {
    case "all": return true;
    case "active": return !item.completed;
    case "completed": return item.completed;
  }
}));

// =================
// file: TodoItem.js
// =================
let { editing, item, onItemCompletionChange, onItemRename, onItemRemove } = $props();

let newName = $state();

function init(element) {
  element.focus();
}

function onChangeItemCompleted(event) {
  onItemCompletionChange(item.id, event.target.checked);
}

function onClickItemRemove() {
  onItemRemove(item.id);
}

function onDblclickTodo() {
  editing = true;
  newName = item.name;
}

function onKeydownNewName(event) {
  if (event.key === "Escape") {
    editing = false;
    return;
  }
  if (event.key === "Enter" && newName) {
    editing = false;
    onItemRename(item.id, newName);
  }
}

// ===================
// file: TodoFooter.js
// ===================

let { activeCount, filter, onClearCompleted, onFilterChange } = $props();

function onClickClearCompleted() {
  onClearCompleted();
}

function onPointerdownFilterAll() {
  onFilterChange("all");
}

function onPointerdownFilterActive() {
  onFilterChange("active");
}

function onPointerdownFilterCompleted() {
  onFilterChange("completed");
}

// ===================
// file: PageFooter.js
// ===================

// nothing yet

// ============
// file: App.js
// ============
import TodoApp from "@sandbox/TodoApp.js";
import PageFooter from "@sandbox/PageFooter.js";
