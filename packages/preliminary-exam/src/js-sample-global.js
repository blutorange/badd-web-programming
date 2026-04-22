// @ts-check

window.getButtonType = getButtonType;
window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

/**
 * @param {HTMLButtonElement} button
 * @return {CalculatorButton}
 */
function getButtonType(button) {
    if (!button) {
        return { type: "unknown" };
    }
    if (!(button instanceof HTMLButtonElement)) {
        return { type: "unknown" };
    }
    if (!(button.classList.contains("calc__button"))) {
        throw new Error("Expected a button with class 'calc__button'");
    }
    if (button.classList.contains("calc__button--ce")) {
        return { type: "clear" };
    }
    if (button.classList.contains("calc__button--eq")) {
        return { type: "equal" };
    }
    if (button.classList.contains("calc__button--dot")) {
        return { type: "dot" };
    }
    if (button.classList.contains("calc__button--add")) {
        return { type: "operator", value: "add" };
    }
    if (button.classList.contains("calc__button--sub")) {
        return { type: "operator", value: "sub" };
    }
    if (button.classList.contains("calc__button--mul")) {
        return { type: "operator", value: "mul" };
    }
    if (button.classList.contains("calc__button--div")) {
        return { type: "operator", value: "div" };
    }
    if (button.classList.contains("calc__button--sqrt")) {
        return { type: "operator", value: "sqrt" };
    }
    if (button.classList.contains("calc__button--0")) {
        return { type: "number", value: 0 };
    }
    if (button.classList.contains("calc__button--1")) {
        return { type: "number", value: 1 };
    }
    if (button.classList.contains("calc__button--2")) {
        return { type: "number", value: 2 };
    }
    if (button.classList.contains("calc__button--3")) {
        return { type: "number", value: 3 };
    }
    if (button.classList.contains("calc__button--4")) {
        return { type: "number", value: 4 };
    }
    if (button.classList.contains("calc__button--5")) {
        return { type: "number", value: 5 };
    }
    if (button.classList.contains("calc__button--6")) {
        return { type: "number", value: 6 };
    }
    if (button.classList.contains("calc__button--7")) {
        return { type: "number", value: 7 };
    }
    if (button.classList.contains("calc__button--8")) {
        return { type: "number", value: 8 };
    }
    if (button.classList.contains("calc__button--9")) {
        return { type: "number", value: 9 };
    }
    return { type: "unknown" };
}

/**
 * @typedef {{type: "number", value: number} |
 * {type: "operator", value: "add" | "sub" | "mul" | "div" | "sqrt" } |
 * {type: "dot"} |
 * {type: "equal"} |
 * {type: "clear"} |
 * {type: "unknown"}
 * } CalculatorButton
 */
undefined;