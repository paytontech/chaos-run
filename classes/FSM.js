class FSM {
  constructor() {
    this.stack = [];
    this.currentState = null;
    this.nextState = null;
  }

  getCurrentState() {
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1];
    } else {
      return null;
    }
  }
  popState() {
    this.stack.pop();
  }
  pushState(state) {
    if (state != null && state != this.getCurrentState()) {
      this.currentState.exit();

      if (this.currentState.popable) {
        this.popState();
      }
      if (this.getCurrentState().constructor != state.constructor) {
        this.stack.push(state);
      }
      this.currentState = this.getCurrentState();
      this.currentState.enter();
    }
  }
  update() {
    this.nextState = this.currentState.handleInput();
    this.pushState(this.nextState);
    this.nextState = this.currentState.update();
    this.pushState(this.nextState);
  }
  setInitialState(state) {
    this.stack = [];
    this.stack.push(state);
    this.currentState = this.getCurrentState();
    this.currentState.enter();
  }
}
