class State {
    constructor(subject, popable) {
      this.subject = subject;
      this.popable = popable;
    }
    enter() {
      console.log("state enter (make sure to override this)");
    }
    exit() {
      console.log("state exit (make sure to override this)");
    }
    update() {
      console.log("state update (make sure to override this)");
    }
    handleInput() {
      console.log("state handleInput (make sure to override this)");
    }
  }
  