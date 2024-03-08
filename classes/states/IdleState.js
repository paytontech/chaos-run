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
        if (this.subject.type == "player") {
            if (kb.pressing("d")) {


                let keyIndex = this.subject.keys.lastIndexOf("d");
                if (keyIndex == -1) {
                    this.subject.keys.push("d");
                }
                return this.subject.runRightState;

            } else {
                let keyIndex = this.subject.keys.lastIndexOf("d");
                if (keyIndex >= 0) {
                    this.subject.keys.splice(keyIndex, 1);
                }
            }
            if (kb.pressing("a")) {

                let keyIndex = this.subject.keys.lastIndexOf("a");
                if (keyIndex == -1) {
                    this.subject.keys.push("a");
                }
                return this.subject.runLeftState;
            } else {
                let keyIndex = this.subject.keys.lastIndexOf("a");
                if (keyIndex >= 0) {
                    this.subject.keys.splice(keyIndex, 1);
                }
            }
            if (this.subject.keys.length == 0) {
                if (this.subject.sprite.vel.x != 0) {
                    if (this.subject.sprite.vel.x > 0) {
                        this.subject.sprite.vel.x -= 0.1;
                    } else {
                        this.subject.sprite.vel.x += 0.1;
                    }
                }
            }
        }
    }
}
