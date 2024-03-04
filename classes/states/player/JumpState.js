class JumpState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
        this.subjectInitialMass = this.subject.sprite.mass;
        this.subject.sprite.bearing = -90;
        this.subject.sprite.applyForceScaled(this.subject.jumpStrength);
        this.subject.sprite.color = color(0, 255, 0);

    }
    exit() {
        this.subject.sprite.mass = this.subjectInitialMass;
    }
    update() {

    }
    handleInput() {
        if (this.subject.sprite.vel.y > 0) {
            return this.subject.fallState;
        }
    }
}