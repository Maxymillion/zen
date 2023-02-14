import {App, ButtonComponent, PluginSettingTab, Setting} from "obsidian";
import {pluginConfig} from "../../plugin.config";
import Zen from "../../main";
import {VIEW_TYPE_ZEN} from "../../constants";

export class SettingsTab extends PluginSettingTab {
	plugin: Zen;

	constructor(app: App, plugin: Zen) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h1', {text: pluginConfig.name});

		new Setting(containerEl)
			.setHeading()
			.setName("What elements should be hidden when zen mode is enabled?")

		new Setting(containerEl)
			.setName("Application Ribbon")
			.addButton(bc => this.highlightElement(bc, ".workspace-ribbon.mod-left"))
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.ribbon)
				.onChange(async (value) => {
					this.plugin.settings.preferences.ribbon = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Tabs")
			.addButton(bc => this.highlightElement(bc, ".workspace-split.mod-vertical .workspace-tab-header-container"))
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.tabs)
				.onChange(async (value) => {
					this.plugin.settings.preferences.tabs = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Statusbar")
			.addButton(bc => this.highlightElement(bc, ".status-bar", true))
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.statusBar)
				.onChange(async (value) => {
					this.plugin.settings.preferences.statusBar = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("File Header")
			.addButton(bc => this.highlightElement(bc, ".workspace-split.mod-vertical .view-header"))
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.fileHeader)
				.onChange(async (value) => {
					this.plugin.settings.preferences.fileHeader = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Left side-dock")
			.addButton(bc => this.highlightElement(bc, ".workspace-split.mod-horizontal.mod-left-split", false, `.workspace-tab-header[data-type='${VIEW_TYPE_ZEN}']`))
			.setDesc("Including the side-dock toggle button(s), except the 'zen-toggle-button'.")
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.sideDockLeft)
				.onChange(async (value) => {
					this.plugin.settings.preferences.sideDockLeft = value;

					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Right side-dock")
			.addButton(bc => this.highlightElement(bc, ".workspace-split.mod-horizontal.mod-right-split"))
			.setDesc("Including the side-dock toggle button(s).")
			.addToggle(tc => tc
				.setValue(this.plugin.settings.preferences.sideDockRight)
				.onChange(async (value) => {
					this.plugin.settings.preferences.sideDockRight = value;
					await this.plugin.saveSettings();
				})
			);
	}

	highlightElement(c: ButtonComponent, el: string, isAbsolute: boolean = false, exceptionEls: string|null = null) {
		//Status bar is outside of this.app.workspace.containerEl
		const element = document.body.find(el);

		const exceptionElements = exceptionEls && document.querySelectorAll(exceptionEls);
		const highlightClass = isAbsolute ? "zen-highlight-el-ab" : "zen-highlight-el";
		const exceptionClass = "zen-highlight-el--exception";

		c.setIcon("eye");
		c.setTooltip("Highlight");

		c.buttonEl.addEventListener("mousedown", () => {
			element?.classList.add(highlightClass);
			exceptionElements && exceptionElements.forEach((sEl) =>{
				sEl.classList.add(exceptionClass);
			})
		});

		c.buttonEl.addEventListener("mouseup", () => {
			element?.classList.remove(highlightClass);
			exceptionElements && exceptionElements.forEach((sEl) =>{
				sEl.classList.remove(exceptionClass);
			})
		});

		c.buttonEl.addEventListener("mouseleave", () => {
			element?.classList.remove(highlightClass);
			exceptionElements && exceptionElements.forEach((sEl) =>{
				sEl.classList.remove(exceptionClass);
			})
		});
	}
}
