let scoreBlock;
let score = 0;
const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const nameSubmit = document.getElementById("nameSubmit");
const resultModal = document.getElementById("resultModal");
const resultName = document.getElementById("resultName");
const resultScore = document.getElementById("resultScore");
const playAgain = document.getElementById("playAgain");
let playerName = "";

const screenshotBtn = document.getElementById("screenshotBtn");
screenshotBtn.addEventListener("click", takeScreenshot);

function takeScreenshot() {
  html2canvas(resultModal).then((canvas) => {
    let link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

nameModal.style.display = "block";
nameInput.focus();

nameSubmit.addEventListener("click", () => {
  playerName = nameInput.value;
  nameModal.style.display = "none";
});

playAgain.addEventListener("click", () => {
  resultModal.style.display = "none";
  refreshGame();
});

const config = {
  step: 0,
  maxStep: 12,
  sizeCell: 16,
  sizeBerry: 16 / 4,
};

const snake = {
  x: 160,
  y: 160,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3,
};

let berry = {
  x: 0,
  y: 0,
};

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
const toggleCheckbox = document.querySelector(".toggle-checkbox");
const toggleText = document.querySelector(".toggle-text");
drawScore();

toggleCheckbox.addEventListener("change", function () {
  if (toggleCheckbox.checked) {
    // Хардкорный режим
    config.maxStep = 6; // значение по умолчанию
    toggleText.textContent = "Hardcore";
  } else {
    // Обычный режим
    config.maxStep = 12; // устанавливаем более высокое значение для более низкой начальной скорости
    toggleText.textContent = "Normal";
  }
  refreshGame();
});

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++config.step < config.maxStep) {
    return;
  }
  config.step = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBerry();
  drawSnake();
}
requestAnimationFrame(gameLoop);

let mouthCounter = 0;

function drawSnake() {
  snake.x += snake.dx;
  snake.y += snake.dy;

  collisionBorder();

  snake.tails.unshift({ x: snake.x, y: snake.y });

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach(function (el, index) {
    let radius = config.sizeCell / 2;
    if (index !== 0) {
      radius -= (index / snake.tails.length) * (config.sizeCell / 4);
    }

    if (index == 0) {
      context.fillStyle = "#eea825";
    } else {
      const gradient = context.createRadialGradient(
        el.x + config.sizeCell / 2,
        el.y + config.sizeCell / 2,
        1,
        el.x + config.sizeCell / 2,
        el.y + config.sizeCell / 2,
        config.sizeCell / 2
      );
      gradient.addColorStop(0, "#A00034");
      gradient.addColorStop(1, "#7B0023");
      context.fillStyle = gradient;
    }

    context.beginPath();
    context.arc(
      el.x + config.sizeCell / 2,
      el.y + config.sizeCell / 2,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    if (el.x === berry.x && el.y === berry.y) {
      snake.maxTails++;
      incScore();

      if (toggleCheckbox.checked) {
        config.maxStep = Math.max(Math.floor(config.maxStep * 0.9), 1);
      }

      randomPositionBerry();
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
        refreshGame();
      }
    }
  });
}

function collisionBorder() {
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}

function showResult() {
  if (score > 0) {
    resultName.textContent = playerName;
    resultScore.textContent = score;
    if (toggleCheckbox.checked) {
      resultScore.textContent += " (Hardcore)";
    } else {
      resultScore.textContent += " (Normal)";
    }
    resultModal.style.display = "block";
  }
}

function refreshGame() {
  if (playerName === "") {
    playerName = prompt("Как вас зовут?", "Игрок");
    if (playerName === null || playerName.trim() === "") {
      playerName = "Игрок";
    }
  }

  if (score > 0) {
    showResult();
  }

  score = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;
  config.step = 0;

  randomPositionBerry();
}

function drawBerry() {
  context.beginPath();
  context.fillStyle = "#eea825";
  context.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  context.fill();
}

function randomPositionBerry() {
  berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
  berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function incScore() {
  score++;
  drawScore();
}

function drawScore() {
  scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener("keydown", function (e) {
  if (
    (e.code == "KeyW" || e.code == "ArrowUp") &&
    snake.dy !== config.sizeCell
  ) {
    snake.dy = -config.sizeCell;
    snake.dx = 0;
  } else if (
    (e.code == "KeyA" || e.code == "ArrowLeft") &&
    snake.dx !== config.sizeCell
  ) {
    snake.dx = -config.sizeCell;
    snake.dy = 0;
  } else if (
    (e.code == "KeyS" || e.code == "ArrowDown") &&
    snake.dy !== -config.sizeCell
  ) {
    snake.dy = config.sizeCell;
    snake.dx = 0;
  } else if (
    (e.code == "KeyD" || e.code == "ArrowRight") &&
    snake.dx !== -config.sizeCell
  ) {
    snake.dx = config.sizeCell;
    snake.dy = 0;
  }
});
