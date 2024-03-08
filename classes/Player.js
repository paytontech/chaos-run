class Player extends DynamicCreature {
  constructor(initX, initY, speed) {
    super("player", createVector(initX, initY), createVector(speed, 0), true, true, true, 100, "idle");
    // this.type = "player";
    // this.pos = createVector(initX, initY);
    // this.vel = createVector(speed, 0);
    this.speed = speed;
    this.jumpStrength = 350;
    console.log(speed);
    this.jumping = false;
    this.jumpHeight = 100;
    this.jumpTime = 400;
    this.groundLevel = initY;
    this.jumpStartTime = 0;
    this.killed = false;
    //jumpphase
    //0 - ground -> sky
    //1 - sky -> ground
    this.jumpPhase = 0;
    this.setDirectionRight = false;
    this.setDirectionLeft = false;
    // this.sprite = new Sprite();
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
    this.fsm.update();
    if (this.killed) {
      this.sprite.vel.x = 0;
    }
    this.sprite.rotation = 0;
    gameWorld.deltaXOffset = 0;


    if (this.sprite.collides(gameWorldBG.floor)) {
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
    world.gravity.y = 0;
    for (let obj of gameWorld.gameObjects) {
      obj.sprite.collider = "d";
      obj.sprite.bearing = random(-90, 90);
      obj.sprite.rotation = random(0, 360);
      obj.sprite.applyForceScaled(0, random(100, 500));
      obj.sprite.applyTorque(random(-20, 20));
    }
  }
  reset() {
    this.jumping = false;
    this.jumpHeight = 100;
    this.jumpTime = 400;
    this.jumpStartTime = 0;
    this.killed = false;
    world.gravity.y = 10;
    //jumpphase
    //0 - ground -> sky
    //1 - sky -> ground
    this.jumpPhase = 0;
    this.setDirectionRight = false;
    this.setDirectionLeft = false;
    this.fsm = new FSM();
    this.runLeftState = new RunLeftState(this, true);
    this.runRightState = new RunRightState(this, true);
    this.fsm.setInitialState(this.idleState);
  }
}
