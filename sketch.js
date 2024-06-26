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
let saveButton;
let icicleSprite;
let score = 0;
let playerAnimations = {};
let joystick;
var usingController = false;
let umbrellaIdleImg;
let umbrellaRainCollisionImg;

function preload() {
  bgTestImg = loadImage("assets/images/gamebg1.png");
  protoImg = loadImage("assets/sprites/proto-idle.png");
  protoWalkImg = loadImage("assets/sprites/proto-moving.gif");
  floorImg = loadImage("assets/images/ground.png");
  bgTestImg2 = loadImage("assets/images/bgtest.jpg");
  icicleSprite = loadImage("assets/sprites/icicle.png");
  playerAnimations.idle = loadImage("assets/sprites/player/player-idle.gif");
  playerAnimations.walking = loadImage("assets/sprites/player/player-walking.gif");
  playerAnimations.jump = loadImage("assets/sprites/player/player-jump.gif");
  playerAnimations.fall = loadImage("assets/sprites/player/player-fall.gif");
  playerAnimations.dying = loadImage("assets/sprites/player/player-dying.gif");
  umbrellaIdleImg = loadImage("assets/sprites/umbrella/umbrella-idle.png");
}

function addBetaDisclaimer() {
  let div = document.createElement("div");
  div.id = "beta-disclaimer";
  let h1 = document.createElement("h1");
  h1.className = "inter";
  h1.innerHTML = "Chaos Run is in beta!";
  let p = document.createElement("p");
  p.className = "inter";
  p.innerHTML = "Things will break often!<br/>This code is <i>fresh</i> out of my IDE, and it is usually untested and unfinished.<br/>To track game progress, check out <a href=\"https://github.com/paytontech/chaos-run/blob/main/TODO.md\" target=\"_blank\" rel=\"noopener noreferrer\">the TODO</a>";
  div.append(h1);
  div.append(p);
  document.body.append(div);
}

function setup() {
  console.clear();
  new Canvas(windowWidth, 400);
  addBetaDisclaimer();
  world.gravity.y = 10;
  gameWorld = new World(new Player(width / 4, height / 1.5, 5), false, false, null);
  gameWorld.registerEvent(new Projectiles());
  gameWorld.registerEvent(new Rainfall());
  gameWorld.registerEvent(new LightningStorm());
  gameWorld.registerEvent(new CodeEvent());
  gameWorld.registerEvent(new PongEvent());
  gameWorld.registerEvent(new CoinRushEvent());
  gameWorld.onEventChange = () => {
    animStartTime = millis();
    doingTextAnim = gameWorld.eventRunning;
    setTimeout(() => {
      doingTextAnim = false;
    }, 3000);
  };
  gameWorldBG = new WorldBackground(gameWorld, [bgTestImg, bgTestImg2], width);
  restartButton = createButton("Retry");
  restartButton.position(width / 2 - 30, height / 2);
  restartButton.hide();
  restartButton.mousePressed(() => {
    // gameWorld.restart();
    // gameWorldBG.posX = 0;
    // restartButton.hide();
    // score = 0;
    // displayedFailScreen = false;
    // doingTextAnim = false;
    // this is a gross hack but it works
    window.location.reload();
  });
  joystick = createJoystick();
  joystick.calibrate(true);
  joystick.onAxesPressed(buttonPushed);
}



function draw() {

  gameWorldBG.paintBG();
  if (!gameWorld.gameObjects[0].killed) {
    gameWorld.update();
  }
  eventStatusText();
  if (gameWorld.gameObjects[0].killed && !displayedFailScreen) {
    restartButton.show();
    displayedFailScreen = true;

  }
  if (displayedFailScreen) {
    if (controllerHelper.startButton()) {
      console.log("start btn");
      gameWorld.restart();
      gameWorldBG.posX = 0;
      restartButton.hide();
      score = 0;
      displayedFailScreen = false;
      doingTextAnim = false;
    }
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
      return;
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

function buttonPushed(e) {
  console.log(e);
}