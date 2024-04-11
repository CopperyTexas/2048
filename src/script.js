import { Grid } from './grid.js'
import { Tile } from './tile.js'

// Получаем элемент игрового поля и инициализируем сетку игры.
let gameBoard = document.getElementById('game-board')
let grid = new Grid(gameBoard)

// Добавляем две начальные плитки на игровое поле.
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))

// Настраиваем обработчик ввода с клавиатуры.
setupInputOnce()

// Инициализация начального счета игры.
let score = 0

// Обновление таблицы лидеров после полной загрузки страницы.
document.addEventListener('DOMContentLoaded', updateLeaderboard)

// Функция для настройки одноразового слушателя ввода с клавиатуры.
function setupInputOnce() {
	window.addEventListener('keydown', handleInput, { once: true })
}

// Обработчик событий для кнопки "Начать заново" в настройках игры.
const settingsRestartButton = document.getElementById('settings-restart')
if (settingsRestartButton) {
	settingsRestartButton.addEventListener('click', function () {
		restartGame()
		resetScore()
	})
}

// Обработка нажатий клавиш и выполнение соответствующих действий.
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

	// Добавляем новую плитку после каждого успешного хода.
	const newTile = new Tile(gameBoard)
	grid.getRandomEmptyCell().linkTile(newTile)

	// Проверяем возможность дальнейшего движения. Если двигаться некуда, показываем popup.
	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		await newTile.waitForAnimationEnd()
		return showPopup()
	}

	setupInputOnce()
}

// Асинхронная функция для перемещения плиток вверх
async function moveUp() {
	await slideTiles(grid.cellsGroupedByColumn) // Сдвигаем плитки вверх, работая с группами ячеек по колонкам
}

// Асинхронная функция для перемещения плиток вниз
async function moveDown() {
	await slideTiles(grid.cellsGroupedByReversedColumn) // Сдвигаем плитки вниз, работая с группами ячеек по обратным колонкам
}

// Асинхронная функция для перемещения плиток влево
async function moveLeft() {
	await slideTiles(grid.cellsGroupedByRow) // Сдвигаем плитки влево, работая с группами ячеек по строкам
}

// Асинхронная функция для перемещения плиток вправо
async function moveRight() {
	await slideTiles(grid.cellsGroupedByReversedRow) // Сдвигаем плитки вправо, работая с группами ячеек по обратным строкам
}

// Асинхронная функция для сдвига плиток в заданной группе ячеек
async function slideTiles(groupedCells) {
	const promises = [] // Массив для хранения промисов анимации

	// Проходим по каждой группе ячеек и сдвигаем плитки
	groupedCells.forEach(group => slideTilesInGroup(group, promises))

	// Ожидаем завершения всех анимаций сдвига
	await Promise.all(promises)

	// Проходим по всем ячейкам сетки и сливаем плитки, если это необходимо
	grid.cells.forEach(cell => {
		if (cell.hasTileForMerge()) {
			cell.mergeTiles() // Слияние плиток
		}
	})

	// Проверяем условие выигрыша после завершения всех действий
	checkWinCondition()
}

// Функция проверки условия выигрыша (достижения плиткой значения 2048)
function checkWinCondition() {
	const hasWon = grid.cells.some(
		cell => cell.linkedTile && cell.linkedTile.value === 2048
	)
	if (hasWon) {
		showPopup(true) // Показываем всплывающее окно с поздравлением о победе
	}
}

// Функция для сдвига и слияния плиток внутри конкретной группы ячеек
function slideTilesInGroup(group, promises) {
	for (let i = 1; i < group.length; i++) {
		if (group[i].isEmpty()) {
			continue // Пропускаем пустые ячейки
		}

		const cellWithTile = group[i] // Текущая ячейка с плиткой

		let targetCell // Целевая ячейка для сдвига или слияния
		// Ищем целевую ячейку для перемещения или слияния, двигаясь по группе ячеек
		let j = i - 1
		while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
			targetCell = group[j]
			j--
		}

		if (!targetCell) {
			continue // Если не нашли целевую ячейку, переходим к следующей итерации
		}

		// Добавляем промис завершения анимации перемещения в массив promises
		promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

		// Если целевая ячейка пустая, перемещаем в неё плитку
		if (targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile)
		} else {
			// Иначе подготавливаем плитки к слиянию
			targetCell.linkTileForMerge(cellWithTile.linkedTile)
		}

		// Отвязываем плитку от текущей ячейки
		cellWithTile.unlinkTile()
	}
}

// Функции для проверки возможности движения плиток в каждом из четырёх направлений.
function canMoveUp() {
	// Проверка возможности движения вверх.
	return canMove(grid.cellsGroupedByColumn)
}

function canMoveDown() {
	// Проверка возможности движения вниз.
	return canMove(grid.cellsGroupedByReversedColumn)
}

function canMoveLeft() {
	// Проверка возможности движения влево.
	return canMove(grid.cellsGroupedByRow)
}

function canMoveRight() {
	// Проверка возможности движения вправо.
	return canMove(grid.cellsGroupedByReversedRow)
}

// Основная функция для проверки возможности движения.
function canMove(groupedCells) {
	// Проверяем, существует ли хотя бы одна группа ячеек, в которой возможно движение.
	return groupedCells.some(group => canMoveInGroup(group))
}

// Вспомогательная функция для определения возможности движения внутри группы ячеек.
function canMoveInGroup(group) {
	// Проверяем каждую ячейку в группе на возможность движения или слияния.
	return group.some((cell, index) => {
		if (index === 0) {
			// Первая ячейка в группе не может двигаться/сливаться в направлении движения.
			return false
		}

		if (cell.isEmpty()) {
			// Пустая ячейка не блокирует движение.
			return false
		}

		// Проверяем, может ли текущая ячейка двигаться или сливаться с предыдущей.
		const targetCell = group[index - 1]
		return targetCell.canAccept(cell.linkedTile)
	})
}

// Функция для перезапуска игры.
function restartGame() {
	// Удаляем все плитки с игрового поля.
	while (gameBoard.firstChild) {
		gameBoard.removeChild(gameBoard.firstChild)
	}

	// Создаём новую сетку и добавляем две начальные плитки.
	grid = new Grid(gameBoard)
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
	grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))

	// Повторно настраиваем слушатель нажатий клавиш.
	setupInputOnce()

	// Сбрасываем счёт игры.
	updateScore(0, true) // Предполагается, что updateScore модифицирована для поддержки сброса
}

// Функция для отображения всплывающего окна в конце игры
function showPopup(win) {
	// Поиск существующего фона или создание нового
	const backdrop =
		document.querySelector('.backdrop') || document.createElement('div')
	if (!document.querySelector('.backdrop')) {
		backdrop.classList.add('backdrop')
		// Клонирование и добавление шаблона всплывающего окна в документ
		const template = document
			.getElementById('popup-template')
			.content.cloneNode(true)
		backdrop.appendChild(template)
		document.body.appendChild(backdrop)
	}

	// Установка сообщения в зависимости от исхода игры
	const message = win
		? `Поздравляем! Вы достигли 2048! ваш счет :`
		: 'Игра окончена! Ваш счёт: '
	document.getElementById('popup-message').innerHTML =
		message + `<span id="final-score">${score}</span>`

	// Добавление обработчиков для кнопок внутри всплывающего окна
	document.getElementById('save-score').addEventListener('click', saveScore)
	document.getElementById('restart').addEventListener('click', function () {
		backdrop.remove() // Удаление всплывающего окна при перезапуске
		restartGame()
	})
	document.getElementById('close').addEventListener('click', function () {
		backdrop.remove() // Закрытие всплывающего окна
	})

	// Если игра проиграна, обновляем счёт на текущий
	if (!win) {
		document.getElementById('final-score').textContent = score
	}
}

// Функция для обновления счёта игры
export function updateScore(totalValue, reset = false) {
	if (reset) {
		score = 0 // Сброс счёта
	} else {
		score += totalValue // Увеличение счёта
	}
	document.getElementById('score').textContent = score // Отображение нового счёта
}
window.updateScore = updateScore

// Функция для сохранения счёта игрока
function saveScore() {
	const playerName = document.getElementById('player-name').value.trim() // Получение имени игрока
	const finalScore = score // Текущий счёт

	if (!playerName) {
		alert('Пожалуйста, введите ваше имя.') // Предупреждение, если имя не введено
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

// Функция для обновления таблицы лидеров на странице
function updateLeaderboard() {
	const scoresList = document.getElementById('scores-list') // Находим элемент списка для отображения результатов
	const scores = JSON.parse(localStorage.getItem('scores')) || [] // Получаем результаты из localStorage

	// Сортируем результаты по убыванию счёта
	scores.sort((a, b) => b.score - a.score)

	// Очищаем текущий список перед добавлением новых элементов
	scoresList.innerHTML = ''

	// Добавляем результаты в список
	scores.forEach(score => {
		const li = document.createElement('li')
		li.textContent = `${score.name}: ${score.score}`
		scoresList.appendChild(li)
	})
}

// Функция для сброса текущего счёта игры
function resetScore() {
	score = 0 // Обнуляем счет
	document.getElementById('score').textContent = score // Обновляем отображение счета на странице
}

// Функция для очистки localStorage и обновления таблицы лидеров
function clearStorage() {
	const clearButton = document.getElementById('clearLocalStorageBtn')
	if (clearButton) {
		clearButton.addEventListener('click', function () {
			localStorage.clear() // Очищаем localStorage
			updateLeaderboard() // Обновляем таблицу лидеров на странице
			alert('LocalStorage has been cleared.') // Уведомляем пользователя об очистке
		})
	}
}

// Инициализация функции очистки localStorage при загрузке страницы
window.addEventListener('load', function () {
	clearStorage() // Вызов функции clearStorage при полной загрузке страницы
})
