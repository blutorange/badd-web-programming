"babel transform-react-jsx";

const { useEffect, useState } = React;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyApp />);

function MyApp() {
  return (
    <>
      <TodoApp />
      <PageFooter />
    </>
  );
}

function TodoApp() {
  const [items, setItems] = useState(() => loadTodoItems());
  const [filter, setFilter] = useState("all");

  useEffect(() => storeTodoItems(items), [items]);

  const addNewTodoItem = (newTodoName) => {
    const id = crypto.randomUUID();
    setItems([...items, { id, name: newTodoName, completed: false }]);
  };

  const changeFilter = (newFilter) => setFilter(newFilter);

  const removeCompleted = () => setItems(items.filter((x) => !x.completed));

  const changeCompletion = (itemId, completed) => {
    const newItems = spliceItems(items, itemId, (oldItem) => [
      { ...oldItem, completed },
    ]);
    setItems(newItems);
  };
  const removeItem = (itemId) => {
    setItems(spliceItems(items, itemId, () => []));
  };

  const renameItem = (itemId, name) => {
    const newItems = spliceItems(items, itemId, (oldItem) => [
      { ...oldItem, name },
    ]);
    setItems(newItems);
  };

  const toggleAll = (completed) => {
    setItems(items.map((item) => ({ ...item, completed })));
  };

  const activeCount = items.filter((item) => !item.completed).length;

  const filterFn = createTodoItemFilter(filter);

  return (
    <section className="todoapp">
      <TodoHeader onNewTodo={addNewTodoItem} />
      <TodoMain
        items={items}
        filter={filterFn}
        onItemCompletionChange={changeCompletion}
        onItemRename={renameItem}
        onItemRemove={removeItem}
        onToggleAll={toggleAll}
      />
      <TodoFooter
        filter={filter}
        activeCount={activeCount}
        onFilterChange={changeFilter}
        onRemoveCompleted={removeCompleted}
      />
    </section>
  );
}

function TodoHeader({ onNewTodo }) {
  const [name, setName] = useState("");

  const onChange = (e) => setName(e.target.value);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && name.length > 0) {
      onNewTodo(name);
      setName("");
    }
  };

  return (
    <header>
      <h1>TODOs</h1>
      <div className="input-container">
        <input
          className="new-todo"
          id="todo-input"
          type="text"
          value={name}
          onKeyDown={onKeyDown}
          onChange={onChange}
          autoComplete="off"
          placeholder="Was muss getan werden?"
        />
      </div>
    </header>
  );
}

function TodoMain({
  items,
  filter,
  onItemCompletionChange,
  onItemRename,
  onItemRemove,
  onToggleAll,
}) {
  const allCompleted = items.every((item) => item.completed);
  return (
    <main className="main">
      <TodoToggleAll allCompleted={allCompleted} onToggleAll={onToggleAll} />
      <TodoList
        items={items}
        filter={filter}
        onItemCompletionChange={onItemCompletionChange}
        onItemRename={onItemRename}
        onItemRemove={onItemRemove}
      />
    </main>
  );
}

function TodoToggleAll({ allCompleted, onToggleAll }) {
  return (
    <div className="toggle-all-container">
      <input
        className="toggle-all"
        type="checkbox"
        id="toggle-all"
        checked={allCompleted}
        onChange={(e) => onToggleAll(e.target.checked)}
      />
      <label className="toggle-all-label" htmlFor="toggle-all">
        Alle als erledigt / unerledigt markieren
      </label>
    </div>
  );
}

function TodoList({
  items,
  filter,
  onItemCompletionChange,
  onItemRename,
  onItemRemove,
}) {
  return (
    <ul className="todo-list">
      {items.filter(filter).map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onCompletionChange={(completed) =>
            onItemCompletionChange(item.id, completed)
          }
          onRename={(newName) => onItemRename(item.id, newName)}
          onRemove={() => onItemRemove(item.id)}
        />
      ))}
    </ul>
  );
}

function TodoItem({ item, onCompletionChange, onRename, onRemove }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(false);

  const startEdit = () => {
    setEditing(true);
    setNewName(item.name);
  };

  const onEditKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditing(false);
      setNewName("");
      onRename(newName);
    }
    if (e.key === "Escape") {
      setEditing(false);
    }
  };

  return (
    <li
      className={`todo-list-item ${item.completed ? "completed" : ""} ${editing ? "editing" : ""}`}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={item.completed}
          onChange={(e) => onCompletionChange(e.target.checked)}
        />
        <label className="todo-list-item-content" onDoubleClick={startEdit}>
          {item.name}
        </label>
        <button
          className="destroy"
          type="button"
          onPointerDown={() => onRemove()}
        />
      </div>
      <input
        className="edit"
        id="todo-edit-input"
        type="text"
        ref={(input) => input?.focus()}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={onEditKeyDown}
      />
    </li>
  );
}

function TodoFooter({
  filter,
  activeCount,
  onFilterChange,
  onRemoveCompleted,
}) {
  return (
    <footer className="footer">
      <span className="todo-count">{`${activeCount} TODO verbleibend!`}</span>
      <ul className="filters">
        <li className={`filter-all ${filter === "all" ? "selected" : ""}`}>
          <a onPointerDown={() => onFilterChange("all")}>Alle</a>
        </li>
        <li
          className={`filter-active ${filter === "active" ? "selected" : ""}`}
        >
          <a onPointerDown={() => onFilterChange("active")}>Aktive</a>
        </li>
        <li
          className={`filter-completed ${filter === "completed" ? "selected" : ""}`}
        >
          <a onPointerDown={() => onFilterChange("completed")}>Fertige</a>
        </li>
      </ul>
      <button
        className="clear-completed"
        type="button"
        onPointerDown={onRemoveCompleted}
      >
        Fertige TODOs löschen
      </button>
    </footer>
  );
}

function PageFooter() {
  const mdnStorageLink =
    "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API";
  return (
    <footer className="info">
      <p>Doppelklick, um ein TODO zu bearbeiten</p>
      <p>
        TODOs werden im <a href={mdnStorageLink}>localStorage</a>gespeichert
      </p>
      <p>
        Basierend auf <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  );
}

function createTodoItemFilter(filter) {
  switch (filter) {
    case "all":
      return () => true;
    case "active":
      return (item) => !item.completed;
    case "completed":
      return (item) => item.completed;
  }
}

function spliceItems(items, itemId, createNewItems) {
  const index = items.findIndex((item) => item.id === itemId);
  if (index >= 0) {
    return [
      ...items.slice(0, index),
      ...createNewItems(items[index]),
      ...items.slice(index + 1),
    ];
  }
  return items;
}

// Speichern und Laden im localStorage
function storeTodoItems(todoItems) {
  localStorage.setItem("todo-app-items-react", JSON.stringify(todoItems));
}

function loadTodoItems() {
  try {
    const itemDataString = localStorage.getItem("todo-app-items-react");
    return itemDataString ? JSON.parse(itemDataString) : [];
  } catch (e) {
    console.error(
      "Could not load items from local storage -- corrupted data?",
      e,
    );
    return [];
  }
}