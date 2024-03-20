class CodeEvent extends Event {
    constructor() {
        super();
        this.name = "Code Challenge";
    }
    activate(gameWorld) {
        const challenges = [
            {
                name: "Write code which returns 12 squared.",
                result: 12 * 12,
                example: "8*8 (returns 64)"
            }
        ];
        this.currentChallenge = random(challenges);
        this.challengeSolved = false;
    }
    update(gameWorld) {

        push();
        textSize(24);
        text(`Your challenge:\n${this.currentChallenge.name}\n(example: ${this.currentChallenge.example})`, width / 2 - 120, height / 2);
        pop();

    }
    reset(gameWorld) { }
}