import { $dom, domReady } from './dom';

export class StiloDirective {

    constructor(element, option) {
        this.element = $dom(element);
        this.option = option;
        domReady.then(() => requestAnimationFrame(() => this.ready()));
    }

    ready() {}
}