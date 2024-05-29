document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 16;

    canvas.width = 640;
    canvas.height = 640;

    let count = 0;
    let speed = 4;
    let score = 0;

    let snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };

    let apple = {
        x: 320,
        y: 320
    };

    const scoreDisplay = document.getElementById('score');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('startButton');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function resetGame() {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 40) * grid;
        apple.y = getRandomInt(0, 40) * grid;

        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
    }

    function loop() {
        requestAnimationFrame(loop);

        if (++count < speed) {
            return;
        }

        count = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        // Check for collision with walls
        if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
            resetGame();
        }

        snake.cells.unshift({ x: snake.x, y: snake.y });

        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(apple.x + grid / 2, apple.y + grid / 2, grid / 2 - 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'green';
        snake.cells.forEach((cell, index) => {
            ctx.beginPath();
            ctx.arc(cell.x + grid / 2, cell.y + grid / 2, grid / 2 - 1, 0, Math.PI * 2);
            ctx.fill();

            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score += 5;
                scoreDisplay.textContent = 'Score: ' + score;
                apple.x = getRandomInt(0, 40) * grid;
                apple.y = getRandomInt(0, 40) * grid;
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    resetGame();
                }
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.which === 37 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        } else if (e.which === 38 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        } else if (e.which === 39 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        } else if (e.which === 40 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    });

    startButton.addEventListener('click', () => {
        const difficulty = difficultySelect.value;
        if (difficulty === 'easy') {
            speed = 10;
        } else if (difficulty === 'medium') {
            speed = 6;
        } else if (difficulty === 'hard') {
            speed = 4;
        }
        resetGame();
        requestAnimationFrame(loop);
    });
});
