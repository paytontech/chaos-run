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
        this.umbrella = new Umbrella(gameWorld);
        for (let i = 0; i < 500; i++) {
            this.rain.push(new Rain());
        }
    }
}

class Umbrella extends DynamicCreature {
    constructor(gameWorld) {
        super("umbrella", createVector(random(0 + gameWorld.gameObjects[0].sprite.x, width + gameWorld.gameObjects[0].sprite.x), width / 4), createVector(0, 0), false, false, true, 1, new IdleState());
        this.sprite.remove();
        this.sprite = new Sprite(this.pos.x, this.pos.y);
        this.sprite.collider = "k";
        this.sprite.w = 200;
        this.sprite.h = 10;
        this.sprite.debug = true;
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
        this.sprite.collider = "k";
        this.sprite.h = 50;
        this.sprite.w = 10;
        this.sprite.debug = true;
    }
    update(gameWorld) {
        this.sprite.pos.y += 2;
        if (gameWorld.gameObjects[0].sprite.collides(this.sprite)) {
            gameWorld.gameObjects[0].kill();
        }
    }
}