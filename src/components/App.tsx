import React, { useState } from 'react'
import classes from './App.module.scss'
import GameBoard from './gameBoard/gameBoard'
import SettingsPanel from './settingsPanel/settingsPanel'
const App = () => {
	// Состояние настроек игры
	const [gameSettings, setGameSettings] = useState<any>({})

	// Функция для обновления настроек игры
	const updateSettings = (newSettings: any) => {
		setGameSettings(newSettings)
	}

	return (
		<div className={classes.app}>
			<GameBoard id='game-board' />
			<SettingsPanel id='settings' />
		</div>
	)
}

export default App
