import NxNDrawer from "../graphics/webgpu/nxn-drawer.js";
import { Cube } from "../cube/cube.js";
import { Alg } from "../alg/alg.js";

// TOOD: Can only have as many of these as canvas contexts
export class PuzzleViewer extends HTMLElement {
    public cube: Cube;
    public alg: Alg;
    
    private readonly canvas: HTMLCanvasElement;
    private drawer: NxNDrawer;

    private width: number;
    private height: number;

    private rotationX: number = 0;
    private rotationY: number = 0;
    private mouseIsDown: boolean = false;

    private shouldUpdateCube: boolean = false;

    constructor() {
        super();

        this.canvas = document.createElement("canvas");

        if (this.clientWidth !== 0 && this.clientHeight !== 0) {
            this.canvas.width = this.clientWidth;
            this.canvas.height = this.clientHeight;
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.cube = new Cube(3);
        this.alg = new Alg([]);

        this.drawer = new NxNDrawer(this.canvas, 3);
        this.drawer.reset();

        const resizeObserver = new ResizeObserver(() => {
            this.requestUpdate();
        });
        resizeObserver.observe(this);

        this.addEventListener("mousemove", event => {
            if (this.mouseIsDown) {
                this.rotationX -= event.movementY * 0.005;
                this.rotationY -= event.movementX * 0.005;
                this.requestUpdate();
            }
        });
        this.addEventListener("mousedown", () => { this.mouseIsDown = true; });
        this.addEventListener("mouseup",   () => { this.mouseIsDown = false; });

        this.requestUpdate();
    }

    connectedCallback(): void {
        this.appendChild(this.canvas);
    }

    static get observedAttributes() {
        return ["size", "alg"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "size": {
                const size = Number(newValue);
                if (size > 0 && Number.isInteger(size) && size != this.cube.getLayerCount()) {
                    this.cube = new Cube(size);
                    this.shouldUpdateCube = true;
                }
                break;
            }
            case "alg":
                this.alg = Alg.fromString(newValue);
                this.shouldUpdateCube = true;
                break;
        }
        this.requestUpdate();
    }

    update(): void {
        this.resize(this.clientWidth, this.clientHeight);
        if (this.cube.getLayerCount() != this.drawer.layerCount) {
            this.drawer.destroy();
            this.drawer = new NxNDrawer(this.canvas, this.cube.getLayerCount());
        }
        if (this.shouldUpdateCube) {
            this.cube.reset();
            this.cube.execute(this.alg);
            this.drawer.set(this.cube);
        }
        this.render();
    }
    
    private updateAnimationFrameHandle: number = 0;
    private requestUpdate(): void {
        window.cancelAnimationFrame(this.updateAnimationFrameHandle);
        this.updateAnimationFrameHandle = window.requestAnimationFrame(this.update.bind(this));
    }

    render(): void {
        this.drawer.setCameraTransform([0, 0, -0.4], this.rotationX, this.rotationY);
        this.drawer.render();
    }

    private resize(width: number, height: number) {
        if (this.width === width && this.height === height) {
            return;
        }

        this.width = width;
        this.height = height;
        // Also resizes canvas
        this.drawer.resize(width, height);
    }
}

customElements.define("puzzle-viewer", PuzzleViewer);