import { $dom, domReady, observe } from './dom';
import { StiloDirective as Directive } from './stilo-directive';

let directives = {}

export function register(name, def) {
    directives[name] = def;
}

export function init(root) {
    
    domReady.then(() => {
        
        root = $dom(root || document.body);

        let names = Object.keys(directives);
        let selector = names.map(name => `[s-${name}]`).join(',');

        if (!selector) {
            return;
        }

        root.$find(selector).forEach(element => {
            names.forEach(name => {
                if (!element.hasAttribute(`s-${name}`)) {
                    return
                }
                new directives[name](element, element.getAttribute(`s-${name}`));
                element.removeAttribute(`s-${name}`);
            });
        });
    });
}

domReady.then(() => {

    observe(document.body, mutations => {

        mutations.forEach(({addedNodes, removedNodes, target}) => {

            for (let i=0;i < addedNodes.length;i++) {

                if (addedNodes[i].nodeType == Node.ELEMENT_NODE) {
                    init(addedNodes[i]);
                }
            }
        });
    });

    init()
});

export let StiloDirective = Directive;