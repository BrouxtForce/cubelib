import { Alg } from "../cube/alg.js";
import { SiGNToken, SiGNTokens } from "../cube/sign-tokens.js";

// https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
function getCaretCharacterOffsetWithin(element: HTMLDivElement): number {
    let caretOffset = 0;
    const selection = window.getSelection() as Selection;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

// https://stackoverflow.com/questions/6240139/highlight-text-range-using-javascript/6242538#6242538
function getTextNodesIn(node: Node): Text[] {
    var textNodes: Text[] = [];
    // nodeType 3 == Text
    if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node as Text);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }

    return textNodes;
}

function setSelectionRange(node: HTMLElement, start: number, end: number) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const textNodes = getTextNodesIn(node);
    let foundStart = false;
    let charCount = 0;
    let endCharCount: number;

    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
        endCharCount = charCount + textNode.length;
        if (!foundStart && start >= charCount
                && (start < endCharCount ||
                (start == endCharCount && i <= textNodes.length))) {
            range.setStart(textNode, start - charCount);
            foundStart = true;
        }
        if (foundStart && end <= endCharCount) {
            range.setEnd(textNode, end - charCount);
            break;
        }
        charCount = endCharCount;
    }

    var selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
}

export class AlgInput extends HTMLElement {
    private textInput: HTMLDivElement;
    private errorDiv: HTMLDivElement;
    private placeholderDiv: HTMLDivElement;
    private rowsRulerDiv: HTMLElement;

    private animationFrame: number = 0;

    constructor() {
        super();

        this.textInput = document.createElement("div");
        this.textInput.className = "text-input";

        this.textInput.contentEditable = "true";

        this.textInput.spellcheck = false;

        this.textInput.addEventListener("beforeinput", this.inputCallback);

        this.errorDiv = document.createElement("div");
        this.errorDiv.className = "error-message";

        this.placeholderDiv = document.createElement("div");
        this.placeholderDiv.className = "placeholder";
        this.placeholderDiv.textContent = "Click here to add moves";

        this.rowsRulerDiv = document.createElement("div");
        this.rowsRulerDiv.classList.add("text-input", "rows-ruler");
    }

    get value(): string { return this.textInput.textContent ?? ""; }
    set value(value: string) {
        this.textInput.textContent = value;
        this.textInput.dispatchEvent(new InputEvent("input"));
    }

    connectedCallback() {
        this.appendChild(this.rowsRulerDiv);
        this.appendChild(this.placeholderDiv);
        this.appendChild(this.textInput);
        this.appendChild(this.errorDiv);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/src/cubing/templates/alg-input.css";
        this.appendChild(link);
    }

    static get observedAttributes(): string[] {
        return ["min-rows"];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "min-rows":
                const calcMinHeight = () => {
                    let count = Number.parseInt(newValue);
                    this.rowsRulerDiv.textContent = Array(count).fill("\n").join("");
                    this.textInput.style.minHeight = this.rowsRulerDiv.clientHeight + "px";
                };
                if (document.readyState !== "complete") {
                    window.addEventListener("load", calcMinHeight);
                } else {
                    calcMinHeight();
                }
                break;
        }
    }

    private inputCallback = async (event: InputEvent) => {
        console.time("alg-input.oninput");
        event.preventDefault();

        const staticEditedRange = (event as InputEvent).getTargetRanges()[0];        

        let input = this.textInput.textContent ?? "";

        if (input === "" || (this.textInput.childNodes.length === 1 && this.textInput.firstChild?.textContent === "\n")) {
            this.placeholderDiv.style.display = "";
        } else {
            this.placeholderDiv.style.display = "none";
        }

        try {
            // const tokens = SiGNTokens(input);
            // const tokenNodes = this.styleSiGNTokens(tokens);

            // console.log(tokenNodes);

            let startContainer = staticEditedRange.startContainer;
            let endContainer = staticEditedRange.endContainer;

            let editedNodes = document.createRange();
            editedNodes.setStart(startContainer, staticEditedRange.startOffset);
            editedNodes.setEnd(endContainer, staticEditedRange.endOffset);

            let selection = window.getSelection() as Selection;
            let selectionNode = endContainer;
            let selectionOffset = 0;

            // Should never happen
            console.assert(selection !== null);

            let text = event.data ?? "";
            switch (event.inputType) {
                case "insertText": {
                    if (startContainer === this.textInput) {
                        let containerContent = startContainer.textContent ?? "";

                        containerContent =
                            containerContent.slice(0, staticEditedRange.startOffset) +
                            text +
                            containerContent.slice(staticEditedRange.startOffset);
                        
                        startContainer.textContent = containerContent;

                        selectionNode = startContainer;
                        selectionOffset = staticEditedRange.startOffset + text.length;
                    } else {
                        
                    }
                    break;
                }
                case "insertFromPaste":
                case "deleteWordBackward":
                case "deleteSoftLineBackward":
                case "deleteContentBackward": {
                    selectionOffset = staticEditedRange.startOffset;

                    if (startContainer !== endContainer) {

                        startContainer.textContent = (startContainer.textContent ?? "").slice(0, staticEditedRange.startOffset);
                        
                        while (true) {
                            const nextSibling = startContainer.nextSibling;
                            if (nextSibling === null || nextSibling === endContainer) {
                                break;
                            }
                            
                            nextSibling.remove();
                        }

                        endContainer.textContent = (endContainer.textContent ?? "").slice(0, staticEditedRange.endOffset);

                        selectionNode = endContainer;
                        selectionOffset = 0;

                    } else {

                        let containerContent = startContainer.textContent ?? "";

                        startContainer.textContent =
                            containerContent.slice(0, staticEditedRange.startOffset) +
                            containerContent.slice(staticEditedRange.endOffset);
                        
                        selectionOffset = staticEditedRange.startOffset;
                    }
                    
                    if (event.inputType !== "insertFromPaste") {
                        break;
                    }

                    const clipboardText = await navigator.clipboard.readText();
    
                    let containerContent = startContainer.textContent ?? "";
                    startContainer.textContent =
                        containerContent.slice(0, staticEditedRange.startOffset) +
                        clipboardText +
                        containerContent.slice(staticEditedRange.startOffset);
                    
                    selectionOffset += clipboardText.length;

                    break;
                }
                case "insertParagraph": {
                    // Two BRs should be inserted if there are no BRs in the textInput
                    let shouldInsertTwo = true;
                    for (const node of this.textInput.children) {
                        if (node.tagName === "BR") {
                            shouldInsertTwo = false;
                            break;
                        }
                    }

                    if (startContainer === this.textInput) {
                        console.log(1);

                        if (shouldInsertTwo) {
                            this.textInput.prepend(document.createElement("br"));
                        }
                        this.textInput.prepend(document.createElement("br"));

                    } else if (startContainer === endContainer) {
                        console.log(2);

                        let containerContent = startContainer.textContent ?? "";
                        let prefix = containerContent.slice(0, staticEditedRange.startOffset);
                        let suffix = containerContent.slice(staticEditedRange.startOffset);

                        const copyContainer = startContainer.cloneNode();

                        startContainer.textContent = prefix;
                        copyContainer.textContent = suffix;

                        this.textInput.insertBefore(copyContainer, startContainer.nextSibling);
                        this.textInput.insertBefore(document.createElement("br"), startContainer.nextSibling);
                        if (shouldInsertTwo) {
                            this.textInput.insertBefore(document.createElement("br"), startContainer.nextSibling);
                        }

                    } else {
                        console.log(3);

                        let containerContent = startContainer.textContent ?? "";
                        let prefix = containerContent.slice(0, staticEditedRange.startOffset);
                        let suffix = containerContent.slice(staticEditedRange.startOffset);

                        const suffixContainer = startContainer.cloneNode();

                        const parent = startContainer.parentElement;

                        if (parent === null) {
                            console.error("Failed to insert paragraph: Node does not have a parent.");
                            break;
                        }

                        startContainer.textContent = prefix;
                        suffixContainer.textContent = suffix;

                        parent.after(suffixContainer);
                        parent.after(document.createElement("br"));
                        if (shouldInsertTwo) {
                            parent.after(document.createElement("br"));
                        }
                    }
                    break;
                }
                default:
                    console.error(`Unknown input type: '${event.inputType}'`);
            }

            selection.collapse(selectionNode, selectionOffset);

            // console.log(event);
            // console.log(staticEditedRange.startContainer, staticEditedRange.startOffset);
            // console.log(staticEditedRange.endContainer, staticEditedRange.endOffset);

            // let caretPosition = getCaretCharacterOffsetWithin(this.textInput);
            // console.log(caretPosition);
            // this.textInput.replaceChildren(...tokenNodes);
            // setSelectionRange(this.textInput, caretPosition, caretPosition);

            // const tokens = SiGNTokens(this.textInput.textContent ?? "");
            // const tokenNodes = this.styleSiGNTokens(tokens);

            // this.textInput.replaceChildren(...tokenNodes);

            this.errorDiv.style.display = "";
        } catch (error) {
            this.errorDiv.textContent = error as string;
            this.errorDiv.style.display = "block";
        }

        console.timeEnd("alg-input.oninput");
    }

    private styleSiGNTokens(tokens: SiGNToken[]): (string | HTMLElement)[] {
        let out: (string | HTMLElement)[] = [];

        let prevContent: string = "";
        let prevClassName: string = "";
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            let content: string;
            let className: string;
            switch (token.type) {
                case "blockComment": case "lineComment":
                    content = (token.type === "blockComment") ? `/*${token.value}*/` : `//${token.value}`;
                    className = "comment";
                    break;
                case "move":
                    if (token.value.match(/x|y|z/) !== null) {
                        content = token.value;
                        className = "rotation";
                        break;
                    }
                default:
                    content = token.value;
                    className = token.type;
                    break;
            }

            if (i === 0) {
                prevContent = content;
                if (className !== "whitespace") {
                    prevClassName = className;
                }
                continue;
            }

            // if (className === "whitespace" && content.indexOf("\n") !== -1) {
            //     const span = document.createElement("span");
            //     span.textContent = prevContent;
            //     span.className = prevClassName;
            //     out.push(span);

            //     let lines = content.split("\n");
            //     for (let i = 0; i < lines.length; i++) {
            //         if (i !== 0) {
            //             out.push(document.createElement("br"));
            //         }
            //         if (lines[i] !== "") {
            //             out.push(lines[i]);
            //         }
            //     }

            //     prevContent = "";
            //     content = "";
            // }

            if (className === prevClassName || className === "whitespace") {
                prevContent += content;
            } else {
                const span = document.createElement("span");
                span.textContent = prevContent;
                span.className = prevClassName;
                out.push(span);

                prevContent = content;
                prevClassName = className;
            }
        }

        if (prevContent !== "") {
            const span = document.createElement("span");
            span.textContent = prevContent;
            span.className = prevClassName;
            out.push(span);
        }

        return out;
    }
}

customElements.define("alg-input", AlgInput);