const children = document.querySelector("#children");
const plus = document.querySelector("#plus");

plus.addEventListener("click", addChild);

function addChild() {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const delBtn = document.createElement("button");
    
    input.id = `child-${crypto.randomUUID()}`;
    label.htmlFor = input.id;
    label.textContent = "Kind";
    delBtn.type = "button";
    delBtn.textContent = "- (Entfernen)";
    delBtn.addEventListener("click", () => div.remove());
    div.append(label, input, delBtn);

    children.append(div);
}