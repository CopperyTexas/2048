import { Cell } from './cell.js'

const GRID_SIZE = 4 // Размер стороны сетки, создающей игровое поле 4x4
const CELLS_COUNT = GRID_SIZE * GRID_SIZE // Общее количество ячеек в сетке

export class Grid {
	constructor(gridElement) {
		this.cells = [] // Инициализация массива для хранения ячеек
		// Создание ячеек и добавление их в массив cells
		for (let i = 0; i < CELLS_COUNT; i++) {
			this.cells.push(
				new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
			)
		}

		// Группировка ячеек по столбцам и строкам для удобства доступа и манипуляций
		this.cellsGroupedByColumn = this.groupCellsByColumn()
		this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column =>
			[...column].reverse()
		)
		this.cellsGroupedByRow = this.groupCellsByRow()
		this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row =>
			[...row].reverse()
		)
	}

	// Возвращает случайную пустую ячейку из сетки
	getRandomEmptyCell() {
		const emptyCells = this.cells.filter(cell => cell.isEmpty()) // Фильтрация пустых ячеек
		if (emptyCells.length === 0) return null // Возвращает null, если пустых ячеек нет
		const randomIndex = Math.floor(Math.random() * emptyCells.length) // Получение случайного индекса
		return emptyCells[randomIndex] // Возвращение случайной пустой ячейки
	}

	// Группировка ячеек по столбцам для упрощения вычислений движений и слияний
	groupCellsByColumn() {
		return this.cells.reduce((groupedCells, cell) => {
			groupedCells[cell.x] = groupedCells[cell.x] || []
			groupedCells[cell.x][cell.y] = cell
			return groupedCells
		}, [])
	}

	// Группировка ячеек по строкам, аналогично столбцам
	groupCellsByRow() {
		return this.cells.reduce((groupedCells, cell) => {
			groupedCells[cell.y] = groupedCells[cell.y] || []
			groupedCells[cell.y][cell.x] = cell
			return groupedCells
		}, [])
	}
}
