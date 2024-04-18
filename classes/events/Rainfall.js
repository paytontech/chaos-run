class Rainfall extends Event {
    constructor() {
        super();
        this.name = "Rainfall";
        this.rain = [];
        this.addedMoreRain = false;
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
        for (let rainEntity of this.rain) {
            rainEntity.update(gameWorld, this.umbrella);
        }
        this.umbrella.update(gameWorld, this.rain);
        if (millis() - this.startTime >= 4000 && !this.addedMoreRain) {
            for (let i = 0; i < 300; i++) {
                this.rain.push(new Rain(gameWorld));
            }
            this.addedMoreRain = true;
        }
    }
    reset(gameWorld) {
        gameWorld.gameObjects[0].vel.x = this.initPlayerXVelocity;
        this.umbrella.sprite.remove();
        for (let rainEntity of this.rain) {
            rainEntity.sprite.remove();
        }
        this.rain = [];
        this.addedMoreRain = false;
    }
    activate(gameWorld) {
        this.initPlayerXVelocity = gameWorld.gameObjects[0].vel.x;
        gameWorld.gameObjects[0].vel.x *= 2;
        this.umbrella = new Umbrella(gameWorld);
        for (let i = 0; i < 200; i++) {
            this.rain.push(new Rain(gameWorld));
        }

    }
}

class Umbrella extends DynamicCreature {
    constructor(gameWorld) {
        super("umbrella", createVector(random(0 + gameWorld.gameObjects[0].sprite.x, width + gameWorld.gameObjects[0].sprite.x), height / 4), createVector(0, 0), false, false, true, 1, new IdleState());
        this.sprite.remove();
        this.sprite = new Sprite(this.pos.x, this.pos.y, 200, 10, "k");
        this.targetPos = createVector(random(this.sprite.x - 50, this.sprite.x + 50), this.sprite.y);
        this.sprite.velocity.x = random([-1.2, 1.2]);
        this.startTime = millis();
        this.changedDirection = false;
        this.lastRainCollision = millis() - 10000;
        this.sprite.image = umbrellaIdleImg;
    }
    update(gameWorld, rain) {
        // this.sprite.image = umbrellaIdleImg;
        for (let rainEntity of rain) {
            if (this.sprite.collides(rainEntity.sprite)) {
                // this.sprite.image = umbrellaRainCollisionImg;
                this.lastRainCollision = millis();
                rainEntity.sprite.remove();
            }
        }
        console.log(this.lastRainCollision - millis());

        if (millis() % 5000 < 50) {
            console.log((millis() - this.startTime) % 1000);
            this.sprite.velocity.x = -this.sprite.velocity.x;
            this.changedDirection = true;
        }
    }
}

class Rain extends DynamicCreature {
    constructor(gameWorld) {
        super("rain", createVector(random(gameWorld.gameObjects[0].sprite.x - width / 2, gameWorld.gameObjects[0].sprite.x + width / 2), -height - random(height, height * 2)), createVector(0, 0), true, false, false, 1, new IdleState());
        this.sprite.remove();
        this.initX = this.pos.x;
        this.sprite = new Sprite(this.pos.x, this.pos.y);
        this.sprite.collider = "d";
        this.sprite.h = 25;
        this.sprite.w = 5;
        this.sprite.mass = 0.5;
        this.sprite.color = "cyan";
        this.sprite.strokeWeight = 0;
        this.lastPlayerPos = gameWorld.gameObjects[0].sprite.x;
    }
    update(gameWorld, umbrella) {
        let deltaUmbrella = gameWorld.gameObjects[0].sprite.x - this.lastPlayerPos;
        this.lastPlayerPos = gameWorld.gameObjects[0].sprite.x;
        this.sprite.x += deltaUmbrella;
        this.sprite.bearing = 0;
        this.sprite.rotation = 0;

        this.sprite.applyForceScaled(0, -9);
        if (gameWorld.gameObjects[0].sprite.collides(this.sprite)) {
            gameWorld.gameObjects[0].kill();
        }
        if (this.sprite.y == height / 1.5) {
            this.sprite.remove();
        }
        if (this.sprite.collides(gameWorldBG.floors)) {
            this.sprite.remove();
        }

        if (this.sprite.y >= umbrella.sprite.y) {
            if (this.sprite.x >= (umbrella.sprite.x - (umbrella.sprite.w / 2)) && this.sprite.x <= (umbrella.sprite.x + (umbrella.sprite.w / 2))) {
                this.sprite.remove();
            }
        }
    }
}