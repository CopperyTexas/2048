import { Grid } from './grid.js'
import { Tile } from './tile.js'
const gameBoard = document.getElementById('game-board')

const grid = new Grid(gameBoard)
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setupInputOnce()

function setupInputOnce() {
	window.addEventListener('keydown', handleInput, { once: true })
}

function handleInput(event) {
	console.log(event.key)
	setupInputOnce()
}
