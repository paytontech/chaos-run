class RunLeftState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
    }
    exit() {
    }
    update() {
        if (-this.subject.sprite.velocity.x < this.subject.speed) {
            this.subject.sprite.applyForceScaled(-this.subject.vel.x, 0);
        }
    }
    handleInput() {
        if (!kb.pressing("a")) {
            return this.subject.idleState;
        }
        if (kb.presses(" ") && this.subject.type == "player") {
            return this.subject.jumpState;
        }
    }
}