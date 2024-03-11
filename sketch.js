let gameWorld;
let doingTextAnim = false;
let animStartTime;
let bgTestImg;
let protoImg;
let protoWalkImg;
let floorImg;
let gameWorldBG;
let bgTestImg2;
let displayedFailScreen = false;
let restartButton;
let icicleSprite;
let score = 0;

function preload() {
  bgTestImg = loadImage("assets/images/gamebg1.png");
  protoImg = loadImage("assets/sprites/proto-idle.png");
  protoWalkImg = loadImage("assets/sprites/proto-moving.gif");
  floorImg = loadImage("assets/images/ground.png");
  bgTestImg2 = loadImage("assets/images/bgtest.jpg");
  icicleSprite = loadImage("assets/sprites/icicle.png");
}

function setup() {
  new Canvas(windowWidth, 400);
  world.gravity.y = 10;
  gameWorld = new World(new Player(width / 4, height / 1.5, 5), false);
  // gameWorld.registerEvent(new AntiGravEvent());
  // gameWorld.registerEvent(new ShakeEverything());
  // gameWorld.registerEvent(new Projectiles());
  gameWorld.registerEvent(new Rainfall());
  gameWorld.onEventChange = () => {
    animStartTime = millis();
    doingTextAnim = gameWorld.eventRunning;
    setTimeout(() => {
      doingTextAnim = false;
    }, 3000);
  };
  gameWorldBG = new WorldBackground(gameWorld, [bgTestImg, bgTestImg2], width);
  restartButton = createButton("Retry?");
  restartButton.position(width / 2 - 30, height / 2);
  restartButton.hide();
  restartButton.mousePressed(() => {
    gameWorld.restart();
    gameWorldBG.posX = 0;
    restartButton.hide();
    score = 0;
    displayedFailScreen = false;
    doingTextAnim = false;
  });
}



function draw() {
  gameWorldBG.paintBG();
  if (!gameWorld.gameObjects[0].killed) {
    gameWorld.update();
  }
  gameWorld.display();
  eventStatusText();
  if (gameWorld.gameObjects[0].killed && !displayedFailScreen) {
    restartButton.show();
    displayedFailScreen = true;

  }
  getScore();
  text(`${~~score}pts`, width - width / 4, 50);
}

function eventStatusText() {
  if (doingTextAnim) {
    var initialPos = createVector(gameWorld.currentEvent.name.length, height - 12);
    var textTargetPos = createVector(width / 3, height / 2);
    var textPos = initialPos;
    if (millis() - animStartTime < 1000) {
      let amt;
      amt = map(millis() - animStartTime, 0, 1000, 0, 1);
      textPos = p5.Vector.lerp(initialPos, textTargetPos, amt);
    } else if (
      millis() - animStartTime <= 2000 &&
      millis() - animStartTime > 1000
    ) {
      textPos = textTargetPos;
    } else {
      let amt = map(millis() - animStartTime, 2000, 3000, 1, 0);
      textPos = p5.Vector.lerp(initialPos, textTargetPos, amt);
    }
    gradientText(
      gameWorld.currentEvent.name,
      textPos.x,
      textPos.y,
      color(209, 199, 142),
      color(154, 54, 217),
      true
    );
  } else {
    if (gameWorld.eventRunning && gameWorld.currentEvent != null) {
      gradientText(
        gameWorld.currentEvent.name,
        gameWorld.currentEvent.name.length,
        height - 12,
        color(209, 199, 142),
        color(154, 54, 217),
        true
      );
    } else {
      gradientText(
        "No event",
        4,
        height - 12,
        color("black"),
        color("black"),
        false
      );
    }
  }
}

function getScore() {
  if (!gameWorld.gameObjects[0].killed) {
    let playerVel = gameWorld.gameObjects[0].sprite.velocity.x;
    if (playerVel < 0) {
      playerVel = -playerVel;
    }
    score += 0.1 * playerVel;
  }
}

function gradientText(text, posX, posY, color1, color2, bold) {
  let gradient = drawingContext.createLinearGradient(
    posX,
    posY - 20,
    posX,
    posY
  );
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1.0, color2);
  drawingContext.fillStyle = gradient;
  drawingContext.fontAlign = "center";

  drawingContext.font = `${bold ? "bold" : ""} 50px kanit`;
  drawingContext.fillText(text, posX, posY);
  if (bold) {
    drawingContext.strokeText(text, posX, posY);
  }
}

function numbersEqualWithinBounds(num1, num2, bounds) {
  if (num1 - num2 <= bounds && num1 - num2 >= -bounds) {
    return true;
  }
  return false;
}
