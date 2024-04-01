import React from 'react'

interface SettingsPanelProps {
	id: string
}

const SettingsPanel = ({ id }: SettingsPanelProps) => {
	return <div id={id}>Компонент настроек игры</div>
}

export default SettingsPanel
