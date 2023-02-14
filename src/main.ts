import {
	MarkdownView,
	Plugin,
	WorkspaceLeaf
} from 'obsidian';
import {DEFAULT_SETTINGS, Settings} from "./utils/types";
import {SettingsTab} from "./components/Settings";

import {VIEW_TYPE_ZEN} from "./constants";
import {ZenView} from "./ui/ZenView";

export default class Zen extends Plugin {
	settings: Settings;
	zenView: ZenView;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		// @ts-ignore
		this.registerView(VIEW_TYPE_ZEN,  (leaf: WorkspaceLeaf) => {
			leaf.setPinned(true);
			this.zenView = new ZenView(leaf, this);
			return this.zenView;
		})

		this.addCommand({
			id: 'toggle-zen',
			name: 'Toggle',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						let zenButton = document.querySelector("[data-type='com.maxymillion.zen']") as HTMLElement;
						zenButton.click();
					}
					return true;
				}
			}
		});

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



