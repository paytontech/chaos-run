class IdleState extends State {
    constructor(subject, popable) {
        super(subject, popable);
    }
    enter() {
        this.subject.sprite.color = color(255, 0, 0);
    }
    exit() {
    }
    update() {
    }
    handleInput() {
        if (this.subject.type == "proto" || this.subject.type == "airborne") {
            return this.subject.leftPhase;
        }
        if (kb.presses(" ") && this.subject.type == "player") {
            return this.subject.jumpState;
        }

    }
}
