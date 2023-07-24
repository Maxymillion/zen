export interface Integration {
	name: string,
	description: string,
	enabled: boolean,
	available: boolean,
	options: IntegrationOptions,
	settings: {
		type: "enable" | "disable",
		callback(plugin: any): void
	}[]
}

export interface IntegrationOptions {
	[key: string]: {
		active: boolean,
		description?: string
	}
}

export const pluginIntegrations: Integration[] = [
	{
		name: "cm-typewriter-scroll-obsidian",
		description: "Automatically enable typewriter scroll when entering Zen mode.",
		enabled: false,
		available: false,
		options: {
			zenEnabled: {
				active: false,
				description: "Enable the darkening of non-active lines"
			}
		},
		settings: [
			{
				type: "enable",
				callback(plugin: any): void {
					plugin.enableZen();
					return plugin.enableTypewriterScroll();
				}
			}, {
				type: "disable",
				callback(plugin: any): void {
					plugin.disableZen();
					return plugin.disableTypewriterScroll();
				}
			}
		]
	},
	{
		name: "obsidian-stille",
		description: "Automatically enable Stille when entering Zen mode.",
		enabled: false,
		available: false,
		options: {
		},
		settings: [
			{
				type: "enable",
				callback(plugin: any): void {
					return plugin.toggleStille();
				}
			}, {
				type: "disable",
				callback(plugin: any): void {
					return plugin.toggleStille();
				}
			}
		]
	}
];
