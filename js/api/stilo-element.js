import { $dom, domReady } from './dom';

export class StiloElement extends HTMLElement {

    constructor() {
        super();
        $dom(this);
    }

    connectedCallback() {
        this.connect();
        domReady.then(() => requestAnimationFrame(() => this.ready()));
    }
    disconnectedCallback() { this.disconnect(); }
    attributeChangedCallback() { this.disconnect(); }

    ready() {}
    connect() {}
    disconnect() {}
}