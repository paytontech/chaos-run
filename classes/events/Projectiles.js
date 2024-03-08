class Projectiles extends Event {
    constructor() {
        super();
        this.name = "Icicles";
        this.projectiles = [];
    }
    activate(gameWorld) {
        var currentDelay = 0;
        for (let i = 0; i < 5; i++) {
            currentDelay += 500;
            setTimeout(() => {
                var proposedProjectile = new Projectile(gameWorld);
                this.projectiles.push(proposedProjectile);
            }, currentDelay);
        }
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            if (!obj.killed) {
                obj.update(gameWorld);
            }
        }
        gameWorld.gameObjects[0].update(gameWorld);
        for (let projectile of this.projectiles) {
            projectile.update(gameWorld);
            // projectile.pos.x -= gameWorld.deltaXOffset;
        }
        this.display();
    }
    display() {
        for (let projectile of this.projectiles) {
            projectile.display();
        }
    }
    reset(gameWorld) {
        for (let projectile of this.projectiles) {
            projectile.sprite.remove();
        }
    }
}

class Projectile extends DynamicCreature {
    constructor(gameWorld) {
        super("projectile", createVector(random(0 + gameWorld.gameObjects[0].pos.x - (width / 4), width + gameWorld.gameObjects[0].pos.x - (width / 4)), -height), createVector(0, 2), true, false, false, 1);
        this.height = 100;
        this.sprite.remove();
        this.sprite = new Sprite(this.pos.x, this.pos.y, 25, this.height, "static");
        this.sprite.image = icicleSprite;
        this.lastCameraX = camera.x;
    }
    update(gameWorld) {
        this.sprite.y += this.vel.y;
        this.sprite.x += (camera.x - this.lastCameraX) / 4;
        this.lastCameraX = camera.x;
        this.checkCollision(gameWorld);
    }
    display() {

    }
    checkCollision(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            if (this.sprite.overlaps(obj.sprite)) {
                obj.kill();
            }
        }
    }
}