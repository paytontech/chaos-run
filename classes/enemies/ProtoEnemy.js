class ProtoEnemy extends DynamicCreature {
  constructor(initX, initY, speed, range) {
    super("proto", createVector(initX, initY), createVector(speed, 0), true, true, false, 1, "idle");
    this.type = "proto";
    this.range = range;
    this.killed = false;
    this.readyToReset = false;
    this.onKilledEvent = new SpawnMoreProto();
    this.speed = speed;
    this.sprite.img = "assets/sprites/proto-moving.gif";
    this.sprite.x = initX;
    this.sprite.y = initY;
    this.leftPhase = new ProtoPhaseLeft(this, true);
    this.rightPhase = new ProtoPhaseRight(this, true);
    this.fsm.setInitialState(this.idleState);
  }

  display() {
  }

  update(gameWorld) {
    this.sprite.rotation = 0;
    if (!this.killed) {
      this.fsm.update();
      this.checkCollision(gameWorld);
    } else {
      this.sprite.image = protoImg;
    }
    if (this.killed) {
      gameWorld.gameObjects[0].sprite.overlaps(this.sprite);
      if (millis() - this.killTime >= 2000) {
        this.readyToReset = true;
        this.sprite.remove();
        let indexOfEnemy = gameWorld.gameObjects.indexOf(this);
        console.log(indexOfEnemy);
        gameWorld.gameObjects.splice(indexOfEnemy, 1);
        gameWorld.createEnemies(1);
        gameWorld.createAirborne(1, true);
      }
    }
    this.sprite.x = this.pos.x;
  }
  checkCollision(gameWorld) {
    if (this.sprite.collides(gameWorld.gameObjects[0].sprite)) {
      if ((this.sprite.y - this.size / 2) > gameWorld.gameObjects[0].sprite.y) {
        this.kill();
      } else {
        gameWorld.gameObjects[0].kill();
      }
    }
  }
  onCollideWith(player) {
    console.log("collided");
    player.kill();
  }
  kill() {
    this.walkingDirection = "idle";
    this.killed = true;
    this.sprite.collider = "s";
    this.killTime = millis();
    this.onKilledEvent.activate(gameWorld);
  }
  genTargetPos(gameWorld) {
    if (this.posPhase == 0) {
      let newPos = createVector((this.initPos.x) + this.range);
      this.posPhase = 1;
      this.targetPos = newPos;
    } else if (this.posPhase == 1) {
      this.targetPos = this.initPos;
      this.posPhase = 0;
    } else {
      this.posPhase = 0;
    }
  }
}
