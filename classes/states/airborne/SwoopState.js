class SwoopState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
        this.target = gameWorld.gameObjects[0];
    }
    exit() {
    }
    update() {
        this.subject.sprite.moveTo(this.target.sprite);
    }
    handleInput() {
    }
}
