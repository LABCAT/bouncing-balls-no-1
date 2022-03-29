export default class BouncingBall {
    constructor(p5, xPos, yPos, zPos, size, speed, direction, fill, stroke, canShrink = true ) {
        this.p = p5;
        this.canDraw = true;

        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;

        this.size = size;
        this.direction = direction;
        this.fill = fill;
        this.stroke = stroke;
        this.canShrink = canShrink;

        this.xSpeed = speed;
        this.ySpeed = speed;
        this.zSpeed = speed;

        this.xDirection = 1;
        this.yDirection = 1;
        this.zDirection = 1;

        this.topBounds = -this.p.height / 2;
        this.bottomBounds = this.p.height / 2;
        this.leftBounds = -this.p.width / 2;
        this.rightBounds = this.p.width / 2;
        this.backBounds = -this.p.height / 2;
        this.frontBounds = this.p.height / 2;
    }

    draw() {
        if(this.canDraw) {
            this.p.translate (this.xPos, this.yPos, -this.zPos);
            this.p.ambientMaterial(this.fill);
            this.p.stroke(this.stroke);
            this.p.sphere(this.size);

            // motion setup
            if(['left-right', 'random'].includes(this.direction)) {
                this.xPos = this.xPos + (this.xSpeed * this.xDirection);  
            }
            
            if(['up-down', 'random'].includes(this.direction)) {
                this.yPos = this.yPos + (this.ySpeed * this.yDirection); 
            }
            
            if(['back-forth', 'random'].includes(this.direction)) {
                this.zPos = this.zPos + (this.zSpeed * this.zDirection);
            }

            if(['left-right', 'random'].includes(this.direction)) {
                if (this.xPos > this.rightBounds - this.size) {
                    this.xDirection =- 1;
                }

                if (this.xPos < this.leftBounds - this.size) {
                    this.xDirection =+ 1;
                }
            }

            if(['up-down', 'random'].includes(this.direction)) {
                if (this.yPos > this.bottomBounds - this.size) {
                    this.yDirection =- 1;
                }

                if (this.yPos < this.topBounds - this.size) {
                    this.yDirection =+ 1;
                }
            }

            if(['back-forth', 'random'].includes(this.direction)) {
                if (this.zPos > this.frontBounds) {
                    this.zDirection =- 1;
                }

                if (this.zPos < this.backBounds) {
                   this.zDirection =+ 1;
                }
            }
            
            if(this.canShrink) {
                this.size = this.size - 0.75;
                if(this.size <= 0) {
                    this.canDraw = false;
                }
            }

            this.p.translate (-this.xPos, -this.yPos, +this.zPos);
        }
    }
}