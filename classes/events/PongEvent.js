class PongEvent extends Event {
    constructor() {
        super();
        this.name = "Pong";

    }
    activate(gameWorld) {
        this.paddle = new Paddle();
        this.ball = new Ball(this.paddle);
    }
    update(gameWorld) {
        this.paddle.update();
        this.ball.update(gameWorld, this.paddle);
        world.gravity.y = 0;
        for (let obj of gameWorld.gameObjects) {
            obj.sprite.velocity.x = 0;
            obj.sprite.velocity.y = 0;
            obj.sprite.rotation = 0;
        }
    }
    reset(gameWorld) {
        this.paddle.sprite.remove();
        this.ball.sprite.remove();
        this.paddle = null;
        this.ball = null;
        world.gravity.y = 10;
    }
}

class Paddle {
    constructor() {
        this.pos = createVector(100 + (camera.x - (width / 2)), height / 8);
        this.sprite = new Sprite();
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
        this.sprite.w = 25;
        this.sprite.h = height / 4;
        this.sprite.collider = "k";
        this.speed = 2;
    }
    update() {
        if (kb.pressing("down")) {
            this.sprite.y += this.speed;
        }
        if (kb.pressing("up")) {
            this.sprite.y -= this.speed;
        }
        this.sprite.overlaps(gameWorldBG.floors);
    }
}

class Ball {
    constructor(paddle) {
        this.pos = createVector(
            random(150 + (camera.x - (width / 2)), width + (camera.x - (width / 2))),
            random(50, height - 50)

        );
        console.log(this.pos, camera.x, camera.y);
        this.speed = 3;
        this.velocity = createVector(this.speed, this.speed);
        this.sprite = new Sprite();
        this.sprite.d = 20;
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
        this.sprite.velocity = this.velocity;
        this.sprite.collider = "d";

    }
    update(gameWorld, paddle) {
        this.pos.add(this.velocity);
        this.sprite.overlaps(gameWorldBG.floors);
        if (this.pos.x + 10 >= camera.x + (width / 2)) {
            this.velocity.x *= -1;
        }
        if (this.pos.y + 10 >= height) {
            this.velocity.y *= -1;
        }
        if (this.pos.y <= 10) {
            this.velocity.y *= -1;
        }
        for (let obj of gameWorld.gameObjects) {
            this.sprite.overlaps(obj.sprite);
        }
        if (
            this.sprite.collides(paddle.sprite)
        ) {
            // this.velocity.y *= -1;
            this.velocity.x *= -1;
        }
        if (this.pos.x + 10 <= camera.x - (width / 2)) {
            gameWorld.gameObjects[0].kill();
        }
        this.sprite.velocity = this.velocity;
        this.pos.x = this.sprite.x;
        this.pos.y = this.sprite.y;
        // this.sprite.x += this.velocity.x;
        // this.sprite.y += this.velocity.y;
    }
}