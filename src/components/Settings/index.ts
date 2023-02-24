import {App, ButtonComponent, getIcon, PluginSettingTab, Setting} from "obsidian";
import {pluginConfig} from "../../plugin.config";
import Zen from "../../main";
import {Integration} from "../../plugin.integrations";

export class SettingsTab extends PluginSettingTab {
	plugin: Zen;

	constructor(app: App, plugin: Zen) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h1', {text: this.plugin.manifest.name});

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
			.addButton(bc => this.highlightElement(bc, ".workspace-split.mod-horizontal.mod-left-split", false))
			.setDesc("Including the side-dock toggle button(s).")
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

		new Setting(containerEl)
			.setHeading()
			.setName("Integrations")
			.setDesc(createFragment((el) => {
				let element = el.createSpan({text: "See available integrations "});
				element.appendChild(el.createEl("a", {
					href: "https://github.com/Maxymillion/zen#Integrations",
					text: "here"
				}));
			}))

		this.plugin.integrator.update();

		if (this.plugin.settings.integrations.filter(e => e.available).length < 1) {
			//Add description...
			new Setting(containerEl)
				.setDesc(createFragment((el) => {
					el.createEl("i", {text: "No supported integrations found!"})
				}))
		}


		this.plugin.settings.integrations.map((el: Integration) => {
				if (el.available) {
					const integratedPlugin = this.plugin.integrator.getPluginObject(el.name);

					if (integratedPlugin) {
						const pluginEl = createEl("div", {cls: "zen-int-block", attr: {"data-enabled": el.enabled}});

						new Setting(pluginEl)
							.setName(createFragment((frag) => {
								let pluginTitle = frag.createEl("a", {
									cls: "zen-int--link",
									text: integratedPlugin.manifest.name,
									href: `${integratedPlugin.manifest.authorUrl}/${integratedPlugin.manifest.id}`
								});
								pluginTitle.appendChild(frag.createSpan({
									cls: "zen-int--author",
									text: ` by ${integratedPlugin.manifest.author}`
								}))
							}))
							.setDesc(el.description)
							.addToggle(tc => tc
								.setValue(el.enabled)
								.onChange(async (value) => {
									el.enabled = value;
									pluginEl.setAttr("data-enabled", value);

									if(this.plugin.settings.enabled){
										this.plugin.integrator.toggleIntegration(el.name, value);
									}

									await this.plugin.saveSettings();
								})
							)

						//Show extra option toggles if they are defined
						if (Object.keys(el.options).length > 0) {
							const pluginOptionsTriggerEl = createEl("div", {cls: "zen-int-block--options-trigger"});
							const caret = getIcon("chevron-down");

							if (caret) {
								pluginOptionsTriggerEl.append(createFragment((frag) => {
									frag.appendChild(caret);
									frag.createSpan({text: "Extra options"});
								}));

								pluginOptionsTriggerEl.addEventListener("click", (e) => {
									pluginEl.classList.toggle("options-open");
								})
							}

							pluginEl.appendChild(pluginOptionsTriggerEl);
						}
						const pluginOptionsEl = createEl("div", {cls: "zen-int-block--options"});

						Object.keys(el.options).map((key: string) => {
								if (key in integratedPlugin.settings) {

									new Setting(pluginOptionsEl)
										.setName(el.options[key].description ?? key)
										.addToggle(tc => tc
											.setValue(el.options[key].active)
											.onChange(async (value) => {
												el.options[key].active = value;
												await this.plugin.saveSettings();
											})
										)
										.nameEl.addEventListener("click", async (e) => {
											(pluginOptionsEl.querySelector(".setting-item-control input") as HTMLElement)?.click();
										}
									);
								}
							}
						);

						pluginEl.appendChild(pluginOptionsEl);
						containerEl.appendChild(pluginEl);
					}
				}
			}
		)
	}

	highlightElement(c: ButtonComponent, el: string, isAbsolute: boolean = false) {
		//Status bar is outside of this.app.workspace.containerEl
		const element = document.body.find(el);

		const highlightClass = isAbsolute ? "zen-highlight-el-ab" : "zen-highlight-el";

		c.setIcon("eye");
		c.setTooltip("Highlight");

		c.buttonEl.addEventListener("mousedown", () => {
			element?.classList.add(highlightClass);
		});

		c.buttonEl.addEventListener("mouseup", () => {
			element?.classList.remove(highlightClass);
		});

		c.buttonEl.addEventListener("mouseleave", () => {
			element?.classList.remove(highlightClass);
		});
	}
}
