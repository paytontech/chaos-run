class WorldBackground {
    constructor(gameWorld, imgs, rangePerImg) {
        this.imgs = imgs;
        this.gameWorld = gameWorld;
        this.bg = imgs[0];
        this.posX = 0;
        this.rangePerImg = rangePerImg;
        this.floor = new Sprite();
        this.floor.x = width / 2;
        this.floor.y = height / 1.34;
        this.floor.collider = "s";
        this.floor.h = 25;
        this.floor.w = width * 8;
        this.floor.visible = false;
        this.lastCameraX = camera.x;
        this.lastCameraY = camera.y;
        this.posY = 0;
        this.cameraDelta = 0;
    }

    getBG() {
        var imgIndex = 0;
        imgIndex = ~~(this.gameWorld.xOffset / this.rangePerImg);
        if (imgIndex < 0) {
            imgIndex = -imgIndex;
        }
        if (imgIndex > this.imgs.length - 1) {
            imgIndex = this.imgs.length - 1;
        }
        this.bg = this.imgs[imgIndex];
    }

    paintBG() {
        this.getBG();
        this.posX -= camera.x - this.lastCameraX;
        this.posY -= camera.y - this.lastCameraY;
        this.cameraDelta -= camera.y - this.lastCameraY;
        this.lastCameraX = camera.x;
        this.lastCameraY = camera.y;

        //TODO refactor this mess!
        image(this.bg, this.posX - width, this.posY, width, height);
        image(floorImg, this.posX - width, height / 1.4 + this.cameraDelta, width, 25);
        image(this.bg, this.posX, this.posY, width, height);
        image(floorImg, this.posX, height / 1.4 + this.cameraDelta, width, 25);
        image(this.bg, this.posX + width, this.posY, width, height);
        image(floorImg, this.posX + width, height / 1.4 + this.cameraDelta, width, 25);
        image(this.bg, this.posX, this.posY - height, width, height);
        image(this.bg, this.posX, this.posY + height, width, height);
        image(this.bg, this.posX - width, this.posY - height, width, height);
        image(this.bg, this.posX + width, this.posY + height, width, height);
        image(this.bg, this.posX + width, this.posY - height, width, height);
        image(this.bg, this.posX - width, this.posY + height, width, height);

        if (this.posX <= -width) {
            this.posX = 0;
            this.floor.x += width;
            if (this.gameWorld.gameObjects[0].sprite.x > width * 2) {
                this.gameWorld.createEnemies(2, false);
            }
        }
        if (this.posX > width) {
            this.posX = 0;
            this.floor.x -= width;

        }
        if (this.posY >= height) {
            this.posY = 0;
        }
        if (this.posY < -height) {
            this.posY = 0;
        }
    }
}