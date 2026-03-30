var myGamePiece;
var myObstacles = [];
var myScore;
var gameSpeed = 3;
var frameInterval = 90;
var isGameOver = false;

function startGame() {
    myGamePiece = new component(30, 30, "assets/Android.svg", 40, 120, "image");
    myGamePiece.gravity = 0.1;
    myScore = new component("20px", "Consolas", "white", 800, 35, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1000;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
        isGameOver = true;
        this.context.font = "40px Consolas";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
        this.context.font = "20px Consolas";
        this.context.fillText("Press SPACE to Restart", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.context.textAlign = "left"; // reset
    }
}

function component(width, height, color, x, y, type) {
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Outer glow or border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBounds();
    }
    
    this.hitBounds = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    
    this.crashWith = function(otherobj) {
        // slightly forgiving collision bounds (-4px inner margin)
        var myleft = this.x + 4;
        var myright = this.x + (this.width) - 4;
        var mytop = this.y + 4;
        var mybottom = this.y + (this.height) - 4;
        
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    
    for (var i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    
    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    // Smooth speed progression
    if (gameSpeed < 12) {
        gameSpeed += 0.0015;
    }
    
    // Scale interval based on game speed to keep gap distance constant
    frameInterval = Math.max(30, Math.floor(250 / gameSpeed));
    
    if (myGameArea.frameNo == 1 || everyinterval(frameInterval)) {
        x = myGameArea.canvas.width;
        minHeight = 40;
        maxHeight = 220;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 85;
        maxGap = 160;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        
        // Vibrant neon green column
        myObstacles.push(new component(35, height, "#00ffaa", x, 0));
        myObstacles.push(new component(35, x - height - gap, "#00ffaa", x, height + gap));
    }
    
    for (var i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= gameSpeed;
        myObstacles[i].update();
    }
    
    // Clean up off-screen obstacles to avoid memory leak
    if (myObstacles.length > 0 && myObstacles[0].x < -50) {
        myObstacles.shift(); // remove top obstacle
        myObstacles.shift(); // remove bottom obstacle
    }
    
    myScore.text = "SCORE: " + Math.floor(myGameArea.frameNo / 10);
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 === 0) { return true; }
    return false;
}

function boostUp() {
    if (isGameOver) {
        window.location.reload();
        return;
    }
    myGamePiece.gravity = -0.15;
}

function boostDown() {
    myGamePiece.gravity = 0.1;
}