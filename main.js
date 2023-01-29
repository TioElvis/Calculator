const buttons = document.querySelectorAll("button");
const displayInput = document.getElementById("input");
const displayOutput = document.getElementById("output");

let input = "";

document.addEventListener("keydown", (event) => {
  let key = event.key;

  if (key === "=" || key === "Enter") resolve();
  if (key === "(" || key === ")") addBrackets();

  isNum(key) && addNum(key);
  isOp(key) && addOp(key);

  key === "Backspace" && backspace();
  key === "," && addComma();
});

buttons.forEach((item) => {
  const { value } = item;
  item.addEventListener("click", () => {
    isNum(value) && addNum(value);
    isOp(value) && addOp(value);
    value === "brackets" && addBrackets();
    value === "c" && clear();
    value === "equal" && resolve();
    value === "backspace" && backspace();
    value === "," && addComma();
    return;
  });
});

function addComma() {
  const addOtherCommas =
    input.indexOf(",") != -1 &&
    isThereOp() &&
    lastIndexOperator() > input.lastIndexOf(",");

  if (lastKey() != ",") {
    if (input.length === 0) input += "0";
    if (lastKeyIsOperator()) input += "0";
    if (input.indexOf(",") === -1) input += ",";
    if (addOtherCommas) input += ",";

    displayInput.innerText = input;
  }
  return;
}

function backspace() {
  if (input.length > 1) {
    input = input.substring(0, input.length - 1);
    displayInput.innerText = input;
  } else {
    input = "";
    displayInput.innerText = "0";
  }
  return;
}

function resolve() {
  if (input.length > 0) {
    const result = String(
      eval(input.replaceAll("÷", "/").replaceAll("x", "*").replaceAll(",", "."))
    );

    displayOutput.innerText = result.replaceAll(".", ",");
  }
  return;
}

function clear() {
  input = "";
  displayInput.innerText = "0";
  displayOutput.innerText = "";
  return;
}

function addOp(value) {
  if (input.length != 0) {
    if (isNum(lastKey()) || lastKey() === ")") input += value;

    displayInput.innerText = input;
  }
  return;
}

function addNum(value) {
  if (lastKey() != ")") input += value;
  if (lastKey() === ")") input += `x${value}`;

  displayInput.innerText = input;
  return;
}

function addBrackets() {
  const conditionStartBracket =
    input.indexOf("(") != -1 &&
    input.indexOf(")") != -1 &&
    input.lastIndexOf("(") < input.lastIndexOf(")");

  const startBracket = input.indexOf("(") == -1 || conditionStartBracket;

  if (startBracket && isNum(lastKey())) input += "x(";
  if (startBracket && (lastKeyIsOperator() || input.length == 0)) input += "(";

  const conditionEndBracket =
    input.indexOf("(") != -1 &&
    input.indexOf(")") != -1 &&
    input.lastIndexOf("(") > input.lastIndexOf(")");

  const endBracket =
    (input.indexOf(")") == -1 || conditionEndBracket) && isNum(lastKey());

  if (endBracket) input += ")";

  displayInput.innerText = input;
  return;
}

// Utils
const operators = ["+", "-", "x", "÷"];
const isNum = (value) => Boolean(Number(value)) || value === "0";
const isOp = (value) => operators.includes(value);
const isThereOp = () => operators.some((i) => input.includes(i));
const lastKey = () => input.slice(-1);
const lastKeyIsOperator = () => operators.some((x) => lastKey() === x);
const lastIndexOperator = () => {
  const array = [
    input.lastIndexOf("+"),
    input.lastIndexOf("-"),
    input.lastIndexOf("x"),
    input.lastIndexOf("÷"),
  ];

  return array
    .sort((a, b) => a - b)
    .reverse()
    .shift();
};
