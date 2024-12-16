const boardWidth = 500;
const boardHeight = 500;
const playerWidth = 10;
const playerHeight = 50;
const playerSpeed = 5;

// Modificat: augmentem la velocitat de la pilota
const ballSpeedX = 3; // velocitat de la pilota en la direcció X
const ballSpeedY = 4; // velocitat de la pilota en la direcció Y

// Modificat: augmentem la mida de la pilota
const ballWidth = 15; // ampliem la mida de la pilota
const ballHeight = 15; // ampliem la mida de la pilota

let board;
let context;

let player1 = {
    x: 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballSpeedX,
    velocityY: ballSpeedY
};

let player1Score = 0;
let player2Score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);

    requestAnimationFrame(update);
};

function update() {
    context.clearRect(0, 0, board.width, board.height);

    updatePlayer(player1);
    updatePlayer(player2);
    updateBall();

    drawCenterLine();

    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(player1Score, boardWidth / 4, 30);
    context.fillText(player2Score, (boardWidth / 4) * 3, 30);

    requestAnimationFrame(update);
}

function updatePlayer(player) {
    let nextY = player.y + player.velocityY;
    if (!outOfBounds(nextY)) {
        player.y = nextY;
    }

    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);
}

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
        ball.velocityY *= -1;
    }

    if (detectCollision(ball, player1) && ball.velocityX < 0) {
        ball.velocityX *= -1;
    }
    if (detectCollision(ball, player2) && ball.velocityX > 0) {
        ball.velocityX *= -1;
    }

    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    } else if (ball.x + ball.width > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    context.fillStyle = "green";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function movePlayer(event) {
    if (event.code === "KeyW") player1.velocityY = -playerSpeed;
    else if (event.code === "KeyS") player1.velocityY = playerSpeed;

    if (event.code === "ArrowUp") player2.velocityY = -playerSpeed;
    else if (event.code === "ArrowDown") player2.velocityY = playerSpeed;
}

function stopPlayer(event) {
    if (event.code === "KeyW" || event.code === "KeyS") player1.velocityY = 0;
    if (event.code === "ArrowUp" || event.code === "ArrowDown") player2.velocityY = 0;
}

function drawCenterLine() {
    context.fillStyle = "white";
    for (let i = 0; i < boardHeight; i += 20) {
        context.fillRect(boardWidth / 2 - 2, i, 4, 10);
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function outOfBounds(y) {
    return y < 0 || y + playerHeight > boardHeight;
}

function resetGame(direction) {
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ball.width,
        height: ball.height,
        velocityX: direction * 3, // mantenir la velocitat horitzontal més consistent
        velocityY: 3  // mantenir la velocitat vertical constant
    };
}
