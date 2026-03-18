import { Settings } from "src/plugin/settings/settings";
import { AssetLoader } from "./base-asset.js";
import { AssetType, InlinePolicy, LoadMethod, Mutability } from "./asset-types.js";
import { AssetHandler } from "./asset-handler.js";
import { ObsidianStyles } from "./obsidian-styles.js";

export class OtherPluginStyles extends AssetLoader
{
    private lastEnabledPluginStyles: string[] = [];
    private static readonly tabsPluginCandidates = ["tabs", "obsidian-tabs"];

    constructor()
    {
        super("other-plugins.css", "", null, AssetType.Style, InlinePolicy.AutoHead, true, Mutability.Dynamic, LoadMethod.Async, 9);
    }

	public static async getStyleForPlugin(pluginName: string): Promise<string>
	{
		const path = AssetHandler.vaultPluginsPath.joinString(pluginName.replace("\n", ""), "styles.css");
		if (!path.exists) return "";
		
		return await path.readAsString() ?? "";
	}

	private static isTabsPluginName(pluginName: string): boolean
	{
		return OtherPluginStyles.tabsPluginCandidates.contains(pluginName.trim().toLowerCase());
	}

	private static async getTabsPluginStyle(): Promise<{name: string; style: string} | undefined>
	{
		for (const pluginName of OtherPluginStyles.tabsPluginCandidates)
		{
			const style = await OtherPluginStyles.getStyleForPlugin(pluginName);
			if (style) return { name: pluginName, style };
		}

		return;
	}

	override async load()
	{
		if(this.lastEnabledPluginStyles == Settings.exportOptions.includePluginCss) return;

		this.data = "";
		let tabsPluginStyleLoaded = false;
		for (let i = 0; i < Settings.exportOptions.includePluginCss.length; i++)
		{
			if (!Settings.exportOptions.includePluginCss[i] || (Settings.exportOptions.includePluginCss[i] && !(/\S/.test(Settings.exportOptions.includePluginCss[i])))) continue;
			const pluginName = Settings.exportOptions.includePluginCss[i].trim();
			const style = await OtherPluginStyles.getStyleForPlugin(pluginName);
	           
			if (style)
			{
				// Tabs relies on "tab*" selectors that are stripped by the generic Obsidian filter.
				// Keep the plugin CSS intact so exported tabs match Obsidian.
				if (OtherPluginStyles.isTabsPluginName(pluginName))
				{
					this.data += style;
					tabsPluginStyleLoaded = true;
					console.log("Loaded tabs plugin style (unfiltered): " + pluginName + " size: " + style.length);
				}
				else
				{
					this.data += await AssetHandler.filterStyleRules(style, ObsidianStyles.obsidianStyleAlwaysFilter, ObsidianStyles.obsidianStylesFilter, ObsidianStyles.stylesKeep);
					console.log("Loaded plugin style: " + pluginName + " size: " + style.length);
				}
			}
		}

		// Add tabs plugin styles
		if (!tabsPluginStyleLoaded) {
			const tabsPlugin = await OtherPluginStyles.getTabsPluginStyle();
			if (tabsPlugin?.style) {
				this.data += tabsPlugin.style;
				tabsPluginStyleLoaded = true;
				console.log("Loaded tabs plugin style (unfiltered): " + tabsPlugin.name + " size: " + tabsPlugin.style.length);
			}
		}

		if (!tabsPluginStyleLoaded) {
			console.log("Tabs plugin style file not found. Using fallback tabs CSS.");
			// Fallback tabs styles
			this.data += `
                /* Tabs plugin styles */
                .tabs-container {
                    border: 1px solid var(--tabs-border-color, var(--background-modifier-border));
                    border-radius: var(--tabs-border-radius, var(--radius-m));
                    margin: 1em 0;
                    overflow: hidden;
                }

                .tabs-container.tabs-border-always {
                    border: 1px solid var(--tabs-border-color, var(--background-modifier-border));
                }

                .tabs-container .tabs-nav {
                    display: flex;
                    flex-wrap: wrap;
                    background-color: var(--tabs-nav-background, var(--background-secondary));
                    border-bottom: 1px solid var(--tabs-border-color, var(--background-modifier-border));
                }

                .tabs-container .tabs-nav.tabs-nav-top {
                    flex-direction: row;
                }

                .tabs-container .tabs-nav .tabs-nav-item-wrapper {
                    display: flex;
                    overflow-x: auto;
                    flex-grow: 1;
                }

                .tabs-container .tabs-nav .tabs-nav-item {
                    padding: 0.5em 1.5em;
                    cursor: pointer;
                    border-bottom: 3px solid transparent;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                    font-size: var(--font-size-normal);
                    color: var(--text-muted);
                    height: 36px;
                    display: flex;
                    align-items: center;
                }

                .tabs-container .tabs-nav .tabs-nav-item .tabs-nav-item-md {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                .tabs-container .tabs-nav .tabs-nav-item .tabs-nav-item-md p {
                    margin: 0;
                    padding: 0;
                    line-height: 1;
                }

                .tabs-container .tabs-nav .tabs-nav-item:hover {
                    background-color: var(--tabs-nav-item-hover-background, var(--background-modifier-hover));
                    color: var(--text-normal);
                }

                .tabs-container .tabs-nav .tabs-nav-item.tabs-nav-item-active {
                    border-bottom-color: var(--tabs-nav-item-active-color, var(--interactive-accent));
                    background-color: var(--tabs-nav-item-active-background, var(--background-primary));
                    color: var(--text-normal);
                    font-weight: 500;
                }

                .tabs-container .tabs-contents {
                    padding: var(--tabs-contents-padding, 1.5em);
                    background-color: var(--tabs-contents-background, var(--background-primary));
                    min-height: 100px;
                }

                .tabs-container .tabs-contents .tabs-content {
                    display: none;
                }

                .tabs-container .tabs-contents .tabs-content.tabs-content-active {
                    display: block;
                }
			`;
		}

		this.lastEnabledPluginStyles = Settings.exportOptions.includePluginCss;
		await super.load();
	}
}
