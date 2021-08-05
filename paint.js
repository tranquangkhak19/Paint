class paint {
    constructor(){
        this.canvas = document.getElementById('board');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.drawBackground();

        this.color = '#ff0000';
        this.tool = 'pen';//circle, rectangle, line
        this.lineWidth = 1;

        this.drawing = false;
        this.oldImage = null;
        this.newImage = null;


        this.currentPos = {
            x: 0,
            y: 0
        }

        //this properties for straight tool
        this.startPos = {
            x: 0,
            y: 0
        }


        //listen mouse event
        this.listenEvent();
        this.drawLine(10,10, 11, 11);
    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    mousedown(event){
        let mousePos = this.getMousePos(event);
        this.startPos = this.getMousePos(event);
        this.drawing = true;

        this.saveState();
    }

    mousemove(event){
        let mousePos = this.getMousePos(event);
        if(this.drawing){
            switch(this.tool){
                case 'pen': 
                    this.drawLine(this.currentPos, mousePos)
                    break;
                case 'straight':
                    this.undo();
                    this.drawLine(this.startPos, mousePos)
                    break;
                case 'rect':
                    this.undo();
                    this.drawRect(this.startPos, mousePos);
                    break;

            }
        }
        this.currentPos = mousePos;
    }

    mouseup(event){
        this.drawing = false;
        
    }   

    listenEvent(){
        this.canvas.addEventListener('mousedown', (event) => this.mousedown(event));
        this.canvas.addEventListener('mousemove', (event) => this.mousemove(event));
        this.canvas.addEventListener('mouseup', (event) => this.mouseup(event));
    }

    saveState(){
        this.oldImage = new Image;
        this.oldImage.src = this.canvas.toDataURL("image/bmp", 1.0);
    }

    undo(){
        //save new image
        this.newImage = new Image;
        this.newImage.src = this.canvas.toDataURL("image/bmp", 1.0);

        //draw old image
        this.ctx.drawImage(this.oldImage, 0, 0, 800, 500);
    }

    redo(){
        //draw new image
        this.ctx.drawImage(this.newImage, 0, 0, 800, 500);
    }

    drawBackground(){
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, 800, 500);
    }

    drawLine(startPos, endPos) {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.x, startPos.y);
        this.ctx.lineTo(endPos.x, endPos.y);
        this.ctx.stroke();
    }

    drawRect(startPos, endPos){
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.rect(startPos.x, startPos.y, endPos.x-startPos.x, endPos.y-startPos.y);
        this.ctx.stroke();
    }
}

var p = new paint();