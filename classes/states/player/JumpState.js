class JumpState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
        this.subjectInitialMass = this.subject.sprite.mass;
        this.subject.sprite.bearing = -90;
        this.subject.sprite.applyForceScaled(this.subject.jumpStrength);
        this.subject.sprite.color = color(0, 255, 0);
        playerAnimations.jump.reset();
    }
    exit() {
        this.subject.sprite.mass = this.subjectInitialMass;
        playerAnimations.jump.gifProperties.displayIndex = 0;
    }
    update() {
        this.subject.sprite.image = playerAnimations.jump;

    }
    handleInput() {
        // console.log("jumpstate handleInput");
        // this.subject.sprite.mass -= (kb.pressing(" ") / 120)
        // console.log(this.subject.sprite.mass)
        if (kb.pressing(" ") < 30) {
            this.subject.sprite.applyForce((this.subject.jumpStrength / 800) * kb.pressing(" "));

        }
        // console.log(controllerHelper.aButton());
        if (controllerHelper.aButton() < 60) {
            this.subject.sprite.applyForce((this.subject.jumpStrength / 800) * controllerHelper.aButton());
        }
        if (kb.presses("down") || controllerHelper.dPadDown() > 0) {
            return this.subject.fallState;
        }

        if (this.subject.idleState.goingLeft()) {
            if (-this.subject.sprite.velocity.x < this.subject.speed) {
                this.subject.sprite.applyForceScaled(-this.subject.vel.x, 0);
            }
        }

        if (this.subject.idleState.goingRight()) {
            if (this.subject.sprite.velocity.x < this.subject.speed) {
                this.subject.sprite.applyForceScaled(this.subject.vel.x, 0);
            }
        }

        if (this.subject.sprite.vel.y > 0) {
            return this.subject.fallState;
        }
    }
}