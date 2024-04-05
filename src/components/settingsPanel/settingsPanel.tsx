import React from 'react'

interface SettingsPanelProps {
	startGame: () => void
	resetGame: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
	startGame,
	resetGame,
}) => {
	// Теперь функция handleStartGame просто вызывает startGame
	const handleStartGame = () => {
		startGame()
	}

	const handleResetGame = () => {
		resetGame()
	}

	return (
		<div>
			<h2>Настройки игры</h2>
			<button onClick={handleStartGame}>Старт</button>
			<button onClick={handleResetGame}>Перезапуск</button>
		</div>
	)
}

export default SettingsPanel
