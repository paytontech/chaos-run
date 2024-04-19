class Player extends DynamicCreature {
  constructor(initX, initY, speed) {
    super("player", createVector(initX, initY), createVector(speed, 0), true, true, true, 100, "idle");
    this.speed = speed;
    console.log(speed);
    this.killed = false;
    this.initY = initY;
    this.sprite.x = initX;
    this.sprite.y = initY;
    this.keys = [];
    this.runLeftState = new RunLeftState(this, true);
    this.runRightState = new RunRightState(this, true);
    this.fsm.setInitialState(this.idleState);
  }

  display() {
  }

  update(gameWorld) {
    if (!this.killed) {
      this.fsm.update();
    }
    if (this.killed) {
      this.sprite.vel.x = 0;
    }
    this.sprite.rotation = 0;
    gameWorld.deltaXOffset = 0;


    if (this.sprite.collides(gameWorldBG.floors)) {
      this.jumping = false;
    }

    if (this.pos.x <= 0) {
      this.pos.x = 0;
    }
    if (this.pos.x >= width) {
      this.pos.x = width;
    }
    this.pos.x = this.sprite.x;
    this.pos.y = this.sprite.y;
  }
  kill() {
    this.killed = true;
    playerAnimations.dying.reset();
    this.sprite.image = playerAnimations.dying;
    world.gravity.y = 0;
    for (let obj of gameWorld.gameObjects) {
      console.log(obj);
      obj.sprite.collider = "d";
      obj.sprite.bearing = random(-90, 90);
      obj.sprite.rotation = random(0, 360);
      obj.sprite.applyForceScaled(0, random(100, 500));
      obj.sprite.applyTorque(random(-20, 20));
    }
  }
  reset() {
    this.killed = false;
    world.gravity.y = 10;
    this.fsm = new FSM();
    this.runLeftState = new RunLeftState(this, true);
    this.runRightState = new RunRightState(this, true);
    this.fsm.setInitialState(this.idleState);
    this.sprite.y = this.initY;
  }
}
