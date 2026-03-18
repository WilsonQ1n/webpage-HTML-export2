import { WebpageDocument } from "./document"
import { Header } from "./headers";
import { LinkHandler } from "./links";
import { Bounds, inOutQuadBlend, Vector2, getPointerPosition, lerp, lerpv, inOutQuadBlendv, lerpc, clamp, mapRange, mapRangeClamped } from "./utils";

export enum NodeType
{
	Markdown = "markdown",
	ExternalMarkdown = "external-markdown",
	Canvas = "canvas",
	Image = "image",
	Video = "video",
	Audio = "audio",
	Website = "website",
	Group = "group",
	None = "none"
}

export class CanvasNode
{
	public canvas: Canvas;
	public nodeEl: HTMLElement;
	public labelEl: HTMLElement;
	public containerEl: HTMLElement;
	public contentEl: HTMLElement;
	public type: NodeType;
	public document: WebpageDocument;
	public isFocused: boolean = false;

	public get size(): Vector2
	{
		return new Vector2(parseFloat(this.nodeEl.style.width.replace("px", "")), parseFloat(this.nodeEl.style.height.replace("px", "")));
	}

	public set size(newSize: Vector2)
	{
		this.nodeEl.style.width = newSize.x + "px";
		this.nodeEl.style.height = newSize.y + "px";
		this.nodeEl.style.setProperty("--canvas-node-width", newSize.x + "px");
		this.nodeEl.style.setProperty("--canvas-node-height", newSize.y + "px");
	}

	public get position(): Vector2
	{
		// ex. transform: translate(1600px, 10550px);
		const transform = this.nodeEl.style.transform;
		const match = transform.match(/translate\(([^,]+)px, ([^,]+)px\)/);

		const translate = this.nodeEl.style.translate;
		const match2 = translate.match(/([^,]+)px ([^,]+)px/);

		// add together the two translations
		let x = 0;
		let y = 0;
		if (match)
		{
			x += parseFloat(match[1]);
			y += parseFloat(match[2]);
		}

		if (match2)
		{
			x += parseFloat(match2[1]);
			y += parseFloat(match2[2]);
		}

		return new Vector2(x, y);
	}

	public set position(newPos: Vector2)
	{
		this.nodeEl.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
	}

	public get bounds(): Bounds
	{
		let bounds = new Bounds(0, 0, 0, 0);
		let size = this.size.scale(this.canvas.scale);
		let position = this.position.scale(this.canvas.scale).add(this.canvas.position);

		bounds.position = position;
		bounds.size = size;
		return bounds;
	}

	public get label(): string
	{
		return this.labelEl.textContent ?? "";
	}

	public set label(newLabel: string)
	{
		this.labelEl.textContent = newLabel;
	}

	public get isScrollable(): boolean
	{
		if (!this.document) return false;
		return this.document?.documentEl.scrollHeight > this.document?.documentEl.clientHeight;
	}

	public get scrollContainer(): HTMLElement | null
	{
		return this.document?.documentEl;
	}

	constructor(canvas: Canvas, nodeEl: HTMLElement)
	{
		this.canvas = canvas;
		this.nodeEl = nodeEl;
		//@ts-ignore
		this.nodeEl.nodeObj = this;
		this.labelEl = nodeEl.querySelector(".canvas-node-label") as HTMLElement;
		this.containerEl = nodeEl.querySelector(".canvas-node-container") as HTMLElement;
		this.contentEl = nodeEl.querySelector(".canvas-node-content") as HTMLElement;

		if (!this.labelEl || !this.containerEl || !this.contentEl)
		{
			console.error("Failed to find all required elements for canvas node", this);
			return;
		}

		const contentClasses = this.contentEl.classList;
		if (contentClasses.contains("image-embed")) this.type = NodeType.Image;
		else if (contentClasses.contains("video-embed")) this.type = NodeType.Video;
		else if (contentClasses.contains("audio-embed")) this.type = NodeType.Audio;
		else if (contentClasses.contains("markdown-embed") && contentClasses.contains("external-markdown-embed")) this.type = NodeType.ExternalMarkdown;
		else if (contentClasses.contains("markdown-embed")) this.type = NodeType.Markdown;
		else if (contentClasses.contains("canvas-embed")) this.type = NodeType.Canvas;
		else if (this.contentEl.firstElementChild?.tagName === "IFRAME") this.type = NodeType.Website;
		else if (this.nodeEl.classList.contains("canvas-node-group")) this.type = NodeType.Group;
		else this.type = NodeType.None;

		if (this.type == NodeType.ExternalMarkdown)
		{
			const documentEl = this.contentEl.querySelector(".obsidian-document");
			console.log(documentEl);
			const documentObj = canvas.document.children.find((doc) => doc.documentEl == documentEl);
			if (documentObj) this.document = documentObj;
			else console.error("Failed to find document object for external markdown node", this);
		}

		// if (this.type == NodeType.Group)
		// {
		// 	this.nodeEl.style.pointerEvents = "auto";
		// }

		this.initEvents();
	}

	public focus(force: boolean = true)
	{
		if (this.isFocused && force) return;
		if (this.canvas.focusedNode != this) this.canvas.focusedNode?.focus(false);
		this.nodeEl.classList.toggle("is-focused", force);
		this.canvas.focusedNode = force ? this : null;
		this.isFocused = force;
	}

	private initEvents()
	{
		const node = this;

		this.nodeEl.addEventListener("dblclick", (e) => 
		{
			node.fitToView(false);
		});

		function resolveNodePath(): string | undefined
		{
			if (node.document?.pathname) return node.document.pathname;
			const label = node.label?.trim();
			if (!label) return;
			const direct = label.endsWith(".html") ? label : `${label}.html`;
			//@ts-ignore
			if (ObsidianSite?.getWebpageData?.(direct)) return direct;
			//@ts-ignore
			const webpages = ObsidianSite?.metadata?.webpages as Record<string, { title?: string }> | undefined;
			if (webpages)
			{
				for (const path in webpages)
				{
					const title = webpages[path]?.title;
					if (title && title.trim() === label) return path;
				}
			}
			return;
		}

		function getEmbeddedScrollContainer(): HTMLElement | null
		{
			return node.contentEl.querySelector(".markdown-preview-view, .obsidian-document") as HTMLElement | null;
		}

		async function setOutlineForNode(path: string | undefined)
		{
			if (!path)
			{
				//@ts-ignore
				ObsidianSite?.setOutlineForDocument?.(undefined);
				return;
			}

			let sourceHtml: Document | null = null;
			//@ts-ignore
			const fileData = ObsidianSite?.getFileData?.(path);
			if (fileData?.data)
			{
				sourceHtml = new DOMParser().parseFromString(fileData.data, "text/html");
			}
			else
			{
				//@ts-ignore
				const resp = await ObsidianSite?.fetch?.(path);
				if (resp?.ok)
				{
					const text = await resp.text();
					sourceHtml = new DOMParser().parseFromString(text, "text/html");
				}
			}

			if (!sourceHtml)
			{
				//@ts-ignore
				ObsidianSite?.setOutlineForDocument?.(undefined);
				return;
			}

			const scrollContainer = getEmbeddedScrollContainer();
			const headers = scrollContainer ? Header.createHeaderTree(scrollContainer) : [];
			const outlineDoc = { sourceHtml, documentEl: scrollContainer, headers };
			//@ts-ignore
			ObsidianSite?.setOutlineForDocument?.(outlineDoc, !!scrollContainer);
		}

		function updateFileTreeSelection(path: string | undefined)
		{
			//@ts-ignore
			const tree = ObsidianSite?.fileTree;
			if (!tree) return;
			let item = path ? tree.findByPath(path) : undefined;
			if (!item)
			{
				const label = node.label?.trim();
				if (label)
				{
					item = tree.find((treeItem: any) => treeItem?.innerEl?.textContent?.trim() === label);
				}
			}
			item?.setActive({ scrollIntoView: true });
			if (path) tree.revealPath(path);
		}

		async function selectNode()
		{
			if (node.type == NodeType.ExternalMarkdown || node.type == NodeType.Markdown)
			{
				const path = resolveNodePath();
				await setOutlineForNode(path);
				updateFileTreeSelection(path);
			}
			else
			{
				//@ts-ignore
				ObsidianSite?.setOutlineForDocument?.(undefined);
			}
		}

		function onEnter(event: PointerEvent)
		{
			node.focus(true);
			node.nodeEl.addEventListener("mouseleave", onLeave);
			node.nodeEl.addEventListener("touchend", onLeave);
			event.stopPropagation();
		}

		function onLeave()
		{
			console.log("leave");
			node.focus(false);
			node.nodeEl.removeEventListener("mouseleave", onLeave);
			node.nodeEl.removeEventListener("touchend", onLeave);
		}

		this.nodeEl.addEventListener("pointerenter", onEnter);
		this.nodeEl.addEventListener("pointerdown", (event) =>
		{
			if (event.button != 0 && event.button != undefined) return;
			node.focus(true);
			selectNode();
		});
	}

	public fitToView(instant: boolean = false)
	{
		this.canvas.fitToBounds(this.bounds, 0.9, instant);
	}
}

export class Canvas
{
	public document: WebpageDocument;
	public nodes: CanvasNode[];
	public hiddenNodes: CanvasNode[] = [];
	public canvasEl: HTMLElement;
	public wrapperEl: HTMLElement;
	public backgroundEl: HTMLElement;
	public backgroundDotEl: SVGCircleElement;
	public focusedNode: CanvasNode | null = null;

	private _renderScale = 1;
	public get renderScale(): number { return this._renderScale; }
	public set renderScale(scale: number)
	{
		this._renderScale = scale;
		//@ts-ignore
		this.canvasEl.style.zoom = (scale * 100) + "%";
		this.scale = this._scale;
		this.position = this._position;
	}


	public get nodeBounds(): Bounds
	{
		if (this.nodes.length == 0) return new Bounds(0, 0, 0, 0);
		const bounds = this.nodes[0].bounds;

		for (const node of this.nodes)
		{
			bounds.encapsulate(node.bounds);
		};

		return bounds;
	}

	public get wrapperBounds(): Bounds
	{
		return Bounds.fromElement(this.wrapperEl);
	}

	private readonly _minScale: number = 0.1;
	private readonly _maxScale: number = 5;
	public get minScale(): number { return this._minScale; }
	public get maxScale(): number { return this._maxScale; }

	private _targetScale: number = 1;
	public get targetScale(): number { return this._targetScale}
	private set targetScale(newScale: number) 
	{
		newScale = Math.min(Math.max(newScale, this.minScale), this.maxScale);
		this._targetScale = newScale;
	}
	
	private _scale: number = 1;
	public get scale(): number { return this._scale; }
	private set scale(newScale: number)
	{
		let ratio = newScale / this._scale;
		this._scale = newScale;
		let scaled = newScale / this.renderScale;
		const scaleStr = scaled.toString() ?? "1";
		this.canvasEl.style.scale = scaleStr;
		const zoomStr = (1/(Math.sqrt(newScale))).toString() ?? "1";
		this.wrapperEl.style.setProperty("--zoom-multiplier",  zoomStr);

		this.canvasEl.classList.toggle("small-scale", this.scale < 0.15);

		this.backgroundScale = this.backgroundScale * ratio;
	}

	// private nodespaceOffset: Vector2;
	private _targetPosition: Vector2 = new Vector2(0, 0);
	public get targetPosition(): Vector2 { return this._targetPosition; }
	public set targetPosition(screenPos: Vector2)
	{
		this._targetPosition = screenPos;
	}

	private _position: Vector2 = new Vector2(0, 0);
	public get position(): Vector2 { return this._position; }
	public set position(screenPos: Vector2)
	{
		this._position = screenPos;
		let scaled = screenPos.divide(this.renderScale);
		this.canvasEl.style.translate = `${scaled.x}px ${scaled.y}px`;
		this.backgroundPosition = this.position;
	}

	public set forcePosition(screenPos: Vector2)
	{
		this.targetPosition = screenPos;
		this.position = screenPos;
	}

	public get forcePosition(): Vector2
	{
		return this.position;
	}

	private _backgroundBaseScale: number = 20;
	private _invisibleBackgroundScale: number = 2;
	private _backgroundScale: number = this._backgroundBaseScale;
	public get backgroundScale(): number { return this._backgroundScale; }
	public set backgroundScale(newScale: number)
	{
		const scaleStr = (newScale).toString()  ?? "20";
		this.backgroundEl?.setAttribute("width", scaleStr);
		this.backgroundEl?.setAttribute("height", scaleStr);
		this._backgroundScale = newScale;

		// lerp opacity based on scale
		if (this.backgroundEl?.parentElement)
			this.backgroundEl.parentElement.style.opacity = (1 - mapRangeClamped(this._backgroundScale, this._backgroundBaseScale / 2, this._invisibleBackgroundScale, 0, 1)).toString();
	}

	private _backgroundDotSize: number = 1;
	public get backgroundDotSize(): number { return this._backgroundDotSize; }
	public set backgroundDotSize(newSize: number)
	{
		const sizeStr = newSize.toString() ?? "0.7";
		this.backgroundDotEl?.setAttribute("r", sizeStr);
		this.backgroundDotEl?.setAttribute("cx", sizeStr);
		this.backgroundDotEl?.setAttribute("cy", sizeStr);
		this._backgroundDotSize = newSize;
	}

	private _backgroundPosition: Vector2 = new Vector2(0, 0);
	public get backgroundPosition(): Vector2 { return this._backgroundPosition; }
	public set backgroundPosition(newPosition: Vector2)
	{
		if (!this.backgroundEl) return;
		this.backgroundEl?.setAttribute("x", newPosition.x.toString());
		this.backgroundEl?.setAttribute("y", newPosition.y.toString());
		this._backgroundPosition = newPosition;
	}


	constructor(document: WebpageDocument)
	{
		this.document = document;
		this.nodes = Array.from(document.documentEl.querySelectorAll(".canvas-node"))
					.map((nodeEl) => new CanvasNode(this, nodeEl as HTMLElement));

		// canvas nodes sometimes (not always) have both a translate and a transform: translate in their style
		// this snippets combines them into one just one translation
		

		// make local space equal to screen space
		this.document.documentEl.style.position = "absolute";
		this.document.documentEl.style.width = "100%";
		this.document.documentEl.style.height = "100%";
		this.document.documentEl.style.overflow = "hidden";
		this.document.documentEl.style.top = "0";
		this.document.documentEl.style.left = "0";

		this.canvasEl = document.documentEl.querySelector(".canvas") as HTMLElement;
		this.wrapperEl = document.documentEl.querySelector(".canvas-wrapper") as HTMLElement;
		this.backgroundEl = document.documentEl.querySelector(".canvas-background pattern") as HTMLElement;
		this.backgroundDotEl = this.backgroundEl?.querySelector("circle") as SVGCircleElement;
		this.canvasEl.setAttribute("style", `translate: 0px 1px; scale: 1;`);
		this.backgroundScale = this._backgroundScale;
		this.backgroundDotSize = this._backgroundDotSize;
		this.renderScale = this._renderScale;

		const nodespaceOffset = Bounds.fromElement(this.canvasEl).min.sub(this.nodeBounds.min);
		Array.from(this.canvasEl.children).forEach((el) => 
		{
			//@ts-ignore
			el.style.translate = `${nodespaceOffset.x}px ${nodespaceOffset.y}px`;
		});

		this.forcePosition = this.nodeBounds.min.sub(this.wrapperBounds.min);

		requestAnimationFrame(this.updateScale.bind(this));
		
		this.initEvents();
		this.initControlButtons();
		this.initKeyboardZoom();

		this.wrapperEl.style.transition = "opacity 0.0s";
		this.wrapperEl.classList.add("hide");
		this.wrapperEl.style.transition = "opacity 3s";
		this.wrapperEl.classList.remove("hide");

		this.fitToBounds(this.nodeBounds, 3, true);

		setTimeout(() =>
		{
			// zoom in animation
			this.fitToBounds(this.nodeBounds, 0.9, false);
		}, 100);
	}

	private lastTime: number = 0;
	private updateScale(time: number)
	{
		if (this.lastTime == 0) this.lastTime = time;
		const deltaTime = (time - this.lastTime) / 1000;
		this.lastTime = time;

		if (Math.abs(this.targetScale - this.scale) > 0.0001) 
			this.scale = inOutQuadBlend(this.scale, this.targetScale, 6 * deltaTime);

		if (this.targetPosition.sub(this.position).magnitude > 0.001)
			this.position = inOutQuadBlendv(this.position, this.targetPosition, 6 * deltaTime);
		
		let screenBounds = Bounds.screenBounds;

		// sort the hidden nodes by their distance from the center of the screen
		this.hiddenNodes.sort((a, b) => 
		{
			const aCenter = a.bounds.center;
			const bCenter = b.bounds.center;
			const aDist = aCenter.sub(screenBounds.center).magnitude;
			const bDist = bCenter.sub(screenBounds.center).magnitude;
			return aDist - bDist;
		});

		// loop through the first 50 hidden nodes and check if they are visible, if they are unset the display
		for (let i = 0; i < 50; i++)
		{
			if (i >= this.hiddenNodes.length) break;
			const node = this.hiddenNodes[i];
			if (!node)
			{
				this.hiddenNodes.splice(i, 1);
				continue;
			}
			const bounds = node.bounds.expand(100);
			const isVisible = bounds.overlaps(screenBounds);
			node.nodeEl.style.display = isVisible ? "" : "none";
			if (isVisible) this.hiddenNodes.splice(i, 1);
		}

		requestAnimationFrame(this.updateScale.bind(this));
	}

	private initEvents()
	{
		// hide nodes that are not in view
		const observer = new IntersectionObserver((entries) => 
		{
			entries.forEach(entry => 
			{
				(entry.target as HTMLElement).style.display = entry.isIntersecting ? '' : 'none';
				//@ts-ignore
				if (!entry.isIntersecting) this.hiddenNodes.push((entry.target as HTMLElement).nodeObj);
			});
		}, { root: null, rootMargin: '0px', threshold: 0 });
		this.nodes.forEach((node) => observer.observe(node.nodeEl));

		// make canvas draggable / panable with mouse
		const localThis = this;
        const isWindows = navigator.userAgent.includes("Windows");

		function getRelativePointerPosition(event: MouseEvent | Touch): Vector2 {
            const rect = localThis.wrapperEl.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            return new Vector2(x, y);
        }

        function dragStart(event: PointerEvent) {
            if (event.pointerType != "mouse" && event.pointerType != "pen") return;
            const startPointerPos = getRelativePointerPosition(event);
            const startCanvasPos = localThis.position;
            const startingNode = localThis.focusedNode;

            function drag(dragEvent: MouseEvent) {
                if (isWindows && 
                    startingNode?.isScrollable && 
                    dragEvent.buttons == 4) return;

                dragEvent.preventDefault();
                const pointer = getRelativePointerPosition(dragEvent);
                const delta = pointer.sub(startPointerPos);
                localThis.forcePosition = startCanvasPos.add(delta);
            }

            function dragEnd(e: MouseEvent) {
                document.removeEventListener("mousemove", drag);
                document.removeEventListener("mouseup", dragEnd);
            }

            document.addEventListener("mousemove", drag);
            document.addEventListener("mouseup", dragEnd);
        }

        this.wrapperEl.addEventListener("pointerdown", dragStart);

		function getNodeFromTarget(target: HTMLElement | null): CanvasNode | null
		{
			const nodeEl = target?.closest(".canvas-node") as HTMLElement | null;
			if (!nodeEl) return null;
			//@ts-ignore
			return nodeEl.nodeObj ?? localThis.nodes.find((n) => n.nodeEl === nodeEl) ?? null;
		}

		function getScrollableContainer(target: HTMLElement | null, node: CanvasNode | null | undefined): HTMLElement | null
		{
			const nodeEl = target?.closest(".canvas-node") as HTMLElement | null;
			let el: HTMLElement | null = target;
			while (el && nodeEl && nodeEl.contains(el))
			{
				const tag = el.tagName;
				if (tag === "IFRAME" || tag === "EMBED" || tag === "OBJECT") return el;
				if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) return el;
				el = el.parentElement;
			}
			return node?.scrollContainer ?? null;
		}

		function shouldOverrideScroll(deltaY: number, deltaX: number, node: CanvasNode | null | undefined, target?: HTMLElement | null): boolean
		{
			const scrollContainer = getScrollableContainer(target ?? null, node);
			if (scrollContainer) return false;
			return true;
		}

		// make canvas scrollable (pan) with mouse wheel
		this.wrapperEl.addEventListener("wheel", function (event) {
			const target = event.target as HTMLElement | null;
			const targetNode = getNodeFromTarget(target) ?? localThis.focusedNode;
			if (!shouldOverrideScroll(event.deltaY, event.deltaX, targetNode, target)) return;
			event.preventDefault();
			let multiplier = 1;
			if (event.deltaMode === 1) multiplier = 16;
			else if (event.deltaMode === 2) multiplier = localThis.wrapperEl.clientHeight;
			const delta = new Vector2(-event.deltaX * multiplier, -event.deltaY * multiplier);
			localThis.targetPosition = localThis.targetPosition.add(delta);
		}, { passive: false });

		// clear outline when clicking on empty canvas background
		this.wrapperEl.addEventListener("pointerdown", (event) =>
		{
			const target = event.target as HTMLElement | null;
			if (!target) return;
			if (target.closest(".canvas-node") || target.closest(".canvas-controls")) return;
			//@ts-ignore
			ObsidianSite?.setOutlineForDocument?.(undefined);
		});

        let touching = false;
		this.wrapperEl.addEventListener("touchstart", function (event) {
            if (touching) return;
            touching = true;
            const touches = event.touches;
            
            function getTouchData(touches: TouchList) {
                const touch1 = getRelativePointerPosition(touches[0]);
                const touch2 = touches.length == 2 ? getRelativePointerPosition(touches[1]) : null;
                const center = touch2 ? touch1.add(touch2).scale(0.5) : touch1;
                const distance = touch2 ? Vector2.distance(touch1, touch2) : 0;

                return { touch1, touch2, center, distance };
            }

            let lastTouchData = getTouchData(touches);
            let isTwoFingerDrag = touches.length == 2;
            const startingNode = localThis.focusedNode;
        
            function touchMove(event: TouchEvent) {
                const touches = event.touches;
                const touchData = getTouchData(touches);

                if (touches.length == 2) {
                    if (!isTwoFingerDrag) {
                        lastTouchData = getTouchData(touches);
                        isTwoFingerDrag = true;
                    }

                    const scaleDelta = (touchData.distance - lastTouchData.distance) / lastTouchData.distance;
                    localThis.scaleAround(1 + scaleDelta, touchData.center);
                }

                const delta = touchData.center.sub(lastTouchData.center);
                if (!isTwoFingerDrag && !shouldOverrideScroll(-delta.y, delta.x, startingNode)) {
                    lastTouchData = getTouchData(touches);
                    return;
                }

                event.preventDefault();
                localThis.targetPosition = localThis.targetPosition.add(delta);
                lastTouchData = getTouchData(touches);
            }

            function touchEnd(event: TouchEvent) {
                document.removeEventListener("touchmove", touchMove);
                document.removeEventListener("touchend", touchEnd);
                touching = false;
            }

            document.addEventListener("touchmove", touchMove);
            document.addEventListener("touchend", touchEnd);
        });
    }

	private initKeyboardZoom()
	{
		const localThis = this;
		const zoomStep = 1.1;

		document.addEventListener("keydown", (event) =>
		{
			const target = event.target as HTMLElement | null;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

			const key = event.key;
			const code = event.code;

			const isZoomIn = key === "+" || (key === "=" && event.shiftKey) || code === "NumpadAdd";
			const isZoomOut = key === "-" || key === "_" || code === "NumpadSubtract";

			if (!isZoomIn && !isZoomOut) return;

			event.preventDefault();

			const center = localThis.wrapperBounds.center;
			const scaleBy = isZoomIn ? zoomStep : 1 / zoomStep;
			localThis.scaleAround(scaleBy, center);
		});
	}

	private initControlButtons()
	{
		let controls = this.wrapperEl.querySelector(".canvas-controls") as HTMLElement | null;
		if (!controls)
		{
			controls = document.createElement("div");
			controls.className = "canvas-controls";
			controls.innerHTML = `
				<div class="canvas-control-group mod-raised">
					<div class="canvas-control-item" data-tooltip-position="left">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-plus">
							<path d="M5 12h14"></path>
							<path d="M12 5v14"></path>
						</svg>
					</div>
					<div class="canvas-control-item" data-tooltip-position="left">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-minus">
							<path d="M5 12h14"></path>
						</svg>
					</div>
					<div class="canvas-control-item" data-tooltip-position="left">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-rotate-cw">
							<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
							<path d="M21 3v5h-5"></path>
						</svg>
					</div>
					<div class="canvas-control-item" data-tooltip-position="left">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-maximize">
							<path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
							<path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
							<path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
							<path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
						</svg>
					</div>
				</div>`;
			this.wrapperEl.appendChild(controls);
		}

		controls.style.setProperty("display", "flex", "important");
		controls.style.setProperty("pointer-events", "auto", "important");
		controls.style.setProperty("visibility", "visible", "important");

		const center = () => this.wrapperBounds.center;
		const zoomStep = 1.1;

		const plusIcon = controls.querySelector(".lucide-plus")?.closest(".canvas-control-item") as HTMLElement | null;
		const minusIcon = controls.querySelector(".lucide-minus")?.closest(".canvas-control-item") as HTMLElement | null;
		const resetIcon = controls.querySelector(".lucide-rotate-cw")?.closest(".canvas-control-item") as HTMLElement | null;
		const fitIcon = controls.querySelector(".lucide-maximize")?.closest(".canvas-control-item") as HTMLElement | null;

		if (plusIcon)
		{
			plusIcon.setAttribute("aria-label", "\u6309+");
			plusIcon.setAttribute("title", "\u6309+");
			plusIcon.addEventListener("click", (event) =>
			{
				event.preventDefault();
				this.scaleAround(zoomStep, center());
			});
		}

		if (minusIcon)
		{
			minusIcon.setAttribute("aria-label", "\u6309-");
			minusIcon.setAttribute("title", "\u6309-");
			minusIcon.addEventListener("click", (event) =>
			{
				event.preventDefault();
				this.scaleAround(1 / zoomStep, center());
			});
		}

		if (resetIcon)
		{
			resetIcon.addEventListener("click", (event) =>
			{
				event.preventDefault();
				this.setScaleAround(1, center(), true);
			});
		}

		if (fitIcon)
		{
			fitIcon.addEventListener("click", (event) =>
			{
				event.preventDefault();
				this.fitToBounds(this.nodeBounds, 0.9, false);
			});
		}
	}

	/**Sets the relative scale of the canvas around a point*/
	public scaleAround(scaleBy: number, point: Vector2, instantScale: boolean = false): Vector2
	{
		// clamp scale by the min and max scale when applied to the current scale
		const currentScale = this.targetScale;
		let newScale = currentScale * scaleBy;
		newScale = Math.min(Math.max(newScale, this.minScale), this.maxScale);
		scaleBy = newScale / currentScale;
		
		// calculate offset after scaling
		const centerToPoint = point.sub(this.targetPosition);
		const centerPin = centerToPoint.scale(scaleBy).add(this.targetPosition);
		const offset = point.sub(centerPin);

		if (instantScale)
		{
			this.scale *= scaleBy;
			this.targetScale =  this.scale;
			this.forcePosition = this.forcePosition.add(offset);
		}
		else
		{
			this.targetScale *= scaleBy;
			this.targetPosition = this.targetPosition.add(offset);
		}

		return offset;
	}

	public setScaleAround(scale: number, point: Vector2, instant: boolean = false)
	{
		this.scaleAround(scale / this.targetScale, point, instant);
	}

	public fitToBounds(bounds: Bounds = this.nodeBounds, scaleMultiplier: number = 0.9, instant: boolean = false)
	{
		this.hideNodesOutsideBounds(bounds.scale(2));
		const documentWidth = this.document.containerEl.clientWidth;
		const documentHeight = this.document.containerEl.clientHeight;
		const xRatio = documentWidth/bounds.width;
		const yRatio = documentHeight/bounds.height;
		const scale = scaleMultiplier * Math.min(xRatio, yRatio);
		this.scaleAround(scale, bounds.center, instant);
		this.centerView(bounds.center, instant);
	}

	private hideNodesOutsideBounds(bounds: Bounds)
	{
		for (const node of this.nodes)
		{
			if (!bounds.overlaps(node.bounds))
			{
				node.nodeEl.style.display = "none";
				this.hiddenNodes.push(node);
			}
		}
	}

	/**Sets the absolute center of the view*/
	private centerView(center: Vector2, instant: boolean = false)
	{
		const offset = this.wrapperBounds.center.sub(center);
		if (instant) this.forcePosition = this.forcePosition.add(offset);
		else this.targetPosition = this.targetPosition.add(offset);
	}
}

