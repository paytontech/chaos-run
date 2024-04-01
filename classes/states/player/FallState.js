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
        this.subject.sprite.image = playerAnimations.fall;
    }
    handleInput() {
        if (kb.pressing("down") < 30 || controllerHelper.dPadDown < 30) {
            if (kb.pressing("down") > 0) {
                this.subject.sprite.applyForce((this.subject.jumpStrength / 200) * kb.pressing("down"));
            } else {
                this.subject.sprite.applyForce((this.subject.jumpStrength / 200) * controllerHelper.dPadDown());
            }
        }
        if (this.subject.sprite.collides(gameWorldBG.floor)) {
            return this.subject.idleState;
        }
    }
}