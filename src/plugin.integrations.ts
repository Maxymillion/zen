interface Integration {
	name: string,
	description: string,
	enabled: boolean,
	available: boolean,
	settings: {
		type: "enable" | "disable",
		callback(plugin: any): void
	}[]
}

export const pluginIntegrations: Integration[] = [
	{
		name: "cm-typewriter-scroll-obsidian",
		description: "Automatically enable typewriter scroll when entering Zen mode.",
		enabled: false,
		available: false,
		settings: [
			{
				type: "enable",
				callback(plugin: any): void {
					return plugin.enableTypewriterScroll();
				}
			}, {
				type: "disable",
				callback(plugin: any): void {
					return plugin.disableTypewriterScroll();
				}
			}
		]
	}
];
