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
        this.subject.sprite.image = playerAnimations.walking;
        this.subject.sprite.scale = createVector(-1, 1);
        for (let frame of playerAnimations.walking.gifProperties.frames) {
            frame.delay = map(this.subject.sprite.velocity.x, 0, -this.subject.speed, 500, 100);
        }
    }
    handleInput() {
        if (!this.subject.idleState.goingLeft()) {
            return this.subject.idleState;
        }
        if (this.subject.idleState.jumpPressed() && this.subject.type == "player") {
            return this.subject.jumpState;
        }
    }
}