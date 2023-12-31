function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}
function getTextNodesIn(node) {
    var textNodes = [];
    if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
    }
    else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}
function setSelectionRange(node, start, end) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const textNodes = getTextNodesIn(node);
    let foundStart = false;
    let charCount = 0;
    let endCharCount;
    for (var i = 0, textNode; textNode = textNodes[i++];) {
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
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
export class AlgInput extends HTMLElement {
    constructor() {
        super();
        this.animationFrame = 0;
        this.inputCallback = async (event) => {
            console.time("alg-input.oninput");
            event.preventDefault();
            const staticEditedRange = event.getTargetRanges()[0];
            let input = this.textInput.textContent ?? "";
            if (input === "" || (this.textInput.childNodes.length === 1 && this.textInput.firstChild?.textContent === "\n")) {
                this.placeholderDiv.style.display = "";
            }
            else {
                this.placeholderDiv.style.display = "none";
            }
            try {
                let startContainer = staticEditedRange.startContainer;
                let endContainer = staticEditedRange.endContainer;
                let editedNodes = document.createRange();
                editedNodes.setStart(startContainer, staticEditedRange.startOffset);
                editedNodes.setEnd(endContainer, staticEditedRange.endOffset);
                let selection = window.getSelection();
                let selectionNode = endContainer;
                let selectionOffset = 0;
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
                        }
                        else {
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
                        }
                        else {
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
                        }
                        else if (startContainer === endContainer) {
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
                        }
                        else {
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
                this.errorDiv.style.display = "";
            }
            catch (error) {
                this.errorDiv.textContent = error;
                this.errorDiv.style.display = "block";
            }
            console.timeEnd("alg-input.oninput");
        };
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
    get value() { return this.textInput.textContent ?? ""; }
    set value(value) {
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
    static get observedAttributes() {
        return ["min-rows"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "min-rows":
                const calcMinHeight = () => {
                    let count = Number.parseInt(newValue);
                    this.rowsRulerDiv.textContent = Array(count).fill("\n").join("");
                    this.textInput.style.minHeight = this.rowsRulerDiv.clientHeight + "px";
                };
                if (document.readyState !== "complete") {
                    window.addEventListener("load", calcMinHeight);
                }
                else {
                    calcMinHeight();
                }
                break;
        }
    }
    styleSiGNTokens(tokens) {
        let out = [];
        let prevContent = "";
        let prevClassName = "";
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let content;
            let className;
            switch (token.type) {
                case "blockComment":
                case "lineComment":
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
            if (className === prevClassName || className === "whitespace") {
                prevContent += content;
            }
            else {
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
