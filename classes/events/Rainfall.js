class Rainfall extends Event {
    constructor() {
        super();
        this.name = "Rainfall";
        this.rain = [];
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
        for (let rainEntity of this.rain) {
            rainEntity.update(gameWorld);
        }
        this.umbrella.update(gameWorld, this.rain);
    }
    reset(gameWorld) {
        this.umbrella.sprite.remove();
        for (let rainEntity of this.rain) {
            rainEntity.sprite.remove();
        }
        this.rain = [];
    }
    activate(gameWorld) {

        for (let i = 0; i < 50; i++) {
            this.rain.push(new Rain());
        }
        this.umbrella = new Umbrella(gameWorld);
    }
}

class Umbrella extends DynamicCreature {
    constructor(gameWorld) {
        super("umbrella", createVector(random(0 + gameWorld.gameObjects[0].sprite.x, width + gameWorld.gameObjects[0].sprite.x), width / 4), createVector(0, 0), false, false, true, 1, new IdleState());
        this.sprite.remove();
        this.sprite = new Sprite(this.pos.x, this.pos.y, 200, 10, "k");
        // this.sprite.debug = true;
    }
    update(gameWorld, rain) {
        for (let rainEntity of rain) {
            if (this.sprite.collides(rainEntity.sprite)) {
                rainEntity.sprite.remove();
            }
        }
    }
}

class Rain extends DynamicCreature {
    constructor() {
        super("rain", createVector(random(0 + gameWorld.gameObjects[0].sprite.x, width + gameWorld.gameObjects[0].sprite.x), -height - random(0, height)), createVector(0, 0), true, false, false, 1, new IdleState());
        this.sprite.remove();
        this.sprite = new Sprite(this.pos.x, this.pos.y);
        this.sprite.collider = "d";
        this.sprite.h = 50;
        this.sprite.w = 10;
        // this.sprite.debug = true;
        this.sprite.mass = 0.25;
        this.sprite.color = "cyan";
    }
    update(gameWorld) {
        this.sprite.applyForceScaled(0, -9);
        if (gameWorld.gameObjects[0].sprite.collides(this.sprite)) {
            gameWorld.gameObjects[0].kill();
        }
        if (this.sprite.y == height / 1.5) {
            this.sprite.remove();
        }
        if (this.sprite.collides(gameWorldBG.floor)) {
            this.sprite.remove();
        }
        // if (this.sprite.velocity.y == 0) {
        //     this.sprite.remove();
        // }
    }
}