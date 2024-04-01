import React from 'react'
import classes from './gameBoard.module.scss'
import Cell from '../cell/cell'

const GRID_SIZE = 4;

interface GameBoardProps{
	gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({gridSize}) => {
	const cells: JSX.Element[] = [];
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
		  cells.push(<Cell key={`${x}-${y}`} x={x} y={y} />);
		}
	  }

	 // Inline стили для динамической сетки
	 const gridStyle = {
        gridTemplateColumns: `repeat(${gridSize}, var(--cell-size))`,
        gridTemplateRows: `repeat(${gridSize}, var(--cell-size))`,
    };

    return <div className={classes.game_board} style={gridStyle}>{cells}</div>;
}

export default GameBoard
