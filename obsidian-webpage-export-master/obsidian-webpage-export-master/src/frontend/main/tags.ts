import { DynamicInsertedFeature } from "src/shared/dynamic-inserted-feature";
import { InsertedFeatureOptions } from "src/shared/features/feature-options-base";
import { LinkHandler } from "./links";

interface TagsDependencies {
	tags: string[];
}

export class Tags extends DynamicInsertedFeature<
	InsertedFeatureOptions,
	TagsDependencies
> {
	private searchInputEl: HTMLInputElement | undefined;
	private readonly onSearchInput = () => {
		this.syncTagFilterState?.();
	};
	private syncTagFilterState: (() => void) | undefined;

	constructor(tags: string[]) {
		super(ObsidianSite.metadata.featureOptions.tags, { tags });
	}

	protected generateContent(container: HTMLElement) {
		const deps = this.getDependencies();
		const tagEls: HTMLAnchorElement[] = [];
		const searchInput = document.querySelector(
			'input[type="search"]'
		) as HTMLInputElement | null;

		const normalizeTagQuery = (query: string): string => {
			let normalized = query.trim();
			if (normalized.startsWith("query=")) {
				normalized = normalized.substring(6);
			}
			if (normalized.startsWith("#")) {
				normalized = "tag:" + normalized.substring(1);
			}
			if (normalized.startsWith("tags:")) {
				normalized = "tag:" + normalized.substring(5);
			}
			return normalized.toLowerCase();
		};

		if (this.searchInputEl && this.searchInputEl !== searchInput) {
			this.searchInputEl.removeEventListener("input", this.onSearchInput);
		}
		this.searchInputEl = searchInput ?? undefined;
		this.searchInputEl?.removeEventListener("input", this.onSearchInput);
		this.searchInputEl?.addEventListener("input", this.onSearchInput);

		const getActiveTagQuery = (): string => {
			const inputValue = this.searchInputEl?.value ?? "";
			const activeQuery = normalizeTagQuery(inputValue);
			return activeQuery.startsWith("tag:") ? activeQuery : "";
		};

		const clearTagFilterButton = document.createElement("button");
		clearTagFilterButton.type = "button";
		clearTagFilterButton.classList.add("tag-filter-clear", "is-hidden");
		clearTagFilterButton.setAttribute("aria-label", "Clear tag filter");
		clearTagFilterButton.title = "Clear tag filter";
		clearTagFilterButton.textContent = "x";
		clearTagFilterButton.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			ObsidianSite.search?.clear();
			this.syncTagFilterState?.();
		});

		this.syncTagFilterState = () => {
			const activeTagQuery = getActiveTagQuery();
			let hasActiveTag = false;
			for (const tagEl of tagEls) {
				const tagQuery = tagEl.dataset.tagQuery ?? "";
				const isActive = activeTagQuery != "" && tagQuery == activeTagQuery;
				tagEl.classList.toggle("is-active", isActive);
				if (isActive) hasActiveTag = true;
			}

			clearTagFilterButton.classList.toggle("is-hidden", !hasActiveTag);
		};

		for (const tagName of deps.tags) {
			const normalizedTagName = tagName.replace(/^#+/, "").trim();
			if (normalizedTagName.length == 0) continue;
			const tagQuery = normalizeTagQuery(`tag:${normalizedTagName}`);

			const tagEl = document.createElement("a");
			tagEl.classList.add("tag");
			tagEl.setAttribute(
				"href",
				`?query=${tagQuery}`
			);
			tagEl.innerText = tagName;
			tagEl.dataset.tagQuery = tagQuery;
			tagEl.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				if (getActiveTagQuery() == tagQuery) {
					ObsidianSite.search?.clear();
				} else {
					ObsidianSite.search?.searchParseFilters(tagQuery);
				}

				this.syncTagFilterState?.();
			});

			tagEls.push(tagEl);
			container.appendChild(tagEl);
		}

		if (tagEls.length > 0) {
			container.appendChild(clearTagFilterButton);
		}

		LinkHandler.initializeLinks(container);
		this.syncTagFilterState?.();
	}
}
