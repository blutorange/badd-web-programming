const countSelect = document.getElementById("count");
const childContainer = document.getElementById("child-container");
const template = document.getElementById("child-template");

template.remove();

// Wenn eine andere Kinderzahl selektiert wurde...
countSelect.addEventListener("change", () => {
  // Lese die aktuelle und die gewünschte Anzahl aus
  const targetCount = Number.parseInt(countSelect.value);
  const currentCount = childContainer.childElementCount;
  if (targetCount > currentCount) {
    // Neue Fieldsets hinzufügen
    for (let i = currentCount; i < targetCount; i++) {
      const copy = createChildDetailsCopy(i);
      childContainer.append(copy);
    }
  } else if (targetCount < currentCount) {
    // Bestehende Fieldsets entfernen
    for (let i = currentCount; i > targetCount; i--) {
      childContainer.removeChild(childContainer.lastChild);
    }
  }
});

function createChildDetailsCopy(index) {
  const copy = template.cloneNode(true);

  // Ensure unique IDs
  const newIdByOldId = new Map();
  for (const child of eachElementDfs(copy)) {
    if (child.id) {
      const newId = `${child.id}_${index}`;
      newIdByOldId.set(child.id, newId);
      child.id = newId;
    }
  }

  // Update for attribute of <label>
  for (const label of copy.querySelectorAll("label")) {
    const newId = newIdByOldId.get(label.htmlFor);
    if (newId) {
      label.htmlFor = newId;
    }
  }

  return copy;
}

// Depth-first traversal over each element
function* eachElementDfs(root) {
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    yield current;
    for (let i = current.children.length - 1; i >= 0; i--) {
      stack.push(current.children[i]);
    }
  }
}
