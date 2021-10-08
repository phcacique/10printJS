var gallery;
var s = 200;

window.onload = function () {
    gallery = new Gallery("main", 4);

    gallery.createPiece(10, 5, true);

    gallery.update();

    addEvents();
}

// Adding user interaction events
function addEvents(){
    document.getElementById("refresh").addEventListener("click", function (event) {
        event.preventDefault();
        gallery.update();
    });
    
    document.getElementById("prob").addEventListener("change", function (event) {
        event.preventDefault();
        for( var i=0; i<gallery.artPieces.length; i++){
            gallery.artPieces[i].prob = parseInt(document.getElementById("prob").value);
        }
        gallery.update();
    });
    
    document.getElementById("gridSize").addEventListener("change", function (event) {
        event.preventDefault();
        for( var i=0; i<gallery.artPieces.length; i++){
            gallery.artPieces[i].subdivisions = parseInt(document.getElementById("gridSize").value);
        }
        gallery.update();
    });
    
    document.getElementById("radio1").addEventListener("change", function (event) {
        event.preventDefault();
        toggleDirection()
    });
    
    document.getElementById("radio2").addEventListener("change", function (event) {
        event.preventDefault();
        toggleDirection()
    });
}

// Auxiliar function to get selection from radio buttons and refresh canvas
function toggleDirection(radio){
    var value = document.getElementById("radio1").checked;
    console.log(value);
    for( var i=0; i<gallery.artPieces.length; i++){
        gallery.artPieces[i].isDiagonal = !value
    }
    gallery.update();
}

// On window resize, update canvas
window.onresize = function (event) {
    gallery.update();
}

// Auxiliar function for getting a random int in a range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cartesian point
class Point {
    /**
     * @param {Number} x - coordinate on x axis
     * @param {Number} y - coordinate on y axis
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Line segment between two points
class Line {
    /**
     * @param {Point} x - origin point
     * @param {Point} y - destination point
     */
    constructor(p1, p2, color = "#000", lineWidth = 2) {
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.lineWidth = lineWidth
    }
}

// Piece of Art - based on the 10print algorithm
class ArtPiece {

    /**
     * @param {string} canvasID - ID of the target canvas on the HTML file
     * @param {string} frameID - ID of the frame image related to the canvas
     * @param {int} subdivision - Number of subdivisions of the grid
     * @param {int} prob - probability for changing line direction (from 0 to 10)
     * @param {boolean} isDiagonal - true for diagonals, and false for vertical/horizontal
     * @param {number} size - if setted, all canvases will have the same specified size
     */
    constructor(canvasID, frameID, subdivisions = 40, prob = 4, isDiagonal = false, size = null) {
        this.canvasID = canvasID;
        this.frameID = frameID;
        this.frameScale = 0.8;
        this.canvasSize;
        this.lines = [];
        this.isDiagonal = isDiagonal;
        this.subdivisions = subdivisions;
        this.prob = prob;
        this.setFrameSize(size);
    }

    init() {
        this.lines = [];
        var size = this.canvasSize / this.subdivisions;
        var posX = 0;
        var posY = 0;
        var p1, p2;

        for (var i = 0; i < this.subdivisions; i++) {
            for (var j = 0; j < this.subdivisions; j++) {
                var direction = getRandomInt(0, 10);
                if (this.isDiagonal) {
                    p1 = (direction < this.prob) ? new Point(posX * size, posY * size) : new Point(posX * size, posY * size + size);
                    p2 = (direction < this.prob) ? new Point(p1.x + size, p1.y + size) : new Point(p1.x + size, posY * size);
                } else {
                    p1 = (direction < this.prob) ? new Point(posX * size + size / 2, posY * size) : new Point(posX * size, posY * size + size / 2);
                    p2 = (direction < this.prob) ? new Point(p1.x, p1.y + size) : new Point(p1.x + size, p1.y);
                }

                var line = new Line(p1, p2, "#000", 1);

                this.lines.push(line);
                posY++;
            }
            posX++;
            posY = 0;
        }
    }

    resize(size) {
        this.setFrameSize(size);
        this.init();
    }

    setFrameSize(artSize) {
        var canvas = document.getElementById(this.canvasID);
        var frame = document.getElementById(this.frameID);
        var context = canvas.getContext('2d');

        var size = artSize

        size *= this.frameScale;
        size = Math.floor(size);
        frame.style.width = size + "px";
        frame.style.height = size + "px";

        var canvasScale = 0.6;
        this.canvasSize = Math.floor(size * canvasScale);
        canvas.style.width = this.canvasSize + "px";
        canvas.style.height = this.canvasSize + "px";

        var scale = window.devicePixelRatio;
        canvas.width = Math.floor(this.canvasSize * scale);
        canvas.height = Math.floor(this.canvasSize * scale);
        context.scale(scale, scale);

        var padding = (size - this.canvasSize) / 2;
        canvas.style.marginLeft = padding + "px";
        canvas.style.marginTop = padding + "px";

        var article = document.getElementById(this.frameID).parentElement;
        article.style.width = size + "px";
        article.style.height = size + "px";
    }

    draw() {
        var canvas = document.getElementById(this.canvasID);
        var context = canvas.getContext('2d');

        context.fillRect(0, 0, canvas.width, canvas.height);

        context.clearRect(0, 0, this.canvasSize, this.canvasSize);
        context.fillStyle = "#fafafa";
        context.fillRect(0, 0, this.canvasSize, this.canvasSize);
        for (var i = 0; i < this.lines.length; i++) {
            context.beginPath();
            context.strokeStyle = this.lines[i].color;
            context.lineWidth = this.lines[i].lineWidth;
            context.moveTo(this.lines[i].p1.x, this.lines[i].p1.y);
            context.lineTo(this.lines[i].p2.x, this.lines[i].p2.y);
            context.stroke();
        }
    }
}

class Gallery {
    /**
     * @param {string} galleryID - ID of the target element on the HTML file
     * @param {int} columns - max columns of canvases
     * @param {number} pieceSize - if setted, all canvases will have the same specified size
     */
    constructor(galleryID, columns = 3, pieceSize = null) {
        this.galleryID = galleryID;
        this.artPieces = [];
        this.columns = columns;
        this.pieceSize = pieceSize;
    }
    createPiece(subdivisions, prob, isDiagonal) {
        var num = this.artPieces.length
        this.createCanvas(num);
        var artPiece = new ArtPiece("canvas" + num, "frame" + num, subdivisions, prob, isDiagonal);
        this.artPieces.push(artPiece);
    }

    createCanvas(num) {
        document.getElementById(this.galleryID).innerHTML += "<article><canvas id='canvas" + num + "'></canvas><img class='frame' id='frame" + num + "' src='img/frame.png' alt='frame' /></article>";
    }

    update() {

        var size = Math.min(window.innerWidth,window.innerHeight);
        if (this.pieceSize == null) {
            if (this.artPieces.length < this.columns) {
                size /= this.artPieces.length;
            } else {
                size /= this.columns;
            }
        } else {
            size = this.pieceSize;
        }


        for (var i = 0; i < this.artPieces.length; i++) {
            this.artPieces[i].resize(size);
        }

        for (var i = 0; i < this.artPieces.length; i++) {
            this.artPieces[i].init();
            this.artPieces[i].draw();
        }
    }
}