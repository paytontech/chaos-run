class World {
  constructor(player, autoscroll, replay, replaySeed) {
    this.gameObjects = [player];
    this.playerStates = [];
    this.timeBasedEvents = [];
    this.currentEvent = null;
    this.eventRunning = false;
    this.startTime = millis() - 2000;
    this.onEventChange = () => { };
    this.createEnemies(10, false);
    this.autoscroll = autoscroll;
    this.replay = replay;
    if (replay) {
      randomSeed(replaySeed);
    }
    this.eventRuntime = 12500;
    this.eventBreaktime = 3500;
  }
  createEnemies(count, ignorePos) {
    let enemyFunctions = ["this.createProto", "this.createAirborne"];
    if (count % enemyFunctions.length == 0) {
      let iterations = count / enemyFunctions.length;
      console.log(iterations);
      for (let enemyFuncI = 0; enemyFuncI < enemyFunctions.length; enemyFuncI++) {
        // enemyFunctions[enemyFuncI](iterations, ignorePos);
        let evalString = `${enemyFunctions[enemyFuncI]}(${iterations}, ${ignorePos})`;
        //eval necessary because having a regular array of just [this.createProto, (etc)] makes the scope of this.createProto the array. meaning that if createProto calls `this`, it returns the array instead of World. fun!
        // console.log(evalString);
        eval(evalString);
      }
    } else {
      if (count < enemyFunctions.length) {
        let evalString = `${enemyFunctions[0]}(${count}, ${ignorePos})`;
        eval(evalString);
      } else {
        let iterations = count / enemyFunctions.length;
        iterations = Math.ceil(iterations);
        for (let enemyFuncI = 0; enemyFuncI < enemyFunctions.length; enemyFuncI++) {
          // enemyFunctions[enemyFuncI](iterations, ignorePos);
          let evalString = `${enemyFunctions[enemyFuncI]}(${iterations}, ${ignorePos})`;
          eval(evalString);
        }
      }
    }
  }
  createProto(count, ignorePos) {
    console.log("create proto");
    for (let i = 0; i < count; i++) {
      var proposedEnemy = new ProtoEnemy(
        random(this.gameObjects[0].sprite.x, this.gameObjects[0].sprite.x + (width * 2)),
        height / 1.5,
        1,
        200 + random(0, 100)
      );
      console.log(proposedEnemy.pos.x);
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
    if (!this.replay) {
      let playerCopy = this.gameObjects[0];
      this.playerStates.push(playerCopy);
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
        console.info(`Successfully registered ${event.name} event`);

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
    if (this.eventRunning) {
      if (millis() - this.startTime >= this.eventRuntime) {
        this.currentEvent.reset(this);
        this.eventRunning = false;
        this.currentEvent = null;
        this.startTime = millis();
        this.onEventChange();
      }
    } else {
      if (millis() - this.startTime >= this.eventBreaktime) {
        if (!this.gameObjects[0].killed) {
          this.currentEvent = random(this.timeBasedEvents);
          this.currentEvent.startTime = millis();
          this.currentEvent.runtime = this.eventRuntime;
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
    console.log("restarting");
    this.eventRunning = false;
    if (this.currentEvent != null) {
      this.currentEvent.reset(this);
    }
    for (let obj of this.gameObjects) {
      if (obj.type != "player") obj.kill();
      if (obj.type != "player") obj.sprite.remove();
    }
    this.gameObjects[0].reset();
    this.gameObjects = [this.gameObjects[0]];
    this.createEnemies(5);

    this.currentEvent = null;

    this.startTime = millis() - 2000;
    this.onEventChange = () => { };
  }
}
