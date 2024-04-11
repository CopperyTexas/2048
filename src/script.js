import { Grid } from './grid.js'
import { Tile } from './tile.js'

let gameBoard = document.getElementById('game-board')

let grid = new Grid(gameBoard)
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setupInputOnce()
let score = 0 // Начальный счёт игры
document.addEventListener('DOMContentLoaded', updateLeaderboard)
function setupInputOnce() {
	window.addEventListener('keydown', handleInput, { once: true })
}
// Добавление слушателя к кнопке "Начать заново" в настройках игры
const settingsRestartButton = document.getElementById('settings-restart')
if (settingsRestartButton) {
	settingsRestartButton.addEventListener('click', function () {
		restartGame()
		resetScore()
	})
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
			cell.mergeTiles()
		}
	})
	checkWinCondition()
}
function checkWinCondition() {
	const hasWon = grid.cells.some(
		cell => cell.linkedTile && cell.linkedTile.value === 2048
	)
	if (hasWon) {
		showPopup(true) // Передаем true, чтобы показать сообщение о победе
	}
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
	grid = new Grid(gameBoard)
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
	setupInputOnce()
}

function showPopup(win) {
	const backdrop =
		document.querySelector('.backdrop') || document.createElement('div')
	if (!document.querySelector('.backdrop')) {
		backdrop.classList.add('backdrop')
		const template = document
			.getElementById('popup-template')
			.content.cloneNode(true)
		backdrop.appendChild(template)
		document.body.appendChild(backdrop)
	}

	const message = win
		? `Поздравляем! Вы достигли 2048! ваш счет :`
		: 'Игра окончена! Ваш счёт: '
	document.getElementById('popup-message').innerHTML =
		message + `<span id="final-score">${score}</span>`
	// Устанавливаем обработчики событий
	document.getElementById('save-score').addEventListener('click', saveScore)
	document.getElementById('restart').addEventListener('click', function () {
		backdrop.remove()
		restartGame()
	})
	document.getElementById('close').addEventListener('click', function () {
		backdrop.remove()
	})
	if (!win) {
		document.getElementById('final-score').textContent = score
	}
}

export function updateScore(totalValue) {
	score += totalValue // Увеличиваем счёт
	document.getElementById('score').textContent = score // Обновляем отображение счёта на странице
}
window.updateScore = updateScore

function saveScore() {
	const playerName = document.getElementById('player-name').value.trim()
	const finalScore = score // score - ваша текущая переменная счёта

	if (!playerName) {
		alert('Пожалуйста, введите ваше имя.')
		return
	}

	// Получаем текущие результаты из localStorage или инициализируем пустой массив
	const scores = JSON.parse(localStorage.getItem('scores')) || []
	const existingPlayer = scores.find(s => s.name === playerName)
	// Добавляем новый результат
	if (existingPlayer) {
		// Если новый счёт выше, обновляем его
		if (finalScore > existingPlayer.score) {
			existingPlayer.score = finalScore
		}
	} else {
		// Добавляем нового игрока, если его имя не найдено
		scores.push({ name: playerName, score: finalScore })
	}
	// Сохраняем обновлённый массив обратно в localStorage
	localStorage.setItem('scores', JSON.stringify(scores))

	// Опционально: обновляем отображение таблицы лидеров
	updateLeaderboard()
	// Закрываем всплывающее окно
	const backdrop = document.querySelector('.backdrop')
	if (backdrop) {
		backdrop.remove() // Удаление всплывающего окна из DOM
		// или используйте backdrop.style.display = 'none'; для скрытия
	}
}

function updateLeaderboard() {
	const scoresList = document.getElementById('scores-list')
	const scores = JSON.parse(localStorage.getItem('scores')) || []

	// Сортировка результатов по убыванию счёта
	scores.sort((a, b) => b.score - a.score)

	// Очищаем текущий список
	scoresList.innerHTML = ''

	// Генерируем элементы списка для каждого результата
	scores.forEach(score => {
		const li = document.createElement('li')
		li.textContent = `${score.name}: ${score.score}`
		scoresList.appendChild(li)
	})
}
function resetScore() {
	// Обнуляем счет
	score = 0
	// Обновляем отображение счета на странице
	document.getElementById('score').textContent = score
}

function clearStorage() {
	document
		.getElementById('clearLocalStorageBtn')
		.addEventListener('click', function () {
			// Очистить localStorage
			localStorage.clear()
			updateLeaderboard()
			// Оповестить пользователя об очистке
			alert('LocalStorage has been cleared.')
		})
}
window.addEventListener('load', function () {
	clearStorage()
})
