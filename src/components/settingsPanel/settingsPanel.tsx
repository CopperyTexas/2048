import React, { useState } from 'react'
import GridSizeInput from '../sizeInput/sizeInput' // Путь к компоненту GridSizeInput

interface SettingsPanelProps {
	updateSettings: (newSettings: {
		gridSize: number
		startGame: boolean
	}) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ updateSettings }) => {
	const [gridSize, setGridSize] = useState<number | null>(null)

	const handleStartGame = () => {
		if (gridSize) {
			updateSettings({ gridSize, startGame: true })
		} else {
			alert('Пожалуйста, выберите размер игрового поля перед началом игры.')
		}
	}

	return (
		<div>
			<h2>Настройки игры</h2>
			<GridSizeInput updateSettings={({ gridSize }) => setGridSize(gridSize)} />
			<button onClick={handleStartGame}>Начать игру</button>
		</div>
	)
}

export default SettingsPanel
