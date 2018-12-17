export default class Map {


    constructor(container){
        this.height = 500;
        this.width = 500;
        this.container = container;
        this.canvas = '';
        this.ctx = '';
        this.position = {
            x: 0,
            y: 0
        }

        this.targetsPos = [];

        this.createCanvas();
        this.draw();

    }

    createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.canvas.style.height = this.height / 2 + 'px';
        this.canvas.style.width = this.width / 2 + 'px';
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '25px';
        this.canvas.style.right = '25px';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    draw(){
        this.background();
        this.myPosition();
        this.targets();

        requestAnimationFrame(this.draw.bind(this));
    }

    background(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.height, this.width);
        this.ctx.closePath();
    }

    myPosition(){
        this.ctx.fillStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.arc(this.xToCanvasCoords(this.position.x), this.yToCanvasCoords(this.position.y), 10, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    targets(){
        this.targetsPos.forEach((target) => {
            this.ctx.fillStyle = "#ff0000";
            this.ctx.beginPath();
            this.ctx.arc(this.xToCanvasCoords(-target.x / 300), this.yToCanvasCoords(target.y / 300), 10, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }

    xToCanvasCoords(i){
        return this.width / 2 + (this.width / 2) * i;
    }

    yToCanvasCoords(i){
        return this.height - this.height * i;
    }


}
