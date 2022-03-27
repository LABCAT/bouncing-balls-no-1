import BouncingBall from './BouncingBall.js';

export default class NaturalBouncingBall extends BouncingBall {

    constructor(p5, xPos, yPos, zPos, size, speed, direction, fillHue, strokeHue, canShrink = true ) {
        super(p5, xPos, yPos, zPos, size, speed, direction, fillHue, strokeHue, canShrink);
    }

    draw() {
        super.draw();

        if(['left', 'right'].includes(this.direction)) {
            if(['left'].includes(this.direction)) {
                this.xPos = this.xPos - (this.xSpeed * this.xDirection);  
            }
            else {
                this.xPos = this.xPos + (this.xSpeed * this.xDirection);  
            }

            this.yPos = this.yPos + (this.ySpeed * this.yDirection);

            if (this.yPos > this.bottomBounds + (this.size * 2)) {
                this.yDirection =- 1;
            }

            if (this.yPos < this.topBounds - this.size) {
                this.yDirection =+ 1;
            }

            this.topBounds = this.topBounds * this.p.random(0.9, 0.99);
        }

    }
}