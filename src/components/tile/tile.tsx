import React from 'react'
import classes from './tile.module.scss'

interface TileProps {
	value: number
	x: number
	y: number
	cellSize?: number
	gapSize?: number
}

const Tile = ({ value, x, y, cellSize, gapSize }: TileProps) => {
	const tileStyle = {
		width: cellSize,
		height: cellSize,
		transform: `translate(${x * (cellSize + gapSize)}px, ${
			y * (cellSize + gapSize)
		}px)`,
	}
	return (
		<div style={tileStyle}>
			<span className={classes.tileValue}>{value}</span>
		</div>
	)
}

export default Tile
