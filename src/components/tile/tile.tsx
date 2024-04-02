import React from 'react'
import classes from './tile.module.scss'

interface TileProps {
	value: number // значение плитки
	x: number // x координата плитки на сетке
	y: number // y координата плитки на сетке
	isNew?: boolean // является ли плитка новой
	isMerged?: boolean // произошло ли объединение с другой плиткой
}

const Tile: React.FC<TileProps> = ({ value, x, y, isNew, isMerged }) => {
	const positionStyle = {
		transform: `translate(${x * 100}%, ${y * 100}%)`,
	}

	// Определение класса в зависимости от состояния плитки
	const tileClass =
		`${classes.tile} ` +
		`${value ? ` ${classes[`tile-${value}`]}` : 'tile-empty'} ` +
		`${isNew ? classes.newTile : ''} ` +
		`${isMerged ? classes.mergedTile : ''}`

	return (
		<div className={tileClass} style={positionStyle}>
			{value !== 0 && <span className={classes.tileValue}>{value}</span>}
		</div>
	)
}

export default Tile
