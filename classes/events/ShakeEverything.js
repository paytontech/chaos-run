class ShakeEverything extends Event {
  constructor() {
    super();
    this.name = "Earthquake";
  }
  update(gameWorld) {
    let gameObjects = gameWorld.gameObjects;
    for (let i = 0; i < gameWorld.gameObjects.length; i++) {
      gameObjects[i].update(gameWorld);
      gameObjects[i].sprite.x += random(-1, 1);
    }
    gameObjects[0].update(gameWorld);
    var currentRuntime = millis() - this.startTime;
  }
}
