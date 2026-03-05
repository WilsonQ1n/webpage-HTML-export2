const { Plugin } = require("obsidian");

const RAW_EMBED_RE = /!\[\[([^\]|]+?)\|\s*raw\s*\]\]+/gi;

module.exports = class RawEmbedPlugin extends Plugin {
  onload() {
    this.contentCache = new Map();
    this.loading = new Set();
    this.readingObservers = new WeakSet();
    this.readingRescans = new WeakSet();

    // Reading mode
    this.registerMarkdownPostProcessor(async (el, ctx) => {
      await this.processEmbedsIn(el, ctx);
      this.ensureReadingObserver(el, ctx);
      this.scheduleReadingRescan(el, ctx);
    });

    // Live Preview (non-destructive: keeps text editable)
    this.tryRegisterEditorExtension();
  }

  async processEmbedsIn(root, ctx) {
    if (!root) return;
    const embeds = root.querySelectorAll("span.internal-embed, div.internal-embed");
    if (!embeds.length) return;

    const tasks = [];
    embeds.forEach((embed) => tasks.push(this.processEmbed(embed, ctx)));
    await Promise.all(tasks);

    // In reading mode, ensure any hidden raw embeds are visible.
    if (root.querySelector(".markdown-preview-view")) {
      root.querySelectorAll(".raw-embed-hidden").forEach((el) => {
        el.classList.remove("raw-embed-hidden");
        el.style.removeProperty("display");
      });
    }
  }

  scheduleReadingRescan(el, ctx) {
    if (!el || this.readingRescans.has(el)) return;
    this.readingRescans.add(el);

    const delays = [0, 50, 200, 500];
    delays.forEach((delay) => {
      setTimeout(() => {
        this.processEmbedsIn(el, ctx);
      }, delay);
    });
  }

  ensureReadingObserver(el, ctx) {
    if (!el || this.readingObservers.has(el)) return;
    this.readingObservers.add(el);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (!m.addedNodes || !m.addedNodes.length) continue;
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          // Process embeds inside newly added nodes (e.g., tabs switching content)
          this.processEmbedsIn(node, ctx);
        });
      }
    });

    observer.observe(el, { childList: true, subtree: true });
  }

  tryRegisterEditorExtension() {
    let EditorView, ViewPlugin, Decoration, WidgetType;
    let StateField, RangeSetBuilder;
    try {
      ({ EditorView, ViewPlugin, Decoration, WidgetType } = require("@codemirror/view"));
      ({ StateField, RangeSetBuilder } = require("@codemirror/state"));
    } catch (err) {
      console.warn("Raw Embed: CodeMirror modules not available; live preview disabled.");
      return;
    }

    const plugin = this;

    class RawEmbedWidget extends WidgetType {
      constructor(text) {
        super();
        this.text = text || "";
      }
      eq(other) {
        return other && other.text === this.text;
      }
      toDOM() {
        const wrap = document.createElement("div");
        wrap.className = "raw-embed-live internal-embed markdown-embed inline-embed is-loaded";
        wrap.setAttribute("data-raw-embed-live", "true");
        wrap.setAttribute("contenteditable", "false");
        applyInlineWrapStyles(wrap);

        const pre = document.createElement("pre");
        pre.className = "raw-embed";
        pre.textContent = this.text;
        applyInlinePreStyles(pre);
        wrap.appendChild(pre);
        return wrap;
      }
    }

    const buildDecorations = (state) => {
      const builder = new RangeSetBuilder();
      const text = state.doc.toString();
      const tabsRanges = findTabsFenceRanges(text);

      let match;
      RAW_EMBED_RE.lastIndex = 0;
      while ((match = RAW_EMBED_RE.exec(text)) !== null) {
        if (isIndexInRanges(match.index, tabsRanges)) {
          // For tabs blocks, let the live preview DOM handler render inline.
          continue;
        }
        const rawPath = String(match[1]).trim();
        if (!rawPath) continue;

        const file = plugin.app.metadataCache.getFirstLinkpathDest(rawPath, getActiveFilePath(plugin));
        if (!file) continue;

        const content = plugin.contentCache.get(file.path) ?? "";
        const to = match.index + match[0].length;

        // Keep text editable: render a widget AFTER the embed, do not replace
        builder.add(to, to, Decoration.widget({ widget: new RawEmbedWidget(content), side: 1, block: true }));

        if (!plugin.contentCache.has(file.path) && !plugin.loading.has(file.path)) {
          plugin.loading.add(file.path);
          plugin.app.vault.cachedRead(file).then((txt) => {
            plugin.contentCache.set(file.path, txt);
            plugin.loading.delete(file.path);
          }).catch(() => {
            plugin.loading.delete(file.path);
          });
        }
      }

      return builder.finish();
    };

    const rawField = StateField.define({
      create(state) {
        return buildDecorations(state);
      },
      update(deco, tr) {
        if (tr.docChanged) {
          return buildDecorations(tr.state);
        }
        return deco;
      },
      provide: (f) => EditorView.decorations.from(f),
    });

    const rawViewPlugin = ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.view = view;
          this.handleClick = (event) => {
            const target = event && event.target;
            if (target && target.closest && target.closest(".tabs-nav-item")) {
              scheduleSync(this.view, plugin);
            }
          };
          this.view.dom.addEventListener("click", this.handleClick);
          scheduleSync(view, plugin);
        }
        update(update) {
          if (!update.docChanged && !update.viewportChanged) return;
          scheduleSync(this.view, plugin);
        }
        destroy() {
          if (this.handleClick) {
            this.view.dom.removeEventListener("click", this.handleClick);
          }
        }
      }
    );

    this.registerEditorExtension([rawField, rawViewPlugin]);
  }

  async processEmbed(embed, ctx) {
    if (embed.getAttribute("data-raw-embed-processed") === "true") return;
    if (!isRawAliasElement(embed)) return;

    const embedPath = this.getEmbedPath(embed);
    if (!embedPath) return;

    const embedFile = this.app.metadataCache.getFirstLinkpathDest(embedPath, ctx.sourcePath);
    if (!embedFile) return;

    let content;
    try {
      content = await this.app.vault.cachedRead(embedFile);
    } catch (err) {
      console.warn("Raw Embed: failed to read file", embedFile?.path, err);
      return;
    }

    const pre = document.createElement("pre");
    pre.className = "raw-embed";
    pre.setAttribute("data-raw-embed-processed", "true");
    pre.textContent = content;
    applyInlinePreStyles(pre);

    embed.setAttribute("data-raw-embed-processed", "true");
    embed.empty();
    applyInlineWrapStyles(embed);
    embed.appendChild(pre);
  }

  getEmbedPath(embed) {
    const data = embed.dataset || {};
    const candidates = [
      data.link,
      data.href,
      data.embedSrc,
      data.src,
      embed.getAttribute("data-link"),
      embed.getAttribute("data-href"),
      embed.getAttribute("src"),
      embed.getAttribute("href"),
    ].filter(Boolean);

    if (candidates.length) {
      return String(candidates[0]).split("|")[0].trim();
    }

    const linkEl = embed.querySelector("a.internal-link, span.internal-link");
    if (linkEl) {
      const val =
        linkEl.getAttribute("data-href") ||
        linkEl.getAttribute("href") ||
        linkEl.getAttribute("data-link") ||
        linkEl.textContent;
      if (val) return String(val).split("|")[0].trim();
    }

    return null;
  }
};

function getActiveFilePath(plugin) {
  const file = plugin.app.workspace.getActiveFile();
  return file ? file.path : "";
}

function getAliasFromElement(el) {
  const candidates = [
    el.getAttribute("data-alias"),
    el.getAttribute("data-embed-alias"),
    el.getAttribute("alt"),
  ].filter(Boolean);

  if (candidates.length) return String(candidates[0]).trim();

  const dataLink =
    el.getAttribute("data-link") ||
    el.getAttribute("data-href") ||
    el.getAttribute("href") ||
    "";
  if (dataLink.includes("|")) {
    const parts = dataLink.split("|");
    return parts[parts.length - 1].trim();
  }

  return "";
}

function isRawAliasElement(el) {
  const alias = getAliasFromElement(el).trim().toLowerCase();
  return alias === "raw";
}

function applyInlineWrapStyles(el) {
  if (!el || !el.style) return;
  el.style.marginTop = "var(--nested-padding)";
  el.style.padding = "0 calc(var(--nested-padding) / 2) 0 var(--nested-padding)";
  el.style.border = "0";
  el.style.borderLeft = "1px solid var(--quote-opening-modifier)";
  el.style.borderRadius = "0";
  el.style.background = "transparent";
}

function applyInlinePreStyles(pre) {
  if (!pre || !pre.style) return;
  pre.style.fontFamily =
    'var(--font-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", monospace)';
  pre.style.fontSize = "var(--font-code, var(--code-size, 0.9em))";
  pre.style.fontWeight = "var(--normal-weight, 400)";
  pre.style.letterSpacing = "normal";
  pre.style.wordSpacing = "normal";
  pre.style.fontVariantLigatures = "normal";
  pre.style.fontFeatureSettings = "normal";
  pre.style.fontKerning = "normal";
  pre.style.textRendering = "optimizeLegibility";
  pre.style.webkitFontSmoothing = "antialiased";
  pre.style.lineHeight = "1.5";
  pre.style.margin = "0";
  pre.style.padding = "0.75em 1em";
  pre.style.border = "1px solid var(--background-modifier-border, #d0d0d0)";
  pre.style.borderRadius = "8px";
  pre.style.background = "var(--background-primary-alt, #f6f6f6)";
  pre.style.color = "var(--text-normal, #222)";
  pre.style.whiteSpace = "pre";
  pre.style.overflowX = "auto";
  pre.style.boxShadow = "none";
  pre.style.display = "block";
}

let syncHandle = null;
function scheduleSync(view, plugin) {
  if (syncHandle) return;
  syncHandle = requestAnimationFrame(() => {
    syncHandle = null;
    syncLivePreviewEmbeds(view, plugin);
    syncTabsInLivePreview(view);
  });
}

function hideElement(el) {
  if (!el) return;
  el.classList.add("raw-embed-hidden");
  el.style.display = "none";
}

function isHtmlExportRunning() {
  const body = document.body;
  if (!body || !body.classList) return false;
  return body.classList.contains("html-export-running") || body.classList.contains("html-export");
}

function findTabsFenceRanges(text) {
  if (!text) return [];
  const ranges = [];
  const lines = text.split(/\r?\n/);
  let offset = 0;
  let inTabs = false;
  let fenceChar = null;
  let startOffset = 0;

  const fenceRe = /^(\s*)(`{3,}|~{3,})(.*)$/;

  for (const line of lines) {
    const match = line.match(fenceRe);
    if (match) {
      const fence = match[2];
      const info = String(match[3] || "").trim().toLowerCase();

      if (!inTabs && info.startsWith("tabs")) {
        inTabs = true;
        fenceChar = fence[0];
        startOffset = offset;
      } else if (inTabs && fence[0] === fenceChar) {
        const endOffset = offset + line.length;
        ranges.push({ start: startOffset, end: endOffset });
        inTabs = false;
        fenceChar = null;
      }
    }
    offset += line.length + 1;
  }

  return ranges;
}

function isIndexInRanges(index, ranges) {
  if (!ranges || !ranges.length) return false;
  for (const range of ranges) {
    if (index >= range.start && index <= range.end) return true;
  }
  return false;
}

function getEmbedPathFromElement(embed) {
  if (!embed) return null;
  const data = embed.dataset || {};
  const candidates = [
    data.link,
    data.href,
    data.embedSrc,
    data.src,
    embed.getAttribute("data-link"),
    embed.getAttribute("data-href"),
    embed.getAttribute("src"),
    embed.getAttribute("href"),
  ].filter(Boolean);

  if (candidates.length) {
    return String(candidates[0]).split("|")[0].trim();
  }

  const linkEl = embed.querySelector("a.internal-link, span.internal-link");
  if (linkEl) {
    const val =
      linkEl.getAttribute("data-href") ||
      linkEl.getAttribute("href") ||
      linkEl.getAttribute("data-link") ||
      linkEl.textContent;
    if (val) return String(val).split("|")[0].trim();
  }

  return null;
}

function renderRawEmbedInline(embed, plugin) {
  if (!embed || !plugin) return;
  const existingPre = embed.querySelector("pre.raw-embed");
  const hasEmbedContent = !!embed.querySelector(".markdown-embed-content");
  if (existingPre && !hasEmbedContent) return;

  const embedPath = getEmbedPathFromElement(embed);
  if (!embedPath) return;

  const file = plugin.app.metadataCache.getFirstLinkpathDest(embedPath, getActiveFilePath(plugin));
  if (!file) return;

  const finish = (content) => {
    const pre = document.createElement("pre");
    pre.className = "raw-embed";
    pre.setAttribute("data-raw-embed-processed", "true");
    pre.textContent = content || "";
    applyInlinePreStyles(pre);

    embed.setAttribute("data-raw-embed-processed", "true");
    while (embed.firstChild) embed.removeChild(embed.firstChild);
    applyInlineWrapStyles(embed);
    embed.appendChild(pre);
  };

  const cached = plugin.contentCache.get(file.path);
  if (typeof cached === "string") {
    finish(cached);
    return;
  }

  plugin.app.vault.cachedRead(file).then((txt) => {
    plugin.contentCache.set(file.path, txt);
    finish(txt);
  }).catch(() => {
    finish("");
  });
}

function syncTabsInLivePreview(view) {
  if (!view || !view.dom) return;
  const containers = view.dom.querySelectorAll(".tabs-container");
  if (!containers.length) return;

  containers.forEach((container) => {
    const navItems = Array.from(container.querySelectorAll(".tabs-nav-item"));
    const contents = Array.from(container.querySelectorAll(".tabs-content"));
    if (!navItems.length || !contents.length) return;

    let activeIndex = navItems.findIndex((item) => item.classList.contains("tabs-nav-item-active"));
    if (activeIndex < 0) activeIndex = 0;

    navItems.forEach((item, idx) => {
      if (idx !== activeIndex && item.classList.contains("tabs-nav-item-active")) {
        item.classList.remove("tabs-nav-item-active");
      }
    });

    contents.forEach((content, idx) => {
      if (idx === activeIndex) {
        content.classList.add("tabs-content-active");
      } else {
        content.classList.remove("tabs-content-active");
      }
    });
  });
}

function syncLivePreviewEmbeds(view, plugin) {
  // During HTML export, do not hide raw embeds; keep them visible for export output.
  if (isHtmlExportRunning()) {
    view.dom.querySelectorAll(".raw-embed-hidden").forEach((el) => {
      el.classList.remove("raw-embed-hidden");
      el.style.removeProperty("display");
    });
    return;
  }

  // Clear previous hidden blocks in this editor view
  view.dom.querySelectorAll(".raw-embed-hidden").forEach((el) => {
    el.classList.remove("raw-embed-hidden");
    el.style.removeProperty("display");
  });

  const embeds = view.dom.querySelectorAll(".internal-embed.markdown-embed, .markdown-embed.internal-embed");
  embeds.forEach((embed) => {
    if (!isRawAliasElement(embed)) return;

    if (embed.closest(".tabs-container")) {
      renderRawEmbedInline(embed, plugin);
      embed.querySelectorAll(".markdown-embed-content").forEach((node) => node.remove());
      embed.classList.remove("raw-embed-hidden");
      embed.style.removeProperty("display");
      return;
    }

    hideElement(embed);
    const block = embed.closest(".cm-embed-block, .markdown-embed, .cm-callout");
    if (block) hideElement(block);
  });
}
