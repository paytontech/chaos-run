class AntiGravEvent extends Event {
  constructor() {
    super();
    this.name = "Anti-Gravity";
  }
  reset(gameWorld) {
    world.gravity.y = 10;
    camera.y = height / 2;
  }
  update(gameWorld) {
    for (let obj of gameWorld.gameObjects) {
      obj.update(gameWorld);
      obj.sprite.collider = "d";
    }
    let player = gameWorld.gameObjects[0];
    // console.log(player.pos.y);

    if (millis() - this.startTime < 5000) {
      world.gravity.y = -1;
    } else {
      world.gravity.y = 5;
    }
    if (player.pos.y < height / 2) {
      camera.y = player.pos.y;
    } else {
      camera.y = height / 2;
    }
  }
}
