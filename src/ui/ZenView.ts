import {setIcon, View, WorkspaceLeaf} from "obsidian";
import {VIEW_TYPE_ZEN} from "../constants";
import Zen from "../main";


export class ZenView extends View {
	leaf: WorkspaceLeaf;

	plugin: Zen;

	constructor(leaf: WorkspaceLeaf, plugin: Zen) {
		super(leaf);
		this.leaf = leaf;
		this.plugin = plugin;
	}

	onload() {
		let zenLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_ZEN)[0];

		if (zenLeaf) {
			this.updateClass(zenLeaf, this.plugin.settings.enabled);
			// @ts-ignore
			zenLeaf.tabHeaderEl.addEventListener("click", async (e: any) => {
				e.stopPropagation();
				e.preventDefault();

				this.plugin.settings.enabled= !this.plugin.settings.enabled;
				await this.plugin.saveSettings();
				await this.updateClass(zenLeaf, this.plugin.settings.enabled);
			});
		}
		super.onload();
	}

	async updateClass(leaf: any, currentState: boolean): Promise<void> {
		// @ts-ignore
		setIcon(leaf.tabHeaderInnerIconEl, this.plugin.settings.enabled? 'eye-off' : 'eye');

		if (currentState) {
			document.body.classList.add("zen-enabled");
			Object.keys(this.plugin.settings.preferences).map((key) => {
				// @ts-ignore
				if(this.plugin.settings.preferences[key] === true){
					document.body.classList.add("zen-module--"+ key);
				}
			})
			await this.plugin.saveSettings();
		} else {
			document.body.classList.remove("zen-enabled");
			document.body.className = document.body.className.split(" ").filter(c => !c.startsWith("zen-module--")).join(" ").trim();
			await this.plugin.saveSettings();
		}
	}

	getViewType(): string {
		return VIEW_TYPE_ZEN;
	}

	getDisplayText(): string {
		return 'Toggle Zen';
	}

	getIcon(): string {
		return this.plugin.settings.enabled ? 'eye-off' : 'eye';
	}
}
