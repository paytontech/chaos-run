class ProgressBar {
    constructor(value, maxValue, maxWidth, maxHeight, bgColor, fgColor) {
        this.value = value;
        this.barWidth = map(value, 0, maxValue, 0, maxWidth);
        this.maxValue = maxValue;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
        this.bgColor = bgColor;
        this.fgColor = fgColor;
    }
    render(pos, maxWidth) {
        push();
        textAlign(CENTER);
        rectMode(CORNER);
        noStroke();
        fill(this.bgColor);
        rect(pos.x, pos.y, this.maxWidth, this.maxHeight, 5);
        if (this.barWidth > 0) {
            fill(this.fgColor);
            rect(pos.x, pos.y, this.barWidth, this.maxHeight, 5);
        }
        pop();
    }
}