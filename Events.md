# Chaos Run custom events
### Chaos Run uses an Events system as its core gameplay mechanic. Events can be things like acid rain falling down that you need to seek cover for, or icicles falling down that you need to dodge. Chaos Run was built with extensibility in mind, making it easier than ever for anybody to add their own, fully custom events.

## Table of Contents
- Event Basics
- Getting Started

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