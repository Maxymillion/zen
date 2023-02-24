import {setIcon, View, WorkspaceLeaf} from "obsidian";
import {VIEW_TYPE_ZEN} from "../constants";
import Zen from "../main";


export class ZenLeaf extends WorkspaceLeaf{
	tabHeaderEl: HTMLElement;

	tabHeaderInnerIconEl: HTMLElement;
}

export class ZenView extends View {
	leaf: ZenLeaf;

	headerIcon: HTMLElement;

	lastActiveSibling: HTMLElement | undefined;

	plugin: Zen;

	navigation: true;

	constructor(leaf: ZenLeaf, plugin: Zen) {
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
		console.log(this.app);
		if (this.app.workspace.leftSplit) {
			this.createHeaderIcon();
		}

		this.leaf.tabHeaderEl.draggable =false;

		this.updateClass();

		this.addEventListeners();

		super.onload();
	}

	async toggleZen() {
		this.plugin.settings.enabled = !this.plugin.settings.enabled;
		await this.plugin.saveSettings();
		await this.updateClass();
	}

	addEventListeners(){
		this.leaf.tabHeaderEl.addEventListener("click", async (e: any) => {
			e.stopPropagation();
			e.preventDefault();
			await this.toggleZen();
		});
	}

	createHeaderIcon() {
		let headerIcon = createEl("div", {
			cls: "zen-header",
			attr: {"data-zen": "icon", "aria-label": "Zen", "aria-label-position": "bottom"}
		});

		let headerInner = createEl("div", {cls: "zen-header-inner"});
		setIcon(headerInner, 'eye-off');

		headerInner.addEventListener("click", async () => {
			await this.toggleZen();
		});

		headerIcon.appendChild(headerInner);
		this.headerIcon = headerIcon;

		// @ts-ignore
		this.app.workspace.leftSplit.getContainer().containerEl.appendChild(headerIcon);
	}

	async updateClass(): Promise<void> {

		setIcon(this.leaf.tabHeaderInnerIconEl, this.plugin.settings.enabled ? 'eye-off' : 'eye');

		if (this.plugin.settings.enabled) {
			document.body.classList.add("zen-enabled");

			Object.keys(this.plugin.settings.preferences).map((key) => {
				// @ts-ignore
				if (this.plugin.settings.preferences[key] === true) {
					document.body.classList.add("zen-module--" + key);
				}
			});

			this.plugin.integrator.enableIntegrations();

		} else {
			document.body.classList.remove("zen-enabled");
			document.body.className = document.body.className.split(" ").filter(c => !c.startsWith("zen-module--")).join(" ").trim();
			this.plugin.integrator.disableIntegrations();
		}

		await this.plugin.saveSettings();
	}

	getViewType(): string {
		return VIEW_TYPE_ZEN;
	}

	getDisplayText(): string {
		return 'Zen';
	}

	getIcon(): string {
		return !this.plugin.settings.enabled ? 'eye' : 'eye-off';
	}
}
