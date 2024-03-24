class SnakeGame {
  initSnakeBody = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 1 },
  ];

  constructor(score) {
    this.boardWithAndHeight = 12;
    this.score = score;
    this.snakePace = 0.15;
    this.prevDirection = "down";
    this.direction = "down";
    this.snakeBody = [...this.initSnakeBody];
    this.food = { x: 5, y: 5 };
    this.eatSound = new Audio("./sounds/eat.wav");
    this.gameOverSound = new Audio("./sounds/game-over.wav");
    this.gameMusic = new Audio("./sounds/music.mp3");
  }

  initBoard() {
    const board = document.querySelector(".board");
    const playgroundArray = Array.from(
      { length: this.boardWithAndHeight },
      () => Array.from({ length: this.boardWithAndHeight }, () => 0),
    );

    playgroundArray.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellElement = document.createElement("div");

        cellElement.classList.add("cell");
        cellElement.setAttribute("rowIndex", rowIndex);
        cellElement.setAttribute("cellIndex", cellIndex);

        board.appendChild(cellElement);
      });
    });
  }

  setDirection(keyStroke) {
    if (
      keyStroke === "ArrowUp" &&
      this.direction !== "down" &&
      this.prevDirection !== "down"
    ) {
      this.direction = "up";
    }
    if (
      keyStroke === "ArrowDown" &&
      this.direction !== "up" &&
      this.prevDirection !== "up"
    ) {
      this.direction = "down";
    }
    if (
      keyStroke === "ArrowLeft" &&
      this.direction !== "right" &&
      this.prevDirection !== "right"
    ) {
      this.direction = "left";
    }
    if (
      keyStroke === "ArrowRight" &&
      this.direction !== "left" &&
      this.prevDirection !== "left"
    ) {
      this.direction = "right";
    }
  }

  drawSnakeOnBoard() {
    document.querySelectorAll(".snake").forEach((snakePart) => {
      snakePart.classList.remove("snake");
      snakePart.classList.remove("snake-head");
      snakePart.classList.remove("snake-tail");
      snakePart.attributeStyleMap.clear();
    });

    this.snakeBody.forEach((snakePart) => {
      const snakePartElement = document.querySelector(
        `.cell[rowIndex="${snakePart.y}"][cellIndex="${snakePart.x}"]`,
      );

      snakePartElement.classList.add("snake");

      if (snakePart === this.snakeBody[this.snakeBody.length - 1]) {
        snakePartElement.classList.add("snake-head");

        if (this.direction === "up") {
          snakePartElement.style.transform = "rotate(-180deg)";
        }

        if (this.direction === "right") {
          snakePartElement.style.transform = "rotate(-90deg)";
        }

        if (this.direction === "left") {
          snakePartElement.style.transform = "rotate(90deg)";
        }
      }

      if (snakePart === this.snakeBody[0]) {
        snakePartElement.classList.add("snake-tail");

        if (this.prevDirection === "up") {
          snakePartElement.style.transform = "rotate(0deg)";
        }

        if (this.prevDirection === "right") {
          snakePartElement.style.transform = "rotate(-90deg)";
        }

        if (this.prevDirection === "left") {
          snakePartElement.style.transform = "rotate(90deg)";
        }

        if (this.prevDirection === "down") {
          snakePartElement.style.transform = "rotate(-180deg)";
        }
      }
    });
  }

  updateSnakeCoordinates() {
    const gameLoop = window.setInterval(() => {
      if (this.direction === "right") {
        this.snakeBody.push({
          x: this.snakeBody[this.snakeBody.length - 1].x + 1,
          y: this.snakeBody[this.snakeBody.length - 1].y,
        });

        this.snakeBody.shift();
      }

      if (this.direction === "left") {
        this.snakeBody.push({
          x: this.snakeBody[this.snakeBody.length - 1].x - 1,
          y: this.snakeBody[this.snakeBody.length - 1].y,
        });

        this.snakeBody.shift();
      }

      if (this.direction === "up") {
        this.snakeBody.push({
          x: this.snakeBody[this.snakeBody.length - 1].x,
          y: this.snakeBody[this.snakeBody.length - 1].y - 1,
        });

        this.snakeBody.shift();
      }

      if (this.direction === "down") {
        this.snakeBody.push({
          x: this.snakeBody[this.snakeBody.length - 1].x,
          y: this.snakeBody[this.snakeBody.length - 1].y + 1,
        });

        this.snakeBody.shift();
      }

      this.prevDirection = this.direction;

      if (this.isGameOver()) {
        this.handleGameOver(gameLoop);
        return;
      }

      if (this.pickedUpFood()) {
        this.handleFoodEaten();
      }

      this.drawSnakeOnBoard();
    }, this.snakePace * 1000);
  }

  handleGameOver(interval) {
    this.gameMusic.pause();
    this.gameMusic.currentTime = 0;
    this.gameOverSound.play();
    clearInterval(interval);

    document.querySelector(".game-over").classList.add("show");

    document.querySelector(".game-over .end-score").innerText =
      `Score: ${this.score}`;
  }

  handleFoodEaten() {
    this.eatSound.play();
    this.score += 1;
    this.generateFood();

    // Add new snake part
    this.snakeBody.unshift({
      x: this.snakeBody[0].x,
      y: this.snakeBody[0].y,
    });

    this.updateScore();
  }

  initKeyboardListener() {
    document.addEventListener("keydown", (event) => {
      this.setDirection(event.key);
    });
  }

  isGameOver() {
    return (
      this.snakeBody[this.snakeBody.length - 1].x >= this.boardWithAndHeight ||
      this.snakeBody[this.snakeBody.length - 1].x < 0 ||
      this.snakeBody[this.snakeBody.length - 1].y < 0 ||
      this.snakeBody[this.snakeBody.length - 1].y >= this.boardWithAndHeight ||
      this.snakeBody
        .slice(0, -1)
        .some(
          (snakePart) =>
            snakePart.x === this.snakeBody[this.snakeBody.length - 1].x &&
            snakePart.y === this.snakeBody[this.snakeBody.length - 1].y,
        )
    );
  }

  pickedUpFood() {
    return (
      this.snakeBody[this.snakeBody.length - 1].x === this.food.x &&
      this.snakeBody[this.snakeBody.length - 1].y === this.food.y
    );
  }

  generateRandomFoodPosition() {
    const allCells = Array.from(document.querySelectorAll(".cell"));

    const snakeCells = new Set(
      this.snakeBody.map((part) => `${part.y}-${part.x}`),
    );

    const emptyCells = allCells.filter((cell) => {
      const x = parseInt(cell.getAttribute("cellIndex"), 10);
      const y = parseInt(cell.getAttribute("rowIndex"), 10);
      return !snakeCells.has(`${y}-${x}`);
    });

    if (emptyCells.length === 0) {
      throw new Error("No empty cells available for food");
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomXPosition = parseInt(randomCell.getAttribute("cellIndex"), 10);
    const randomYPosition = parseInt(randomCell.getAttribute("rowIndex"), 10);

    return { x: randomXPosition, y: randomYPosition };
  }

  generateFood() {
    document.querySelectorAll(".food").forEach((snakePart) => {
      snakePart.classList.remove("food");
    });

    this.food = this.generateRandomFoodPosition();

    const foodElement = document.querySelector(
      `.cell[rowIndex="${this.food.y}"][cellIndex="${this.food.x}"]`,
    );

    foodElement.classList.add("food");
  }

  updateScore() {
    const scoreElement = document.querySelector(".score");
    scoreElement.innerHTML = `Score: ${this.score}`;
  }

  initNewGame() {
    this.gameMusic.loop = true;
    this.gameMusic.play();
    this.score = initScore;
    this.direction = "down";
    this.prevDirection = "down";
    this.snakeBody = [...this.initSnakeBody];
    this.updateScore();

    // init drawing snake
    this.drawSnakeOnBoard();

    this.generateFood();

    this.updateSnakeCoordinates();
  }

  initListeners() {
    document.querySelector(".new-game").addEventListener("click", () => {
      document.querySelector(".game-over").classList.remove("show");
      this.initNewGame();
    });

    document.querySelector(".start").addEventListener("click", () => {
      document.querySelector(".game-start").classList.add("hidden");
      this.initNewGame();
    });
  }

  init() {
    // init board
    this.initBoard();

    this.initKeyboardListener();

    this.initListeners();
  }
}

const initScore = 0;
const game1 = new SnakeGame(0);

game1.init();
