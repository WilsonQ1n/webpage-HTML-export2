var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => RelativeIframePlugin
});
var import_obsidian = __toModule(require("obsidian"));
var resources = {
  "zh-CN": {
    file: "\u6587\u4EF6",
    path: "\u8DEF\u5F84",
    openInBrowser: "\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00",
    securityRestrictions: "\u7531\u4E8EObsidian\u5B89\u5168\u9650\u5236\uFF0C\u6B64\u63D2\u4EF6\u4F7F\u7528\u6D4F\u89C8\u5668\u6253\u5F00HTML\u6587\u4EF6\u3002",
    safeHandling: "\u8FD9\u786E\u4FDD\u4E86\u672C\u5730HTML\u5185\u5BB9\u7684\u5B89\u5168\u5904\u7406\uFF0C\u540C\u65F6\u4E0D\u4F1A\u5371\u53CAObsidian\u7684\u7A33\u5B9A\u6027\u3002",
    fileNotFound: "\u6587\u4EF6\u672A\u627E\u5230",
    errorRendering: "\u6E32\u67D3iframe\u9519\u8BEF"
  },
  "en": {
    file: "File",
    path: "Path",
    openInBrowser: "Open in Browser",
    securityRestrictions: "This plugin uses browser opening for HTML files due to Obsidian security restrictions.",
    safeHandling: "This ensures safe handling of local HTML content without risking Obsidian stability.",
    fileNotFound: "File not found",
    errorRendering: "Error rendering iframe"
  }
};
var DEFAULT_SETTINGS = {
  language: "zh-CN",
  pathType: "attachments",
  customPath: "Attachments"
};
var RelativeIframePlugin = class extends import_obsidian.Plugin {
  onload() {
    console.log("Relative Iframe Plugin Loaded");
    this.loadSettings();
    this.addSettingTab(new RelativeIframeSettingTab(this.app, this));
    this.registerMarkdownPostProcessor((el) => {
      this.processReadingMode(el);
    });
    this.registerMarkdownCodeBlockProcessor("iframe", (source, el) => {
      this.processEditMode(source, el);
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  onunload() {
    console.log("Relative Iframe Plugin Unloaded");
  }
  parseFileName(fileName) {
    const queryIndex = fileName.indexOf("?");
    if (queryIndex > -1) {
      return {
        actualFileName: fileName.substring(0, queryIndex),
        queryString: fileName.substring(queryIndex)
      };
    }
    return { actualFileName: fileName, queryString: "" };
  }
  getFilePath(actualFileName) {
    var _a, _b, _c, _d, _e;
    if (this.settings.pathType === "attachments") {
      const attachmentsFolderPath = ((_b = (_a = this.app.vault).getConfig) == null ? void 0 : _b.call(_a, "attachmentFolderPath")) || ((_e = (_d = (_c = this.app.settingContainerEl) == null ? void 0 : _c.querySelector) == null ? void 0 : _d.call(_c, '[name="attachmentFolderPath"] input')) == null ? void 0 : _e.value) || "Attachments";
      return `${attachmentsFolderPath}/${actualFileName}`;
    } else {
      return `${this.settings.customPath}/${actualFileName}`;
    }
  }
  processEditMode(source, el) {
    return __async(this, null, function* () {
      try {
        const content = source.trim();
        if (!content)
          return;
        const match = content.match(/^([^\s]+)\s*([^\s]+)?\s*(.*)$/);
        if (!match)
          return;
        const fileName = match[1];
        const height = match[2];
        const customTitle = match[3];
        if (!fileName)
          return;
        const container = yield this.createIframeContainer(fileName, height, customTitle);
        el.appendChild(container);
      } catch (error) {
        console.error("Error processing edit mode:", error);
        this.createErrorContainer(el, `Error processing iframe: ${error.message}`);
      }
    });
  }
  processReadingMode(el) {
    try {
      const preElements = el.querySelectorAll("pre");
      const settings = this.settings;
      for (const pre of Array.from(preElements)) {
        const code = pre.querySelector("code");
        if (!code)
          continue;
        const codeText = code.textContent;
        if (!codeText)
          continue;
        if (pre.classList.contains("language-iframe") || code.classList.contains("language-iframe") || codeText.includes("```iframe")) {
          this.processIframePre(pre);
        }
      }
    } catch (error) {
      console.error("Error processing reading mode:", error);
    }
  }
  processIframePre(pre) {
    return __async(this, null, function* () {
      try {
        const code = pre.querySelector("code");
        if (!code)
          return;
        let content = code.textContent || "";
        if (content.includes("```iframe")) {
          content = content.replace(/```iframe\s*/, "").replace(/\s*```/, "").trim();
        }
        const match = content.match(/^([^\s]+)\s*([^\s]+)?\s*(.*)$/);
        if (!match)
          return;
        const fileName = match[1];
        const height = match[2];
        const customTitle = match[3];
        if (!fileName)
          return;
        const container = yield this.createIframeContainer(fileName, height, customTitle);
        pre.replaceWith(container);
      } catch (error) {
        console.error("Error processing iframe pre:", error);
        this.createErrorContainer(pre.parentElement || pre, `Error processing iframe: ${error.message}`);
      }
    });
  }
  createIframeContainer(fileName, height, customTitle) {
    return __async(this, null, function* () {
      const div = document.createElement("div");
      div.className = "relative-iframe-container";
      div.style.padding = "1rem";
      div.style.backgroundColor = "var(--background-primary)";
      div.style.border = "1px solid var(--background-modifier-border)";
      div.style.borderRadius = "8px";
      div.style.margin = "1rem 0";
      div.style.overflow = "hidden";
      const res = resources[this.settings.language];
      const { actualFileName, queryString } = this.parseFileName(fileName);
      const filePath = this.getFilePath(actualFileName);
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file && file instanceof import_obsidian.TFile) {
        try {
          let vaultResourceUrl = this.app.vault.getResourcePath(file);
          const urlParts = vaultResourceUrl.split("?");
          const baseUrl = urlParts[0];
          if (queryString) {
            vaultResourceUrl = `${baseUrl}${queryString}`;
          } else {
            vaultResourceUrl = baseUrl;
          }
          const iframe = document.createElement("iframe");
          iframe.style.width = "100%";
          iframe.style.height = height || "500px";
          iframe.style.border = "none";
          iframe.style.borderRadius = "4px";
          iframe.src = vaultResourceUrl;
          iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
          div.appendChild(iframe);
          const controlBar = document.createElement("div");
          controlBar.style.display = "flex";
          controlBar.style.alignItems = "center";
          controlBar.style.marginTop = "0.5rem";
          controlBar.style.fontSize = "0.875rem";
          controlBar.style.color = "var(--text-muted)";
          if (customTitle && customTitle.trim()) {
            const titleInfo = document.createElement("span");
            titleInfo.style.flex = "1";
            const tempEl = document.createElement("div");
            tempEl.className = "relative-iframe-title";
            titleInfo.appendChild(tempEl);
            controlBar.appendChild(titleInfo);
            yield import_obsidian.MarkdownRenderer.renderMarkdown(customTitle.trim(), tempEl, "", this);
          } else {
            const emptySpan = document.createElement("span");
            emptySpan.style.flex = "1";
            controlBar.appendChild(emptySpan);
          }
          const openButton = document.createElement("button");
          openButton.textContent = res.openInBrowser;
          openButton.style.padding = "0.25rem 0.75rem";
          openButton.style.backgroundColor = "var(--interactive-accent)";
          openButton.style.color = "var(--text-on-accent)";
          openButton.style.border = "none";
          openButton.style.borderRadius = "4px";
          openButton.style.cursor = "pointer";
          openButton.style.fontSize = "0.875rem";
          openButton.addEventListener("click", () => {
            this.openHtmlFileInBrowser(fileName);
          });
          controlBar.appendChild(openButton);
          div.appendChild(controlBar);
        } catch (error) {
          console.error("Error creating iframe:", error);
          this.createErrorContainer(div, `${res.errorRendering}: ${error.message}`);
        }
      } else {
        this.createErrorContainer(div, `${res.fileNotFound}: ${filePath}`);
      }
      return div;
    });
  }
  createErrorContainer(parent, message) {
    if (!parent)
      return;
    const errorDiv = document.createElement("div");
    errorDiv.style.padding = "1rem";
    errorDiv.style.backgroundColor = "var(--background-primary)";
    errorDiv.style.border = "1px solid var(--background-modifier-border)";
    errorDiv.style.borderRadius = "4px";
    errorDiv.style.margin = "1rem 0";
    errorDiv.style.color = "var(--text-error)";
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
  }
  openHtmlFileInBrowser(fileName) {
    try {
      const { actualFileName, queryString } = this.parseFileName(fileName);
      const filePath = this.getFilePath(actualFileName);
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file && file instanceof import_obsidian.TFile) {
        this.app.openWithDefaultApp(file.path);
        console.log(`Opened ${file.path} with default app`);
        if (queryString) {
          console.log(`Detected query string: ${queryString}`);
          console.log("Please manually add this query string to the browser address bar.");
        }
      } else {
        console.error(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error("Error opening HTML file:", error);
    }
  }
};
var RelativeIframeSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Relative Iframe Settings" });
    new import_obsidian.Setting(containerEl).setName("Language").setDesc("Select the display language for the plugin").addDropdown((dropdown) => dropdown.addOption("zh-CN", "\u4E2D\u6587").addOption("en", "English").setValue(this.plugin.settings.language).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.language = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Path Type").setDesc("Choose whether to use the default attachments folder path or a custom relative path").addDropdown((dropdown) => dropdown.addOption("attachments", "Use Attachments Folder Path").addOption("custom", "Use Custom Relative Path").setValue(this.plugin.settings.pathType).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.pathType = value;
      yield this.plugin.saveSettings();
      this.display();
    })));
    if (this.plugin.settings.pathType === "custom") {
      new import_obsidian.Setting(containerEl).setName("Custom Relative Path").setDesc("Specify the custom relative path to use for HTML files").addText((text) => text.setPlaceholder("e.g., Attachments, html-files, etc.").setValue(this.plugin.settings.customPath).onChange((value) => __async(this, null, function* () {
        this.plugin.settings.customPath = value.trim();
        yield this.plugin.saveSettings();
      })));
    }
  }
};
