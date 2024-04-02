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
			<div className={classes.gameBoardArena}>
				<GameBoard gridSize={gridSize} />
			</div>
			<div className={classes.settingsPanelArena}>
				<SettingsPanel updateSettings={updateSettings} />
			</div>
		</div>
	)
}

export default App
