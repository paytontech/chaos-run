class IdleState extends State {
    constructor(subject, popable) {
        super(subject, popable);
        this.lastTouchY = 0;
        this.touchDeltaY = 0;
    }
    enter() {
        this.subject.sprite.color = color(255, 0, 0);
        if (this.subject.type == "player") {
            this.subject.sprite.velocity.y = 0;
        }
    }
    exit() {
    }
    update() {
    }
    handleInput() {
        if (this.subject.type == "proto" || this.subject.type == "airborne") {
            return this.subject.leftPhase;
        }
        if (this.jumpPressed() && this.subject.type == "player") {
            this.touchDeltaY = 0;
            this.lastTouchY = 0;
            return this.subject.jumpState;
        }
        if (this.subject.type == "player") {
            if (this.goingRight()) {


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
            if (this.goingLeft(0)) {

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
    goingRight() {

        if (kb.pressing("d")) return true;
        var goingRight = false;
        for (let touch of touches) {
            if (touch.x > width / 2) goingRight = true;
        }
        return goingRight;
    }
    goingLeft() {
        if (kb.pressing("a")) return true;
        var goingLeft = false;
        for (let touch of touches) {
            if (touch.x < width / 2) goingLeft = true;
        }
        return goingLeft;
    }
    jumpPressed() {
        if (kb.presses(" ")) return true;
        var jumping = false;

        if (touches[0] != undefined) {
            if (this.lastTouchY == 0) this.lastTouchY = touches[0].y;
            this.touchDeltaY = touches[0].y - this.lastTouchY;
            this.lastTouchY = touches[0].y;
        }
        if (this.touchDeltaY > 10 || this.touchDeltaY < -10) jumping = true;
        return jumping;
    }
}
