class LightningStorm extends Event {
    constructor() {
        super();
        this.name = "Lightning";
        this.lightning = [];
    }
    activate(gameWorld) {
        let acitvationTime = millis() + 2000;
        for (let i = 0; i < 4; i++) {
            this.lightning.push(
                new Lightning(gameWorld, acitvationTime)
            );
            acitvationTime += 2000;
        }
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
        for (let lightning of this.lightning) {
            lightning.update(gameWorld);
        }
    }
    reset(gameWorld) {
        for (let lightning of this.lightning) {
            lightning.sprite.remove();
        }
        this.lightning = [];
    }
}

class Lightning extends DynamicCreature {
    constructor(gameWorld, acitvationTime) {
        super("lightning", createVector(random(0 + gameWorld.gameObjects[0].sprite.x, width + gameWorld.gameObjects[0].sprite.x), -height));
        this.acitvationTime = acitvationTime;
        this.sprite.remove();
        this.sprite = new Sprite();
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
        this.sprite.collider = "s";
        this.sprite.h = height;
        this.sprite.w = 15;
        this.sprite.strokeWeight = 0;
        this.sprite.color = "aqua";
        this.firing = false;
    }
    update(gameWorld) {
        if (numbersEqualWithinBounds(millis(), this.acitvationTime, 2000)) {
            this.sprite.y = height / 2 - (height / 1.34);
        }
        if (numbersEqualWithinBounds(millis(), this.acitvationTime, 100)) {
            this.firing = true;


        }
        if (this.firing) {
            if (~~random(0, 25) == 0) {
                this.sprite.color = "gray";
                this.sprite.y = height / 2 - (height / 1.34);
            } else {
                this.sprite.color = "white";
                this.sprite.y = height / 2;
            }
            let player = gameWorld.gameObjects[0];
            if (numbersEqualWithinBounds(player.sprite.x, this.pos.x, 75)) {
                player.kill();
            }
        }
    }
}