# Chaos Run custom events
### Chaos Run uses an Events system as its core gameplay mechanic. Events can be things like acid rain falling down that you need to seek cover for, or icicles falling down that you need to dodge. Chaos Run was built with extensibility in mind, making it easier than ever for anybody to add their own, fully custom events.

## Table of Contents
- [Event Basics](#event-basics)
- [Getting Started](#getting-started)
- [Classes & Types](#classes--types)
  - [GameWorld](#gameworld)
  - [Dynamic](#dynamic)
    - [DynamicCreature](#dynamiccreature)

## Event Basics
### Event Classes
Once the player starts playing Chaos Run, every x seconds, an event will happen. Events are defined completely independantly from the rest of the game, meaning that adding an event **does not require you to touch any game code** (except for registering your event with the game). Events in Chaos Run are classes which are only initialized once, requiring some special code:
- Events need a `name` property. This is the name of the event which will be shown to the player.
- Events need an `update(gameWorld)` function. This function is called every frame, and `gameWorld` contains literally everything you need to know about the current game state. To learn more about `gameWorld`, read [the World docs](https://google.com).
- Optionally, Events can have an `activate(gameWorld)` function which is called the frame before the event is actually triggered. This could be used for creating sprites, choosing random values, etc.
- Events must also have a `reset(gameWorld)` function. This function is used to restore values to their defaults, remove sprites, etc. This function is necessary because the game does not reinitialize your event class. The class is used for the duration of gameplay.
- Events are also given a `startTime` property, which includes the time (in Unix millis) that the event started. To get the time elapsed since the event started, you can do `millis() - this.startTime`. **You do not need to define this property yourself, the game does this for you**.
- Events are also given a `runtime` property, which includes the length of time (in Unix millis) that the event will run. **You do not need to define this property yourself, the game does this for you**.

Your event class should conform to `Event`, but there technically isn't anything enforcing that.

### Event Lifecycle

When your event is randomly chosen, Chaos Run does a few things to prepare to hand control over to you:
1. First, Chaos Run injects the `startTime` and `runtime` properties into your event. This is done before any code from your event is used, so you can rest assured that those properties **will always be available to you**.
2. If your event has an `activate(gameWorld)` function, that function is called.
3. Then, the game hands control over to you

It is important to note that when your event is active, **you are in control of the entire game**, including basic housekeeping tasks like updating objects. All objects (players, enemies, etc.) need to be updated **every frame**. The code for this is very simple. In your `update(gameWorld)` function, place the following code:
```js
    for (let obj of gameWorld.gameObjects) {
        obj.update(gameWorld)
    }
```
and then objects will update! Without this code, whenever your event starts, all objects (including the player) will be completely motionless and uncontrollable. That may be what you want your event to do, though! If so, do not include this code or wrap it in a conditional.

Right now, events run for 12.5 seconds, but that is subject to change. **Please use the `runtime` property, do NOT hardcode that value**.

When that 12.5 seconds is up, your event's `reset(gameWorld)` function is called, and you **must** remove any sprites you created and reset any values you changed.

## Getting Started
Making a custom event is extremely simple. Here is a step-by-step guide *with code samples* to get you started. In this guide, we're going to make an event that causes an "earthquake" to happen by shaking the camera and inverting the controls.

### Creating the class
We're going to get started by creating the class for the event. Here's that code:
```js
class EarthquakeEvent extends Event /*<--- extends Event not required but recommended*/ {
    constructor() {
        super() /*<--- only necessary if extending Event*/
        this.name = "Earthquake" /*<--- shown to the user*/
    }
    activate(gameWorld) {}
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld)
        }
    }
    reset(gameWorld) {}
}
```
This class contains none of our event code, yet. Here's what this code does:
- Creates a class called EarthquakeEvent
- Calls the event "Earthquake" (this name is shown to the user when the event is triggered)
- Creates "stub" functions in-place of our actual code, which we have not written yet. The `update(gameWorld)` function contains code which updates our objects. Read [Event Basics](#event-basics) to learn more about that.

### Flipping Controls
The main part of our event is that our controls are going to be flipped. Meaning that if, for instance, the user presses the `d` key, they'll go left instead of right, and vice-versa. This may sound complicatd, but it's actually very simple.

Let's start by creating a function called `flipControls(gameWorld)`:
```js
    // class EarthquakeEvent extends Event { etc...
    flipControls(gameWorld) {
        this.controlsFlipped = !this.controlsFlippsed

        let player = gameWorld.gameObjects[0] // the player is always index 0
        let playerRunLeft = player.runLeftState
        let playerRunRight = player.runRightState
        
        player.runLeftState = playerRunRight
        player.runRightState = player.runLeftState
    }
    //}
```

This function may look complicated, but we should explain how player controls work in Chaos Run. In Chaos Run, player movement is managed by 2 states (`runLeftState` and `runRightState`). Flipping these two makes it so that whenever the code which reads user input tries to make the player run right, the player will actually run left because the `runLeftState` is being used instead. TL;DR: we're not actually flipping the *controls*, but rather *the direction the player moves*.

We're also keeping track of whether or not the controls are flipped so that we can un-flip them in the `reset(gameWorld)` function if they're flipped. Place this code in the constructor:
```js
this.controlsFlipped = false
```

And finally, place the following code into `activate(gameWorld)`:
```js
    this.flipControls(gameWorld)
```

Now, whenever the event is started, the player's controls will be flipped. But we may need to unflip them when the event ends! In the `reset(gameWorld)` function, check if the controls are flipped and if so, flip them one more time so that they're back to normal:
```js
    reset(gameWorld) {
        if (this.controlsFlipped) {
            this.flipControls(gameWorld)
        }
    }
```
Here is the final code for this chapter:
```js
class EarthquakeEvent extends Event {
    constructor() {
        super() 
        this.name = "Earthquake"
        this.flippedControls = false
    }
    activate(gameWorld) {
        this.flipControls(gameWorld)
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld)
        }
    }
    reset(gameWorld) {
        if (this.controlsFlipped) {
            this.flipControls(gameWorld)
        }
    }
    flipControls(gameWorld) {
        this.controlsFlipped = !this.controlsFlippsed

        let player = gameWorld.gameObjects[0] // the player is always index 0
        let playerRunLeft = player.runLeftState
        let playerRunRight = player.runRightState
        
        player.runLeftState = playerRunRight
        player.runRightState = player.runLeftState
    }
}
```
### Camera Shake
Chaos Run uses [p5.play](https://p5play.org/) as a game engine on top of p5.js. p5play provides a global `camera` object to control the camera. `camera` has many [useful properties](https://p5play.org/docs/Camera.html), but for this, we want to focus on `camera.x`, a property which lets you read and set the camera's x position. This makes it extremely easy to add camera shake. In your event's `update(gameWorld)` function, after the object update code, write the following:
```js
camera.x += random(-1, 1)
```
This code randomly shakes the camera. That's literally it.

Here is the final code for this chapter:
```js
class EarthquakeEvent extends Event {
    constructor() {
        super() 
        this.name = "Earthquake"
        this.flippedControls = false
    }
    activate(gameWorld) {
        this.flipControls(gameWorld)
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld)
        }
        camera.x += random(-1, 1)
    }
    reset(gameWorld) {
        if (this.controlsFlipped) {
            this.flipControls(gameWorld)
        }
    }
    flipControls(gameWorld) {
        this.controlsFlipped = !this.controlsFlippsed

        let player = gameWorld.gameObjects[0] // the player is always index 0
        let playerRunLeft = player.runLeftState
        let playerRunRight = player.runRightState
        
        player.runLeftState = playerRunRight
        player.runRightState = player.runLeftState
    }
}
```

### Finishing Touches

Let's add a bit more challenge to this event! What if we flipped the controls every few seconds rather than just once? That's pretty simple, thanks to `startTime`!

Chaos Run provides a helper function called `numbersEqualWithinBounds`:
```js
function numbersEqualWithinBounds(num1, num2, bounds)
```
This function checks if `num1` and `num2` are equal within a range (`bounds`). For instance, `numbersEqualWithinBounds(10, 50, 100)` returns true, because 50 - 10 is within 100.

This is important because of some time inaccuracies. For instance, to check if 2 seconds has passed, you'd expect something like this:
```js
if (millis() - this.startTime % 2000 == 0) {
    //2 seconds has passed
}
```
But, the next frame & `update` function might not be called on the exact millisecond that 2 seconds has passed, so you have to use `numbersEqualWithinBounds`.

Here's what the above code snippet would look like using `numbersEqualWithinBounds`:
```js
if (numbersEqualWithinBounds(millis() - this.startTime % 2000, 0, 100)) {
    //2 seconds (give or take) has passed
}
```

With this approach, you do sacrifice some accuracy, but the code becomes a lot more reliable, so we're going to use this approach.

The code for this is very simple, since we put `flipControls` into its own function.

Put this code anywhere in your `update` function:
```js
// update(gameWorld) {
    // prev code ...
    if (numbersEqualWithinBounds(millis() - this.startTime % 2000, 0, 100)) {
        this.flipControls(gameWorld)
    }
//}
```
That's literally it! You've made your own event. Here is the final code for this chapter:
```js
class EarthquakeEvent extends Event {
    constructor() {
        super() 
        this.name = "Earthquake"
        this.flippedControls = false
    }
    activate(gameWorld) {
        this.flipControls(gameWorld)
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld)
        }
        camera.x += random(-1, 1)
        if (numbersEqualWithinBounds(millis() - this.startTime % 2000, 0, 100)) {
            this.flipControls(gameWorld)
        }
    }
    reset(gameWorld) {
        if (this.controlsFlipped) {
            this.flipControls(gameWorld)
        }
    }
    flipControls(gameWorld) {
        this.controlsFlipped = !this.controlsFlippsed

        let player = gameWorld.gameObjects[0] // the player is always index 0
        let playerRunLeft = player.runLeftState
        let playerRunRight = player.runRightState
        
        player.runLeftState = playerRunRight
        player.runRightState = player.runLeftState
    }
}
```

### Registering your Event
So, you've made your event. Congrats! But, if you play the game, your event won't ever run. This is because the game doesn't know about your event, yet. To tell the game about your event, you need to *register* it.

The code for this is very simple. Open `sketch.js` and **anywhere** in the `setup()` function, type:
```js
    gameWorld.registerEvent(new EarthquakeEvent())
```
and then run the game! If you still can't get your event to trigger, temporarily comment out all of the other `registerEvent` calls. 

If you get any errors like `"EarthquakeEvent is not defined"`, make sure you import the class in the `index.html` file:
```html
    <script src="/path/to/EarthquakeEvent.js"></script>
    <!--<script src="./sketch.js"></script>-->
```

## Classes & Types

### GameWorld
GameWorld is the class that contains all info about the current state of the game. This is the class that is passed into your events with `gameWorld`. GameWorld contains the following properties & functions:

**Properties**:
- `gameObjects` **[Dynamic]**
  - gameObjects contains all objects in the game (player, enemies).
  - The current player is **always** gameObjects[0]
  - To read more about game objects, explore [Dynamic & Others]()
- `timeBasedEvents` **[Event]** - **Private**
  - This is an internal array of events. Please **do not directly modify this array**! To register your event, use `registerEvent(event)` instead.
- `currentEvent` **Event** - **Private**
  - This variable holds the currently active event, and is `null` when there is no event.
  - **Never modify this variable!** You may read from it if necessary.
- `eventRunning` **Bool** - **Private**
  - This is a simple boolean value that is true if there is an active event and false if there is no active event.
  - **Never modify this variable!** You may read from it if necessary.
- `startTime` **Number (millis)** - **Private**
  - This variable is used to keep track of when to trigger and stop events.
  - **Never modify this variable!** You should never have to read from this, but you can if necessary.
- `autoscroll` **Bool**
  - This variable controls whether or not autoscroll is enabled. If enabled, the camera will continuously move to the right.
  - You may read from AND modify this variable if necessary, but **reset it to its original value when you're done with it.**
- `eventRuntime` **Number (millis)** - **Private**
  - This is the length of time that events run for.
  - **Never modify this variable!** You should never have to read from it either, please use `this.runtime` in your events instead.
- `eventBreaktime` **Number (millis)** - **Private**
  - This is the length of time between events.
  - **Never modify this variable!** You should never have to read from it either, but you can if necessary.

**Functions**:
- `createEnemies(count, ignorePos)`
  - This function spawns `count` enemies, evenly distributing between each type of enemy.
  - If `ignorePos` is true, the enemies will spawn anywhere on the level, including potentially **right in front of the player**. If false, enemies will spawn at least 75px away from the player.
  - This function evenly distributes between each type of enemy. For instance, as of writing there are 2 enemies (airborne & proto). If `count` is 4, 2 proto and 2 airborne will be spawned. If `count` if 10, 5 proto and 5 airborne will be spawned. If `count` is not divisible by the # of types of enemies or if count is less than the # of types of enemies, a random distribution of enemies will be spawned.
- `createProto(count, ignorePos)`
  - This function spanws `count` Proto enemies
  - If `ignorePos` is true, the enemies will spawn anywhere on the level, including potentially **right in front of the player**. If false, enemies will spawn at least 75px away from the player.
- `createAirborne(count, ignorePos)`
  - This function spawns `count` Airborne enemies
  - If `ignorePos` is true, the enemies will spawn anywhere on the level, including potentially **right in front of the player**. If false, enemies will spawn at least 75px away from the player.
- `update()` **Private**
  - This function either updates all game objects OR calls your event's update function depending on whether or not an event is running.
  - **Never EVER call this function from your event**! You will overflow the stack & destroy everything.
- `registerEvent(event)`
  - This function registers your event with the game. It checks that your event meets the following criteria:
    - Event has a name
    - Event name hasn't been taken
    - Event `reset(gameWorld)` function works properly.
- `checkEventTimer()` **Private**
  - This function runs every frame and checks if an event should be terminated or started.
  - **Never call this function from your event!** You won't break anything, but it'll be a huge performance killer.
- `restart()`
  - This function resets the game and game objects to their initial states.
  - You probably shouldn't ever call this function from within your code, as this function is called when the player is dead and they press the "Replay?" button.

### Dynamic
- `constructor(type, pos, vel, dVD, dVM, friendly)`

Dynamic is the base class of all game objects. Every object in GameWorld's `gameObjects` property conforms to this class. Here are some properties & functions in this class:

**Properties**
- `pos` **p5.Vector** **DEPRECATED (please use `sprite.x` and `sprite.y` instead**)
  - This property contains the `x` and `y` position of the object
- `vel` **p5.Vector** **DEPRECATED (please use `sprite.velocity` instead**)
  - This property contains the `x` and `y` velocities of the object
- `dynamicVsDynamic` **Bool**
  - Controls whether or not the object collides with other dynamic objects
- `dynamicVsMap` **Bool**
  - Controls whether or not the object colides with the map.
- `friendly` **Bool**
  - Controls whether or not the object is friendly towards other dynamics.
- `type` **String**
  - The type of the dynamic (examples: "player" "airborne" "proto")
- `size` **Number**
  - The size (in px) of the object.
- `sprite` **p5play.Sprite**
  - The sprite of the object [(learn more)](https://p5play.org/learn/sprite.html)

**Functions**
- `update(gameWorld)`
  - This function updates the object & ensures it responds to all outside events
- `display()` **DEPRECATED**
  - This function would've displayed the object's sprite *before we moved to p5.play*. Now, it does nothing.
- `interact()` **UNIMPLEMENTED**
  - This function does nothing for now.

### DynamicCreature
- `constructor(type, pos, vel, dVD, dVM, friendly, health, defaultState)`

DynamicCreature is a superset of Dynamic that's specifically geared towards entities. Here are the properties & functions:

**Properties**:
- `health` **Number**
  - (mostly unused) The health of the creature
- `maxHealth` **Number**
  - The maximum health of the creature
  - **DO NOT MODIFY THIS VARIABLE!** You may read from it.
- `jumpStrength` **Number**
  - The jump strength of the creature
- `killed` **Bool**
  - Whether or not the creature is killed
- `fsm` **FSM**
  - The FSM (Finite State Machine) controls the various states of the creature. The FSM contains the following states by default:
    - `idleState` **IdleState** - The idle state (does nothing)
    - `jumpState` **JumpState** - The jump state (applies jump force to creature)
    - `fallState` **FallState** - The fall state (applies downward force to creature, intended to be used after the jump state)
  - You should **never need to modify the FSM**, but if you do, please do not modify it directly and instead use the functions. (docs soon)

**Functions**:
- `update(gameWorld)`
  - This function updates the object & ensures it responds to all outside events
  - NOTE: if you're making your own DynamicCreature, **make sure to call `this.fsm.update()` in your update function.**
- `display()` **DEPRECATED**
  - This function would've displayed the object's sprite *before we moved to p5.play*. Now, it does nothing.
- `interact()` **UNIMPLEMENTED**
  - This function does nothing for now.