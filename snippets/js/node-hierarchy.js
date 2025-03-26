// Maximale Verschachtelungstiefe finden
const maxDepth = maxBy(eachElementDfs(document), (item) => item.depth);

// Jede Node ausgeben
const nodeDetails = [];
for (const { node, depth } of eachElementDfs(document)) {
  // Leere Text-Nodes auslassen 
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length === 0) {
    continue;
  }
  const indent = "  ".repeat(depth);
  const type = findNodeTypeName(node);
  const alignment = " ".repeat(22 + maxDepth - indent.length - type.length);
  const details = findNodeDetails(node);
  nodeDetails.push(
    `${indent} - ${type}${alignment} [${node.nodeName}${details}]`,
  );
}
document.getElementById("nodes").textContent = nodeDetails.join("\n");

// Depth-first traversal over each node
function* eachElementDfs(root) {
  const stack = [{ node: root, depth: 0 }];
  while (stack.length > 0) {
    const current = stack.pop();
    yield current;
    for (let i = current.node.childNodes.length - 1; i >= 0; i--) {
      stack.push({
        node: current.node.childNodes[i],
        depth: current.depth + 1,
      });
    }
    if (current.node instanceof Element) {
      const attributes = current.node.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        stack.push({ node: attributes.item(i), depth: current.depth + 1 });
      }
    }
  }
}

// Findet den Namen einer Node durch Suche in den Keys von "Node"
function findNodeTypeName(node) {
  return (
    Object.keys(Node)
      .filter((x) => x.endsWith("_NODE"))
      .filter((x) => Node[x] === node.nodeType)[0] ?? "UNKNOWN"
  );
}

// Findet zusätzliche Details für eine Node zum Ausgeben
function findNodeDetails(node) {
  switch (node.nodeType) {
    case Node.ATTRIBUTE_NODE:
      return `=${node.nodeValue}`;
    case Node.TEXT_NODE:
      return `,${node.textContent.replace(/[\s\r\n\t]+/g, "")}`;
    default:
      return "";
  }
}

// Findet das Maximum von Elementen anhand einer Funktion, die die Stelle
// des Elements extrahiert.
function maxBy(items, valueExtractor) {
  let max = undefined;
  for (const item of items) {
    const value = valueExtractor(item);
    max = max === undefined || value > max ? value : max;
  }
  return max;
}