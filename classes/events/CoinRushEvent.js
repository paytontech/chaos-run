class CoinRushEvent extends Event {
    constructor() {
        super();
        this.name = "Coin Rush";
    }
    activate(gameWorld) {
        this.coinsCollected = 0;
        this.coinsNeededToPass = 20;
        this.coins = [];
        this.genCoins(30);
    }
    update(gameWorld) {
        for (let obj of gameWorld.gameObjects) {
            obj.update(gameWorld);
        }
        for (let coin of this.coins) {
            coin.update(gameWorld);
        }
        if (((millis() - this.startTime / 1000) % 6) < 1) {
            if (this.coins.length < 200) {
                this.genCoins(5);
            }
        }
        text(`${this.coinsCollected}/${~~this.coinsNeededToPass}`, width - (width / 4), height / 2);
    }
    reset(gameWorld) {
        if (this.coinsCollected < this.coinsNeededToPass) {
            gameWorld.gameObjects[0].kill();
        }
        for (let coin of this.coins) {
            coin.sprite.remove();
        }
        this.coins = [];

    }
    genCoins(count) {
        for (let i = 0; i < count; i++) {
            let coin = new Coin(() => {
                this.coinsCollected += 1;
                let thisIndex = this.coins.indexOf(coin);
                // console.log(thisIndex);
                this.coins.splice(thisIndex, 1);
            });
            this.coins.push(coin);
        }
        this.coinsNeededToPass = this.coins.length / 4;
    }
}

class Coin {
    constructor(onCollected) {
        let sprite = new Sprite();
        sprite.x = random(-width + (camera.x - (width / 2)), width * 2 + (camera.x - (width / 2)));
        sprite.y = random(-50, -height);
        sprite.collider = "d";
        sprite.d = 30;
        sprite.color = 'yellow';
        this.sprite = sprite;
        this.onCollected = onCollected;
    }
    update(gameWorld) {
        if (this.sprite.collides(gameWorld.gameObjects[0].sprite)) {
            this.sprite.remove();
            this.onCollected();
        }
    }
}