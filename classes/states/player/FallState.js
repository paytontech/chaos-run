class FallState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
        this.subject.sprite.bearing = 90;
        this.subject.sprite.applyForceScaled(this.subject.jumpStrength / 2);
        this.subject.sprite.color = color(245, 167, 66);
    }
    exit() {
    }
    update() {

    }
    handleInput() {
        if (this.subject.sprite.collides(gameWorldBG.floor)) {
            return this.subject.idleState;
        }
    }
}