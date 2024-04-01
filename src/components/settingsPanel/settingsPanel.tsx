import React from 'react';
import GridSizeInput from '../sizeInput/sizeInput'; // Убедитесь, что путь к файлу корректный

interface SettingsPanelProps {
    updateSettings: (newSettings: { gridSize: number }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ updateSettings }) => {
    return (
        <div>
            <h2>Настройки игры</h2>
            <GridSizeInput updateSettings={updateSettings} />
        </div>
    );
};

export default SettingsPanel;
