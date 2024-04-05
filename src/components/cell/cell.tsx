import React from 'react'
import classes from './cell.module.scss'

interface CellProps {
	x: number
	y: number
}

const Cell = ({ x, y }: CellProps) => {
	return <div className={classes.cell} data-x={x} data-y={y}></div>
}

export default Cell
