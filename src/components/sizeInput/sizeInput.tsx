import React, { useState } from 'react';

interface GridSizeInputProps {
    updateSettings: (newSettings: { gridSize: number }) => void;
}

const GridSizeInput: React.FC<GridSizeInputProps> = ({ updateSettings }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const gridSize = parseInt(inputValue, 10);
        if (!isNaN(gridSize) && gridSize > 0) {
            updateSettings({ gridSize });
        } else {
            alert("Пожалуйста, введите корректное положительное число.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="gridSize">Размер сетки: </label>
            <input
                type="number"
                id="gridSize"
                value={inputValue}
                onChange={handleChange}
                min="1"
            />
            <button type="submit">Обновить</button>
        </form>
    );
};

export default GridSizeInput;
