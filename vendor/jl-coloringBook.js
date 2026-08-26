"use strict";
/*
    Copyright 2025 Joseph Love, primoweb.com, joe@primoweb.com
    This component is free to use provided that this notice is not altered or removed.
    Donations are accepted to continue the development of more open source projects. Paypal address: joe@primoweb.com

    Vendored for todaysdailybattle.com from https://github.com/collinph/jl-coloringbook
    Patches: localStorage keys, first palette selection, cursor max brush, print without document.write, quieter save(),
      build toolbar with createElement (insertAdjacentHTML + DOMPurify strips <input> under Trusted Types),
      tap-to-fill (flood fill inside line art) + brush mode toggle.
*/
customElements.define('jl-coloringbook', class extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        this.dragging = false;
        this.paths = [];
        this.color = null; // Initialize color
        this.drawMode = 'fill'; // kids default: pick color, tap area to fill between lines
        this._lineArtData = null;
        this._lineArtKey = '';
        this._lineArtCache = {};

        // Default colors
        this.paletteColors = [
            'rgba(87, 87, 87,0.8)',
            'rgba(220, 35, 35,0.8)',
            'rgba(42, 75, 215,0.8)',
            'rgba(29, 105, 20,0.8)',
            'rgba(129, 74, 25,0.8)',
            'rgba(129, 38, 192,0.8)',
            'rgba(160, 160, 160,0.8)',
            'rgba(129, 197, 122,0.8)',
            'rgba(157, 175, 255,0.8)',
            'rgba(41, 208, 208,0.8)',
            'rgba(255, 146, 51,0.8)',
            'rgba(255, 238, 51,0.8)',
            'rgba(233, 222, 187,0.8)',
            'rgba(255, 205, 243,0.8)',
            'white' // last color is eraser
        ];
    }

    // --- Lifecycle Callbacks ---
    connectedCallback() {
        // Ensure the component is displayed as a block
        this.style.display = 'block';

        const auto = this.getAttribute('autoinit');
        if (auto !== '0') {
            this.init();
        }
    }

    // --- Initialization & Setup ---
    init() {
        // Create a container for the slot elements
        this.slotsContainer = document.createElement('div');
        this.slotsContainer.classList.add('slots');
        this.slotsContainer.style.display = 'none';
        const slot = document.createElement('slot');
        this.slotsContainer.appendChild(slot);
        this.shadowRoot.appendChild(this.slotsContainer);

        // Listen for changes in the assigned slot elements
        slot.addEventListener('slotchange', this.drawTemplate.bind(this));
    }

    
   drawTemplate() {
        if (!this._jlClickTrap) {
            this._jlClickTrap = true;
            this.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }

        if (this._jlShellBuilt) {
            this.generatePalette();
            this.drawImageNav();
            return;
        }
        this._jlShellBuilt = true;

        // Add base styles
        const style = document.createElement('style');
        style.textContent = `
            /*icons*/
            @font-face {
              font-family: 'Material Icons';
              font-style: normal;
              font-weight: 400;
              src: url(https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNZ.ttf) format('truetype');
            }

            .material-icons {
              font-family: 'Material Icons';
              font-weight: normal;
              font-style: normal;
              font-size: 18px;
              line-height: 1;
              letter-spacing: normal;
              text-transform: none;
              display: inline-block;
              white-space: nowrap;
              word-wrap: normal;
              direction: ltr;
            }
            .wrapper { width:100%; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}

            /*default theme*/
            .imageNav img {
                box-sizing:border-box;
                border:3px solid transparent;
                width:12%; min-width:75px; max-width:150px;
                margin:4px;
                cursor: pointer; /* Add pointer cursor for clickable images */
            }
            .imageNav img.selected {
                border: 3px solid green;

            }
            .toolbar {
                z-index:100000;
                position: sticky;  position: -webkit-sticky;
                top: 0;
                background-color: rgba(200,200,200,.1)
            }
            .tools {
                display:flex;
                justify-content:flex-end;
                flex-wrap:wrap;
                max-width:100%;
            }
            .sizerTool {
                cursor:inherit;
                align-self:flex-start;
                width:64px;
            }
            .spacer {
                flex-basis:0;
                flex-grow:1;
            }
            .tools > * {margin:2px}
            .palette {
                display:inline-block;
            }
            .paletteColor {
                text-align:center;
                height:28px;
                width:28px;
                margin:2px;
                border-radius:50%;
                box-sizing:border-box;
                border:3px solid rgba(232,232,232,1);
                display:inline-block;
                overflow:hidden;
                cursor: pointer; /* Add pointer cursor for color selection */
            }
            .paletteColor.selected {
                border-color:black;
                transform: scale(1.2);
            }

            .paletteColor.eraser { border-color: red; background-image: linear-gradient(135deg,white 43%, red 45%, red 55%, white 57%, white)}


            .canvasWrapper {
                display:inline-block;
                position:relative;
                width:100%
            }
            .canvas {
                z-index:1000;
                position:absolute;
                top:0;left:0;
                width:100%;
            }
            .activeCanvas {
                z-index:1001;
                position:absolute;
                top:0;left:0;
                width:100%;
            }
            .canvasBackgroundImage{width:100%}

            /* Line-art overlay — rendered above paint canvases so outlines stay crisp */
            .lineArtOverlay {
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                z-index: 1002;
                pointer-events: none;
                display: block;
            }

            .undoButton > i::after{ content: "undo"}
            .clearButton > i::after{ content: "clear"}
            .printButton > i::after{ content: "print"}
            .saveButton > i::after{ content: "save"}
            .fillButton > i::after{ content: "format_color_fill"}
            .brushButton > i::after{ content: "brush"}
            .tools .button.modeSelected {
                outline: 3px solid #2563eb;
                background: #dbeafe;
            }
            .sizerTool.is-disabled {
                opacity: 0.35;
                pointer-events: none;
            }
            .modeHint {
                width: 100%;
                text-align: center;
                font: 600 12px/1.35 system-ui, -apple-system, Segoe UI, sans-serif;
                color: #1e3a5f;
                padding: 2px 6px 6px;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Load external CSS if specified
        const cssAttr = this.getAttribute('css');
        if (cssAttr) {
            const link = document.createElement('link');
            link.href = cssAttr;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            this.shadowRoot.appendChild(link);
        }

        this.mainContentContainer = document.createElement('div');
        this.shadowRoot.appendChild(this.mainContentContainer);

        const maxBrushSize = this.getAttribute('maxbrushsize') || 32;

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        const imageNav = document.createElement('div');
        imageNav.className = 'imageNav';
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        const tools = document.createElement('div');
        tools.className = 'tools';

        const sizer = document.createElement('input');
        sizer.type = 'range';
        sizer.className = 'sizerTool input';
        sizer.min = '1';
        sizer.max = String(maxBrushSize);
        tools.appendChild(sizer);

        const spacer = document.createElement('div');
        spacer.className = 'spacer';
        tools.appendChild(spacer);

        function iconButton(className) {
            const btn = document.createElement('button');
            btn.className = className + ' button';
            const i = document.createElement('i');
            i.className = 'material-icons';
            btn.appendChild(i);
            return btn;
        }

        const fillButton = iconButton('fillButton');
        fillButton.type = 'button';
        fillButton.setAttribute('aria-label', 'Fill tool: tap an area to color inside the lines');
        fillButton.title = 'Fill — tap an area';
        const brushButton = iconButton('brushButton');
        brushButton.type = 'button';
        brushButton.setAttribute('aria-label', 'Brush tool: draw freehand');
        brushButton.title = 'Brush — draw freehand';
        const undoButton = iconButton('undoButton');
        undoButton.type = 'button';
        undoButton.setAttribute('aria-label', 'Undo');
        undoButton.title = 'Undo';
        const clearButton = iconButton('clearButton');
        clearButton.type = 'button';
        clearButton.setAttribute('aria-label', 'Clear all color');
        clearButton.title = 'Clear';
        const printButton = iconButton('printButton');
        printButton.type = 'button';
        printButton.setAttribute('aria-label', 'Print');
        printButton.title = 'Print';
        const saveButton = iconButton('saveButton');
        saveButton.type = 'button';
        saveButton.setAttribute('aria-label', 'Save picture');
        saveButton.title = 'Save';
        tools.appendChild(fillButton);
        tools.appendChild(brushButton);
        tools.appendChild(undoButton);
        tools.appendChild(clearButton);
        tools.appendChild(printButton);
        tools.appendChild(saveButton);

        const modeHint = document.createElement('div');
        modeHint.className = 'modeHint';
        modeHint.setAttribute('aria-live', 'polite');

        const palette = document.createElement('div');
        palette.className = 'palette';
        toolbar.appendChild(tools);
        toolbar.appendChild(modeHint);
        toolbar.appendChild(palette);

        this.fillButton = fillButton;
        this.brushButton = brushButton;
        this.modeHint = modeHint;

        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'canvasWrapper';

        wrapper.appendChild(imageNav);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(canvasWrapper);
        this.mainContentContainer.appendChild(wrapper);

        this.sizer = sizer;
        this.wrapper = wrapper;
        this.imageNav = imageNav;
        this.palette = palette;
        this.canvasWrapper = canvasWrapper;

        sizer.addEventListener('input', this.updateSize.bind(this));
        fillButton.addEventListener('click', () => this.setDrawMode('fill'));
        brushButton.addEventListener('click', () => this.setDrawMode('brush'));
        undoButton.addEventListener('click', () => {
            this.paths.pop();
            this.refresh();
            this.persistPaths();
        });
        clearButton.addEventListener('click', () => {
            this.paths = [];
            this.persistPaths();
            this.refresh();
        });
        printButton.addEventListener('click', this.print.bind(this));
        saveButton.addEventListener('click', this.save.bind(this));

        this.generatePalette();
        this.drawImageNav();
        this.setDrawMode(this.drawMode || 'fill');
    }

    setDrawMode(mode) {
        this.drawMode = mode === 'brush' ? 'brush' : 'fill';
        if (this.fillButton && this.brushButton) {
            this.fillButton.classList.toggle('modeSelected', this.drawMode === 'fill');
            this.brushButton.classList.toggle('modeSelected', this.drawMode === 'brush');
            this.fillButton.setAttribute('aria-pressed', this.drawMode === 'fill' ? 'true' : 'false');
            this.brushButton.setAttribute('aria-pressed', this.drawMode === 'brush' ? 'true' : 'false');
        }
        if (this.sizer) {
            this.sizer.classList.toggle('is-disabled', this.drawMode === 'fill');
            this.sizer.disabled = this.drawMode === 'fill';
        }
        if (this.modeHint) {
            this.modeHint.textContent = this.drawMode === 'fill'
                ? 'Fill mode: pick a color, then tap inside the lines'
                : 'Brush mode: draw freehand (size slider on the left)';
        }
        this.setCursor();
    }

    persistPaths() {
        if (!this.src) return;
        try {
            localStorage.setItem('v2:' + this.src, JSON.stringify(this.paths));
        } catch (e) {}
    }

   generatePalette() {
        let customPaletteColors = [];
        const slotElements = this.slotsContainer.querySelector('slot').assignedElements();

        for (const el of slotElements) {
            if (el.tagName === 'I') {
                const color = el.getAttribute('color');
                if (color) {
                    customPaletteColors.push(color);
                }
            }
        }
        if (customPaletteColors.length) {
            this.paletteColors = customPaletteColors;
        }

        this.palette.innerHTML = ''; // Clear existing palette
        let i = 0;
        for (const value of this.paletteColors) {
            const classesToAdd = ['paletteColor', `color${i}`]; // Always add these

            // Conditionally add the 'eraser' class
            if (i === (this.paletteColors.length - 1)) {
                classesToAdd.push("eraser");
            }

            const paletteColorDiv = document.createElement('div');
            // Use the spread operator to add all classes from the array
            paletteColorDiv.classList.add(...classesToAdd);
            paletteColorDiv.style.backgroundColor = value;
            paletteColorDiv.setAttribute('data-color-index', i);

            paletteColorDiv.addEventListener('click', (e) => {
                this.color = parseInt(e.currentTarget.getAttribute('data-color-index'), 10); // Added radix 10
                this.setCursor();
                // Remove 'selected' from all siblings and add to current
                this.palette.querySelectorAll('.paletteColor').forEach(pc => pc.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
            });
            this.palette.appendChild(paletteColorDiv);
            i++;
        }
    }

    drawImageNav() {
        this.images = [];
        const slotElements = this.slotsContainer.querySelector('slot').assignedElements();

        for (const el of slotElements) {
            if (el.tagName === 'IMG') {
                this.images.push(el.getAttribute('data-lazy-src') || el.getAttribute('src'));
            }
        }

        this.imageNav.innerHTML = ''; // Clear previous navigation
        let sel = 0;
        let i = 0;
        if (this.hasAttribute('randomize')) {
            sel = Math.floor(Math.random() * this.images.length);
        }

        if (this.images.length > 1) {
            for (const src of this.images) {
                const imgElement = document.createElement('img');
                imgElement.src = src;
                imgElement.classList.add('image');
                imgElement.addEventListener('click', (e) => {
                    this.selectImage(e.currentTarget);
                });
                this.imageNav.appendChild(imgElement);
                if (sel === i) {
                    this.selectImage(imgElement);
                }
                i++;
            }
        } else if (this.images.length === 1) {
            const imgElement = document.createElement('img');
            imgElement.src = this.images[0];
            this.selectImage(imgElement);
        }
    }

    selectImage(sourceImgElement) {
        this.src = sourceImgElement.src;
        this.img = document.createElement('img');
        this.img.classList.add('canvasBackgroundImage');
        this.img.src = this.src;

        // Remove 'selected' class from all images in imageNav and add to selected one
        this.imageNav.querySelectorAll('.image').forEach(img => img.classList.remove('selected'));
        sourceImgElement.classList.add('selected');

        this.drawCanvas();
    }

    drawCanvas() {
        // Clear previous canvas elements and append the new background image
        this.canvasWrapper.innerHTML = '';
        this.canvasWrapper.appendChild(this.img);

        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('canvas');
        this.canvasWrapper.appendChild(this.canvas);

        this.activeCanvas = document.createElement('canvas');
        this.activeCanvas.classList.add('activeCanvas');
        this.canvasWrapper.appendChild(this.activeCanvas);

        // Line art overlay — same image rendered on top of both paint canvases so
        // outlines can never be painted over. pointer-events:none so drawing still works.
        this.lineArtOverlay = document.createElement('img');
        this.lineArtOverlay.src = this.src;
        this.lineArtOverlay.alt = '';
        this.lineArtOverlay.setAttribute('aria-hidden', 'true');
        this.lineArtOverlay.classList.add('lineArtOverlay');
        this.canvasWrapper.appendChild(this.lineArtOverlay);

        this.ctx = this.canvas.getContext('2d');
        this.activeCtx = this.activeCanvas.getContext('2d');

        this.img.onload = () => {
            this.sizeCanvas();
            const storedPaths = localStorage.getItem(`v2:${this.img.src}`);
            if (storedPaths) {
                try {
                    this.paths = JSON.parse(storedPaths);
                } catch (e) {
                    console.error("Error parsing stored paths, clearing data:", e);
                    this.paths = [];
                }
            } else {
                this.paths = [];
            }
            this.refresh();

            // Select the first color if none is selected
            if (this.color === null) {
                const firstColor = this.shadowRoot.querySelector('.paletteColor');
                if (firstColor) {
                    firstColor.click();
                }
            }
        };

        // Ensure image load event fires if image is already cached
        if (this.img.complete && this.img.naturalHeight !== 0) {
            this.img.onload();
        }

        // Add mouse and touch event listeners to the active canvas
        this.activeCanvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.activeCanvas.addEventListener('mouseup', this.mouseUp.bind(this));
        this.activeCanvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.activeCanvas.addEventListener('touchstart', this.touchStart.bind(this), {
            passive: false
        }); // Use passive:false for preventDefault
        this.activeCanvas.addEventListener('touchend', this.touchEnd.bind(this));
        this.activeCanvas.addEventListener('touchmove', this.touchMove.bind(this), {
            passive: false
        }); // Use passive:false for preventDefault
    }

    // --- Event Handlers ---
    touchStart(oe) {
        const e = oe; // Original event is directly passed now
        if (e.touches.length >= 2) return;
        // Prevent scroll + synthetic mouse double-tap on fill
        if (e.preventDefault) e.preventDefault();
        const touch = e.touches[0];
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        this.mouseDown(e);
    }

    touchEnd(oe) {
        const e = oe; // Original event is directly passed now
        this.mouseUp(e);
    }

    touchMove(oe) {
        const e = oe; // Original event is directly passed now
        if (e.touches.length >= 2) return true; // allow 2 finger gestures through
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        this.mouseMove(e);
    }

    mouseDown(e) {
        const pos = this.getCursorPosition(e);
        if (this.drawMode === 'fill') {
            if (e.preventDefault) e.preventDefault();
            this.applyTapFill(pos.x, pos.y);
            this.dragging = false;
            return;
        }
        this.dragging = true;
        pos.c = this.color;
        pos.s = this.sizer.value; // Use .value for input range
        this.paths.push([pos]);
        this.setCursor();
    }

    mouseUp(e) {
        if (this.drawMode === 'fill') {
            this.dragging = false;
            return;
        }
        this.commitActivePath();
        if (this.dragging) {
            this.persistPaths();
        }
        this.dragging = false;
    }

    mouseMove(e) {
        if (this.drawMode === 'fill') return;
        if (!this.dragging) return;
        const path = this.paths[this.paths.length - 1];
        if (!path || path[0] && path[0].fill) return;
        const pos = this.getCursorPosition(e);
        path.push(pos); // Append point to current path.
        this.drawActivePath();
    }

    updateSize() {
        this.setCursor();
    }

    // --- Utility Functions ---
    async print() {
        const dataUrl = await this.getImageData();
        const windowContent =
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Print Your Creation</title></head><body style="margin:0">' +
            '<img src="' +
            dataUrl +
            '" alt="" style="width:100%;height:auto" />' +
            '</body></html>';
        const printWin = window.open('', '_blank');
        if (!printWin) return;
        const blob = new Blob([windowContent], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        printWin.location.href = blobUrl;
        printWin.addEventListener(
            'load',
            function () {
                try {
                    printWin.focus();
                    printWin.print();
                } finally {
                    setTimeout(function () {
                        URL.revokeObjectURL(blobUrl);
                    }, 60000);
                }
            },
            { once: true }
        );
    }

    loadImage(url) {
        return new Promise(resolve => {
            const image = new Image();
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.src = url;
        });
    }

    async getImageData() {
        const height = this.img.naturalHeight;
        const width = this.img.naturalWidth;
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.height = height;
        combinedCanvas.width = width;
        const c = combinedCanvas.getContext('2d');

        // White base
        c.fillStyle = '#ffffff';
        c.fillRect(0, 0, width, height);

        // Draw color strokes first (underneath line art)
        const coloringData = await this.loadImage(this.canvas.toDataURL('image/png'));
        c.drawImage(coloringData, 0, 0, width, height);

        // Draw line art last so outlines sit on top of color.
        // multiply: white JPG paper becomes transparent; black lines stay inked.
        // Works for SVG stroke-only art too (transparent fills leave color alone).
        c.globalCompositeOperation = 'multiply';
        c.drawImage(this.img, 0, 0, width, height);
        c.globalCompositeOperation = 'source-over';

        return combinedCanvas.toDataURL('image/png');
    }

    /** Snapshot for Color & Tell (composite line art + paint) — returns null if not ready. */
    async exportCompositePng() {
        if (!this.img || !this.canvas || !this.img.naturalWidth) return null;
        try {
            return await this.getImageData();
        } catch (e) {
            return null;
        }
    }

    async save() {
        try {
            const dataUrl = await this.getImageData();

            const response = await fetch(dataUrl);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'ColoringBook.png';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Picture did not save. Try again or use Print instead.');
        }
    }

    sizeCanvas() {
        // Recalculate canvas position and size based on the background image's natural dimensions
        this.canvasPos = this.canvas.getBoundingClientRect();
        this.canvas.height = this.img.naturalHeight;
        this.canvas.width = this.img.naturalWidth;
        this.activeCanvas.height = this.img.naturalHeight;
        this.activeCanvas.width = this.img.naturalWidth;
    }

    getCursorPosition(e) {
        // Ensure canvasPos is up-to-date for accurate calculations
        this.canvasPos = this.activeCanvas.getBoundingClientRect();
        const adjX = this.activeCanvas.width / this.canvasPos.width; // Adjustment for width scaling
        const adjY = this.activeCanvas.height / this.canvasPos.height; // Adjustment for height scaling

        return {
            x: (e.clientX - this.canvasPos.left) * adjX,
            y: (e.clientY - this.canvasPos.top) * adjY,
        };
    }

    commitActivePath() {
        this.drawActivePath(true);
    }

    clearActivePath() {
        const height = this.img.naturalHeight;
        const width = this.img.naturalWidth;
        this.activeCtx.clearRect(0, 0, width, height);
    }

    drawActivePath(saveToCanvas = false) {
        this.clearActivePath();
        let ctx;
        const path = this.paths[this.paths.length - 1];

        if (!path || path.length < 1) return; // Guard against empty paths
        if (path[0].fill) return; // fills are applied on the main canvas only

        if (saveToCanvas === true || path[0].c === (this.paletteColors.length - 1)) {
            ctx = this.ctx; // Draw on main canvas for saving or eraser
        } else {
            ctx = this.activeCtx; // Draw on active canvas for temporary preview
        }

        if (path[0].c === null || path[0].c === undefined) {
            path[0].c = 0; // Default to first color if not set
        }

        ctx.strokeStyle = `${this.paletteColors[path[0].c]}`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Adjust line width based on image's natural size vs displayed size
        ctx.lineWidth = path[0].s * (this.img.naturalWidth / this.img.width);

        if (path[0].c === (this.paletteColors.length - 1)) {
            /*eraser*/
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = `white`; // Eraser uses white stroke but composite operation makes it clear
        } else {
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let j = 1; j < path.length; ++j) {
            ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.stroke();
    }

    /**
     * Cache a binary barrier mask for flood-fill walls.
     * Dark ink is a wall. Tiny gaps in outlines are closed so sky/grass
     * do not leak into the next region. Soft gray washes stay open.
     */
    ensureLineArtData(strict) {
        if (!this.img || !this.img.naturalWidth) return null;
        const w = this.img.naturalWidth;
        const h = this.img.naturalHeight;
        const mode = strict ? 's' : 'n';
        const key = this.src + '|' + w + 'x' + h + '|mask-v4|' + mode;
        if (this._lineArtCache && this._lineArtCache[key]) return this._lineArtCache[key];
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        try {
            ctx.drawImage(this.img, 0, 0, w, h);
        } catch (e) {
            return null;
        }
        const src = ctx.getImageData(0, 0, w, h);
        const sd = src.data;
        const n = w * h;
        const ink = new Uint8Array(n);
        const INK_LUMA = strict ? 158 : 122;
        for (let p = 0, i = 0; p < n; p++, i += 4) {
            const a = sd[i + 3];
            if (a < 28) {
                ink[p] = 0;
                continue;
            }
            const lum = sd[i] * 0.299 + sd[i + 1] * 0.587 + sd[i + 2] * 0.114;
            ink[p] = lum < INK_LUMA ? 1 : 0;
        }
        const cleaned = new Uint8Array(n);
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const p = y * w + x;
                if (!ink[p]) {
                    cleaned[p] = 0;
                    continue;
                }
                let neighbors = 0;
                neighbors += ink[p - 1];
                neighbors += ink[p + 1];
                neighbors += ink[p - w];
                neighbors += ink[p + w];
                neighbors += ink[p - w - 1];
                neighbors += ink[p - w + 1];
                neighbors += ink[p + w - 1];
                neighbors += ink[p + w + 1];
                cleaned[p] = neighbors >= 1 ? 1 : 0;
            }
        }
        for (let x = 0; x < w; x++) {
            cleaned[x] = ink[x];
            cleaned[(h - 1) * w + x] = ink[(h - 1) * w + x];
        }
        for (let y = 0; y < h; y++) {
            cleaned[y * w] = ink[y * w];
            cleaned[y * w + w - 1] = ink[y * w + w - 1];
        }
        // Close 1px holes in outlines so a sky tap cannot walk through a broken horizon.
        const closed = new Uint8Array(cleaned);
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const p = y * w + x;
                if (cleaned[p]) continue;
                let neighbors = 0;
                neighbors += cleaned[p - 1];
                neighbors += cleaned[p + 1];
                neighbors += cleaned[p - w];
                neighbors += cleaned[p + w];
                neighbors += cleaned[p - w - 1];
                neighbors += cleaned[p - w + 1];
                neighbors += cleaned[p + w - 1];
                neighbors += cleaned[p + w + 1];
                if (neighbors >= 5) closed[p] = 1;
            }
        }
        // Bridge 1–2px tunnels (hair, grass, JPEG gaps) without filling open shapes.
        let walls = closed;
        for (let pass = 0; pass < 2; pass++) {
            const bridged = new Uint8Array(walls);
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const p = y * w + x;
                    if (walls[p]) continue;
                    const lr = walls[p - 1] && walls[p + 1];
                    const ud = walls[p - w] && walls[p + w];
                    if (lr || ud) {
                        bridged[p] = 1;
                        continue;
                    }
                    if (x > 1 && walls[p - 2] && walls[p + 1]) bridged[p] = 1;
                    else if (x + 2 < w && walls[p - 1] && walls[p + 2]) bridged[p] = 1;
                    else if (y > 1 && walls[p - 2 * w] && walls[p + w]) bridged[p] = 1;
                    else if (y + 2 < h && walls[p - w] && walls[p + 2 * w]) bridged[p] = 1;
                }
            }
            walls = bridged;
        }
        // Keep paint from walking around a drawing via the empty margin.
        for (let x = 0; x < w; x++) {
            walls[x] = 1;
            walls[(h - 1) * w + x] = 1;
        }
        for (let y = 0; y < h; y++) {
            walls[y * w] = 1;
            walls[y * w + w - 1] = 1;
        }
        const dilatePasses = strict ? 2 : 1;
        for (let pass = 0; pass < dilatePasses; pass++) {
            const dilated = new Uint8Array(n);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const p = y * w + x;
                    if (walls[p]) {
                        dilated[p] = 1;
                        continue;
                    }
                    let wall = 0;
                    if (x > 0) wall |= walls[p - 1];
                    if (x + 1 < w) wall |= walls[p + 1];
                    if (y > 0) wall |= walls[p - w];
                    if (y + 1 < h) wall |= walls[p + w];
                    if (x > 0 && y > 0) wall |= walls[p - w - 1];
                    if (x + 1 < w && y > 0) wall |= walls[p - w + 1];
                    if (x > 0 && y + 1 < h) wall |= walls[p + w - 1];
                    if (x + 1 < w && y + 1 < h) wall |= walls[p + w + 1];
                    dilated[p] = wall ? 1 : 0;
                }
            }
            walls = dilated;
        }
        const out = ctx.createImageData(w, h);
        const od = out.data;
        let open = 0;
        for (let p = 0, i = 0; p < n; p++, i += 4) {
            const v = walls[p] ? 0 : 255;
            if (!walls[p]) open++;
            od[i] = v;
            od[i + 1] = v;
            od[i + 2] = v;
            od[i + 3] = 255;
        }
        out._tdbOpen = open;
        if (!this._lineArtCache) this._lineArtCache = {};
        this._lineArtCache[key] = out;
        this._lineArtData = out;
        this._lineArtKey = key;
        return out;
    }

    isLineBarrier(data, idx) {
        // Mask is pure black/white after ensureLineArtData
        const lum = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
        return lum < 128;
    }

    parseCssColor(css) {
        if (!css) return [0, 0, 0, 255];
        const s = String(css).trim().toLowerCase();
        if (s === 'white') return [255, 255, 255, 255];
        if (s === 'black') return [0, 0, 0, 255];
        let m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/);
        if (m) {
            const a = m[4] === undefined ? 1 : parseFloat(m[4]);
            return [
                Math.round(parseFloat(m[1])),
                Math.round(parseFloat(m[2])),
                Math.round(parseFloat(m[3])),
                Math.round(Math.max(0, Math.min(1, a)) * 255)
            ];
        }
        m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (m) {
            let h = m[1];
            if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255];
        }
        return [0, 0, 0, 255];
    }

    applyTapFill(x, y) {
        if (this.color === null || this.color === undefined) {
            const firstColor = this.shadowRoot.querySelector('.paletteColor');
            if (firstColor) firstColor.click();
        }
        if (!this.canvas || !this.ctx) return;
        const ix = Math.max(0, Math.min(this.canvas.width - 1, Math.round(x)));
        const iy = Math.max(0, Math.min(this.canvas.height - 1, Math.round(y)));
        // Apply fill first; only store if pixels changed (so Undo stays clean)
        const painted = this.floodFillAt(ix, iy, this.color);
        if (!painted) return;
        this.paths.push([{ fill: 1, x: ix, y: iy, c: this.color }]);
        this.persistPaths();
    }

    /**
     * Flood-fill paint canvas inside closed line-art regions.
     * Only paints pixels that match the tapped color, so grass stays grass
     * when you fill the sky. If a tap would flood most of the page, retry
     * with tighter line walls (broken outlines).
     * Returns true if any pixels changed.
     */
    floodFillAt(x, y, colorIndex) {
        if (!this.ctx) return false;
        const loose = this.ensureLineArtData(false);
        if (!loose) return false;
        const w = loose.width;
        const h = loose.height;
        const ix = Math.max(0, Math.min(w - 1, x | 0));
        const iy = Math.max(0, Math.min(h - 1, y | 0));
        const isEraser = colorIndex === (this.paletteColors.length - 1);
        const rgba = isEraser ? [0, 0, 0, 0] : this.parseCssColor(this.paletteColors[colorIndex]);
        const snapshot = this.ctx.getImageData(0, 0, w, h);

        const run = (line) => {
            const start = (iy * w + ix) * 4;
            if (this.isLineBarrier(line.data, start)) return 0;
            const pd = new Uint8ClampedArray(snapshot.data);
            const ld = line.data;
            const sr = snapshot.data[start];
            const sg = snapshot.data[start + 1];
            const sb = snapshot.data[start + 2];
            const sa = snapshot.data[start + 3];
            const seedEmpty = sa < 18;
            const samePaint = (i) => {
                if (seedEmpty) return pd[i + 3] < 18;
                return (
                    Math.abs(pd[i] - sr) <= 28 &&
                    Math.abs(pd[i + 1] - sg) <= 28 &&
                    Math.abs(pd[i + 2] - sb) <= 28 &&
                    Math.abs(pd[i + 3] - sa) <= 28
                );
            };
            if (!seedEmpty &&
                Math.abs(sr - rgba[0]) <= 4 &&
                Math.abs(sg - rgba[1]) <= 4 &&
                Math.abs(sb - rgba[2]) <= 4 &&
                Math.abs(sa - rgba[3]) <= 4) {
                return 0;
            }
            const visited = new Uint8Array(w * h);
            const stack = [ix, iy];
            visited[iy * w + ix] = 1;
            let count = 0;
            const maxPx = w * h;
            while (stack.length) {
                const cy = stack.pop();
                const cx = stack.pop();
                const p = cy * w + cx;
                const i = p * 4;
                if (this.isLineBarrier(ld, i)) continue;
                if (!samePaint(i)) continue;
                if (isEraser) {
                    pd[i] = 0; pd[i + 1] = 0; pd[i + 2] = 0; pd[i + 3] = 0;
                } else {
                    pd[i] = rgba[0];
                    pd[i + 1] = rgba[1];
                    pd[i + 2] = rgba[2];
                    pd[i + 3] = rgba[3];
                }
                count++;
                if (count > maxPx) break;
                if (cx > 0) {
                    const np = p - 1;
                    if (!visited[np]) { visited[np] = 1; stack.push(cx - 1, cy); }
                }
                if (cx + 1 < w) {
                    const np = p + 1;
                    if (!visited[np]) { visited[np] = 1; stack.push(cx + 1, cy); }
                }
                if (cy > 0) {
                    const np = p - w;
                    if (!visited[np]) { visited[np] = 1; stack.push(cx, cy - 1); }
                }
                if (cy + 1 < h) {
                    const np = p + w;
                    if (!visited[np]) { visited[np] = 1; stack.push(cx, cy + 1); }
                }
            }
            if (count >= 8) {
                snapshot.data.set(pd);
            }
            return count;
        };

        let count = run(loose);
        const open = loose._tdbOpen || (w * h);
        if (count > open * 0.42) {
            const tight = this.ensureLineArtData(true);
            if (tight) {
                snapshot.data.set(this.ctx.getImageData(0, 0, w, h).data);
                const retry = run(tight);
                if (retry >= 8) count = retry;
            }
        }
        // A true whole-page leak — do not dump one tap across the picture.
        if (count > open * 0.72) return false;
        if (count < 8) return false;
        this.ctx.putImageData(snapshot, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';
        return true;
    }

    strokePath(ctx, path) {
        if (!path || path.length < 1 || path[0].fill) return;
        if (path[0].c === null || path[0].c === undefined) {
            path[0].c = 0;
        }
        const size = path[0].s || 8;
        ctx.strokeStyle = `${this.paletteColors[path[0].c]}`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const naturalW = this.img.naturalWidth || this.canvas.width;
        const displayW = this.img.width || naturalW;
        ctx.lineWidth = size * (naturalW / displayW);

        if (path[0].c === (this.paletteColors.length - 1)) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = `white`;
        } else {
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let j = 1; j < path.length; ++j) {
            ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
    }

    refresh() {
        this.clearActivePath();
        if (!this.img || !this.ctx) return;
        const height = this.img.naturalHeight;
        const width = this.img.naturalWidth;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, width, height); // Clear the entire main canvas
        ctx.globalCompositeOperation = "source-over";

        for (let i = 0; i < this.paths.length; ++i) {
            const path = this.paths[i];
            if (!path || path.length < 1) continue;
            if (path[0].fill) {
                this.floodFillAt(path[0].x, path[0].y, path[0].c);
            } else {
                this.strokePath(ctx, path);
            }
        }
        ctx.globalCompositeOperation = "source-over";
    }

    setCursor() {
        if (!this.wrapper) return;
        const color = this.paletteColors[this.color] || '#333';
        const canvas = document.createElement('canvas');
        canvas.height = 32;
        canvas.width = 32;
        const context = canvas.getContext('2d');

        if (this.drawMode === 'fill') {
            // Paint-bucket style cursor
            context.fillStyle = color;
            context.strokeStyle = '#0f172a';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(8, 20);
            context.lineTo(14, 12);
            context.lineTo(22, 14);
            context.lineTo(20, 22);
            context.closePath();
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc(14, 10, 3, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            context.stroke();
            context.beginPath();
            context.moveTo(20, 22);
            context.lineTo(24, 28);
            context.strokeStyle = '#0f172a';
            context.stroke();
        } else {
            const size = parseInt(this.sizer.value, 10);
            const maxBrush = parseInt(this.getAttribute('maxbrushsize') || '32', 10) || 32;
            const effectiveSize = Math.max(2, Math.min(size, maxBrush));
            context.beginPath();
            context.arc(16, 16, effectiveSize / 2, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.stroke();
            context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(0, 16);
            context.lineTo(32, 16);
            context.moveTo(16, 0);
            context.lineTo(16, 32);
            context.stroke();
        }

        const url = canvas.toDataURL();
        this.wrapper.style.cursor = `url(${url}) 16 16, pointer`;
    }
});