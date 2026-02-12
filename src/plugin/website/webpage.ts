import { FileSystemAdapter, FrontMatterCache, TFile, parseYaml } from "obsidian";
import { Path } from "src/plugin/utils/path";
import { Attachment } from "src/plugin/utils/downloadable";
import { OutlineTree } from "src/plugin/features/outline-tree";
import { Website } from "./website";
import { _MarkdownRendererInternal, ExportLog } from "src/plugin/render-api/render-api";
import { MarkdownRendererAPI } from "src/plugin/render-api/render-api";
import { ExportPipelineOptions } from "src/plugin/website/pipeline-options.js";
import { DocumentType } from "src/shared/website-data";
import { Settings } from "src/plugin/settings/settings";
import { AssetHandler } from "src/plugin/asset-loaders/asset-handler";
import { Shared } from "src/shared/shared";
import { moment } from "obsidian";
import { promises as fs } from "fs";
import path from "path";

export class WebpageOutputData
{
	public html: string = "";
	public title: string = "";
	public icon: string = "";
	public description: string = "";
	public author: string = "";
	public fullURL: string = "";
	public rssDate: string = "";
	public pathToRoot: string = "";
	public coverImageURL: string = "";
	public allTags: string[] = [];
	public inlineTags: string[] = [];
	public frontmatterTags: string[] = [];
	public aliases: string[] = [];
	public backlinks: Webpage[] = [];
	public headings: {heading: string, level: number, id: string, headingEl: HTMLElement}[] = [];
	public renderedHeadings: {heading: string, level: number, id: string}[] = [];
	public descriptionOrShortenedContent: string = "";
	public searchContent: string = "";
	public srcLinks: string[] = [];
	public hrefLinks: string[] = [];
	public linksToOtherFiles: string[] = [];
}

export class Webpage extends Attachment
{
	public get source(): TFile
	{
		return super.source as TFile;
	}

	public set source(file: TFile)
	{
		super.source = file;
	}

	public website: Website;
	public pageDocument: Document = document.implementation.createHTMLDocument();
	public attachments: Attachment[] = [];
	public type: DocumentType = DocumentType.Markdown;
	public title: string = "";
	public icon: string = "";
	private static advancedSlidesAssetsPromise: Promise<Attachment[]> | undefined;
	private static advancedSlidesEmbedCache: Map<string, Attachment> = new Map();

	/**
	 * @param file The original markdown file to export
	 * @param destination The absolute path to the FOLDER we are exporting to
	 * @param name The name of the file being exported without the extension
	 * @param website The website this file is part of
	 * @param options The options for exporting this file
	 */
	constructor(file: TFile, filename: string, website: Website, options?: ExportPipelineOptions)
	{
		if (!MarkdownRendererAPI.isConvertable(file.extension)) throw new Error("File type not supported: " + file.extension);

		const targetPath = website.getTargetPathForFile(file, filename);
		options = Object.assign(Settings.exportOptions, options);

		super("", targetPath, file, options);
		this.targetPath.setExtension("html");
		this.exportOptions = options;
		this.source = file;
		this.website = website;

		if (this.exportOptions.flattenExportPaths) 
			this.targetPath.parent = Path.emptyPath;
	}

	public outputData: WebpageOutputData = new WebpageOutputData();

	public async generateOutput()
	{
		const output = new WebpageOutputData();
		output.html = this.html;
		output.title = this.title;
		output.icon = this.icon;
		output.description = this.descriptionOrShortenedContent;
		output.author = this.author;
		output.fullURL = this.fullURL;
		output.rssDate = this.rssDate;
		output.pathToRoot = this.pathToRoot.path;
		output.coverImageURL = this.coverImageURL ?? "";
		output.allTags = this.allTags;
		output.frontmatterTags = this.frontmatterTags;
		output.aliases = this.aliases;
		output.backlinks = this.backlinks;
		output.headings = this.headings;
		output.renderedHeadings = await this.getRenderedHeadings();
		output.descriptionOrShortenedContent = this.descriptionOrShortenedContent;
		output.searchContent = this.searchContent;
		output.srcLinks = this.srcLinks;
		output.hrefLinks = this.hrefLinks;
		output.linksToOtherFiles = this.linksToOtherFiles;

		this.data = output.html;

		this.outputData = output;
	}

	private get searchContent(): string
	{
		const contentElement = this.sizerElement ?? this.viewElement ?? this.pageDocument?.body;
		if (!contentElement)
		{
			return "";
		}

		const skipSelector = ".math, svg, img, .frontmatter, .metadata-container, .heading-after, style, script";
		function getTextNodes(element: HTMLElement): Node[]
		{
			const textNodes = [];
			const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
	
			let node;
			while (node = walker.nextNode()) 
			{
				if (node.parentElement?.closest(skipSelector))
				{
					continue;
				}

				textNodes.push(node);
			}
	
			return textNodes;
		}

		const textNodes = getTextNodes(contentElement);

		let content = '';
		for (const node of textNodes) 
		{
			content += ' ' + node.textContent + ' ';
		}

		content += this.hrefLinks.join(" ");
		content += this.srcLinks.join(" ");

		content = content.trim().replace(/\s+/g, ' ');

		return content;
	}

	/**
	 * The HTML string for the file
	 */
	private get html(): string
	{
		const htmlString = "<!DOCTYPE html> " + this.pageDocument.documentElement.outerHTML;
		return htmlString;
	}

	/**
	 * The element that contains the content of the document, aka the markdown-preview-view or view-content
	 */
	private get viewElement(): HTMLElement | undefined
	{
		return this.pageDocument.querySelector(".obsidian-document") as HTMLElement;
	}

	/**
	 * The element that determines the size of the document, aka the markdown-preview-sizer
	 */
	private get sizerElement(): HTMLElement | undefined
	{
		return (this.pageDocument.querySelector(".canvas-wrapper") ?? this.pageDocument.querySelector(".markdown-preview-sizer") ?? this.pageDocument.querySelector(".obsidian-document")) as HTMLElement | undefined;
	}

	/**
	 * The header eleent which holds the title and various other non-body text info
	 */
	private get headerElement(): HTMLElement | undefined
	{
		return this.pageDocument.querySelector(".header") as HTMLElement | undefined;
	}

	/**
	 * The footer element which holds the footer text
	 */
	private get footerElement(): HTMLElement | undefined
	{
		return this.pageDocument.querySelector(".footer") as HTMLElement | undefined;
	}

	/**
	 * The relative path from exportPath to rootFolder
	 */
	private get pathToRoot(): Path
	{
		const ptr = Path.getRelativePath(this.targetPath, new Path(this.targetPath.workingDirectory), true);
		return ptr;
	}

	private get allTags(): string[]
	{
		const tags = this.frontmatterTags.concat(this.inlineTags);

		// remove duplicates
		const uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) == index);

		return uniqueTags;
	}

	private get frontmatterTags(): string[]
	{
		let tags: string[] = [];
		const frontmatterTags = this.frontmatter?.tags || [];
		
		// if frontmatter.tags is not an array, make it an array
		if(!Array.isArray(frontmatterTags)){
			tags = [String(frontmatterTags)];
		} else {
			tags = frontmatterTags.map((tag) => String(tag));
		}

		// if a tag doesn't start with a #, add it
		tags = tags.map(tag => tag.startsWith("#") ? tag : "#" + tag);
		
		return tags;
	}

	private get inlineTags(): string[]
	{
		const tagCaches = app.metadataCache.getFileCache(this.source)?.tags?.values();
		const tags: string[] = [];
		if (tagCaches)
		{
			tags.push(...Array.from(tagCaches).map((tag) => tag.tag));
		}

		return tags;
	}

	public get headings(): {heading: string, level: number, id: string, headingEl: HTMLElement}[]
	{
		const headers: {heading: string, level: number, id: string, headingEl: HTMLElement}[] = [];
		if (this.pageDocument)
		{
			this.pageDocument.querySelectorAll(".heading").forEach((headerEl: HTMLElement) =>
			{
				let level = parseInt(headerEl.tagName[1]);
				if (headerEl.closest("[class^='block-language-']") || headerEl.closest(".markdown-embed.inline-embed")) level += 6;
				const heading = headerEl.getAttribute("data-heading") ?? headerEl.innerText ?? "";
				headers.push({heading, level, id: headerEl.id, headingEl: headerEl});
			});
		}

		return headers;
	}

	private async getRenderedHeadings(): Promise<{ heading: string; level: number; id: string; }[]>
	{
		const headings = this.headings.map((header) => {return {heading: header.heading, level: header.level, id: header.id}});
		
		for (const header of headings)
		{
			const h = await MarkdownRendererAPI.renderMarkdownSimple(header.heading) ?? header.heading;
			header.heading = h;
		}

		return headings;
	}

	private get aliases(): string[]
	{
		const aliases = this.frontmatter?.aliases ?? [];
		return aliases;
	}

	private get description(): string
	{
		return this.frontmatter["description"] || this.frontmatter["summary"] || "";
	}

	private get descriptionOrShortenedContent(): string
	{
		let description = this.description;
		let localThis = this;

		if (!description)
		{
			if(!this.viewElement) return "";
			const content = this.viewElement.cloneNode(true) as HTMLElement;
			content.querySelectorAll(`h1, h2, h3, h4, h5, h6, .mermaid, table, mjx-container, style, script, 
.mod-header, .mod-footer, .metadata-container, .frontmatter, img[src^="data:"]`).forEach((heading) => heading.remove());

			// update image links
			content.querySelectorAll("[src]").forEach((el: HTMLImageElement) => 
			{
				let src = el.getAttribute("src");
				if (!src) return;
				if (src.startsWith("http") || src.startsWith("data:")) return;
				if (src.startsWith("data:")) 
				{
					el.remove();
					return;
				}
				src = src.replace("app://obsidian", "");
				src = src.replace(".md", "");
				const path = Path.joinStrings(this.exportOptions.rssOptions.siteUrl ?? "", src);
				el.setAttribute("src", path.path);
			});

			// update normal links
			content.querySelectorAll("[href]").forEach((el: HTMLAnchorElement) => 
			{
				let href = el.getAttribute("href");
				if (!href) return; 
				if (href.startsWith("http") || href.startsWith("data:")) return;
				href = href.replace("app://obsidian", "");
				href = href.replace(".md", "");
				const path = Path.joinStrings(this.exportOptions.rssOptions.siteUrl ?? "", href);
				el.setAttribute("href", path.path);
			});

			function keepTextLinksImages(element: HTMLElement) 
			{
				const walker = localThis.pageDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
				let node;
				const nodes = [];
				while (node = walker.nextNode()) 
				{
					if (node.nodeType == Node.ELEMENT_NODE)
					{
						const element = node as HTMLElement;
						if (element.tagName == "A" || element.tagName == "IMG" || element.tagName == "BR")
						{
							nodes.push(element);
						}

						if (element.tagName == "DIV")
						{
							const classes = element.parentElement?.classList;
							if (classes?.contains("heading-children") || classes?.contains("markdown-preview-sizer"))
							{
								nodes.push(document.createElement("br"));
							}
						}

						if (element.tagName == "LI") 
						{
							nodes.push(document.createElement("br"));
						}
					}
					else
					{
						if (node.parentElement?.tagName != "A" && node.parentElement?.tagName != "IMG")
							nodes.push(node);
					}
				}

				element.innerHTML = "";
				element.append(...nodes);
			}

			
			keepTextLinksImages(content);

			//remove subsequent br tags
			content.querySelectorAll("br").forEach((br: HTMLElement) => 
			{
				const next = br.nextElementSibling;
				if (next?.tagName == "BR") br.remove();
			});

			// remove br tags at the start and end of the content
			const first = content.firstElementChild;
			if (first?.tagName == "BR") first.remove();
			const last = content.lastElementChild;
			if (last?.tagName == "BR") last.remove();

			description = content.innerHTML;
			content.remove();
		}

		// remove multiple whitespace characters in a row
		description = description.replace(/\s{2,}/g, " ");

		return description ?? "";
	}

	private get author(): string
	{
		return this.frontmatter["author"] || this.exportOptions.rssOptions.authorName || "";
	}

	private get fullURL(): string
	{
		const url = Path.joinStrings(this.exportOptions.rssOptions.siteUrl ?? "", this.targetPath.path).path;
		return url;
	}

	private get rssDate(): string
	{
		// if it has a date in the frontmatter, use that
		const date = this.frontmatter[Settings.rssDateProperty];
		console.log(date);
		if (date) return date;

		// if it doesn't, use the file's modified date
		const mtimeMs = this.source.stat.mtime;
		const rssDate = new Date(mtimeMs).toISOString();
		return rssDate;
	}

	private get backlinks(): Webpage[]
	{
		// @ts-ignore
		const backlinks = Array.from(app.metadataCache.getBacklinksForFile(this.source)?.data?.keys?.() || []);
		let linkedWebpages = backlinks.map((path: string) => this.website.index.getWebpage(path)) as Webpage[];
		linkedWebpages = linkedWebpages.filter((page) => page != undefined);
		return linkedWebpages;
	}

	private get coverImageURL(): string | undefined
	{
		if (!this.viewElement) return undefined;
		let mediaPathStr = this.viewElement.querySelector("img")?.getAttribute("src") ?? "";
		if (mediaPathStr.startsWith("data:")) return undefined;
		const hasMedia = mediaPathStr.length > 0;
		if (!hasMedia) return undefined;

		if (!mediaPathStr.startsWith("http") && !mediaPathStr.startsWith("data:"))
		{
			// Use getFilePathFromSrc to properly resolve app:// URLs and other paths
			const resolvedPath = this.website.getFilePathFromSrc(mediaPathStr, this.source.path);
			const attachment = this.website.index.getFile(resolvedPath.pathname, true);
			
			if (attachment) {
				mediaPathStr = attachment.targetPath.path;
			} else {
				// Fallback to resolved path if attachment not found
				mediaPathStr = resolvedPath.path;
			}
			
			const mediaPath = Path.joinStrings(this.exportOptions.rssOptions.siteUrl ?? "", mediaPathStr);
			mediaPathStr = mediaPath.path;
		}

		return mediaPathStr;
	}

	private get frontmatter(): FrontMatterCache
	{
		const frontmatter = app.metadataCache.getFileCache(this.source)?.frontmatter ?? {};
		return frontmatter;
	}

	private get srcLinks(): string[]
	{
		const srcEls = this.srcLinkElements.map((item) => item.getAttribute("src")) as string[];
		return srcEls;
	}
	private get hrefLinks(): string[]
	{
		const hrefEls = this.hrefLinkElements.map((item) => item.getAttribute("href")) as string[];
		return hrefEls;
	}
	private get srcLinkElements(): HTMLImageElement[]
	{
		const srcEls = (Array.from(this.pageDocument.querySelectorAll(".obsidian-document [src]:not(head *)")) as HTMLImageElement[]);
		return srcEls.filter((el) => !(el.tagName == "IFRAME" && el.getAttribute("data-advanced-slides-embed") == "true"));
	}
	private get hrefLinkElements(): HTMLAnchorElement[]
	{
		const hrefEls = (Array.from(this.pageDocument.querySelectorAll(".obsidian-document [href]:not(head *)")) as HTMLAnchorElement[]);
		return hrefEls;
	}
	private get linksToOtherFiles(): string[]
	{
		const links = this.hrefLinks;
		const otherFiles = links.filter((link) => !link.startsWith("#") && !link.startsWith(Shared.libFolderName + "/") && !link.startsWith("http") && !link.startsWith("data:"));
		return otherFiles;
	}

	public async build(): Promise<Webpage | undefined>
	{
		let isMedia = MarkdownRendererAPI.viewableMediaExtensions.contains(this.source.extension);
		if (isMedia) this.type = DocumentType.Attachment;
		
		this.viewElement?.setAttribute("data-type", this.type);

		// get title and icon
		const titleInfo = await _MarkdownRendererInternal.getTitleForFile(this.source);
		const iconInfo = await _MarkdownRendererInternal.getIconForFile(this.source);
		this.title = titleInfo.title;
		this.icon = iconInfo.icon;
		this.icon = await MarkdownRendererAPI.renderMarkdownSimple(this.icon) ?? this.icon;
	

		if (this.exportOptions.inlineMedia) 
			await this.inlineMedia();

		if (this.exportOptions.addHeadTag) 
			await this.addHead();

		if (this.exportOptions.fixLinks)
		{
			this.remapLinks();
			this.remapEmbedLinks();
		}

		// add math styles to the document. They are here and not in <head> because they are unique to each document
		if (this.exportOptions.addMathjaxStyles && this.type != DocumentType.Attachment)
		{
			const mathStyleEl = document.createElement("style");
			mathStyleEl.id = "MJX-CHTML-styles";
			await AssetHandler.mathjaxStyles.load();
			mathStyleEl.innerHTML = AssetHandler.mathjaxStyles.data as string;
			this.viewElement?.prepend(mathStyleEl);
		}

		// inject outline
		if (this.exportOptions.outlineOptions.enabled)
		{
			const headerTree = new OutlineTree(this, 1);
			headerTree.id = "outline";
			headerTree.title = "目录";
			headerTree.showNestingIndicator = false;
			headerTree.generateWithItemsClosed = this.exportOptions.outlineOptions.startCollapsed === true;
			headerTree.minCollapsableDepth = this.exportOptions.outlineOptions.minCollapseDepth ?? 2;
			this.exportOptions.outlineOptions.insertFeature(this.pageDocument.documentElement, await headerTree.generate());
		}

		// if html will be inlined, un-collapse the tree containing this file
		const fileExplorer = this.pageDocument.querySelector("#file-explorer");
		if (fileExplorer && this.exportOptions.fileNavigationOptions.exposeStartingPath && this.exportOptions.inlineHTML)
		{
			const unixPath = this.targetPath.path;
			let fileElement: HTMLElement = fileExplorer?.querySelector(`[href="${unixPath}"]`) as HTMLElement;
			fileElement = fileElement?.closest(".tree-item") as HTMLElement;
			while (fileElement)
			{
				fileElement?.classList.remove("is-collapsed");
				const children = fileElement?.querySelector(".tree-item-children") as HTMLElement;
				if(children) children.style.display = "block";
				fileElement = fileElement?.parentElement?.closest(".tree-item") as HTMLElement;
			}
		}

		if (this.exportOptions.includeJS)
		{
			const bodyScript = this.pageDocument.body.createEl("script");
			bodyScript.setAttribute("defer", "");
			bodyScript.innerText = AssetHandler.themeLoadJS.data.toString();
			this.pageDocument.body.prepend(bodyScript);
		}

		// Add tabs plugin functionality
		const tabsScript = this.pageDocument.body.createEl("script");
		tabsScript.setAttribute("defer", "");
		tabsScript.textContent = "// Tabs plugin functionality\nfunction initializeTabs() {\n  var tabsContainers = document.querySelectorAll('.tabs-container');\n  tabsContainers.forEach(function(container) {\n    // Re-select nav items and contents to ensure we have current references\n    var navItems = container.querySelectorAll('.tabs-nav-item');\n    var contents = container.querySelectorAll('.tabs-content');\n\n    navItems.forEach(function(item, index) {\n      // Remove existing event listeners to avoid duplicates\n      var newItem = item.cloneNode(true);\n      item.parentNode.replaceChild(newItem, item);\n      item = newItem;\n\n      item.addEventListener('click', function() {\n        // Re-select nav items and contents again to ensure we have the latest references\n        var currentNavItems = container.querySelectorAll('.tabs-nav-item');\n        var currentContents = container.querySelectorAll('.tabs-content');\n        \n        // Remove active class from all items and contents\n        currentNavItems.forEach(function(navItem) {\n          navItem.classList.remove('tabs-nav-item-active');\n        });\n        currentContents.forEach(function(content) {\n          content.classList.remove('tabs-content-active');\n        });\n\n        // Add active class to clicked item and corresponding content\n        item.classList.add('tabs-nav-item-active');\n        if (currentContents[index]) {\n          currentContents[index].classList.add('tabs-content-active');\n        }\n      });\n    });\n  });\n}\n\n// Initialize tabs on page load\ndocument.addEventListener(\"DOMContentLoaded\", initializeTabs);\n\n// Use MutationObserver to detect new tabs containers\nvar observer = new MutationObserver(function(mutations) {\n  mutations.forEach(function(mutation) {\n    if (mutation.addedNodes.length) {\n      // Check if any added node contains tabs containers\n      var hasTabs = false;\n      mutation.addedNodes.forEach(function(node) {\n        if (node.nodeType === 1) { // Element node\n          if (node.classList && node.classList.contains('tabs-container')) {\n            hasTabs = true;\n          } else if (node.querySelector('.tabs-container')) {\n            hasTabs = true;\n          }\n        }\n      });\n      if (hasTabs) {\n        // Small delay to ensure all tabs elements are fully loaded\n        setTimeout(initializeTabs, 100);\n      }\n    }\n  });\n});\n\n// Start observing the document body\nobserver.observe(document.body, {\n  childList: true,\n  subtree: true\n});";
		this.pageDocument.body.prepend(tabsScript);

		this.pageDocument.documentElement.lang = moment.locale();

		await this.generateOutput();

		return this;
	}

	public async renderDocument(): Promise<Webpage | undefined>
	{
		this.pageDocument.documentElement.innerHTML = this.website.webpageTemplate.getDocElementInner();

		// render the file
		const centerContent = this.pageDocument.querySelector("#center-content") as HTMLElement;
		if (!centerContent) return undefined;

		const options = {...this.exportOptions, container: centerContent};
		const renderInfo = await MarkdownRendererAPI.renderFile(this.source, options);

		const contentEl = renderInfo?.contentEl;
		if (!contentEl) return undefined;
		if (MarkdownRendererAPI.checkCancelled()) return undefined;

		// set the document's type
		this.type = (renderInfo?.viewType as DocumentType) ?? DocumentType.Markdown;

		if (this.type == "markdown")
		{
			contentEl.classList.toggle("allow-fold-headings", this.exportOptions.documentOptions.allowFoldingHeadings);
			contentEl.classList.toggle("allow-fold-lists", this.exportOptions.documentOptions.allowFoldingLists);
			contentEl.classList.add("is-readable-line-width");

			const cssclasses = this.frontmatter['cssclasses'];
			if (cssclasses && cssclasses.length > 0) contentEl.classList.add(...cssclasses);
		}

		if(this.sizerElement) this.sizerElement.style.paddingBottom = "";

		return this;
	}

	private getAdvancedSlidesPlugin(): any | undefined
	{
		// @ts-ignore
		return app?.plugins?.plugins?.["obsidian-advanced-slides"];
	}

	private getAdvancedSlidesRenderer(plugin: any): any | undefined
	{
		return plugin?.revealServer?._revealRenderer ?? plugin?.revealRenderer ?? plugin?.renderer;
	}

	private getAdvancedSlidesPluginDir(plugin: any): string | undefined
	{
		const utilsDir = plugin?.obsidianUtils?.getPluginDirectory?.();
		if (typeof utilsDir === "string" && utilsDir.trim() != "") return utilsDir;

		const adapter = app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return path.join(adapter.getBasePath(), app.vault.configDir, "plugins", "obsidian-advanced-slides");
		}

		return;
	}

	private async ensureAdvancedSlidesAssets(plugin: any): Promise<Attachment[]>
	{
		if (Webpage.advancedSlidesAssetsPromise) return await Webpage.advancedSlidesAssetsPromise;

		Webpage.advancedSlidesAssetsPromise = (async () => {
			const pluginDir = this.getAdvancedSlidesPluginDir(plugin);
			if (!pluginDir) return [];

			const assetRoot = AssetHandler.libraryPath.joinString("advanced-slides");
			const folders = ["dist", "plugin", "css"];
			const attachments: Attachment[] = [];

			const collectFiles = async (dir: string): Promise<string[]> => {
				let results: string[] = [];
				const entries = await fs.readdir(dir, { withFileTypes: true });
				for (const entry of entries) {
					const fullPath = path.join(dir, entry.name);
					if (entry.isDirectory()) {
						results = results.concat(await collectFiles(fullPath));
					} else if (entry.isFile()) {
						results.push(fullPath);
					}
				}
				return results;
			};

			for (const folder of folders) {
				const dirPath = path.join(pluginDir, folder);
				try {
					const files = await collectFiles(dirPath);
					for (const filePath of files) {
						try {
							const relPath = path.relative(pluginDir, filePath).replaceAll("\\", "/");
							const ext = path.extname(relPath);
							if (!ext) {
								// Skip extensionless files like LICENSE to avoid Path treating them as folders.
								continue;
							}
							const targetPath = assetRoot.joinString(relPath).setWorkingDirectory(this.website.destination.path);
							const data = await fs.readFile(filePath);
							const attachment = new Attachment(data, targetPath, null, this.exportOptions);
							attachment.sourcePath = filePath;
							attachments.push(attachment);
						} catch (error) {
							ExportLog.warning(error, "Failed to add Advanced Slides asset: " + filePath);
						}
					}
				} catch (error) {
					ExportLog.warning(error, "Failed to read Advanced Slides assets from " + dirPath);
				}
			}

			return attachments;
		})();

		return await Webpage.advancedSlidesAssetsPromise;
	}

	private parseAdvancedSlidesPageFromHash(hash: string): number
	{
		if (!hash) return 0;
		const cleaned = hash.replace(/^#\/?/, "");
		const parts = cleaned.split("/");
		const page = Number.parseInt(parts[0]);
		return Number.isFinite(page) ? page : 0;
	}

	private resolveAdvancedSlidesFileFromSlide(slide: string, plugin?: any): TFile | undefined
	{
		if (!slide) return;
		let slidePath = slide.trim();
		if (slidePath.startsWith("[[") && slidePath.endsWith("]]")) {
			slidePath = slidePath.substring(2, slidePath.length - 2).trim();
		}

		if (plugin?.obsidianUtils?.getTFile) {
			try {
				const pluginFile = plugin.obsidianUtils.getTFile(slidePath);
				if (pluginFile) return pluginFile;
			} catch {
				// fall through to local resolution
			}
		}

		let file: TFile | null = app.vault.getFileByPath(slidePath);
		if (!file && !slidePath.toLowerCase().endsWith(".md")) {
			file = app.vault.getFileByPath(slidePath + ".md");
		}
		if (!file) {
			file = app.metadataCache.getFirstLinkpathDest(slidePath, this.source.path) ?? null;
		}
		if (!file) {
			const candidates = app.vault.getFiles().filter((f) => {
				const normalized = f.path.replaceAll("\\", "/");
				return normalized == slidePath || normalized.endsWith("/" + slidePath) || normalized.endsWith("/" + slidePath + ".md");
			});
			if (candidates.length == 1) return candidates[0];
			if (candidates.length > 1) {
				candidates.sort((a, b) => a.path.length - b.path.length);
				return candidates[0];
			}
		}
		return file ?? undefined;
	}

	private getAdvancedSlidesEmbedTargetPath(slideFile: TFile, page: number): Path
	{
		const slidePath = new Path(slideFile.path);
		const embedRoot = AssetHandler.libraryPath.joinString("advanced-slides", "embeds");
		const target = embedRoot.joinString(slidePath.path).setWorkingDirectory(this.website.destination.path);
		target.setExtension("html");
		target.setFileName(`${target.basename}-page-${page}`);
		return target;
	}

	private async rewriteAdvancedSlidesHtml(html: string, embedTarget: Path, slideFile: TFile): Promise<string>
	{
		const doc = new DOMParser().parseFromString(html, "text/html");
		const assetRoot = AssetHandler.libraryPath.joinString("advanced-slides");
		const assetPrefix = Path.getRelativePath(embedTarget, assetRoot).path.replaceAll("\\", "/");
		const assetBase = assetPrefix.endsWith("/") ? assetPrefix : assetPrefix + "/";

		const replaceAssetPath = (value: string): string => {
			if (value.startsWith("/dist/") || value.startsWith("dist/")) return assetBase + value.replace(/^\/?dist\//, "dist/");
			if (value.startsWith("/plugin/") || value.startsWith("plugin/")) return assetBase + value.replace(/^\/?plugin\//, "plugin/");
			if (value.startsWith("/css/") || value.startsWith("css/")) return assetBase + value.replace(/^\/?css\//, "css/");
			return value;
		};

		doc.querySelectorAll("[src]").forEach((el) => {
			const src = el.getAttribute("src");
			if (!src) return;
			const updated = replaceAssetPath(src);
			if (updated != src) el.setAttribute("src", updated);
		});

		doc.querySelectorAll("[href]").forEach((el) => {
			const href = el.getAttribute("href");
			if (!href) return;
			const updated = replaceAssetPath(href);
			if (updated != href) el.setAttribute("href", updated);
		});

		doc.querySelectorAll("script").forEach((script) => {
			if (!script.textContent) return;
			script.textContent = script.textContent.replace(/(['"])\/(dist|plugin|css)\//g, `$1${assetBase}$2/`);
		});

		// remap media and internal links in slide content
		const addEmbedAttachment = async (src: string) => {
			const attachment = await this.website.createAttachmentFromSrc(src, slideFile);
			if (attachment && !this.attachments.includes(attachment)) this.attachments.push(attachment);
			return attachment;
		};

		const srcElements = Array.from(doc.querySelectorAll("[src]")) as HTMLElement[];
		for (const el of srcElements) {
			const src = el.getAttribute("src");
			if (!src) continue;
			if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("mailto:")) continue;
			if (src.startsWith(assetBase) || src.startsWith("dist/") || src.startsWith("plugin/") || src.startsWith("css/")) continue;

			const resolvedPath = this.website.getFilePathFromSrc(src, slideFile.path);
			let attachment = this.website.index.getFile(resolvedPath.pathname, true);
			if (!attachment) {
				attachment = await addEmbedAttachment(src);
			}
			if (attachment) {
				const rel = Path.getRelativePath(embedTarget, attachment.targetPath).path.replaceAll("\\", "/");
				el.setAttribute("src", rel);
			}
		}

		const hrefElements = Array.from(doc.querySelectorAll("[href]")) as HTMLElement[];
		for (const el of hrefElements) {
			const href = el.getAttribute("href");
			if (!href) continue;
			if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("data:") || href.startsWith("#")) continue;

			const resolvedPath = this.website.getFilePathFromSrc(href, slideFile.path);
			const attachment = this.website.index.getFile(resolvedPath.pathname, false);
			if (attachment) {
				const rel = Path.getRelativePath(embedTarget, attachment.targetPath).path.replaceAll("\\", "/");
				el.setAttribute("href", rel);
			}
		}

		return "<!DOCTYPE html> " + doc.documentElement.outerHTML;
	}

	private async handleAdvancedSlidesEmbeds(): Promise<void>
	{
		const plugin = this.getAdvancedSlidesPlugin();
		if (!plugin) return;

		const renderer = this.getAdvancedSlidesRenderer(plugin);
		if (!renderer || typeof renderer.renderFile !== "function") {
			ExportLog.warning("Advanced Slides renderer not available. Slide embeds will not be exported.");
			return;
		}

		const iframeEmbeds = Array.from(this.pageDocument.querySelectorAll(".reveal-preview-view iframe")) as HTMLIFrameElement[];
		const codeBlocks = Array.from(this.pageDocument.querySelectorAll("pre, code")) as HTMLElement[];
		const slideBlockSet = new Set<HTMLElement>();
		for (const el of codeBlocks) {
			if (el.classList.contains("language-slide") || el.classList.contains("lang-slide") || el.classList.contains("block-language-slide")) {
				if (el.tagName == "CODE") {
					const pre = el.closest("pre") as HTMLElement | null;
					slideBlockSet.add(pre ?? el);
				} else {
					slideBlockSet.add(el);
				}
			}
		}
		const slideBlocks = Array.from(slideBlockSet);

		const fallbackSlideBlocks: { raw: string; params: any }[] = [];
		if (slideBlocks.length == 0) {
			try {
				const sourceText = await app.vault.read(this.source);
				const regex = /```slide\s*([\s\S]*?)```/g;
				let match: RegExpExecArray | null;
				while ((match = regex.exec(sourceText)) != null) {
					const raw = match[1]?.trim() ?? "";
					if (!raw) continue;
					try {
						const params = parseYaml(raw);
						if (params) fallbackSlideBlocks.push({ raw, params });
					} catch {
						// ignore parse errors here
					}
				}
			} catch (error) {
				ExportLog.warning(error, "Failed to read source file for Advanced Slides fallback parsing.");
			}
		}

		if (iframeEmbeds.length == 0 && slideBlocks.length == 0 && fallbackSlideBlocks.length == 0) return;

		const assets = await this.ensureAdvancedSlidesAssets(plugin);
		for (const asset of assets) {
			if (!this.attachments.includes(asset)) this.attachments.push(asset);
		}

		const processEmbed = async (slideFile: TFile, page: number, iframe: HTMLIFrameElement) => {
			const cacheKey = `${slideFile.path}#page=${page}`;
			let embedAttachment = Webpage.advancedSlidesEmbedCache.get(cacheKey);

			if (!embedAttachment) {
				const adapter = app.vault.adapter;
				let absPath = slideFile.path;
				if (adapter instanceof FileSystemAdapter) {
					absPath = adapter.getFullPath(slideFile.path);
				}

				const html = await renderer.renderFile(absPath, { embed: true });
				if (!html) {
					ExportLog.warning("Advanced Slides embed rendering failed for " + slideFile.path);
					return;
				}
				const targetPath = this.getAdvancedSlidesEmbedTargetPath(slideFile, page);
				const rewritten = await this.rewriteAdvancedSlidesHtml(html, targetPath, slideFile);
				embedAttachment = new Attachment(rewritten, targetPath, null, this.exportOptions);
				Webpage.advancedSlidesEmbedCache.set(cacheKey, embedAttachment);
			}

			if (!this.attachments.includes(embedAttachment)) this.attachments.push(embedAttachment);

			const iframeSrc = Path.getRelativePath(this.targetPath, embedAttachment.targetPath).path.replaceAll("\\", "/");
			iframe.setAttribute("src", iframeSrc);
			iframe.setAttribute("loading", "lazy");
			iframe.setAttribute("data-advanced-slides-embed", "true");
		};

		for (const iframe of iframeEmbeds) {
			if (iframe.getAttribute("data-advanced-slides-exported") == "true") continue;
			const src = iframe.getAttribute("src");
			if (!src) continue;
			let url: URL | undefined;
			try {
				url = new URL(src, "http://localhost");
			} catch {
				continue;
			}

			const match = url.pathname.match(/\/embed\/(.+)$/);
			if (!match) continue;

			const slidePath = decodeURIComponent(match[1]);
			const slideFile = this.resolveAdvancedSlidesFileFromSlide(slidePath, plugin);
			if (!slideFile) {
				ExportLog.warning("Advanced Slides embed source not found: " + slidePath);
				continue;
			}

			const page = this.parseAdvancedSlidesPageFromHash(url.hash);
			await processEmbed(slideFile, page, iframe);
			iframe.setAttribute("data-advanced-slides-exported", "true");
		}

		const normalizeYaml = (input: string) => input.replace(/\s+/g, " ").trim();

		for (const codeEl of slideBlocks) {
			let raw = "";
			if (codeEl.tagName == "PRE") {
				const code = codeEl.querySelector("code");
				raw = code?.textContent ?? codeEl.textContent ?? "";
			} else {
				raw = codeEl.textContent ?? "";
			}
			let params: any = undefined;
			try {
				params = parseYaml(raw);
			} catch (error) {
				ExportLog.warning(error, "Failed to parse Advanced Slides code block parameters.");
				continue;
			}

			const slide = params?.slide?.toString?.() ?? "";
			const page = Number.isFinite(Number(params?.page)) ? Number(params?.page) : 0;
			const slideFile = this.resolveAdvancedSlidesFileFromSlide(slide, plugin);
			if (!slideFile) {
				ExportLog.warning("Advanced Slides embed source not found: " + slide);
				continue;
			}

			const container = this.pageDocument.createElement("div");
			container.classList.add("reveal-preview-view", "relative-iframe-container");
			const iframe = this.pageDocument.createElement("iframe");
			iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
			container.appendChild(iframe);

			await processEmbed(slideFile, page, iframe);

			if (codeEl.tagName == "PRE") {
				codeEl.replaceWith(container);
			} else {
				const pre = codeEl.closest("pre");
				if (pre && pre.parentElement) {
					pre.replaceWith(container);
				} else if (codeEl.parentElement) {
					codeEl.replaceWith(container);
				}
			}
		}

		if (slideBlocks.length == 0 && fallbackSlideBlocks.length > 0) {
			const allPreBlocks = Array.from(this.pageDocument.querySelectorAll("pre")) as HTMLElement[];
			for (const fallback of fallbackSlideBlocks) {
				const slide = fallback.params?.slide?.toString?.() ?? "";
				const page = Number.isFinite(Number(fallback.params?.page)) ? Number(fallback.params?.page) : 0;
				const slideFile = this.resolveAdvancedSlidesFileFromSlide(slide, plugin);
				if (!slideFile) {
					ExportLog.warning("Advanced Slides embed source not found: " + slide);
					continue;
				}

				const container = this.pageDocument.createElement("div");
				container.classList.add("reveal-preview-view", "relative-iframe-container");
				const iframe = this.pageDocument.createElement("iframe");
				iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
				container.appendChild(iframe);

				await processEmbed(slideFile, page, iframe);

				const normalizedTarget = normalizeYaml(fallback.raw);
				const matchedPre = allPreBlocks.find((pre) => normalizeYaml(pre.textContent ?? "") == normalizedTarget);
				if (matchedPre) {
					matchedPre.replaceWith(container);
				}
			}
		}
	}

	public async getAttachments(): Promise<Attachment[]>{
		await this.handleAdvancedSlidesEmbeds();

		const sources = this.srcLinks;
		for (const src of sources)
		{
			if ((!src.startsWith("app://") && /\w+:(\/\/|\\\\)/.exec(src)) || // link is a URL except for app://
				src.startsWith("data:")) // link is a data URL
			continue;

			// Get the full resolved path including query parameters
			const resolvedPath = this.website.getFilePathFromSrc(src, this.source.path);
			const sourcePath = resolvedPath.pathname;
			
			let attachment = this.attachments.find((attachment) => attachment.sourcePath == sourcePath);
			attachment ??= this.website.index.getFile(sourcePath);
			attachment ??= await this.website.createAttachmentFromSrc(src, this.source);
			
			if (!sourcePath || !attachment)
			{
				ExportLog.log("Attachment source not found: " + src);
				continue;
			}

			if (!this.attachments.includes(attachment)) 
				this.attachments.push(attachment);
		}

		return this.attachments;
	}

	public resolveLink(link: string | null, linkEl: HTMLElement, preferAttachment: boolean = false): string | undefined
	{
		if (!link) return "";
		if ((!link.startsWith("app://") && /\w+:(\/\/|\\\\)/.exec(link)))
			return;
		if (link.startsWith("data:"))
			return;
		if (link?.startsWith("?")) 
			return;
		if (link.startsWith("mailto:"))
			return;

		if (link.startsWith("#"))
		{
			let headerText = (linkEl?.getAttribute("data-href") ?? link).replaceAll(" ", "_").replaceAll(":", "").replaceAll("__", "_").substring(1);
			
			// Only apply numbering if this header is in the headerMap (i.e., it's an actual header)
			if (this.headerMap.has(headerText)) {
				let hrefValue = `#${headerText}_${this.headerMap.get(headerText)}`;
				if (!this.exportOptions.relativeHeaderLinks)
					hrefValue = this.targetPath + hrefValue;
				return hrefValue;
			}
			
			// For non-header links (like footnotes), return the link unchanged
			return link;
		}

		// Split link into path, query, and hash parts
		const querySplit = link.split("?");
		const hashSplit = querySplit[0].split("#");
		const path = hashSplit[0];
		const hash = hashSplit[1]?.trim();
		const query = querySplit[1]?.trim();
		
		const attachmentPath = this.website.getFilePathFromSrc(path, this.source.path);
		const attachment = this.website.index.getFile(attachmentPath.pathname, preferAttachment);
		if (!attachment)
		{
			// otherwise resolve it as best as possible
			const resolved = attachmentPath.slugify(this.exportOptions.slugifyPaths).setExtension("html");
			let resolvedPath = resolved.path;
			// Add back query parameters if they exist
			if (query) resolvedPath += "?" + query;
			// Add back hash if it exists
			if (hash) resolvedPath += "#" + hash;
			return resolvedPath;
		}

		let finalHash = hash;
		if (finalHash != "") finalHash = "#" + finalHash;

		if (attachment.targetPath.extensionName == "html")
		{
			const headerText = finalHash.replaceAll(" ", "_").replaceAll(":", "").replaceAll("__", "_").substring(1);
			// Only apply numbering if this header is in the headerMap
			if (this.headerMap.has(headerText)) {
				const headerId = this.headerMap.get(headerText);
				finalHash = `#${headerText}_${headerId}`;
			}
			// Otherwise keep the hash unchanged (for footnotes, etc.)
		}

		let finalPath = attachment.targetPath.path;
		// Add back query parameters if they exist
		if (query) finalPath += "?" + query;
		// Add back hash if it exists
		if (finalHash) finalPath += finalHash;

		return finalPath;
	}

	readonly headerMap = new Map();
	private remapLinks()
	{
		// convert the data-heading to the id
		this.pageDocument
			.querySelectorAll("h1, h2, h3, h4, h5, h6")
			.forEach((headerEl) => {
				let headerText = (headerEl.getAttribute("data-heading") ?? headerEl.textContent ?? "").replaceAll(" ", "_").replaceAll(":", "").replaceAll("__", "_");
				let headerId = this.headerMap.get(headerText);
				if (headerId) {
					headerId = `${+headerId + 1}`;
				} else {
					headerId = "0";
				}

				this.headerMap.set(headerText, headerId);

				headerEl.setAttribute(
					"id",
					`${headerText}_${headerId}`
				);
			});

		const links = this.hrefLinkElements;
		for (const link of links) {
			const href = link.getAttribute("href");
			const newHref = this.resolveLink(href, link);
			link.setAttribute("href", newHref ?? href ?? "");
			link.setAttribute("target", "_self");
			link.classList.toggle("is-unresolved", !newHref);
		}
		
		// Add click event handlers for "在浏览器中打开" buttons
		const openButtons = Array.from(this.pageDocument.querySelectorAll('button'));
		for (const button of openButtons) {
			if (button.textContent === "在浏览器中打开" || button.textContent === "Open in Browser") {
				// Find the nearest iframe sibling
				const container = button.closest('.relative-iframe-container');
				if (container) {
					const iframe = container.querySelector('iframe');
					if (iframe) {
						// Add onclick attribute directly to the button
						// This ensures the event handler is included in the exported HTML
						button.setAttribute('onclick', `
							const iframe = this.closest('.relative-iframe-container').querySelector('iframe');
							const src = iframe.getAttribute('src');
							if (src) {
								// Create a temporary link and click it to open in new window
								const tempLink = document.createElement('a');
								tempLink.href = src;
								tempLink.target = '_blank';
								tempLink.rel = 'noopener noreferrer';
								document.body.appendChild(tempLink);
								tempLink.click();
								document.body.removeChild(tempLink);
							}
						`);
					}
				}
			}
		}
	}

	private remapEmbedLinks()
	{
		const links = this.srcLinkElements;
		for (const link of links)
		{
			const src = link.getAttribute("src");
			const newSrc = this.resolveLink(src, link, true);
			link.setAttribute("src", newSrc ?? src ?? "");
			link.setAttribute("target", "_self");
			link.classList.toggle("is-unresolved", !newSrc);
		}
		
		// Also handle iframe elements specifically to ensure query parameters are preserved
		const iframes = Array.from(this.pageDocument.querySelectorAll("iframe"));
		for (const iframe of iframes)
		{
			const src = iframe.getAttribute("src");
			const newSrc = this.resolveLink(src, iframe, true);
			iframe.setAttribute("src", newSrc ?? src ?? "");
			iframe.setAttribute("target", "_self");
			iframe.classList.toggle("is-unresolved", !newSrc);
		}
		
		// Handle model-viewer elements for 3D models
		const modelViewers = Array.from(this.pageDocument.querySelectorAll("model-viewer"));
		for (const modelViewer of modelViewers)
		{
			const src = modelViewer.getAttribute("src");
			const newSrc = this.resolveLink(src, modelViewer as HTMLElement, true);
			modelViewer.setAttribute("src", newSrc ?? src ?? "");
			modelViewer.classList.toggle("is-unresolved", !newSrc);
		}
	}

	private async addHead()
	{
		let rootPath = this.pathToRoot.slugified(this.exportOptions.slugifyPaths).path;
		if (rootPath == "") rootPath = ".";
		const description = this.description || (this.exportOptions.siteName + " - " + this.title);
		let head =
`
<title>${this.title}</title>
<base href="${rootPath}">
<meta name="pathname" content="${this.targetPath}">
<meta name="description" content="${description}">
<meta property="og:title" content="${this.title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${this.fullURL}">
<meta property="og:image" content="${this.coverImageURL}">
`;
		if (this.author && this.author != "")
		{
			head += `<meta name="author" content="${this.author}">`;
		} 

		// Add model-viewer script for 3D models
		head += `<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@latest/dist/model-viewer.min.js"></script>`;

		this.pageDocument.head.innerHTML = head + this.pageDocument.head.innerHTML;
	}

	private async inlineMedia()
	{
		const elements = Array.from(this.pageDocument.querySelectorAll("[src]:not(head [src])"))
		for (const mediaEl of elements)
		{
			const rawSrc = mediaEl.getAttribute("src") ?? "";
			const filePath = this.website.getFilePathFromSrc(rawSrc, this.source.path);
			if (filePath.isEmpty || filePath.isDirectory || filePath.isAbsolute) continue;

			const base64 = await filePath.readAsString("base64");
			if (!base64) return;

			let ext = filePath.extensionName;

			//@ts-ignore
			const type = app.viewRegistry.typeByExtension[ext] ?? "audio";

			if(ext === "svg") ext += "+xml";
			
			mediaEl.setAttribute("src", `data:${type}/${ext};base64,${base64}`);
		};
	}

	public dispose()
	{
		this.viewElement?.remove();
		// @ts-ignore
		this.pageDocument = undefined;
	}
}
