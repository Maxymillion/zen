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
	}
}
