import {getIcon, Menu, setIcon, View, WorkspaceLeaf} from "obsidian";
import {VIEW_TYPE_ZEN} from "../constants";
import Zen from "../main";


export class ZenView extends View {
	leaf: WorkspaceLeaf;

	headerIcon: HTMLElement;

	plugin: Zen;

	constructor(leaf: WorkspaceLeaf, plugin: Zen) {
		super(leaf);
		this.leaf = leaf;
		this.plugin = plugin;
	}

	onunload() {
		if (this.headerIcon) {
			this.headerIcon.remove();
		}

		super.onunload();
	}

	onload() {
		let zenLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_ZEN)[0];

		if (zenLeaf) {
			this.createHeaderIcon(zenLeaf);
			// @ts-ignore
			this.updateClass(zenLeaf, this.plugin.settings.enabled);
			// @ts-ignore
			zenLeaf.tabHeaderEl.addEventListener("click", async (e: any) => {
				e.stopPropagation();
				e.preventDefault();

				this.plugin.settings.enabled = !this.plugin.settings.enabled;
				await this.plugin.saveSettings();
				await this.updateClass(zenLeaf, this.plugin.settings.enabled);
			});
		}

		super.onload();
	}

	createHeaderIcon(zenLeaf: WorkspaceLeaf) {

		let headerIcon = createEl("div", {
			cls: "zen-header",
			attr: {"data-zen": "icon", "aria-label": "Toggle Zen", "aria-label-position": "right"}
		});

		let headerInner = createEl("div", {cls: "zen-header-inner"});

		// @ts-ignore
		headerInner.appendChild(getIcon("eye-off"));
		headerIcon.appendChild(headerInner);

		headerInner.addEventListener("click", async () => {
			this.plugin.settings.enabled = !this.plugin.settings.enabled;
			await this.plugin.saveSettings();
			await this.updateClass(zenLeaf, this.plugin.settings.enabled);
		});

		this.headerIcon = headerIcon;

		// @ts-ignore
		this.app.workspace.leftSplit.getContainer().containerEl.appendChild(headerIcon);
	}

	async updateClass(leaf: any, currentState: boolean): Promise<void> {

		if (currentState) {
			document.body.classList.add("zen-enabled");

			// @ts-ignore
			setIcon(leaf.tabHeaderInnerIconEl, this.plugin.settings.enabled? 'eye-off' : 'eye');

			Object.keys(this.plugin.settings.preferences).map((key) => {
				// @ts-ignore
				if (this.plugin.settings.preferences[key] === true) {
					document.body.classList.add("zen-module--" + key);
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
		return this.plugin.settings.enabled ? 'eye' : 'eye-off';
	}
}
