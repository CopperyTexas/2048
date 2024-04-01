import React from 'react'

interface GameBoardProps {
	id: string
}

const GameBoard = ({ id }: GameBoardProps) => {
	return <div id={id}>Компонент игровой доски</div>
}

export default GameBoard
