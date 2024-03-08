class AirborneEnemy extends DynamicCreature {
    constructor(initPos, speed, range) {
        super("airborne", initPos, createVector(speed, speed / 4), true, true, false, 100);
        this.initPos = initPos;
        this.range = range;
        this.sprite.collider = "k";
        this.leftPhase = new AirbornePhaseLeft(this, true);
        this.rightPhase = new AirbornePhaseRight(this, true);
        this.fsm.setInitialState(this.idleState);
        this.sprite.img = "assets/sprites/enemies/airborne/airborne-flight.gif";
        this.swoopState = new SwoopState(this, true);
        this.killed = false;
    }
    update(world) {
        if (!this.killed) {
            this.sprite.x = this.pos.x;
            this.sprite.y = this.pos.y;
            this.fsm.update();
            this.checkCollision(world);
        }


    }
    checkCollision(world) {
        if (this.sprite.collides(world.gameObjects[0].sprite)) {
            this.sprite.collider = "d";
            world.gameObjects[0].kill();
        }
    }
}