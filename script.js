const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const equalBtn = document.querySelector(".equal");
const resetBtn = document.querySelector(".reset-btn");
const plusMinusBtn = document.querySelector(".plus-minus-btn");
const backspaceBtn = document.querySelector(".backspace-btn");
const allBtn = document.querySelectorAll("button");

const previousValueEl = document.querySelector(".previous-value");
const currentValueEl = document.querySelector(".current-value");
const recordTitle = document.querySelector(".record-title");
const trashIcon = document.querySelector("i");
// 除了加減乘除運算時會將value型別轉為number，其餘操作都用字串型別處理。
let previousValue = "";
let currentValue = "0";
let currentOperator = null;
let result;
let lastClickedBtn = null;

function setCurrentValue(newValue) {
  // ====  依照前次按的按鈕判斷如何設定值 ====
  // 當要設定currentValue時已選好operator，且"前次"按下的btn也為operatorBtn時代表當前計算機顯示的currentValue已存於previousValue，可進行初始開始選第二個value。
  if (currentOperator && lastClickedBtn === "operator") {
    currentValue = "0";
  }

  //  當前次按下的btn為equal時代表已計算完畢，再次按下數字鍵則視為新的一回
  if (lastClickedBtn === "equal") {
    resetAll();
  }

  // 不更新currentValue狀況 1.currentValue為0，又按0  2.已有一個小數點，又按小數點
  if (currentValue === "0" && newValue === "0") return;
  if (currentValue.includes(".") && newValue === ".") return;

  // 當前值為0時按小數點則呈現"0."，按數字則輸入值直接替換0 剩下情況就是一般字串相加。
  if (currentValue === "0" && newValue === ".") {
    currentValue = `${currentValue}${newValue}`;
  } else if (currentValue === "0" && newValue !== "0") {
    currentValue = newValue;
  } else {
    currentValue = currentValue + newValue;
  }
  currentValueEl.textContent = formatDisplayText(currentValue);
}

function setOperator(newOperator) {
  // 當前次為按equal時，將前次計算結果帶入到previousValue並設定operator
  if (lastClickedBtn === "equal") {
    previousValue = result;
    currentOperator = newOperator;
    previousValueEl.textContent = `${formatDisplayText(
      previousValue
    )}${currentOperator}`;
  }
  // 當所有計算條件都有且前次不是按operator btn時則直接進行計算
  else if (
    previousValue &&
    currentValue &&
    currentOperator &&
    lastClickedBtn !== "operator"
  ) {
    calculate();
    if (resultIsInvalid(result)) return;
    createRecordEl();

    previousValue = result;
    currentValue = result;
    // 前次的計算條件operator有可能跟這次點選的operator不一樣 所以計算完前次的運算後更新operator
    currentOperator = newOperator;
    previousValueEl.textContent = `${formatDisplayText(
      previousValue
    )}${currentOperator}`;
    currentValueEl.textContent = formatDisplayText(result);
  }
  // 當已有計算結果且上次按的btn也是operator時，代表前次的計算結果已更新為previouseValue，此時按operator btn只更新operator等待下一個值
  else if (lastClickedBtn === "operator" && result) {
    currentOperator = newOperator;
    previousValueEl.textContent = `${formatDisplayText(
      previousValue
    )}${currentOperator}`;
  }
  // 剩下的狀況就是只選好第一個值，此時按下operator btn則將此值更新為previouseValue再更新運算子
  else {
    currentOperator = newOperator;
    previousValue = currentValue;
    previousValueEl.textContent = `${formatDisplayText(
      previousValue
    )}${currentOperator}`;
  }
}

function getResult() {
  if (!previousValue || !currentValue || !currentOperator) return;

  // 連按equal btn的話則前次計算結果設為previousValue並且不更新currentValue直接再運算
  if (lastClickedBtn === "equal") {
    previousValue = result;
  }

  calculate();
  if (resultIsInvalid(result)) return;
  createRecordEl();
  previousValueEl.textContent = `${formatDisplayText(
    previousValue
  )}${currentOperator}${formatDisplayText(currentValue)}=`;
  currentValueEl.textContent = formatDisplayText(result);
}

function calculate() {
  switch (currentOperator) {
    case "+":
      result = (
        parseFloat(previousValue) + parseFloat(currentValue)
      ).toString();
      break;
    case "-":
      result = (
        parseFloat(previousValue) - parseFloat(currentValue)
      ).toString();
      break;
    case "×":
      result = (
        parseFloat(previousValue) * parseFloat(currentValue)
      ).toString();
      break;
    case "÷":
      result = (
        parseFloat(previousValue) / parseFloat(currentValue)
      ).toString();
      break;
  }
}

function resultIsInvalid(result) {
  if (isNaN(result)) {
    resetAll();
    return true;
  }
}

function createRecordEl() {
  const recordItem = document.createElement("div");
  recordItem.classList.add("record-item");

  const expressionTextEl = document.createElement("p");
  expressionTextEl.classList.add("expression-text");
  expressionTextEl.textContent = `${formatDisplayText(
    previousValue
  )}${currentOperator}${formatDisplayText(currentValue)}=`;

  const resultValueEl = document.createElement("p");
  resultValueEl.classList.add("result-value");
  resultValueEl.textContent = formatDisplayText(result);

  recordItem.append(expressionTextEl, resultValueEl);
  recordTitle.insertAdjacentElement("afterend", recordItem);
}

function resetAll() {
  previousValue = "";
  currentValue = "0";
  currentOperator = null;

  currentValueEl.textContent = currentValue;
  previousValueEl.textContent = previousValue;
}

function backspace() {
  if (lastClickedBtn === "equal") {
    resetAll();
  } else {
    currentValue = currentValue.slice(0, -1);

    if (currentValue) {
      currentValueEl.textContent = formatDisplayText(currentValue);
    } else {
      currentValue = "0";
      currentValueEl.textContent = formatDisplayText(currentValue);
    }
  }
}

function togglePlusMinus() {
  if (lastClickedBtn === "equal") {
    if (result.startsWith("-")) {
      previousValue = result.slice(1);
      currentValueEl.textContent = formatDisplayText(previousValue);
    } else {
      previousValue = `-${result}`;
      currentValueEl.textContent = formatDisplayText(previousValue);
    }
  } else {
    currentValue.startsWith("-")
      ? (currentValue = currentValue.slice(1))
      : (currentValue = `-${currentValue}`);
    currentValueEl.textContent = formatDisplayText(currentValue);
  }
}

function formatDisplayText(text) {
  let integer = text.split(".")[0];
  const decimal = text.split(".")[1];
  integer = parseFloat(integer).toLocaleString("en", {
    maximumFractionDigits: 0,
  });
  return decimal ? `${integer}.${decimal}` : `${integer}`;
}

function btnIsActive(el) {
  el.classList.add("active");
}

function updateLastClickedBtn(type) {
  lastClickedBtn = type;
}

//  Event Listener
numberBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => setCurrentValue(e.target.textContent));
});

operatorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => setOperator(e.target.textContent));
});

equalBtn.addEventListener("click", getResult);

// 其他功能鍵
resetBtn.addEventListener("click", resetAll);
backspaceBtn.addEventListener("click", backspace);
plusMinusBtn.addEventListener("click", togglePlusMinus);

// 鍵盤
window.addEventListener("keydown", (e) => {
  allBtn.forEach((btn) => btn.classList.remove("active"));

  // 按下的為數字鍵或"."
  if (e.code.includes("Digit") || e.code === "Period") {
    numberBtns.forEach((btn) => {
      if (btn.textContent === e.key) {
        btnIsActive(btn);
        setCurrentValue(btn.textContent);
        updateLastClickedBtn("number");
      }
    });
  }

  switch (e.key) {
    case "+":
      setOperator("+");
      updateLastClickedBtn("operator");
      break;
    case "-":
      setOperator("-");
      updateLastClickedBtn("operator");
      break;
    case "*":
      setOperator("×");
      updateLastClickedBtn("operator");
      break;
    case "/":
      setOperator("÷");
      updateLastClickedBtn("operator");
      break;
    case "=":
    case "Enter":
      getResult();
      updateLastClickedBtn("equal");
      break;
    case "Backspace":
      backspace();
      btnIsActive(backspaceBtn);
      updateLastClickedBtn("backspace");
      break;
    case "Escape":
      resetAll();
      btnIsActive(resetBtn);
      updateLastClickedBtn("reset");
      break;

    default:
      break;
  }
});

allBtn.forEach((btn) => {
  btn.addEventListener("transitionend", () => btn.classList.remove("active"));

  btn.addEventListener("click", (e) =>
    updateLastClickedBtn(e.currentTarget.dataset.type)
  );
});

trashIcon.addEventListener("click", () => {
  const recordItems = document.querySelectorAll(".record-item");
  recordItems.forEach((item) => item.remove());
});
