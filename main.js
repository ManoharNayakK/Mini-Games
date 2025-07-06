document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    showMenu();

    function showMenu() {
        app.innerHTML = `
            <h1>Game Menu</h1>
            <div class="menu">
                <button class="button" id="ttt-btn">Tic Tac Toe</button>
                <button class="button" id="snake-btn">Snake and Ladder</button>
                <button class="button" id="ludo-btn">Ludo</button>
                <button class="button" id="exit-btn">Exit</button>
            </div>
        `;
        document.getElementById("ttt-btn").onclick = showTicTacToe;
        document.getElementById("snake-btn").onclick = showSnakeAndLadder;
        document.getElementById("ludo-btn").onclick = showLudo;
        document.getElementById("exit-btn").onclick = () => window.close();
    }

    // --- Tic Tac Toe ---
    function showTicTacToe() {
        app.innerHTML = `
            <h1>Tic Tac Toe</h1>
            <div class="status-bar" id="ttt-status">Your turn (X)</div>
            <div class="game-board" id="ttt-board"></div>
            <div class="menu" style="margin-top:24px;">
                <button class="button" id="ttt-menu">Back to Menu</button>
                <button class="button" id="ttt-exit">Exit</button>
            </div>
        `;
        document.getElementById("ttt-menu").onclick = showMenu;
        document.getElementById("ttt-exit").onclick = () => window.close();
        ticTacToeGame();
    }

    function ticTacToeGame() {
        const board = Array.from({length: 3}, () => Array(3).fill(""));
        let player = "X";
        let gameOver = false;
        const status = document.getElementById("ttt-status");
        const boardDiv = document.getElementById("ttt-board");

        function render() {
            boardDiv.innerHTML = "";
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cell = document.createElement("div");
                    cell.className = "cell";
                    cell.tabIndex = 0;
                    cell.textContent = board[i][j];
                    cell.onclick = () => playerMove(i, j);
                    cell.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") playerMove(i, j); };
                    if (board[i][j] !== "" || gameOver) cell.style.pointerEvents = "none";
                    boardDiv.appendChild(cell);
                }
            }
        }

        function playerMove(i, j) {
            if (gameOver || board[i][j] !== "") return;
            board[i][j] = player;
            render();
            if (checkWinner(board, player)) {
                status.textContent = "You win! 🎉";
                gameOver = true;
                setTimeout(resetGame, 1200);
                return;
            }
            if (isDraw(board)) {
                status.textContent = "It's a draw!";
                gameOver = true;
                setTimeout(resetGame, 1200);
                return;
            }
            status.textContent = "Computer's turn (O)";
            setTimeout(computerMove, 500);
        }

        function computerMove() {
            let bestScore = -Infinity, move = null;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = "O";
                        let score = minimax(board, 0, false);
                        board[i][j] = "";
                        if (score > bestScore) {
                            bestScore = score;
                            move = [i, j];
                        }
                    }
                }
            }
            if (move) {
                board[move[0]][move[1]] = "O";
                render();
                if (checkWinner(board, "O")) {
                    status.textContent = "Computer wins! 😔";
                    gameOver = true;
                    setTimeout(resetGame, 1200);
                    return;
                }
                if (isDraw(board)) {
                    status.textContent = "It's a draw!";
                    gameOver = true;
                    setTimeout(resetGame, 1200);
                    return;
                }
            }
            status.textContent = "Your turn (X)";
        }

        function minimax(board, depth, isMax) {
            if (checkWinner(board, "O")) return 1;
            if (checkWinner(board, "X")) return -1;
            if (isDraw(board)) return 0;
            let best = isMax ? -Infinity : Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = isMax ? "O" : "X";
                        let score = minimax(board, depth + 1, !isMax);
                        board[i][j] = "";
                        best = isMax ? Math.max(score, best) : Math.min(score, best);
                    }
                }
            }
            return best;
        }

        function checkWinner(board, p) {
            for (let i = 0; i < 3; i++)
                if (board[i][0] === p && board[i][1] === p && board[i][2] === p) return true;
            for (let j = 0; j < 3; j++)
                if (board[0][j] === p && board[1][j] === p && board[2][j] === p) return true;
            if (board[0][0] === p && board[1][1] === p && board[2][2] === p) return true;
            if (board[0][2] === p && board[1][1] === p && board[2][0] === p) return true;
            return false;
        }

        function isDraw(board) {
            return board.flat().every(cell => cell !== "");
        }

        function resetGame() {
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) board[i][j] = "";
            player = "X";
            gameOver = false;
            status.textContent = "Your turn (X)";
            render();
        }

        render();
    }

    // --- Snake and Ladder ---
    function showSnakeAndLadder() {
        app.innerHTML = `
            <h1>Snake and Ladder</h1>
            <div class="status-bar" id="snl-status">Your turn! Click 'Roll Dice'</div>
            <canvas id="snl-canvas" width="340" height="340" style="display:block;margin:24px auto 0 auto;background:#eee;border-radius:12px;box-shadow:0 8px 32px #0003;"></canvas>
            <div class="menu" style="margin-top:24px;">
                <button class="button" id="snl-roll">Roll Dice</button>
                <button class="button" id="snl-menu">Back to Menu</button>
                <button class="button" id="snl-exit">Exit</button>
            </div>
        `;
        document.getElementById("snl-menu").onclick = showMenu;
        document.getElementById("snl-exit").onclick = () => window.close();
        snakeAndLadderGame();
    }

    function snakeAndLadderGame() {
        const size = 10;
        const cell = 34;
        let playerPos = 1;
        let computerPos = 1;
        let turn = "Player";
        const snakes = {16: 6, 48: 30, 62: 19, 64: 60, 93: 68, 95: 24, 97: 76, 98: 78};
        const ladders = {1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100};
        const status = document.getElementById("snl-status");
        const canvas = document.getElementById("snl-canvas");
        const ctx = canvas.getContext("2d");
        const rollBtn = document.getElementById("snl-roll");

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let x = j * cell, y = (size - 1 - i) * cell;
                    ctx.fillStyle = (i + j) % 2 === 0 ? "#FFD369" : "#00ADB5";
                    ctx.fillRect(x, y, cell, cell);
                    ctx.strokeStyle = "#222831";
                    ctx.strokeRect(x, y, cell, cell);
                    let num = i % 2 === 0 ? i * size + (j + 1) : i * size + (size - j);
                    ctx.fillStyle = "#222831";
                    ctx.font = "bold 10px Segoe UI";
                    ctx.fillText(num, x + 4, y + 14);
                }
            }
            // Draw ladders
            for (let start in ladders) {
                drawLine(+start, ladders[start], "#8B5E3C");
            }
            // Draw snakes
            for (let start in snakes) {
                drawLine(+start, snakes[start], "#B22222");
            }
        }

        function getCoords(pos) {
            pos -= 1;
            let row = Math.floor(pos / size);
            let col = row % 2 === 0 ? pos % size : size - 1 - (pos % size);
            let x = col * cell + cell / 2;
            let y = (size - 1 - row) * cell + cell / 2;
            return [x, y];
        }

        function drawLine(start, end, color) {
            let [x1, y1] = getCoords(start);
            let [x2, y2] = getCoords(end);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }

        function drawPlayers() {
            // Player (red)
            let [x, y] = getCoords(playerPos);
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = "#FF2E2E";
            ctx.fill();
            ctx.font = "16px Segoe UI Emoji";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🧑", x, y);
            // Computer (yellow)
            [x, y] = getCoords(computerPos);
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = "#FFD369";
            ctx.fill();
            ctx.fillText("🤖", x, y);
        }

        function render() {
            drawBoard();
            drawPlayers();
        }

        rollBtn.onclick = () => {
            if (turn !== "Player") return;
            let roll = Math.floor(Math.random() * 6) + 1;
            status.textContent = `You rolled a ${roll}!`;
            setTimeout(() => movePlayer(roll), 700);
        };

        function movePlayer(roll) {
            playerPos += roll;
            if (playerPos > 100) playerPos -= roll;
            if (snakes[playerPos]) playerPos = snakes[playerPos];
            if (ladders[playerPos]) playerPos = ladders[playerPos];
            render();
            if (playerPos === 100) {
                status.textContent = "You win! 🎉";
                rollBtn.disabled = true;
                setTimeout(() => showMenu(), 1800);
                return;
            }
            turn = "Computer";
            status.textContent = "Computer's turn...";
            setTimeout(computerTurn, 1200);
        }

        function computerTurn() {
            let roll = Math.floor(Math.random() * 6) + 1;
            status.textContent = `Computer rolled a ${roll}!`;
            setTimeout(() => {
                computerPos += roll;
                if (computerPos > 100) computerPos -= roll;
                if (snakes[computerPos]) computerPos = snakes[computerPos];
                if (ladders[computerPos]) computerPos = ladders[computerPos];
                render();
                if (computerPos === 100) {
                    status.textContent = "Computer wins! 😔";
                    rollBtn.disabled = true;
                    setTimeout(() => showMenu(), 1800);
                    return;
                }
                turn = "Player";
                status.textContent = "Your turn! Click 'Roll Dice'";
            }, 900);
        }

        render();
    }

    // --- Ludo (Single Token per Player, Simple) ---
    function showLudo() {
        app.innerHTML = `
            <h1>Ludo</h1>
            <div class="status-bar" id="ludo-status">Your turn! Click 'Roll Dice'</div>
            <canvas id="ludo-canvas" width="480" height="480" style="display:block;margin:24px auto 0 auto;background:#eee;border-radius:12px;box-shadow:0 8px 32px #0003;"></canvas>
            <div class="menu" style="margin-top:24px;">
                <button class="button" id="ludo-roll">Roll Dice</button>
                <button class="button" id="ludo-menu">Back to Menu</button>
                <button class="button" id="ludo-exit">Exit</button>
            </div>
        `;
        document.getElementById("ludo-menu").onclick = showMenu;
        document.getElementById("ludo-exit").onclick = () => window.close();
        ludoGame();
    }

    function ludoGame() {
        const COLORS = ["#FF2E2E", "#3EC300", "#0099FF", "#FFD369"];
        const EMOJIS = ["🧑", "🤖", "🤖", "🤖"];
        const NAMES = ["You", "Bot 1", "Bot 2", "Bot 3"];
        const canvas = document.getElementById("ludo-canvas");
        const ctx = canvas.getContext("2d");
        const status = document.getElementById("ludo-status");
        const rollBtn = document.getElementById("ludo-roll");
        const size = 15, cell = 32;
        let tokens = [[-1], [-1], [-1], [-1]];
        let finished = [false, false, false, false];
        let turn = 0;
        let dice = 1;

        // Precompute paths
        const PATHS = [makePath(0), makePath(1), makePath(2), makePath(3)];

        function makePath(color) {
            // Main path (52 steps)
            let main_path = [
                [6,0],[6,1],[6,2],[6,3],[6,4],[5,5],[4,6],[3,6],[2,6],[1,6],[0,6],
                [0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[7,12],
                [8,12],[8,11],[8,10],[8,9],[8,8],[9,8],[10,8],[11,8],[12,8],[12,7],[12,6],
                [11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0],[6,0],[6,1],
                [6,2],[6,3],[6,4],[6,5],[6,6],[7,6]
            ];
            let start_indices = [0, 13, 26, 39];
            let home_stretch = [
                [[5,7],[4,7],[3,7],[2,7],[1,7],[0,7]],
                [[7,9],[7,10],[7,11],[7,12],[7,13],[7,14]],
                [[9,7],[10,7],[11,7],[12,7],[13,7],[14,7]],
                [[7,5],[7,4],[7,3],[7,2],[7,1],[7,0]]
            ];
            let path = [];
            let idx = start_indices[color];
            for (let i = 0; i < 52; i++) path.push(main_path[(idx + i)%52]);
            path = path.concat(home_stretch[color]);
            path.push([7,7]);
            return path;
        }

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Board border
            ctx.strokeStyle = "#222831";
            ctx.lineWidth = 6;
            ctx.strokeRect(0, 0, size*cell, size*cell);
            // Main squares
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let fill = "#EEEEEE";
                    if (i < 6 && j < 6) fill = "#FFB3B3";
                    else if (i < 6 && j > 8) fill = "#B3E6B3";
                    else if (i > 8 && j < 6) fill = "#B3D1FF";
                    else if (i > 8 && j > 8) fill = "#FFF7B3";
                    ctx.fillStyle = fill;
                    ctx.fillRect(j*cell, i*cell, cell, cell);
                    ctx.strokeStyle = "#222831";
                    ctx.strokeRect(j*cell, i*cell, cell, cell);
                }
            }
            // Home triangles
            ctx.fillStyle = "#FF2E2E";
            ctx.beginPath(); ctx.moveTo(6*cell,6*cell); ctx.lineTo(8*cell,6*cell); ctx.lineTo(7*cell,7*cell); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#3EC300";
            ctx.beginPath(); ctx.moveTo(8*cell,6*cell); ctx.lineTo(8*cell,8*cell); ctx.lineTo(7*cell,7*cell); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#0099FF";
            ctx.beginPath(); ctx.moveTo(8*cell,8*cell); ctx.lineTo(6*cell,8*cell); ctx.lineTo(7*cell,7*cell); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#FFD369";
            ctx.beginPath(); ctx.moveTo(6*cell,8*cell); ctx.lineTo(6*cell,6*cell); ctx.lineTo(7*cell,7*cell); ctx.closePath(); ctx.fill();
            // Center
            ctx.beginPath();
            ctx.arc(7.5*cell, 7.5*cell, cell/2, 0, 2*Math.PI);
            ctx.fillStyle = "#222831";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#FFD369";
            ctx.stroke();
        }

        function drawTokens() {
            // Home tokens
            let pos_coords = [
                [1.5*cell, 1.5*cell], [13.5*cell, 1.5*cell], [1.5*cell, 13.5*cell], [13.5*cell, 13.5*cell]
            ];
            for (let i = 0; i < 4; i++) {
                if (tokens[i][0] === -1) {
                    let [x, y] = pos_coords[i];
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, 2*Math.PI);
                    ctx.fillStyle = COLORS[i];
                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#222831";
                    ctx.stroke();
                    ctx.font = "16px Segoe UI Emoji";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(EMOJIS[i], x, y);
                }
            }
            // Path tokens
            for (let i = 0; i < 4; i++) {
                if (tokens[i][0] >= 0 && tokens[i][0] < PATHS[i].length-1) {
                    let [row, col] = PATHS[i][tokens[i][0]];
                    let x = (col+0.5)*cell, y = (row+0.5)*cell;
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, 2*Math.PI);
                    ctx.fillStyle = COLORS[i];
                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#222831";
                    ctx.stroke();
                    ctx.font = "16px Segoe UI Emoji";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(EMOJIS[i], x, y);
                }
                if (tokens[i][0] === PATHS[i].length-1) {
                    let x = (7.5)*cell, y = (7.5)*cell;
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, 2*Math.PI);
                    ctx.fillStyle = COLORS[i];
                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#FFD369";
                    ctx.stroke();
                    ctx.font = "16px Segoe UI Emoji";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("🏁", x, y);
                }
            }
        }

        function render() {
            drawBoard();
            drawTokens();
        }

        rollBtn.onclick = () => {
            if (finished[turn]) return;
            rollBtn.disabled = true;
            dice = Math.floor(Math.random() * 6) + 1;
            status.textContent = `${NAMES[turn]} rolled a ${dice}!`;
            setTimeout(() => animateMove(), 700);
        };

        function animateMove() {
            let t = turn;
            let steps = [];
            if (tokens[t][0] === -1) {
                if (dice === 6) steps = [0];
                else {
                    status.textContent = `${NAMES[t]} needs a 6 to enter!`;
                    setTimeout(nextTurn, 900);
                    return;
                }
            } else {
                let start = tokens[t][0], end = start + dice;
                if (end > PATHS[t].length-1) {
                    status.textContent = `${NAMES[t]} can't move!`;
                    setTimeout(nextTurn, 900);
                    return;
                }
                for (let k = start+1; k <= end; k++) steps.push(k);
            }
            _animateStep(t, steps);
        }

        function _animateStep(t, steps) {
            if (!steps.length) {
                if (tokens[t][0] === PATHS[t].length-1) {
                    finished[t] = true;
                    status.textContent = `${NAMES[t]} finished!`;
                    setTimeout(nextTurn, 900);
                    return;
                }
                if (dice === 6 && !finished[t]) {
                    status.textContent = `${NAMES[t]} rolled a 6! Roll again.`;
                    if (t === 0) rollBtn.disabled = false;
                    else setTimeout(botTurn, 900);
                } else {
                    setTimeout(nextTurn, 900);
                }
                return;
            }
            tokens[t][0] = steps[0];
            render();
            setTimeout(() => _animateStep(t, steps.slice(1)), 200);
        }

        function nextTurn() {
            for (let i = 0; i < 4; i++) {
                turn = (turn + 1) % 4;
                if (!finished[turn]) break;
            }
            if (finished.every(f => f)) {
                status.textContent = "Game Over! All finished.";
                rollBtn.disabled = true;
                setTimeout(showMenu, 1800);
                return;
            }
            if (turn === 0) {
                status.textContent = "Your turn! Click 'Roll Dice'";
                rollBtn.disabled = false;
            } else {
                status.textContent = `${NAMES[turn]}'s turn...`;
                rollBtn.disabled = true;
                setTimeout(botTurn, 1000);
            }
        }

        function botTurn() {
            dice = Math.floor(Math.random() * 6) + 1;
            status.textContent = `${NAMES[turn]} rolled a ${dice}!`;
            setTimeout(animateMove, 700);
        }

        render();
    }
});