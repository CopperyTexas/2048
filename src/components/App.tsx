import React, { useState } from 'react'
import classes from './App.module.scss'
import GameBoard from './gameBoard/gameBoard'
import SettingsPanel from './settingsPanel/settingsPanel'

const App = () => {
	// Начальное состояние размера сетки установлено на 4
	const [gridSize, setGridSize] = useState(4)

	// Функция для обновления размера сетки
	const updateSettings = (newSettings: { gridSize: number }) => {
		setGridSize(newSettings.gridSize)
	}

	return (
		<div className={classes.app}>
			<GameBoard gridSize={gridSize} />
			<SettingsPanel updateSettings={updateSettings} />
		</div>
	)
}

export default App
