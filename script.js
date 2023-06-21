function main(currentTime) {
    if (gameOver) {
	document.querySelector(".gameover").style.setProperty("display", "flex")
	direction = { x: 0, y: 0 }
	score = 0
	newSize = 1
	frameRate = 5
    }

    window.requestAnimationFrame(main)
    let secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / frameRate) return

    lastRenderTime = currentTime
    update()
    render(snakeBody)
}

function render(snakeBody) {
    gameBoard = document.querySelector(".gameboard")
    gameBoard.innerHTML = ""
    snakeBody.forEach(segment => {
	let snakePiece = document.createElement("div")
	snakePiece.style.gridRowStart = segment.y
	snakePiece.style.gridColumnStart = segment.x
	snakePiece.classList.add("snake")
	gameBoard.appendChild(snakePiece)
    })

    let foodPiece = document.createElement("div")
    foodPiece.style.gridRowStart = food.y
    foodPiece.style.gridColumnStart = food.x
    foodPiece.classList.add("food")
    gameBoard.appendChild(foodPiece)

    if (onSnake(food)) {
	console.log(onSnake(food))
	food = createFoodPosition()
	incrementSnake()
	score += 1
	document.querySelector(".scoreboard").innerHTML = score
	var remainder = score%5
	if (remainder == 0) {
	    newSize += 1
	    frameRate += 1
	}	
    }
}

function update() {
    let direction = getDirection()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
	snakeBody[i + 1] = { ...snakeBody[i] }
    }
    snakeBody[0].x += direction.x
    snakeBody[0].y += direction.y
    checkIfAlive()   
}

function getDirection() {
    lastDirection = direction
    return direction
}

function incrementSnake() {
    for (let i = 0; i < newSize; i++) {
	snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }
}

function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
	if (ignoreHead && index === 0) return false
	return samePositions(segment, position)
    })
}

function samePositions(pos1, pos2) {
    console.log(pos1.x, pos2.x, pos1.y, pos2.y)
    return (
	pos1.x === pos2.x && pos1.y === pos2.y)
}

function createFoodPosition() {
    let newFoodPosition = randomGridPosition()
    while (onSnake(newFoodPosition, { ignoreHead: false })) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}

function randomGridPosition () {
    return { x: Math.floor(Math.random() * 21) + 1, y: Math.floor(Math.random() * 21) + 1}
}

function checkIfAlive() {
    console.log(outsideGrid(snakeBody[0]))
    console.log(snakeOnSnake(snakeBody[0]))
    gameOver = outsideGrid(snakeBody[0]) || snakeOnSnake()
}

function outsideGrid(head) {
    return (
	head.x < 1 || head.x > 21 || head.y < 1 || head.y > 21
    )
}

function snakeOnSnake() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function restartGame() {
    gameOver = false
    document.querySelector(".gameover").style.setProperty("display", "none")
    snakeBody = [{ x: 11, y: 11}]
    food  = { x: 5, y: 16}
    document.querySelector(".scoreboard").innerHTML = score
    window.requestAnimationFrame(main)
}

var lastRenderTime = 0
var frameRate = 5
var snakeBody = [{ x: 11, y: 11}]
const snakeExpand = 1
var food  = { x: 5, y: 16}
var gameOver = false
var score = 0
var newSize = 1
var direction = { x: 0, y: 0 }
var lastDirection = { x: 0, y: 0 }

window.addEventListener("keydown", e => {
    switch (e.key) {
    case "ArrowUp":
        if (lastDirection.y !== 0) break	
	direction = { x: 0, y: -1}
	break
    case "ArrowDown":
	if (lastDirection.y !== 0) break
	direction = { x: 0, y: 1}
	break
    case "ArrowLeft":
	if (lastDirection.x !== 0) break
	direction = { x: -1, y: 0}
	break
    case "ArrowRight":
	if (lastDirection.x !== 0) break
	direction = { x: 1, y: 0}
	break
    }
})

window.requestAnimationFrame(main)
