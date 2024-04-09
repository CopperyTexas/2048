import { Grid } from './grid.js'
import { Tile } from './tile.js'

let gameBoard = document.getElementById('game-board')

let grid = new Grid(gameBoard)
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setupInputOnce()
let score = 0 // Начальный счёт игры

function setupInputOnce() {
	window.addEventListener('keydown', handleInput, { once: true })
}

async function handleInput(event) {
	switch (event.key) {
		case 'ArrowUp':
			if (!canMoveUp()) {
				setupInputOnce()
				return
			}
			await moveUp()
			break
		case 'ArrowDown':
			if (!canMoveDown()) {
				setupInputOnce()
				return
			}
			await moveDown()
			break
		case 'ArrowLeft':
			if (!canMoveLeft()) {
				setupInputOnce()
				return
			}
			await moveLeft()
			break
		case 'ArrowRight':
			if (!canMoveRight()) {
				setupInputOnce()
				return
			}
			await moveRight()
			break
		default:
			setupInputOnce()
			return
	}

	const newTile = new Tile(gameBoard)
	grid.getRandomEmptyCell().linkTile(newTile)

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		await newTile.waitForAnimationEnd()

		return showPopup()
	}

	setupInputOnce()
}

async function moveUp() {
	await slideTiles(grid.cellsGroupedByColumn)
}

async function moveDown() {
	await slideTiles(grid.cellsGroupedByReversedColumn)
}

async function moveLeft() {
	await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
	await slideTiles(grid.cellsGroupedByReversedRow)
}

async function slideTiles(groupedCells) {
	const promises = []

	groupedCells.forEach(group => slideTilesInGroup(group, promises))

	await Promise.all(promises)
	grid.cells.forEach(cell => {
		if (cell.hasTileForMerge()) {
			cell.mergeTiles() // Этот вызов обновит счёт за счёт updateScore внутри mergeTiles
		}
	})
}

function slideTilesInGroup(group, promises) {
	for (let i = 1; i < group.length; i++) {
		if (group[i].isEmpty()) {
			continue
		}

		const cellWithTile = group[i]

		let targetCell
		let j = i - 1
		while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
			targetCell = group[j]
			j--
		}

		if (!targetCell) {
			continue
		}

		promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

		if (targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile)
		} else {
			targetCell.linkTileForMerge(cellWithTile.linkedTile)
		}

		cellWithTile.unlinkTile()
	}
}

function canMoveUp() {
	return canMove(grid.cellsGroupedByColumn)
}

function canMoveDown() {
	return canMove(grid.cellsGroupedByReversedColumn)
}

function canMoveLeft() {
	return canMove(grid.cellsGroupedByRow)
}

function canMoveRight() {
	return canMove(grid.cellsGroupedByReversedRow)
}

function canMove(groupedCells) {
	return groupedCells.some(group => canMoveInGroup(group))
}

function canMoveInGroup(group) {
	return group.some((cell, index) => {
		if (index === 0) {
			return false
		}

		if (cell.isEmpty()) {
			return false
		}

		const targetCell = group[index - 1]
		return targetCell.canAccept(cell.linkedTile)
	})
}
function restartGame() {
	// Удаляем все текущие плитки с игрового поля
	while (gameBoard.firstChild) {
		gameBoard.removeChild(gameBoard.firstChild)
	}

	// Инициализируем новое игровое поле
	grid = new Grid(gameBoard) // Теперь это допустимо, так как grid объявлен через let
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))

	// Перенастраиваем обработчик ввода, если это необходимо
	setupInputOnce()
}

function showPopup() {
	if (!document.querySelector('.backdrop')) {
		const backdrop = document.createElement('div')
		backdrop.classList.add('backdrop')

		const template = document
			.getElementById('popup-template')
			.content.cloneNode(true)
		backdrop.appendChild(template)

		document.body.appendChild(backdrop)

		backdrop.querySelector('#close').addEventListener('click', function () {
			backdrop.remove()
		})

		backdrop.querySelector('#restart').addEventListener('click', function () {
			backdrop.remove()
			restartGame()
		})
	}
}
export function updateScore(totalValue) {
	score += totalValue // Увеличиваем счёт
	document.getElementById('score').textContent = score // Обновляем отображение счёта на странице
}
window.updateScore = updateScore
