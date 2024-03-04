class Player extends DynamicCreature {
  constructor(initX, initY, speed) {
    super("player", createVector(initX, initY), createVector(speed, 0), true, true, true, 100, "idle");
    // this.type = "player";
    // this.pos = createVector(initX, initY);
    // this.vel = createVector(speed, 0);
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
    if (kb.pressing("d")) {
      this.sprite.applyForceScaled(this.vel.x, 0);
      let keyIndex = this.keys.lastIndexOf("d");
      if (keyIndex == -1) {
        this.keys.push("d");
      }

    } else {
      let keyIndex = this.keys.lastIndexOf("d");
      if (keyIndex >= 0) {
        this.keys.splice(keyIndex, 1);
      }
    }
    if (kb.pressing("a")) {
      this.sprite.applyForceScaled(-this.vel.x, 0);
      let keyIndex = this.keys.lastIndexOf("a");
      if (keyIndex == -1) {
        this.keys.push("a");
      }
    } else {
      let keyIndex = this.keys.lastIndexOf("a");
      if (keyIndex >= 0) {
        this.keys.splice(keyIndex, 1);
      }
    }
    if (this.keys.length == 0) {
      if (this.sprite.vel.x != 0) {
        if (this.sprite.vel.x > 0) {
          this.sprite.vel.x -= 0.1;
        } else {
          this.sprite.vel.x += 0.1;
        }
      }
    }

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
  }
}
