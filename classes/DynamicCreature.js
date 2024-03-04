class DynamicCreature extends Dynamic {
  constructor(type, pos, vel, dVD, dVM, friendly, health, defaultState) {
    super(type, pos, vel, dVD, dVM, friendly);
    this.health = health;
    this.maxHealth = health;
    this.jumpStrength = 300;
    this.killed = false;
    this.fsm = new FSM();
    this.idleState = new IdleState(this, false);
    this.jumpState = new JumpState(this, true);
    this.fallState = new FallState(this, true);
  }
  display() {
  }
  update() {
    this.fsm.update();
  }
  kill() {
    this.killed = true;
  }
}
