export default class BouncingBall {
    constructor(p5, xPos, yPos, zPos, size, speed, direction, fillHue, strokeHue, canShrink = true ) {
        this.p = p5;
        this.canDraw = true;

        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;

        this.size = size;
        this.direction = direction;
        this.fillHue = fillHue;
        this.strokeHue = strokeHue;
        this.canShrink = canShrink;

        this.xSpeed = speed;
        this.ySpeed = speed;
        this.zSpeed = speed;

        this.xDirection = 1;
        this.yDirection = 1;
        this.zDirection = 1;
    }

    draw() {
        if(this.canDraw) {
            this.p.translate (this.xPos, this.yPos, -this.zPos);
            this.p.ambientMaterial(this.fillHue, 100, 100);
            this.p.fill(this.fillHue, 100, 100);
            this.p.stroke(this.strokeHue, 100, 100);
            // this.p.noStroke();
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
                if (this.xPos > ((this.p.width / 2) - 100)) {
                    this.xDirection =- 1;
                }

                if (this.xPos <  -((this.p.width / 2) - 100)) {
                    this.xDirection =+ 1;
                }
            }

            if(['up-down', 'random'].includes(this.direction)) {
                if (this.yPos > ((this.p.height / 2) - 100)) {
                    this.yDirection =- 1;
                }

                if (this.yPos < -((this.p.height / 2) - 100)) {
                    this.yDirection =+ 1;
                }
            }

            if(['back-forth', 'random'].includes(this.direction)) {
                if (this.zPos > (this.p.height / 2)) {
                    this.zDirection =- 1;
                }

                if (this.zPos < 0) {
                   this.zDirection =+ 1;
                }
            }
            
            if(this.canShrink) {
                this.size = this.size - 0.2;
                if(this.size <= 0) {
                    this.canDraw = false;
                }
            }

            this.p.translate (-this.xPos, -this.yPos, +this.zPos);
        }
    }
}