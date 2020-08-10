function Snake() {
    /**
     * Class Snake - represents our player
     * 
     * attribute positions - defines where our snake is
     * attribute direction - defines moving direction of our snake
     */
    this.positions = [[1, 1], [1, 2], [1, 3]];
    this.direction = "E"; // E - EAST, W - WEST, S - SOUTH, N - NORTH
}

INITIAL_MOVE = true; 
PLAYING = false; // Whether the game is in progress
BOARD = document.getElementById("board");
START_BUTTON = document.getElementById("start-game");
DIRECTIONS_COEFICITENTS = { "E": [0, 1], "W": [0, -1], "S": [-1, 0], "N": [1, 0] }; // Coefficients to be added to head position depending on moving direction
CSS_SNAKE_BACKGROUND = "background-color: burlywood";
CSS_FOOD_BACKGROUND = "background-color: green";
CSS_COLLISION_BACKGROUND = "background-color: red";

let intervalFunction = null;
let foodRow = -1;
let foodCol = -1;
let boardFields = []; // Stores div elements from board - 25 x 25
let player = new Snake(); // Our player
let score = 0;
let directionChanged = false; // Has the direction of movement changed in the current cycle of moving

document.body.setAttribute("onkeydown", "userPressedKey(event)"); // Detection of pressed keys with onkeydown listener
document.getElementById("start-game").setAttribute("onclick", "startGame()");

function initialiseBoard() {
    /**
     * Initialising board and snake.
     */
    BOARD.innerHTML = "";
    boardFields = [];
    for (i = 0; i < 25; i++) {
        let arr = []
        for (j = 0; j < 25; j++) {
            let tmpDiv = document.createElement("div");
            tmpDiv.setAttribute("class", "boardPart");
            tmpDiv.setAttribute("style", `top: ${96 - i * 4}%; left: ${j * 4}%;`);
            BOARD.appendChild(tmpDiv)
            arr.push(tmpDiv);
        }
        boardFields.push(arr)
    }
}

function updatePlayerPosition() {
    let snakeLength = player.positions.length;
    let xCoor = player.positions[0][0];
    let yCoor = player.positions[0][1];
    for (i = 0; i < snakeLength - 1; i ++) {
        player.positions[i][0] = player.positions[i + 1][0];
        player.positions[i][1] = player.positions[i + 1][1];
    }

    let existingValue = boardFields[xCoor][yCoor].getAttribute("style")
    existingValue = existingValue.replace(CSS_SNAKE_BACKGROUND, "");
    boardFields[xCoor][yCoor].setAttribute("style", existingValue);
    
    player.positions[snakeLength - 1][0] += DIRECTIONS_COEFICITENTS[player.direction][0]
    player.positions[snakeLength - 1][1] += DIRECTIONS_COEFICITENTS[player.direction][1]
    player.positions[snakeLength - 1][0] = ((player.positions[snakeLength - 1][0] % 25) + 25) % 25;
    player.positions[snakeLength - 1][1] = ((player.positions[snakeLength - 1][1] % 25) + 25) % 25;

    if (player.positions[snakeLength - 1][0] == foodRow && player.positions[snakeLength - 1][1] == foodCol) {
        placeFood();
        score ++;
        let existingValue = boardFields[player.positions[snakeLength - 1][0]][player.positions[snakeLength - 1][1]].getAttribute("style");
        existingValue = existingValue.replace(CSS_FOOD_BACKGROUND, "");
        
        boardFields[player.positions[snakeLength - 1][0]][player.positions[snakeLength - 1][1]].setAttribute("style", existingValue);

        player.positions.unshift([xCoor, yCoor]);
        snakeLength ++;
        updateScore();
    }
    snakeLength = player.positions.length;

    xCoor = player.positions[snakeLength - 1][0];
    yCoor = player.positions[snakeLength - 1][1];

    for (i = 0; i < snakeLength - 1; i ++) {
        if (player.positions[i][0] == xCoor && player.positions[i][1] == yCoor) {
            clearInterval(intervalFunction);
            let existingValue = boardFields[xCoor][yCoor].getAttribute("style");
            existingValue = existingValue.replace(CSS_SNAKE_BACKGROUND, CSS_COLLISION_BACKGROUND);

            boardFields[xCoor][yCoor].setAttribute("style", existingValue);
            
            START_BUTTON.disabled = false;
            PLAYING = false;
            player = new Snake();
            
            break;
        }
    }
}

function drawOnBoard() {
    if (!PLAYING)
        return;
    if (!INITIAL_MOVE) {
        updatePlayerPosition();
        if (!PLAYING) {
            return;
        }
    } else {
        placeFood();
        INITIAL_MOVE = false;
    }
    player.positions.forEach((pos) => {
        let existingValue = boardFields[pos[0]][pos[1]].getAttribute("style");
        if (!existingValue.includes(CSS_SNAKE_BACKGROUND)) {
            existingValue += CSS_SNAKE_BACKGROUND;
        }

        boardFields[pos[0]][pos[1]].setAttribute("style", existingValue);
        
    });
    directionChanged = false;
}

function userPressedKey(data) {
    if (data.key == 'Enter') {
        startGame();
    } else if (PLAYING && data.key.length == 1 && !directionChanged) { 
        if ("wW".includes(data.key) && player.direction != "S") {
            player.direction = "N";
            directionChanged = true;
        } else if ("sS".includes(data.key) && player.direction != "N") {
            player.direction = "S";
            directionChanged = true;
        } else if ("aA".includes(data.key) && player.direction != "E") {
            player.direction = "W";
            directionChanged = true;
        } else if ("dD".includes(data.key) && player.direction != "W") {
            player.direction = "E";
            directionChanged = true;
        }
    }
}

function startGame() {
    /**
     * Method is invoked when "Start" button is clicked.
     * 
     */
    if (!PLAYING) {
        initialiseBoard();
        score = 0;
        updateScore();
        PLAYING = true;
        intervalFunction = setInterval(drawOnBoard, 50);
        START_BUTTON.disabled = true;
        INITIAL_MOVE = true;
    }
}

function placeFood() {
    do {
        let row = Math.floor(Math.random() * 25);
        let col = Math.floor(Math.random() * 25);
        if (boardFields[row][col].getAttribute("style").includes(CSS_SNAKE_BACKGROUND))
            continue;
        let existingValue = boardFields[row][col].getAttribute("style");
        existingValue += CSS_FOOD_BACKGROUND;
        boardFields[row][col].setAttribute("style", existingValue);
        foodRow = row;
        foodCol = col;
        break;
    } while (true);
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}