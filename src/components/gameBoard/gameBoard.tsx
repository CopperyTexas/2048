import React from 'react'
import classes from './gameBoard.module.scss'
interface GameBoardProps {
	id: string
}

const GameBoard = ({ id }: GameBoardProps) => {
	return <div className={classes.game_board} id={id}></div>
}

export default GameBoard
