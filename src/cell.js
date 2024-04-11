export class Cell {
	// Конструктор класса Cell, инициализирует ячейку
	constructor(gridElement, x, y) {
		const cell = document.createElement('div') // Создаем DOM элемент для ячейки
		cell.classList.add('cell') // Присваиваем класс для стилизации
		gridElement.append(cell) // Добавляем ячейку на игровое поле
		this.x = x // Сохраняем координаты ячейки по оси X
		this.y = y // Сохраняем координаты ячейки по оси Y
	}

	// Связывает плитку с ячейкой, устанавливая ее координаты
	linkTile(tile) {
		tile.setXY(this.x, this.y)
		this.linkedTile = tile // Сохраняем ссылку на плитку в ячейке
	}

	// Отвязывает плитку от ячейки
	unlinkTile() {
		this.linkedTile = null
	}

	// Проверяет, пуста ли ячейка
	isEmpty() {
		return !this.linkedTile
	}

	// Предназначено для установки плитки, которая будет сливаться с текущей
	linkTileForMerge(tile) {
		tile.setXY(this.x, this.y)
		this.linkedTileForMerge = tile
	}

	// Отвязывает плитку, предназначенную для слияния
	unlinkTileForMerge() {
		this.linkedTileForMerge = null
	}

	// Проверяет, есть ли плитка для слияния в ячейке
	hasTileForMerge() {
		return !!this.linkedTileForMerge
	}

	// Проверяет, может ли ячейка принять плитку (пустая или для слияния с таким же значением)
	canAccept(newTile) {
		return (
			this.isEmpty() ||
			(!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
		)
	}

	// Слияние двух плиток в ячейке и обновление счета
	mergeTiles() {
		const totalValue = this.linkedTile.value + this.linkedTileForMerge.value
		this.linkedTile.setValue(totalValue) // Обновляем значение основной плитки
		this.linkedTileForMerge.removeFromDOM() // Удаляем плитку, с которой произошло слияние, из DOM
		this.unlinkTileForMerge() // Очищаем ссылку на плитку для слияния
		updateScore(totalValue) // Обновляем счет
	}
}
