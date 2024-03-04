class ProtoEnemy extends DynamicCreature {
  constructor(initX, initY, speed, range) {
    super("proto", createVector(initX, initY), createVector(speed, 0), true, true, false, 1, "idle");
    this.type = "proto";
    this.initPos = createVector(initX, initY);
    this.targetPos = createVector(initX - 50, initY);
    this.range = range;
    this.targetPosOverride = false;
    this.posPhase = 0;
    this.killed = false;
    this.readyToReset = false;
    this.onKilledEvent = new SpawnMoreProto();
    this.prevXOffset = 0;
    this.walkingDirection = "idle";
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

    if (!this.killed) {
      this.fsm.update();
      this.checkCollision(gameWorld);
      if (
        numbersEqualWithinBounds(
          this.pos.x,
          this.targetPos.x,
          0.5
        ) ||
        this.targetPosOverride
      ) {
        this.genTargetPos(gameWorld);
        this.targetPosOverride = false;
      }
    }
    if (this.killed) {
      gameWorld.gameObjects[0].sprite.overlaps(this.sprite);
      if (millis() - this.killTime >= 2000) {
        this.readyToReset = true;
        this.sprite.remove();
        let indexOfEnemy = gameWorld.gameObjects.indexOf(this);
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
        this.walkingDirection = "idle";
        this.killed = true;
        this.sprite.collider = "s";
        this.killTime = millis();
        this.onKilledEvent.activate(gameWorld);
      } else {
        gameWorld.gameObjects[0].kill();
      }
    }
  }
  onCollideWith(player) {
    console.log("collided");
    player.kill();
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
