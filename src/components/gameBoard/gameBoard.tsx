import React, { useEffect, useState } from 'react'
import Cell from '../cell/cell'
import classes from './gameBoard.module.scss'

interface GameBoardProps {
	gridSize: number
}

const GameBoard: React.FC<GameBoardProps> = ({ gridSize }) => {
	const [cellSize, setCellSize] = useState(100)
	const [gapSize, setGapSize] = useState(5)
	useEffect(() => {
		const handleResize = () => {
			const maxWidth = 1600
			const width = Math.min(window.innerWidth * 0.9, maxWidth)
			const maxCellSize = 200
			const newCellSize = Math.min(
				Math.max(width / gridSize / 2, 20),
				maxCellSize
			)
			setCellSize(newCellSize)
			const newGapSize = Math.max(newCellSize * 0.1, 5)
			setGapSize(newGapSize)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [gridSize])

	const cells: JSX.Element[] = []
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			cells.push(<Cell key={`${gridSize}-${x}-${y}`} x={x} y={y} />)
		}
	}

	const gridStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
		gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
		gap: `${gapSize}px`,
	}

	return (
		<div className={classes.game_board} style={gridStyle}>
			{cells}
		</div>
	)
}

export default GameBoard
