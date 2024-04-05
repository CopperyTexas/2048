import React, { useCallback, useEffect, useState } from 'react'
import Cell from '../Cell/cell'
import Tile from '../Tile/tile'
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
	const [score, setScore] = useState(0)
	const [renderCounter, setRenderCounter] = useState(0)
	// Транспонирование сетки (для движения вверх и вниз)
	const transposeGrid = (grid: TileData[][]): TileData[][] => {
		return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
	}
	// Реверсирование строк сетки (для движения вправо и вниз)
	const reverseRows = (grid: TileData[][]): TileData[][] => {
		return grid.map(row => [...row].reverse())
	}

	const addRandomTile = useCallback(() => {
		let emptyTiles: TileData[] = []
		// Поиск пустых ячеек
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (!tiles.find(tile => tile.x === x && tile.y === y)) {
					emptyTiles.push({ x, y, value: 0 })
				}
			}
		}

		if (emptyTiles.length > 0) {
			const randomTileIndex = Math.floor(Math.random() * emptyTiles.length)
			const newTile = {
				...emptyTiles[randomTileIndex],
				value: Math.random() < 0.9 ? 2 : 4,
				isNew: true,
			}

			setTiles(prevTiles => [...prevTiles, newTile])
		}
	}, [tiles, gridSize])

	const mergeTiles = (
		grid: TileData[][]
	): { newGrid: TileData[][]; score: number } => {
		let score = 0
		const newGrid: TileData[][] = grid.map(row => {
			const newRow: TileData[] = []
			for (let i = 0; i < row.length; i++) {
				if (row[i].value === 0) continue // Пропускаем пустые ячейки

				// Если следующая ячейка существует и равна текущей, объединяем их
				if (i + 1 < row.length && row[i].value === row[i + 1].value) {
					const newValue = row[i].value * 2
					score += newValue // Добавляем очки за слияние
					newRow.push({ ...row[i], value: newValue }) // Создаем новую плитку с удвоенным значением
					i++ // Пропускаем следующую ячейку, так как она уже была объединена
				} else {
					newRow.push(row[i])
				}
			}

			// Заполнение оставшейся части строки пустыми плитками
			while (newRow.length < row.length) {
				newRow.push({ x: 0, y: 0, value: 0 }) // Предполагается, что x и y обновляются в другом месте
			}

			return newRow
		})

		return { newGrid, score }
	}

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key))
				return

			// Преобразуем одномерный массив tiles в двумерный массив grid для обработки
			let grid: TileData[][] = Array.from({ length: gridSize }, () =>
				Array.from({ length: gridSize }, () => ({ x: 0, y: 0, value: 0 }))
			)

			tiles.forEach(tile => {
				if (tile.value > 0) {
					grid[tile.y][tile.x] = tile // Заполняем grid значениями из tiles
				}
			})

			// Проверяем направление и применяем соответствующие преобразования
			let transformedGrid = grid
			let needTranspose = false
			let needReverseRows = false

			if (e.key === 'ArrowUp') {
				transformedGrid = transposeGrid(transformedGrid)
				needTranspose = true
			} else if (e.key === 'ArrowDown') {
				transformedGrid = transposeGrid(transformedGrid)
				transformedGrid = reverseRows(transformedGrid)
				needTranspose = true
				needReverseRows = true
			} else if (e.key === 'ArrowRight') {
				transformedGrid = reverseRows(transformedGrid)
				needReverseRows = true
			}

			// Слияние плиток
			let { newGrid: mergedGrid, score: addedScore } =
				mergeTiles(transformedGrid)

			// Возвращаем к исходному виду после слияния
			if (needReverseRows) {
				mergedGrid = reverseRows(mergedGrid)
			}
			if (needTranspose) {
				mergedGrid = transposeGrid(mergedGrid)
			}

			// Проверяем, было ли изменение на поле
			let hasChanged =
				JSON.stringify(transformedGrid) !== JSON.stringify(mergedGrid)

			if (hasChanged) {
				// Преобразуем обратно в одномерный массив и обновляем состояние
				const newTiles: TileData[] = mergedGrid.flatMap((row, y) =>
					row
						.map((cell, x) =>
							cell.value > 0 ? { ...cell, x, y, isNew: true } : null
						)
						.filter(cell => cell)
				)

				setTiles(newTiles)
				setScore(prevScore => prevScore + addedScore)
				addRandomTile()
				setRenderCounter(prev => prev + 1)
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [
		tiles,
		gridSize,
		addRandomTile,
		mergeTiles,
		transposeGrid,
		reverseRows,
		setScore,
	])
	// -----------------------------------------Логика рендера поля ---------
	const gridStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
		gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
		gap: `${gapSize}px`,
	}
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

	useEffect(() => {
		if (startGame) {
			setTiles([])
			setRenderCounter(prev => prev + 1)
			setScore(0)
			setTimeout(() => {
				addRandomTile()
				addRandomTile()
			}, 0)
		}
	}, [startGame, gridSize])

	return (
		<div className={classes.game_board} style={gridStyle}>
			{Array.from({ length: gridSize * gridSize }, (_, index) => {
				const x = index % gridSize
				const y = Math.floor(index / gridSize)
				return <Cell key={`cell-${x}-${y}`} x={x} y={y} />
			})}
			{tiles.map(tile => (
				<Tile
					key={`tile-${tile.x}-${tile.y}-${renderCounter}`}
					value={tile.value}
					x={tile.x}
					y={tile.y}
					cellSize={cellSize}
					gapSize={gapSize}
				/>
			))}
		</div>
	)
}

export default GameBoard
