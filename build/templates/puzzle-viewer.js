import NxNDrawer from "../graphics/webgpu/nxn-drawer.js";
import { Cube } from "../cube/cube.js";
import { Alg } from "../alg/alg.js";
export class PuzzleViewer extends HTMLElement {
    cube;
    alg;
    ease;
    #sliderNode;
    #playButton;
    #canvas;
    #drawer;
    #width;
    #height;
    #rotationX = 0;
    #rotationY = 0;
    #mouseIsDown = false;
    #isPlaying = false;
    #playSpeed = 0.001;
    #shouldUpdateCube = false;
    constructor() {
        super();
        this.#sliderNode = document.createElement("input");
        this.#sliderNode.type = "range";
        this.#sliderNode.min = "0";
        this.#sliderNode.max = "1";
        this.#sliderNode.step = "0.0001";
        this.#sliderNode.value = "1";
        this.#canvas = document.createElement("canvas");
        this.#playButton = document.createElement("button");
        this.#playButton.textContent = "Play";
        this.#width = this.#canvas.width;
        this.#height = this.#canvas.height;
        this.cube = new Cube(3);
        this.alg = new Alg([]);
        this.ease = (t) => t * t * (3 - 2 * t);
        this.#drawer = new NxNDrawer(this.#canvas, 3);
        this.#drawer.reset();
        const resizeObserver = new ResizeObserver(() => {
            this.#requestUpdate();
        });
        resizeObserver.observe(this);
        this.#canvas.addEventListener("mousemove", event => {
            if (this.#mouseIsDown) {
                this.#rotationX -= event.movementY * 0.005;
                this.#rotationY -= event.movementX * 0.005;
                this.#requestUpdate();
            }
        });
        this.#canvas.addEventListener("mousedown", () => { this.#mouseIsDown = true; });
        this.#canvas.addEventListener("mouseup", () => { this.#mouseIsDown = false; });
        this.#sliderNode.addEventListener("input", () => {
            this.#shouldUpdateCube = true;
            this.#requestUpdate();
        });
        this.#playButton.addEventListener("click", () => {
            this.#isPlaying = !this.#isPlaying;
            if (this.#sliderNode.value === "1") {
                this.#sliderNode.value = "0";
            }
            this.#requestUpdate();
        });
        this.#requestUpdate();
    }
    connectedCallback() {
        const bottomWrapper = document.createElement("div");
        bottomWrapper.className = "bottom-wrapper";
        bottomWrapper.append(this.#sliderNode, this.#playButton);
        this.append(this.#canvas, bottomWrapper);
        const STYLE_ID = "alg-textarea-style";
        if (!document.querySelector(`style#${STYLE_ID}`)) {
            const style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = `
                puzzle-viewer {
                    display: flex;
                    flex-direction: column;
                }

                puzzle-viewer .bottom-wrapper {
                    flex-basis: 50px;
                    background-color: black;
                    padding: 10px;
                    box-sizing: border-box;

                    & input[type="range"] {
                        width: 100%;
                    }
                }
                
                puzzle-viewer canvas {
                    flex: 1;
                }
            `;
            this.appendChild(style);
        }
    }
    static get observedAttributes() {
        return ["size", "alg"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "size": {
                const size = Number(newValue);
                if (size > 0 && Number.isInteger(size) && size != this.cube.getLayerCount()) {
                    this.cube = new Cube(size);
                    this.#shouldUpdateCube = true;
                }
                break;
            }
            case "alg":
                this.alg = Alg.fromString(newValue);
                this.#shouldUpdateCube = true;
                break;
        }
        this.#requestUpdate();
    }
    update() {
        this.#resize(this.#canvas.clientWidth, this.#canvas.clientHeight);
        if (this.cube.getLayerCount() != this.#drawer.layerCount) {
            this.#drawer.destroy();
            this.#drawer = new NxNDrawer(this.#canvas, this.cube.getLayerCount());
        }
        if (this.#shouldUpdateCube) {
            this.cube.reset();
            if (this.#isPlaying) {
                const newValue = Math.min(Number(this.#sliderNode.value) + this.#playSpeed, 1);
                if (newValue === 1) {
                    this.#isPlaying = false;
                }
                this.#sliderNode.value = newValue.toString();
            }
            const sliderValue = Math.max(0, Math.min(Number(this.#sliderNode.value), 1));
            const movesToExecute = Math.floor(sliderValue * this.alg.length);
            const move = this.cube.executeUntil(this.alg, movesToExecute);
            this.#drawer.set(this.cube);
            if (move !== null) {
                const t = sliderValue * this.alg.length - movesToExecute;
                this.#drawer.animateMove(move, this.ease(t));
            }
            else {
                this.#drawer.clearAnimation();
            }
        }
        this.render();
        if (this.#isPlaying) {
            this.#requestUpdate();
        }
    }
    #updateAnimationFrameHandle = 0;
    #requestUpdate() {
        window.cancelAnimationFrame(this.#updateAnimationFrameHandle);
        this.#updateAnimationFrameHandle = window.requestAnimationFrame(this.update.bind(this));
    }
    render() {
        this.#drawer.setCameraTransform([0, 0, -0.4], this.#rotationX, this.#rotationY);
        this.#drawer.render();
    }
    #resize(width, height) {
        if (this.#width === width && this.#height === height) {
            return;
        }
        this.#width = width;
        this.#height = height;
        this.#drawer.resize(width, height);
    }
}
customElements.define("puzzle-viewer", PuzzleViewer);
