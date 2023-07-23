let bricks = [];
let lives = 5;
let paddle;
let ball;

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const PADDLE_WIDTH = 110;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 10;
const NUM_ROWS = 6;
const NUM_COLS = 12;

function setup() {
  createCanvas(853, 600);
  paddle = new Paddle();
  ball = new Ball();

  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      const x = j * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING;
      const y = i * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING;
      bricks.push(new Brick(x, y));
    }
  }
}

function draw() {
  background(50, 55, 100);
  
  paddle.move();

  paddle.show();

  ball.update();
  ball.checkCollision(paddle);
  
  ball.show();
  
  for (let brick of bricks) {
    brick.show();
    if (ball.checkCollision(brick)) {
      brick.active = false;
    }
  }
  

  bricks = bricks.filter(brick => brick.active);
  
  if (ball.y > height) {
    lives--;
    if (lives === 0) {
      gameOver();
    } else {
      ball.reset();
      paddle.reset();
    }
  }
  
  if (bricks.length === 0) {
    gameWin();
  }
  
  displayLives();
}

function displayLives() {
  fill("lightblue");
  textSize(60);
  textAlign(LEFT);
  text(`Lives: ${lives}`, 20, 580);
}

function gameOver() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Better luck next time..." , width / 2, height / 2);
  noLoop();
}

function gameWin() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text("You Win!", width / 2, height / 2);
  noLoop();
}

class Paddle {
  constructor() {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height - 10;
    this.speed = 5;
  }
  
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    
    this.x = constrain(this.x, 0, width - this.width);
  }
  
  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }
  
  reset() {
    this.x = width / 2 - this.width / 2;
  }
}

class Ball {
  constructor() {
    this.radius = BALL_RADIUS;
    this.reset();
  }
  
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = random(-2, 2);
    this.speedY = -2;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off walls
    if (this.x <= this.radius || this.x >= width - this.radius) {
      this.speedX *= -1;
    }
    if (this.y <= this.radius) {
      this.speedY *= -1;
    }
  }
  
  checkCollision(obj) {
    if (
      this.x - this.radius < obj.x + obj.width &&
      this.x + this.radius > obj.x &&
      this.y - this.radius < obj.y + obj.height &&
      this.y + this.radius > obj.y
    ) {
      this.speedY *= -1;
      return true;
    }
    return false;
  }
  
  show() {
    fill(255);
    circle(this.x, this.y, this.radius * 2);
  }
}

class Brick {
  constructor(x, y) {
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.x = x;
    this.y = y;
    this.active = true;
  }
  
  show() {
    if (this.active) {
      fill(255);
      rect(this.x, this.y, this.width, this.height);
    }
  }
}

new p5();
