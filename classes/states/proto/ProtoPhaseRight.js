class ProtoPhaseRight extends State {
    constructor(subject, popable) {
        super(subject, popable);
        this.travelled = 0;
        this.name = "proto-right";
    }
    enter() {
        this.travelled = 0;
        this.subject.sprite.scale = createVector(-1, 1);
    }
    exit() {
    }
    update() {
        this.subject.pos.x += this.subject.vel.x;
        this.travelled += this.subject.vel.x;
    }
    handleInput() {
        if (this.travelled >= this.subject.range) {
            return this.subject.leftPhase;
        }
    }
}