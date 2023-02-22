import {IntegrationOptions} from "../plugin.integrations";

export interface Settings {
	enabled: boolean,
	preferences: {
		ribbon: boolean,
		tabs: boolean,
		statusBar: boolean,
		fileHeader: boolean,
		sideDockLeft: boolean,
		sideDockRight: boolean
	},
	integrations: Array<{ name: string, description: string, enabled: boolean, available: boolean, options: IntegrationOptions }>
}

export const DEFAULT_SETTINGS: Settings = {
	enabled: false,
	preferences: {
		ribbon: true,
		tabs: false,
		statusBar: false,
		fileHeader: false,
		sideDockLeft: true,
		sideDockRight: true,
	},
	integrations: []
}
