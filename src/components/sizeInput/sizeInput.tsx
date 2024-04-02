import React from 'react'

interface GridSizeInputProps {
	updateSettings: (newSettings: { gridSize: number }) => void
}

const GridSizeInput: React.FC<GridSizeInputProps> = ({ updateSettings }) => {
	// Функция для обновления размера сетки
	const setGridSize = (size: number) => {
		updateSettings({ gridSize: size })
	}

	return (
		<div>
			<button onClick={() => setGridSize(4)}>Установить размер 4x4</button>
			<button onClick={() => setGridSize(5)}>Установить размер 5x5</button>
		</div>
	)
}

export default GridSizeInput
