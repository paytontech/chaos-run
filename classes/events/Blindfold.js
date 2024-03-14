class BlindfoldEvent extends Event {
    constructor() {
        super();
        this.name = "Blindfold";

    }
    activate(gameWorld) {
        let sprite = new Sprite();
        sprite.x = (width / 2) + camera.x;
        sprite.y = height / 2;
        sprite.w = width * 2;
        sprite.h = height;
        sprite.collider = "s";
        sprite.color = "black";
        this.sprite = sprite;
        this.lastCameraX = camera.x;
    }
    reset(gameWorld) {
        this.sprite.remove();
        this.sprite = null;
    }
    update(gameWorld) {
        let deltaX = camera.x - this.lastCameraX;
        this.lastCameraX = camera.x;
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
            this.sprite.overlaps(obj.sprite);
        }

        this.sprite.x += deltaX;
    }
}