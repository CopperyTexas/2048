import React, { useState } from 'react'
import classes from './App.module.scss'
import GameBoard from './gameBoard/gameBoard'
import SettingsPanel from './settingsPanel/settingsPanel'

const App = () => {
	// Начальное состояние размера сетки установлено на 4
	const [gridSize, setGridSize] = useState(4)
	const [isGameStarted, setIsGameStarted] = useState(false)
	// Функция для обновления размера сетки
	const updateSettingsAndStartGame = (newSettings: { gridSize: number }) => {
		setGridSize(newSettings.gridSize)
		setIsGameStarted(true) // Начать игру
	}

	return (
		<div className={classes.app}>
			<div className={classes.gameBoardArena}>
				<GameBoard gridSize={gridSize} startGame={isGameStarted} />
			</div>
			<div className={classes.settingsPanelArena}>
				<SettingsPanel updateSettings={updateSettingsAndStartGame} />
			</div>
		</div>
	)
}

export default App
