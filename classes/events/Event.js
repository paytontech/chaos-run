class Event {
    constructor() {
        this.name = "Blank Event";
    }
    update(gameWorld) {
        // console.log("base event update (make sure to override this!)");
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
    }
    reset(gameWorld) {

    }
    activate(gameWorld) {

    }
    update() {

    }
}