class WorldBackground {
    constructor(gameWorld, imgs, rangePerImg) {
        this.imgs = imgs;
        this.gameWorld = gameWorld;
        this.bg = imgs[0];
        this.posX = 0;
        this.rangePerImg = rangePerImg;
        this.lastCameraX = camera.x;
        this.lastCameraY = camera.y;
        this.posY = 0;
        this.cameraDelta = 0;
        let floors = new Group();
        floors.y = height / 1.4;
        floors.w = width;
        floors.h = 10;
        floors.collider = "s";
        floors.x = (i) => (i * width + (width / 2)) - width;
        floors.amount = 5;
        floors.img = floorImg;
        floors.img.width = width;
        floors.img.height = 10;
        this.floors = floors;
    }

    reset() {
        camera.x = 0;
        this.floors.removeAll();
        console.log(this.floors);
        let floors = new Group();
        floors.y = height / 1.4;
        floors.w = width;
        floors.h = 10;
        floors.collider = "s";
        floors.x = (i) => (i * width + (width / 2)) - width;
        floors.amount = 5;
        floors.img = floorImg;
        floors.img.width = width;
        floors.img.height = 10;
        this.floors = floors;
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
        for (let index in this.floors) {
            let floor = this.floors[index];
            if (floor.x + (floor.w / 2) <= camera.x - width / 2) {
                floor.x = (floor.w / 2) + width + (camera.x - width / 2);
                // gameWorld.createEnemies(4, false)
                gameWorld.createAirborne(2, false)
                gameWorld.createProto(2, false)
            } else if (floor.x - (floor.w / 2) >= camera.x + (width / 2)) {

                floor.x = (floor.w / 2) - width + (camera.x - (width / 2));
            }
        }
        //TODO refactor this mess!
        image(this.bg, this.posX - width, this.posY, width, height);
        image(this.bg, this.posX, this.posY, width, height);
        image(this.bg, this.posX + width, this.posY, width, height);
        image(this.bg, this.posX, this.posY - height, width, height);
        image(this.bg, this.posX, this.posY + height, width, height);
        image(this.bg, this.posX - width, this.posY - height, width, height);
        image(this.bg, this.posX + width, this.posY + height, width, height);
        image(this.bg, this.posX + width, this.posY - height, width, height);
        image(this.bg, this.posX - width, this.posY + height, width, height);

        if (this.posX <= -width) {
            this.posX = 0;
        }
        if (this.posX > width) {
            this.posX = 0;
        }
        if (this.posY >= height) {
            this.posY = 0;
        }
        if (this.posY < -height) {
            this.posY = 0;
        }
    }
}