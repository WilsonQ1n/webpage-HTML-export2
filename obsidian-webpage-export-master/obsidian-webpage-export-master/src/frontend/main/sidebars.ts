export class Sidebar
{
	readonly minWidthEm = 15;
	readonly minResizeWidth;
	readonly collapseWidth;

	public containerEl: HTMLElement;
	public contentEl: HTMLElement;
	public topbarEl: HTMLElement;
	public collapseEl: HTMLElement | undefined;
	public topbarContentEl: HTMLElement;
	public resizeHandleEl: HTMLElement | undefined;
	
	private _sidebarID: string;
	get sidebarID(): string { return this._sidebarID; }
	private _isLeft: boolean;
	get isLeft(): boolean { return this._isLeft; }
	private _resizing: boolean;
	get resizing(): boolean { return this._resizing; }
	private _collapsed: boolean;
	get collapsed(): boolean { return this._collapsed; }
		set collapsed(collapse: boolean)
	{
		// If the sidebar is already in the target state, do nothing
		// This check is important to prevent infinite loops if sidebars try to close each other repeatedly.
		if (this._collapsed === collapse) {
			return;
		}

		this._collapsed = collapse;	

		const isPhone = ObsidianSite.deviceSize === "phone";
		const isTablet = ObsidianSite.deviceSize === "tablet"; // Tablets also often have floating sidebars

		if (!collapse) { // Sidebar is being opened
			if (isPhone) {
				// Ticket 1: Close the other sidebar if it's open on phone
				if (this.isLeft) {
					if (ObsidianSite.rightSidebar && !ObsidianSite.rightSidebar.collapsed) {
						ObsidianSite.rightSidebar.collapsed = true;
					}
				} else { // This is the right sidebar
					if (ObsidianSite.leftSidebar && !ObsidianSite.leftSidebar.collapsed) {
						ObsidianSite.leftSidebar.collapsed = true;
					}
				}
			}

			// Ticket 2 (for phone) & general click-outside for floating sidebars (tablet)
			// Add body click listener if on phone or tablet
			if (isPhone || isTablet) {
				// Ensure listener isn't added multiple times by removing it first (just in case)
				// The bound method this.clickOutsideCollapse is used.
				document.body.removeEventListener("click", this.clickOutsideCollapse);
				document.body.addEventListener("click", this.clickOutsideCollapse);
			}
		} else { // Sidebar is being closed
			// Remove body click listener if it was potentially added for phone or tablet
			document.body.removeEventListener("click", this.clickOutsideCollapse);
		}

		this.containerEl.classList.toggle("is-collapsed", collapse);
	}
	private _floating: boolean;
	get floating(): boolean { return this._floating; }
	set floating(floating: boolean)
	{
		this._floating = floating;
		this.containerEl.classList.toggle("floating", floating);
	}

	get width(): number
	{
		return this.containerEl.offsetWidth;
	}
	set width(width: number)
	{
		const newWidth = `min(max(${width}px, ${this.minWidthEm}em), 40vw)`;

		if (width < this.collapseWidth)
		{
			this.collapsed = true;
			this.containerEl.style.removeProperty('transition-duration');
		} 
		else 
		{
			this.collapsed = false;
			this.containerEl.style.setProperty('--sidebar-width', newWidth);
			if (width > this.minResizeWidth) this.containerEl.style.transitionDuration = "0s";
		}

		if(ObsidianSite.graphView) ObsidianSite.graphView.graphRenderer.autoResizeCanvas();
	}

		constructor(container: HTMLElement)
	{
		if (!container.classList.contains("sidebar")) throw new Error("Invalid sidebar container");
		this.containerEl = container;
		this.contentEl = container.querySelector(".leaf-content") as HTMLElement;
		this.topbarEl = container.querySelector(".sidebar-topbar") as HTMLElement;
		this.collapseEl =
			(document.querySelector(
				container.id == "left-sidebar" ? "#left-sidebar-toggle-button" : "#right-sidebar-toggle-button"
			) as HTMLElement | null) ??
			(container.querySelector(".sidebar-collapse-icon") as HTMLElement | null) ??
			(document.querySelector(
				`.global-topbar-sidebar-toggle[data-sidebar="${container.id}"]`
			) as HTMLElement | null) ??
			undefined;
		this.topbarContentEl = container.querySelector(".topbar-content") as HTMLElement;
		this.resizeHandleEl = container.querySelector(".sidebar-handle") as HTMLElement ?? undefined;
		this._isLeft = container.id == "left-sidebar";
		this._sidebarID = container.id;

		if (!this.collapseEl) {
			this.collapseEl = this.createGlobalSidebarToggle();
		}

		this.collapseEl?.addEventListener("click", () =>
		{
			this.collapsed = !this.collapsed;
		});

		// Bind the clickOutsideCollapse method to this instance
		this.clickOutsideCollapse = this.clickOutsideCollapse.bind(this);

		this.minResizeWidth = parseFloat(getComputedStyle(this.resizeHandleEl?.parentElement ?? this.resizeHandleEl).fontSize) * this.minWidthEm;
		this.collapseWidth = this.minResizeWidth / 4.0;

		this.setupSidebarResize();
		if (this.isLeft) {
			this.setupLeftSidebarSectionResize();
		}
	}

	private createGlobalSidebarToggle(): HTMLElement | undefined
	{
		const navbarZoneSelector = this.isLeft
			? "#navbar .navbar-zone-left"
			: "#navbar .navbar-zone-right";
		const navbarZone = document.querySelector(navbarZoneSelector) as HTMLElement | null;
		if (!navbarZone) return undefined;

		const toggle = document.createElement("div");
		toggle.className = `clickable-icon sidebar-collapse-icon global-topbar-sidebar-toggle ${this.isLeft ? "sidebar-toggle-left" : "sidebar-toggle-right"}`;
		toggle.id = this.isLeft ? "left-sidebar-toggle-button" : "right-sidebar-toggle-button";
		toggle.setAttribute("data-sidebar", this.containerEl.id);
		toggle.setAttribute("aria-label", this.isLeft ? "Toggle left sidebar" : "Toggle right sidebar");
		toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon sidebar-toggle-button-icon"><rect x="1" y="2" width="22" height="20" rx="4"></rect><rect x="4" y="5" width="2" height="14" rx="2" fill="currentColor" class="sidebar-toggle-icon-inner"></rect></svg>`;

		navbarZone.appendChild(toggle);
		return toggle;
	}

	private setupSidebarResize()
	{
		if (!this.resizeHandleEl) return;

		const savedWidth = localStorage.getItem(`${this.sidebarID}-width`);
		if (savedWidth) this.containerEl.style.setProperty('--sidebar-width', savedWidth);

		const localThis = this;
		function resizeMove(e: PointerEvent)
		{
			if (!localThis.resizing) return;
			const distance = localThis.isLeft ? e.clientX : window.innerWidth - e.clientX;
			localThis.width = distance;
		}

		function handleClick(e: PointerEvent) 
		{
			localThis._resizing = true;
			localThis.containerEl.classList.add('is-resizing');
			document.addEventListener('pointermove', resizeMove);
			document.addEventListener('pointerup', function () 
			{
				document.removeEventListener('pointermove', resizeMove);
				const finalWidth = getComputedStyle(localThis.containerEl).getPropertyValue('--sidebar-width');
				localStorage.setItem(`${localThis.sidebarID}-width`, finalWidth);
				localThis.containerEl.classList.remove('is-resizing');
				localThis.containerEl.style.removeProperty('transition-duration');
			});
		}

		this.resizeHandleEl.addEventListener('pointerdown', handleClick);

		// reset sidebar width on double click
		function resetSidebarEvent(e: MouseEvent)
		{
			localThis.resetWidth();
		}

		this.resizeHandleEl.addEventListener('dblclick', resetSidebarEvent);
	}

	private setupLeftSidebarSectionResize()
	{
		const graphSection = this.contentEl.querySelector(".graph-view-wrapper") as HTMLElement | null;
		const fileTreeSection = this.contentEl.querySelector("#file-explorer") as HTMLElement | null;
		if (!graphSection || !fileTreeSection) return;

		// Keep graph section above the file tree to match Obsidian's layout.
		if (graphSection.compareDocumentPosition(fileTreeSection) & Node.DOCUMENT_POSITION_PRECEDING)
		{
			fileTreeSection.before(graphSection);
		}

		let splitter = this.contentEl.querySelector(".left-sidebar-section-splitter") as HTMLElement | null;
		if (!splitter)
		{
			splitter = document.createElement("div");
			splitter.classList.add("left-sidebar-section-splitter");
			graphSection.after(splitter);
		}

		const storageKey = `${this.sidebarID}-section-split`;
		const minTopHeight = 120;
		const minBottomHeight = 120;

		let latestGraphHeight = Number.NaN;
		const resizeGraph = (height: number) =>
		{
			const roundedHeight = Math.round(height);
			latestGraphHeight = roundedHeight;
			graphSection.style.flex = `0 0 ${roundedHeight}px`;
		};

		const savedGraphHeight = Number(localStorage.getItem(storageKey) ?? "");
		if (Number.isFinite(savedGraphHeight) && savedGraphHeight > minTopHeight)
		{
			resizeGraph(savedGraphHeight);
		}

		let resizing = false;
		let activePointerId: number | null = null;
		let pointerStartY = 0;
		let graphHeightStart = 0;
		const onPointerMove = (event: PointerEvent) =>
		{
			if (!resizing || !splitter) return;
			if (activePointerId != null && event.pointerId !== activePointerId) return;
			const contentRect = this.contentEl.getBoundingClientRect();
			const splitterHeight = splitter.offsetHeight || 0;
			const maxTopHeight = Math.max(
				minTopHeight,
				contentRect.height - splitterHeight - minBottomHeight
			);
			const dragDelta = event.clientY - pointerStartY;
			const nextHeight = Math.min(Math.max(graphHeightStart + dragDelta, minTopHeight), maxTopHeight);
			resizeGraph(nextHeight);
			event.preventDefault();
		};

		const onPointerUp = (event: PointerEvent) =>
		{
			if (!resizing) return;
			if (activePointerId != null && event.pointerId !== activePointerId) return;
			if (splitter && activePointerId != null && splitter.hasPointerCapture(activePointerId))
			{
				splitter.releasePointerCapture(activePointerId);
			}
			resizing = false;
			activePointerId = null;
			if (Number.isFinite(latestGraphHeight))
			{
				localStorage.setItem(storageKey, `${latestGraphHeight}`);
			}
			if (ObsidianSite.graphView) ObsidianSite.graphView.graphRenderer.autoResizeCanvas();
			this.contentEl.classList.remove("is-section-resizing");
			document.body.style.removeProperty("cursor");
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerup", onPointerUp);
			document.removeEventListener("pointercancel", onPointerUp);
		};

		splitter.addEventListener("pointerdown", (event: PointerEvent) =>
		{
			if (event.button !== 0 && event.pointerType !== "touch" && event.pointerType !== "pen") return;
			resizing = true;
			activePointerId = event.pointerId;
			pointerStartY = event.clientY;
			graphHeightStart = graphSection.getBoundingClientRect().height;
			splitter!.setPointerCapture(event.pointerId);
			this.contentEl.classList.add("is-section-resizing");
			document.body.style.cursor = "ns-resize";
			document.addEventListener("pointermove", onPointerMove);
			document.addEventListener("pointerup", onPointerUp);
			document.addEventListener("pointercancel", onPointerUp);
			event.stopPropagation();
			event.preventDefault();
		});

		// Double click to restore default section ratio.
		splitter.addEventListener("dblclick", () =>
		{
			graphSection.style.removeProperty("flex");
			localStorage.removeItem(storageKey);
			if (ObsidianSite.graphView) ObsidianSite.graphView.graphRenderer.autoResizeCanvas();
		});
	}

	public resetWidth()
	{
		this.containerEl.style.removeProperty('transition-duration');
		this.containerEl.style.removeProperty('--sidebar-width');
		localStorage.removeItem(`${this.sidebarID}-width`);

		setTimeout(() =>
		{
			console.log("Resizing canvas");
			if(ObsidianSite.graphView) 
			{
				ObsidianSite.graphView.graphRenderer.autoResizeCanvas();
				ObsidianSite.graphView.graphRenderer.centerCamera();
			}
		}, 500);
	}

	private clickOutsideCollapse(event: MouseEvent)
	{
		// If the click target is inside this specific sidebar, do nothing.
		const target = event.target as HTMLElement | null;
		if (target?.closest(`#${this.containerEl.id}`)) {
			return;
		}

		// Keep sidebar open when the user clicks this sidebar's topbar toggle button.
		if (target?.closest(`.global-topbar-sidebar-toggle[data-sidebar="${this.containerEl.id}"]`)) {
			return;
		}

		const isPhone = ObsidianSite.deviceSize === "phone";
		const isTablet = ObsidianSite.deviceSize === "tablet";

		// Only collapse if on phone or tablet (where this floating behavior is desired)
		if (isPhone || isTablet) {
			this.collapsed = true; 
			// Setting this.collapsed = true will trigger the setter, 
			// which in turn will remove the event listener from document.body.
		}
	}
}
