// Cell.tsx
import React from 'react'
import classes from './cell.module.scss'

interface CellProps {
	x: number
	y: number
}

const Cell: React.FC<CellProps> = ({ x, y }) => {
	const animationDelay = `${Math.random()}s`
	const animationName = 'cellAnimation'

	return (
		<div
			className={classes.cell}
			style={{
				animationDuration: '0.5s',
				animationFillMode: 'forwards',
				animationTimingFunction: 'ease-out',
				animationDelay: animationDelay,
			}}
			data-x={x}
			data-y={y}
		></div>
	)
}

export default Cell
