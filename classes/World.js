class World {
  constructor(player, autoscroll) {
    this.gameObjects = [player];
    this.createEnemies(3, false);
    this.createAirborne(3, true);
    this.timeBasedEvents = [];
    this.currentEvent = null;
    this.eventRunning = false;
    this.startTime = millis();
    this.onEventChange = () => { };
    this.autoscroll = autoscroll;
  }
  createEnemies(count, ignorePos) {
    for (let i = 0; i < count; i++) {
      var proposedEnemy = new ProtoEnemy(
        random(this.gameObjects[0].sprite.x, this.gameObjects[0].sprite.x + width * 2),
        height / 1.5,
        1,
        200 + random(0, 100)
      );
      if (!ignorePos) {
        for (let enemy of this.gameObjects) {
          while (
            numbersEqualWithinBounds(
              proposedEnemy.pos.x,
              enemy.pos.x,
              75 + proposedEnemy.range
            )
          ) {
            proposedEnemy.pos.x += 75 + proposedEnemy.range;
          }
        }
      }
      this.gameObjects.push(proposedEnemy);
    }
  }
  createAirborne(count, ignorePos) {
    for (let i = 0; i < count; i++) {
      var proposedEnemy = new AirborneEnemy(
        createVector(random(this.gameObjects[0].sprite.x, this.gameObjects[0].sprite.x + width * 2),
          height / 4),
        1,
        width / 8
      );
      if (!ignorePos) {
        for (let enemy of this.gameObjects) {
          while (
            numbersEqualWithinBounds(
              proposedEnemy.pos.x,
              enemy.pos.x,
              75 + proposedEnemy.range
            )
          ) {
            proposedEnemy.pos.x += 75 + proposedEnemy.range;
          }
        }
      }
      this.gameObjects.push(proposedEnemy);
    }
  }
  update() {
    if (this.autoscroll && this.gameObjects[0].keys.length == 0) {
      if (this.gameObjects[0].sprite.velocity.x > 1) {
        this.gameObjects[0].sprite.velocity.x -= 0.1;
      } else if (this.gameObjects[0].sprite.velocity.x < 1) {
        this.gameObjects[0].sprite.velocity.x += 0.5;
      }
    }
    camera.x = this.gameObjects[0].sprite.x + width / 5;
    this.checkEventTimer();

    if (!this.eventRunning) {
      if (!this.gameObjects[0].killed) {
        for (let enemy of this.gameObjects) {
          enemy.update(this);
        }
        this.gameObjects[0].update(this);
      }
    } else {
      if (!this.gameObjects[0].killed) {
        this.currentEvent.update(this);
      }
    }
  }
  display() {

  }
  registerEvent(event) {
    if (event.name != null) {
      var nameUsed = false;
      for (let checkEvent of this.timeBasedEvents) {
        if (checkEvent.name == event.name) {
          nameUsed = true;
        }
      }
      if (!nameUsed) {
        this.timeBasedEvents.push(event);
        console.log(`Successfully registered ${event.name} event`);
      } else {
        console.error(
          "This event's name has been taken or the event has already been registered. Cannot register."
        );
      }
    } else {
      console.error("Event name cannot be null! Cannot register.");
    }
  }
  checkEventTimer() {
    if (millis() - this.startTime >= 10000) {
      if (this.eventRunning) {
        console.log("event stopping");
        this.currentEvent.reset(this);
        this.eventRunning = false;
        this.currentEvent = null;
        this.startTime = millis();
        this.onEventChange();
      } else {
        if (!this.gameObjects[0].killed) {
          console.log("event running");
          this.currentEvent = random(this.timeBasedEvents);
          this.currentEvent.startTime = millis();
          console.log(this.currentEvent.name);
          if (this.currentEvent.activate) {
            this.currentEvent.activate(this);
          }
          this.eventRunning = true;
          this.startTime = millis();
          this.onEventChange();
        }
      }
    }
  }
  restart() {
    this.eventRunning = false;
    if (this.currentEvent != null) {
      this.currentEvent.reset(this);
    }
    for (let obj of this.gameObjects) {
      if (obj.type != "player") obj.sprite.remove();
    }
    this.gameObjects[0].reset();
    this.gameObjects = [this.gameObjects[0]];
    this.createEnemies(3);
    this.createAirborne(3);

    this.currentEvent = null;

    this.startTime = millis();
    this.onEventChange = () => { };
  }
}
