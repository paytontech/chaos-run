class UpsideDown extends Event {
    constructor() {
        super();
        this.name = "Upside Down!";
    }
    activate(gameWorld) {

    }
    reset(gameWorld) {
    }
    update(gameWorld) {
        translate(width / 4, height);
        scale(1, -1);
        translate(0, 0);
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
    }
}