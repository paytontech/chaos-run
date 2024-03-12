class ShakeEverything extends Event {
  constructor() {
    super();
    this.name = "Earthquake";
    this.controlsFlipped = false;
  }
  update(gameWorld) {
    let gameObjects = gameWorld.gameObjects;
    for (let i = 0; i < gameWorld.gameObjects.length; i++) {
      gameObjects[i].update(gameWorld);
      gameObjects[i].sprite.x += random(-1, 1);
    }
    gameObjects[0].update(gameWorld);
    camera.x += random(-1, 1);
    var currentRuntime = millis() - this.startTime;
    if (numbersEqualWithinBounds(currentRuntime % this.flipTime, 0, 50) && currentRuntime >= 1000) {
      console.log("flippingControls");
      this.flipControls(gameWorld);
    }
  }
  activate(gameWorld) {
    this.flipControls(gameWorld);
    this.flipTime = random([1000, 2000, 3000]);
    console.log(this.flipTime);
  }
  reset(gameWorld) {
    if (this.controlsFlipped) {
      this.flipControls(gameWorld);
      this.controlsFlipped = false;
    }
  }
  flipControls(gameWorld) {
    this.controlsFlipped = !this.controlsFlipped;
    let player = gameWorld.gameObjects[0];
    let playerRunLeft = player.runLeftState;
    let playerRunRight = player.runRightState;
    player.runLeftState = playerRunRight;
    player.runRightState = playerRunLeft;
  }
}
