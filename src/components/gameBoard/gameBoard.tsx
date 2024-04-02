import React, { useEffect, useState } from 'react'
import Cell from '../cell/cell'
import Tile from '../tile/tile'
import classes from './gameBoard.module.scss'

interface GameBoardProps {
	gridSize: number
	startGame: boolean // Добавляем флаг для начала игры
}

interface TileData {
	x: number
	y: number
	value: number
}

const GameBoard: React.FC<GameBoardProps> = ({ gridSize, startGame }) => {
	const [cellSize, setCellSize] = useState(100)
	const [gapSize, setGapSize] = useState(5)
	const [tiles, setTiles] = useState<TileData[]>([])
	const [renderCounter, setRenderCounter] = useState(0)

	useEffect(() => {
		setRenderCounter(prev => prev + 1)
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

	const cells = []
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			cells.push(
				<Cell key={`${gridSize}-${x}-${y}-${renderCounter}`} x={x} y={y} />
			)
		}
	}
	// Функция для добавления новой плитки
	const addRandomTile = () => {
		let freePositions = []
		for (let y = 0; y < gridSize; y++) {
			for (let x = 0; x < gridSize; x++) {
				if (!tiles.some(tile => tile.x === x && tile.y === y)) {
					freePositions.push({ x, y })
				}
			}
		}

		if (freePositions.length > 0) {
			const { x, y } =
				freePositions[Math.floor(Math.random() * freePositions.length)]
			setTiles([...tiles, { x, y, value: Math.random() < 0.9 ? 2 : 4 }])
		}
	}

	// Эффект для начала игры
	useEffect(() => {
		if (startGame) {
			setTiles([]) // Очищаем поле
			addRandomTile() // Добавляем начальные плитки
			addRandomTile()
		}
	}, [startGame])

	const gridStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
		gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
		gap: `${gapSize}px`,
	}

	return (
		<div className={classes.game_board} style={gridStyle}>
			{Array.from({ length: gridSize * gridSize }, (_, index) => {
				const x = index % gridSize
				const y = Math.floor(index / gridSize)
				return <Cell key={`cell-${x}-${y}`} x={x} y={y} />
			})}
			{tiles.map(tile => (
				<Tile
					key={`tile-${tile.x}-${tile.y}`}
					value={tile.value}
					x={tile.x}
					y={tile.y}
				/>
			))}
		</div>
	)
}

export default GameBoard
