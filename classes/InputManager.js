class InputManager {
    constructor() { }
    currentIntent() {
        //kb
        if (kb.pressing(" ") || contro.pressing("a")) {
            return "jump";
        }
        if (kb.pressing("a") || contro.pressing("left")) {
            return "move-left";
        }
        if (kb.pressing("d") || contro.pressing("right")) {
            return "move-right";
        }

    }
}