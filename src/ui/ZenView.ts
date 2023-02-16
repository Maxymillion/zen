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

		if(this.app.workspace.leftSplit){
			this.createHeaderIcon();
		}

		this.updateClass();

		// @ts-ignore
		this.leaf.tabHeaderEl.addEventListener("click", async (e: any) => {
			e.stopPropagation();
			e.preventDefault();
			await this.toggleZen();
		});


		super.onload();
	}

	async toggleZen() {
		this.plugin.settings.enabled = !this.plugin.settings.enabled;
		await this.plugin.saveSettings();
		await this.updateClass();
	}

	createHeaderIcon() {

		let headerIcon = createEl("div", {
			cls: "zen-header",
			attr: {"data-zen": "icon", "aria-label": "Toggle Zen", "aria-label-position": "right"}
		});

		let headerInner = createEl("div", {cls: "zen-header-inner"});

		// @ts-ignore
		headerInner.appendChild(getIcon("eye-off"));
		headerIcon.appendChild(headerInner);

		headerInner.addEventListener("click", async () => {
			await this.toggleZen();
		});

		this.headerIcon = headerIcon;

		// @ts-ignore
		this.app.workspace.leftSplit.getContainer().containerEl.appendChild(headerIcon);
	}

	async updateClass(): Promise<void> {

		if (this.plugin.settings.enabled) {
			document.body.classList.add("zen-enabled");


			// @ts-ignore
			setIcon(this.leaf.tabHeaderInnerIconEl, this.plugin.settings.enabled ? 'eye-off' : 'eye');

			Object.keys(this.plugin.settings.preferences).map((key) => {
				// @ts-ignore
				if (this.plugin.settings.preferences[key] === true) {
					document.body.classList.add("zen-module--" + key);
				}
			});

		} else {
			document.body.classList.remove("zen-enabled");
			document.body.className = document.body.className.split(" ").filter(c => !c.startsWith("zen-module--")).join(" ").trim();
		}
		await this.plugin.saveSettings();
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
