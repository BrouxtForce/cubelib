import { Alg } from "../cube/alg.js";

export class AlgTextarea extends HTMLElement {
    private textarea: HTMLTextAreaElement;
    private errorDiv: HTMLDivElement;
    private rowsRulerDiv: HTMLDivElement;

    private animationFrame: number = 0;

    constructor() {
        super();

        this.textarea = document.createElement("textarea");
        this.textarea.placeholder = "Click here to add moves";
        this.textarea.rows = 1;
        this.textarea.spellcheck = false;

        this.textarea.addEventListener("input", () => {
            // Resizing
            this.textarea.style.height = "0px";
            this.textarea.style.height = this.textarea.scrollHeight + "px";

            // Alg parsing
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = window.requestAnimationFrame(() => {
                try {
                    const parsedAlg = Alg.fromString(this.textarea.value);
                    this.dispatchEvent(
                        new CustomEvent<Alg>("alg-parse", { detail: parsedAlg })
                    );
                    this.textarea.classList.remove("invalid");
                    this.errorDiv.style.display = "";
                } catch (error: any) {
                    this.textarea.classList.add("invalid");
                    this.errorDiv.textContent = error;
                    this.errorDiv.style.display = "block";
                }
            });
        });

        this.errorDiv = document.createElement("div");
        this.errorDiv.classList.add("error-message");

        this.rowsRulerDiv = document.createElement("div");
        this.rowsRulerDiv.classList.add("rows-ruler");
    }
    get value() { return this.textarea.value; }
    set value(value: string) {
        this.textarea.value = value;
        this.textarea.dispatchEvent(new InputEvent("input"));
    }

    connectedCallback() {
        this.appendChild(this.rowsRulerDiv);
        this.appendChild(this.textarea);
        this.appendChild(this.errorDiv);

        // Load the CSS if it hasn't been loaded yet
        if (!document.querySelector("link#alg-textarea")) {
            const link = document.createElement("link");
            link.id = "alg-textarea";
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "/src/cubing/templates/alg-textarea.css";
            document.head.appendChild(link);
        }
    }
    static get observedAttributes() {
        return ["min-rows", "value"];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "min-rows":
                const calcMinRows = () => {
                    let minRows = Number.parseInt(newValue);
                    this.rowsRulerDiv.textContent = Array(minRows).fill("\n").join("");
                    this.textarea.style.minHeight = this.rowsRulerDiv.clientHeight + "px";
                }

                if (document.readyState !== "complete") {
                    window.addEventListener("load", calcMinRows);
                    break;
                }
                calcMinRows();
                break;
            case "value":
                this.textarea.value = newValue;
                break;
        }
    }
}

customElements.define("alg-textarea", AlgTextarea);