class CodeEvent extends Event {
    constructor() {
        super();
        this.name = "Code Challenge";
        this.optionButtons = [];
    }
    activate(gameWorld) {
        const challenges = [
            {
                name: "Write code which returns 12 squared.",
                result: 12 * 12,
                example: "8*8 (returns 64)",
                options: [
                    {
                        value: "12 * 12",
                        correct: true
                    },
                    {
                        value: "Math.pow(12,2)",
                        correct: true
                    },
                    {
                        value: "144",
                        correct: true
                    },
                    {
                        value: "Math.sqrt(12)",
                        correct: false
                    },
                    {
                        value: "Math.square(12)",
                        correct: false
                    }
                ]
            },
            {
                name: "Write code which returns the square root of 13",
                result: Math.sqrt(13),
                example: "Math.sqrt(64) (returns 8)",
                options: [
                    {
                        value: "Math.sqrt(3.61)",
                        correct: false
                    },
                    {
                        value: "Math.sqrt(13)",
                        correct: true
                    },
                    {
                        value: "~3.61",
                        correct: true
                    },
                    {
                        value: "13*13",
                        correct: false
                    }
                ]
            },
            {
                name: "Write code which returns the current date as a string",
                result: 0,
                example: "Date(Date.now()) returns the current date in millis, convert this to a locale string.",
                options: [
                    {
                        value: "Date(Date.now())",
                        correct: false
                    },
                    {
                        value: "Date(Date.now()).toLocaleString()",
                        correct: true
                    },
                    {
                        value: "Date.now().toLocaleString()",
                        correct: false
                    },
                    {
                        value: "Date().toLocaleString()",
                        correct: true
                    }
                ]
            },
            {
                name: "Write code which returns true if a given number (x) is greater than 50",
                variables: [
                    {
                        name: "x",
                        value: ~~random(1, 100)
                    }
                ],
                result: "x > 50",
                example: "Use variable \"x\" to represent the number",
                options: [
                    {
                        value: "x > 50",
                        correct: true
                    },
                    {
                        value: "x < 50",
                        correct: false
                    },
                    {
                        value: "x > 50 == true",
                        correct: true
                    },
                    {
                        value: "x >= 50",
                        correct: false
                    },
                    {
                        value: "x <= 50",
                        correct: false
                    }
                ]
            },
            {
                name: "Write code which checks returns true if \"x\" is greater than \"z\"",
                variables: [
                    {
                        name: "x",
                        value: ~~random(1, 100)
                    },
                    {
                        name: "z",
                        value: ~~random(1, 100)
                    }
                ],
                result: "x > z",
                example: "Use variables \"x\" and \"z\" to represent the numbers.",
                options: [
                    {
                        value: "x > z",
                        correct: true
                    },
                    {
                        value: "x < z",
                        correct: false
                    },
                    {
                        value: "x > z == true",
                        correct: true
                    },
                    {
                        value: "x is greater than z",
                        correct: false
                    }
                ]
            },
            {
                name: "Write code which performs x + z, and then returns true if the result is greater than y.",
                variables: [
                    {
                        name: "x",
                        value: ~~random(1, 100)
                    },
                    {
                        name: "z",
                        value: ~~random(1, 100)
                    },
                    {
                        name: "y",
                        value: ~~random(1, 100)
                    }
                ],
                result: "(x + z) > y",
                example: "Use variables \"x\", \"y\", and \"z\" to represent the numbers.",
                options: [
                    {
                        value: "x + z > y",
                        correct: true
                    },
                    {
                        value: "if (x + z < y) return true;",
                        correct: false
                    },
                    {
                        value: "x + y > z",
                        correct: false
                    },
                    {
                        value: "true",
                        correct: false
                    }
                ]
            }
        ];
        for (let challenge of challenges) {

            challenge.result = this.replaceVariables(challenge, challenge.result);
            console.log(challenge.result, challenge.name);
            challenge.result = eval(challenge.result);
        }
        this.currentChallenge = random(challenges);
        print(this.currentChallenge);
        this.challengeSolved = false;
        let codeBox = createInput();
        codeBox.position(12, height / 2 + 75);
        this.codeBox = codeBox;
        this.solved = false;
        this.controllerDelay = 0;
        if (controllerHelper.usesGamepad) {
            this.codeBox.hide();
            this.selectedOption = 0;
            var optionInt = 0;
            shuffleArray(this.currentChallenge.options);
            for (let option of this.currentChallenge.options) {
                var optionButton = createButton(option.value);
                optionButton.position(optionButton.width * optionInt + 20, height / 2 + 75);
                optionButton.mousePressed(() => {
                    this.submitOption(option);
                });
                optionInt += 1;
                this.optionButtons.push(optionButton);
            }
        }
    }
    update(gameWorld) {

        if (!this.solved) {
            for (let index in this.optionButtons) {
                let button = this.optionButtons[index];
                if (index == this.selectedOption) {
                    button.elt.classList.add("selected");
                } else {
                    button.elt.classList.remove("selected");
                }
            }
            // console.log(millis() - this.controllerDelay);
            if (controllerHelper.dPadRight() && millis() - this.controllerDelay > 500
            ) {
                if (this.selectedOption + 1 > (this.currentChallenge.options.length - 1)) {
                    this.selectedOption = 0;
                } else {
                    this.selectedOption += 1;
                }
                this.controllerDelay = millis();
            }
            if (controllerHelper.dPadLeft() && millis() - this.controllerDelay > 500
            ) {
                if (this.selectedOption - 1 < 0) {
                    this.selectedOption = this.currentChallenge.options.length - 1;
                } else {
                    this.selectedOption -= 1;
                }
                this.controllerDelay = millis();
            }
            if (controllerHelper.aButton() > 0) {
                this.submitOption(this.currentChallenge.options[this.selectedOption]);
            }
            push();
            textSize(24);
            text(`Your challenge:\n${this.currentChallenge.name}\n(notes: ${this.currentChallenge.example})`, 12, height / 4, width);

            pop();
            this.progressBar = new ProgressBar(millis() - this.startTime, this.runtime, width / 4, 20, color(255), color(255, 0, 0));
            this.progressBar.render(createVector(5, height - this.progressBar.maxHeight - 5));
        }
        if (kb.presses("enter") && !controllerHelper.usesGamepad) {
            if (this.currentChallenge.name.includes("date")) {
                this.currentChallenge.result = Date(Date.now()).toLocaleString();
            }
            let val = this.codeBox.value();
            val = this.replaceVariables(this.currentChallenge, val);
            try {
                if (eval(val) == this.currentChallenge.result) {
                    this.win();
                } else {
                    this.lose();
                }
            } catch (err) {
                console.log(err);
                this.lose();
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
        this.clearUI();
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
        }
        return resultString;
    }
    submitOption(option) {
        console.log(option);
        if (option.correct) {
            this.win();
        } else {
            this.lose();
        }
    }
    win() {
        this.solved = true;
        this.clearUI();
    }
    lose() {

        gameWorld.gameObjects[0].kill();
        this.clearUI();
    }
    clearUI() {
        for (let button of this.optionButtons) {
            button.hide();
        }
        this.optionButtons = [];
        this.codeBox.hide();
    }
}