/*************  ✨ Codeium Command ⭐  *************/
/**
 * Initializes and starts the Snake game when the window is loaded.
 * Sets up the game canvas, initializes game objects, and begins 
 * the game loop. Handles keypress events to control the snake's 
 * direction and restart the game. Displays high scores and manages 
 * game state transitions such as game over.
 */
/******  0b764c6b-3cb3-4147-8aa6-1b143b0c7074  *******/
window.onload = function() {
    var canvasWidth = window.innerWidth > 900 ? 900 : window.innerWidth * 0.9;
    var canvasHeight = window.innerHeight > 700 ? 700 : window.innerHeight * 0.7;
    var blockSize = 20;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = Math.floor(canvasWidth / blockSize);
    var heightInBlocks = Math.floor(canvasHeight / blockSize);
    var score;
    var timeout;

    init();

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Initializes the game environment by setting up the canvas 
 * and its properties, creating the snake and apple objects, 
 * and starting the game loop. Displays high scores on the screen.
 */
/******  1bb4feee-1f47-4e97-a9a8-58992e417869  *******/
    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "20px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
    
        displayHighScores();
    
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                if (score % 5 === 0) {
                    delay *= 0.9;
                }
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120);
        ctx.restore();

        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    function displayHighScores() {
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        let scoreBoard = document.createElement('div');
        scoreBoard.innerHTML = '<h2>High Scores</h2>' + highScores.join('<br>');
        scoreBoard.style.position = 'sticky';  // Test pour le rendre visible
        scoreBoard.style.top = '10px';
        scoreBoard.style.left = '10px';
        scoreBoard.style.backgroundColor = '#fff';
        scoreBoard.style.padding = '10px';
        document.body.appendChild(scoreBoard);
    }

    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        delay = 100;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.positionsSet = new Set(body.map(block => block.toString()));

        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left": nextPosition[0] -= 1; break;
                case "right": nextPosition[0] += 1; break;
                case "down": nextPosition[1] += 1; break;
                case "up": nextPosition[1] -= 1; break;
                default: throw("invalid Direction");
            }

            this.body.unshift(nextPosition);
            this.positionsSet.add(nextPosition.toString());

            if (!this.ateApple) {
                const removed = this.body.pop();
                this.positionsSet.delete(removed.toString());
            } else {
                this.ateApple = false;
            }
        };

        this.setDirection = function(newDirection) {
            var allowedDirection;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default: throw("invalid Direction");
            }
            if (allowedDirection.includes(newDirection)) {
                this.direction = newDirection;
            }
        };

        this.checkCollision = function() {
            var head = this.body[0];
            if (head[0] < 0 || head[1] < 0 || head[0] >= widthInBlocks || head[1] >= heightInBlocks) {
                return true;
            }
            return this.positionsSet.size !== this.body.length;
        };

        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
        };
    }

    function Apple(position) {
        this.position = position;

        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function() {
            this.position = [getRandomPosition(widthInBlocks), getRandomPosition(heightInBlocks)];
        };

        this.isOnSnake = function(snakeToCheck) {
            return snakeToCheck.positionsSet.has(this.position.toString());
        };
    }

    function getRandomPosition(max) {
        return Math.floor(Math.random() * max);
    }

    document.addEventListener("keydown", function handleKeyDown(e) {
        var newDirection;
        switch (e.keyCode) {
            case 37: newDirection = "left"; break;
            case 38: newDirection = "up"; break;
            case 39: newDirection = "right"; break;
            case 40: newDirection = "down"; break;
            case 32: restart(); return;
            default: return;
        }
        snakee.setDirection(newDirection);
    });
};
