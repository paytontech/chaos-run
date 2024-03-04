class Dynamic {
  constructor(type, pos, vel, dVD, dVM, friendly) {
    this.pos = pos;
    this.vel = vel;
    this.dynamicVsDynamic = dVD;
    this.dynamicVsMap = dVM;
    this.friendly = friendly;
    this.type = type;
    this.size = 50;
    this.sprite = new Sprite();
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.sprite.d = this.size;
    this.sprite.collider = "d";
  }
  display() {
    console.log("dynamic display " + this.type);
  }
  update() {
    console.log("dynamic update");
  }
  interact() { }
}
