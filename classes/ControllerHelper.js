var controllerHelper = {
    aButtonPressedCount: 0,
    dPadDownPressedCount: 0,
    usesGamepad: false,
    dPadLeft() {
        return joystick.getAxesValueByIndex(0, 0) == -1;
    },
    dPadRight() {
        return joystick.getAxesValueByIndex(0, 0) == 1;
    },
    aButton() {
        if (joystick.getButtonPressedByIndex(0, 1)) {
            this.aButtonPressedCount += 1;
        } else {
            this.aButtonPressedCount = 0;
        }
        return this.aButtonPressedCount;
    },
    dPadDown() {
        if (joystick.getAxesValueByIndex(0, 1) == 1) {
            this.dPadDownPressedCount += 1;
        } else {
            this.dPadDownPressedCount = 0;
        }
        return this.dPadDownPressedCount;
    },
    startButton() {
        return joystick.getButtonPressedByIndex(0, 9);
    }
};

window.addEventListener("gamepadconnected", () => { controllerHelper.usesGamepad = true; });
window.addEventListener("gamepaddisconnected", (e) => { controllerHelper.usesGamepad = false; });
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};