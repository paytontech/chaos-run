class SpawnMoreProto extends Event {
  constructor() {
    super();
  }
  activate(gameWorld) {
    let randomNumber = ~~random(0, 25);
    console.log(randomNumber);
    if (randomNumber == 1) {
      //using a for loop here to add a delay to each thing being created, which makes sure each enemy is spread out due to the random function for its position
      var currentDelay = 0;
      for (let i = 0; i < 5; i++) {
        currentDelay += 250;
        setTimeout(() => {
          gameWorld.createEnemies(1, true);
        }, currentDelay);
      }
    }
  }
}
