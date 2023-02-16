import {
	MarkdownView,
	Plugin
} from 'obsidian';
import {DEFAULT_SETTINGS, Settings} from "./utils/types";
import {SettingsTab} from "./components/Settings";

import {VIEW_TYPE_ZEN} from "./constants";
import {ZenLeaf, ZenView} from "./ui/ZenView";
import {pluginConfig} from "./plugin.config";
import {Integrator} from "./components/Intregrator";
import {pluginIntegrations} from "./plugin.integrations";

export default class Zen extends Plugin {
	settings: Settings;
	zenView: ZenView;
	integrator: Integrator;

	async onload() {
		console.log(`${pluginConfig.name}: Loading`);

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerView(VIEW_TYPE_ZEN,  (leaf: ZenLeaf) => {
			leaf.setPinned(true);
			this.zenView = new ZenView(leaf, this);
			return this.zenView;
		});

		this.addCommand({
			id: 'zen-toggle',
			name: 'Toggle',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						this.zenView.toggleZen();
					}
					return true;
				}
			}
		});

		this.integrator = new Integrator(this.app, this);
		this.integrator.load(pluginIntegrations);

		this.app.workspace.onLayoutReady(async () => {
			await this.initLeaf();
		});
	}

	async initLeaf(): Promise<void> {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_ZEN);

		await this.app.workspace.getLeftLeaf(false).setViewState({
			type: VIEW_TYPE_ZEN,
			active: false
		});
	}

	async onunload() {
		console.log(`${pluginConfig.name}: Unloading`);
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_ZEN);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);

		if(this.settings.enabled){
			document.body.className = document.body.className.split(" ").filter(c => !c.startsWith("zen-module--")).join(" ").trim();
			Object.keys(this.settings.preferences).map((key) => {
				// @ts-ignore
				if(this.settings.preferences[key] === true){
					document.body.classList.add("zen-module--"+ key);
				}
			})
		}
	}
}



