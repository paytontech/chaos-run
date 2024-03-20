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
            },
            {
                name: "Write code which returns the square root of 12 squared",
                result: Math.sqrt(12 * 12),
                example: "Math.sqrt(64) (returns 8)"
            },
            {
                name: "Write code which returns the current date as a string",
                result: Date.now().toLocaleString(),
                example: "Date(Date.now()) returns the current date in millis, convert this to a locale string."
            },
            {
                name: "Write code which returns true if a given number (x) is greater than 50",
                variables: [
                    {
                        name: "x",
                        value: ~~random(0, 100)
                    }
                ],
                result: "x > 50",
                example: "Use variable \"x\" to represent the number"
            },
            {
                name: "Write code which checks returns true if \"x\" is greater than \"z\"",
                variables: [
                    {
                        name: "x",
                        value: ~~random(0, 100)
                    },
                    {
                        name: "z",
                        value: ~~random(0, 100)
                    }
                ],
                result: "x > z",
                example: "Use variables \"x\" and \"z\" to represent the numbers."
            }
        ];
        for (let challenge of challenges) {
            challenge.result = this.replaceVariables(challenge, challenge.result);
            console.log(challenge.result);
            challenge.result = eval(challenge.result);
        }
        this.currentChallenge = random(challenges);
        this.challengeSolved = false;
        let codeBox = createInput();
        codeBox.position(12, height / 2 + 75);
        this.codeBox = codeBox;
        this.solved = false;

    }
    update(gameWorld) {

        if (!this.solved) {
            push();
            textSize(24);
            text(`Your challenge:\n${this.currentChallenge.name}\n(example: ${this.currentChallenge.example})`, 12, height / 4, width);
            pop();
            this.progressBar = new ProgressBar(millis() - this.startTime, this.runtime, width / 4, 20, color(255), color(255, 0, 0));
            this.progressBar.render(createVector(5, height - this.progressBar.maxHeight - 5));
        }
        if (kb.presses("enter")) {
            if (this.currentChallenge.name.includes("date")) {
                this.currentChallenge.result = Date(Date.now()).toLocaleString();
            }
            let val = this.codeBox.value();
            val = this.replaceVariables(this.currentChallenge, val);
            try {
                if (eval(val) == this.currentChallenge.result) {
                    this.solved = true;
                    this.codeBox.hide();
                } else {
                    console.log(eval(this.codeBox.value()), this.currentChallenge.result);
                    gameWorld.gameObjects[0].kill();

                    this.codeBox.hide();
                }
            } catch (err) {
                console.log(err);
                console.log(eval(this.codeBox.value()), this.currentChallenge.result);
                gameWorld.gameObjects[0].kill();

                this.codeBox.hide();
            }
        }
        if (this.solved) {
            world.gravity.y = 10;
            for (let obj of gameWorld.gameObjects) {
                obj.update(gameWorld);
            }
        } else {
            world.gravity.y = 0;
            for (let obj of gameWorld.gameObjects) {
                obj.sprite.velocity.x = 0;
                obj.sprite.velocity.y = 0;

            }
        }

    }
    reset(gameWorld) {
        this.codeBox.hide();
        if (!this.solved) {
            gameWorld.gameObjects[0].kill();
        }
    }
    replaceVariables(challenge, string) {
        let resultString = string;
        if (Object.hasOwn(challenge, "variables")) {
            // let resultString = challenge.result;
            // resultString = resultString.replace("x", challenge.value);


            for (let variable of challenge.variables) {
                resultString = resultString.replace(variable.name, variable.value);
            }
            challenge.result = eval(resultString);
        }
        return resultString;
    }
}