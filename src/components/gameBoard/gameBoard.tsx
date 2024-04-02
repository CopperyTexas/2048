import React, { useEffect, useState } from 'react'
import Cell from '../cell/cell'
import Tile from '../tile/tile'
import classes from './gameBoard.module.scss'

interface GameBoardProps {
	gridSize: number
	startGame: boolean
}

interface TileData {
	x: number
	y: number
	value: number
	isNew?: boolean
}

const GameBoard: React.FC<GameBoardProps> = ({ gridSize, startGame }) => {
	const [cellSize, setCellSize] = useState(100)
	const [gapSize, setGapSize] = useState(5)
	const [tiles, setTiles] = useState<TileData[]>([])
	const [renderCounter, setRenderCounter] = useState(0)

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

	const addRandomTile = () => {
		setTiles(tilesCurrent => {
			let freePositions = []
			for (let y = 0; y < gridSize; y++) {
				for (let x = 0; x < gridSize; x++) {
					if (!tilesCurrent.some(tile => tile.x === x && tile.y === y)) {
						freePositions.push({ x, y })
					}
				}
			}

			if (freePositions.length > 0) {
				const { x, y } =
					freePositions[Math.floor(Math.random() * freePositions.length)]
				return [
					...tilesCurrent,
					{ x, y, value: Math.random() < 0.9 ? 2 : 4, isNew: true },
				]
			}
			return tilesCurrent
		})
	}

	useEffect(() => {
		if (startGame) {
			setTiles([])
			setRenderCounter(prev => prev + 1)
			setTimeout(() => {
				addRandomTile()
				addRandomTile()
			}, 0)
		}
	}, [startGame, gridSize])

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
				return <Cell key={`cell-${x}-${y}-${renderCounter}`} x={x} y={y} />
			})}
			{tiles.map(tile => (
				<Tile
					key={`tile-${tile.x}-${tile.y}-${renderCounter}`}
					value={tile.value}
					x={tile.x}
					y={tile.y}
					cellSize={cellSize}
					gapSize={gapSize}
					isNew={tile.isNew}
				/>
			))}
		</div>
	)
}

export default GameBoard
