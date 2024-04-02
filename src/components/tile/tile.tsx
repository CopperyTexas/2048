import React from 'react'
import classes from './tile.module.scss'

interface TileProps {
	value: number // значение плитки
	x: number // x координата плитки на сетке
	y: number // y координата плитки на сетке
	isNew?: boolean // является ли плитка новой
	isMerged?: boolean // произошло ли объединение с другой плиткой
	cellSize?: number
	gapSize?: number
}

const Tile: React.FC<TileProps> = ({
	value,
	x,
	y,
	isNew,
	isMerged,
	cellSize,
	gapSize,
}) => {
	const tileStyle = {
		width: cellSize,
		height: cellSize,
		transform: `translate(${x * (cellSize + gapSize)}px, ${
			y * (cellSize + gapSize)
		}px)`,
	}

	// Определение класса в зависимости от состояния плитки
	const tileClass = `
    ${classes.tile} 
    ${value ? classes[`tile-${value}`] : ''} 
    ${isNew ? classes.newTile : ''} 
    ${isMerged ? classes.mergedTile : ''}
  `

	return (
		<div className={tileClass} style={tileStyle}>
			{value !== 0 && <span className={classes.tileValue}>{value}</span>}
		</div>
	)
}

export default Tile
