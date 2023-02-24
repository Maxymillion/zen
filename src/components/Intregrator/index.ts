import Zen from "../../main";
import {App} from "obsidian";
import {Integration} from "../../plugin.integrations";

class ExtendedApp extends App {
	plugins: any;
}

export class Integrator {
	plugin: Zen;

	app: ExtendedApp;

	integrations: Array<any> = [];

	constructor(app: App, plugin: Zen) {
		this.app = app as ExtendedApp;
		this.plugin = plugin;
	}

	async update() {
		this.plugin.settings.integrations.map((el) => {
			if (this.app.plugins.plugins[el.name]) {
				el.available = true;
			} else {
				el.available = false;
			}
		});

		await this.plugin.saveSettings();
	}

	load(integrations: any[]) {
		integrations.map((el) => {
			console.log(`${this.plugin.manifest.name}: Found integration\n[${el.name}]`);
			this.integrations.push(el);
			const foundPlugin = this.plugin.settings.integrations.filter(e => e.name === el.name);
			if (foundPlugin.length > 0) {
				foundPlugin[0].available = true;
			} else {
				this.plugin.settings.integrations.push({
					enabled: false,
					available: true,
					name: el.name,
					description: el.description,
					options: el.options
				});
			}
		});

		this.plugin.saveSettings();
	}

	getPluginObject(name: string) {
		return this.app.plugins.plugins[name];
	}

	private toggleIntegrations(type: string) {
		this.plugin.settings.integrations.filter(el => el.enabled && el.available).map((el) => {
			const loadedPlugin = this.getPluginObject(el.name);
			const integration = this.integrations.filter(e => e.name === el.name)[0];
			if (loadedPlugin) {
				integration.settings.filter((e: any) => e.type === type)[0].callback(loadedPlugin);
			}
		});
	}

	disableIntegrations() {
		this.toggleIntegrations("disable");
	}

	enableIntegrations() {
		this.toggleIntegrations("enable");
	}

	getIntegration(name: string): Integration {
		return this.integrations.filter(el => el.name === name)[0];
	}

	toggleIntegration(name: string, enable: boolean) {
		this.getIntegration(name).settings.filter(el => el.type === (enable ? "enable" : "disable"))[0].callback(this.getPluginObject(name));
	}
}
