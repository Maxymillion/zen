import {setIcon, View, WorkspaceLeaf} from "obsidian";
import {VIEW_TYPE_ZEN} from "../constants";
import Zen from "../main";
import {ZenPreferences} from "../utils/types";

export class ZenLeaf extends WorkspaceLeaf {
	tabHeaderEl: HTMLElement;

	tabHeaderInnerIconEl: HTMLElement;
}

export class ZenView extends View {
	leaf: ZenLeaf;

	headerIcon: HTMLElement;

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
		if (this.app.workspace.leftSplit) {
			this.createHeaderIcon();
		}

		this.leaf.tabHeaderEl.draggable = false;

		this.updateClass();

		this.addEventListeners();

		super.onload();
	}

	async toggleZen() {
		this.plugin.settings.enabled = !this.plugin.settings.enabled;
		if (this.plugin.settings.preferences.fullScreen) {
			this.plugin.settings.enabled ? this.containerEl.doc.body.requestFullscreen() : this.containerEl.doc.exitFullscreen();
		}

		await this.plugin.saveSettings();
		await this.updateClass();
	}

	addEventListeners() {
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

		let timer: ReturnType<typeof setTimeout>;
		this.containerEl.doc.onmousemove = () => {
			if (!this.plugin.settings.enabled) return;
			if (!this.plugin.settings.preferences.sideDockLeft) return;

			this.headerIcon.style.display = 'flex';
			clearTimeout(timer);
			timer = setTimeout(() => {
				this.headerIcon.style.display = 'none';
			}, 1000);
		};

		// @ts-ignore
		this.app.workspace.leftSplit.getContainer().containerEl.appendChild(headerIcon);
	}

	addBodyClasses(addBaseClass?: boolean): void {
		if (addBaseClass) {
			this.containerEl.doc.body.addClass("zen-enabled");
		}
		Object.keys(this.plugin.settings.preferences).map((key: string) => {
			if (this.plugin.settings.preferences[key as keyof ZenPreferences]) {
				this.containerEl.doc.body.addClass("zen-module--" + key);
			}
		})
	}

	removeBodyClasses(removeBaseClass?: boolean): void {
		if (removeBaseClass) {
			this.containerEl.doc.body.removeClass("zen-enabled");
		}
		this.containerEl.doc.body.className = this.containerEl.doc.body.className.split(" ").filter(c => !c.startsWith("zen-module--")).join(" ").trim();
	}

	async updateClass(): Promise<void> {

		setIcon(this.leaf.tabHeaderInnerIconEl, this.plugin.settings.enabled ? 'eye-off' : 'eye');

		if (this.plugin.settings.enabled) {
			this.removeBodyClasses();
			this.addBodyClasses(true);

			this.plugin.integrator.enableIntegrations();

		} else {
			this.removeBodyClasses(true);
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
