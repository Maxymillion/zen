import {IntegrationOptions} from "../plugin.integrations";

export interface Settings {
	enabled: boolean,
	preferences: ZenPreferences,
	global: GlobalPreferences
	integrations: Array<{ name: string, description: string, enabled: boolean, available: boolean, options: IntegrationOptions }>
}

export interface GlobalPreferences{
	hideZenButton: boolean
}

export interface ZenPreferences{
	ribbon: boolean,
	tabs: boolean,
	statusBar: boolean,
	fileHeader: boolean,
	sideDockLeft: boolean,
	sideDockRight: boolean,
	fullScreen: boolean,
	autoHideZen: boolean,
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
		fullScreen: false,
		autoHideZen: false,
	},
	global: {
		hideZenButton: false,
	},
	integrations: []
}
