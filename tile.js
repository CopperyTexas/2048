export class Tile {
	// Конструктор класса Tile. Создает и инициализирует плитку.
	constructor(gridElement) {
		this.tileElement = document.createElement('div') // Создаем DOM элемент для плитки
		this.tileElement.classList.add('tile') // Присваиваем класс для стилизации
		this.setValue(Math.random() > 0.5 ? 2 : 4) // Начальное значение плитки (2 или 4)
		gridElement.append(this.tileElement) // Добавляем плитку на игровое поле
	}

	// Устанавливает значение плитки и обновляет его отображение и стилизацию
	setValue(value) {
		this.value = value // Сохраняем значение плитки
		this.tileElement.textContent = value // Отображаем значение в элементе плитки
		// Рассчитываем светлоту фона и текста в зависимости от значения плитки
		const bgLightness = 100 - Math.log2(value) * 9
		this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`)
		this.tileElement.style.setProperty(
			'--text-lightness',
			`${bgLightness < 50 ? 90 : 10}%`
		)
	}

	// Устанавливает координаты плитки и обновляет их в стилях для анимации
	setXY(x, y) {
		this.x = x
		this.y = y
		// Использование CSS переменных для управления положением плитки
		this.tileElement.style.setProperty('--x', x)
		this.tileElement.style.setProperty('--y', y)
	}

	// Удаляет плитку из DOM
	removeFromDOM() {
		this.tileElement.remove()
	}

	// Возвращает промис, который разрешается при завершении анимации перехода
	waitForTransitionEnd() {
		return new Promise(resolve => {
			this.tileElement.addEventListener('transitionend', resolve, {
				once: true,
			})
		})
	}

	// Возвращает промис, который разрешается при завершении анимации
	waitForAnimationEnd() {
		return new Promise(resolve => {
			this.tileElement.addEventListener('animationend', resolve, { once: true })
		})
	}
}
