(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function toArray(list) {
    for (var a=[], l=list.length; l--; a[l]=list[l]); return a;
}

let domReady = new Promise(resolve => {
    
    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        requestAnimationFrame(() => resolve() );
    } else {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => resolve() ));
    }
});

function observe(element, fn, config) {

    config = Object.assign({
        attributes: true,
        childList: true,
    }, config || {});

    return (new MutationObserver(mutations => fn(mutations))).observe(element, config);
}

function attr(element, name, value) {
    if (value !== undefined) {
        element[value==='' ? 'removeAttribute':'setAttribute'](name, value);
        return element;
    }
    return element.getAttribute(name);
}

function find(element, selector) {
    return toArray(element.querySelectorAll(selector)).map(ele => $dom(ele));
}

function on(element, name, delegate, fn) {

    if (!fn) {
       element.addEventListener(name, arguments[2]);
    } else {
        element.addEventListener(name, function (e) {
            
            let target = e.target;
            
            while (target !== element) {

                if (target.matches(delegate)){
                    return fn.apply($dom(target), arguments);
                }
                target = target.parentNode;
            }
        });
    }

    return element;
}

function hasClass(element, name) {
    return element.classList.contains(name);
}

function addClass(element, name) {
    name.split(' ').forEach(cls => element.classList.add(cls)); 
    return element;
}

function removeClass(element, name) {
    name.split(' ').forEach(cls => element.classList.remove(cls));
    return element;
}



function trigger(element, name, data) {
    let evt = document.createEvent('HTMLEvents');
    evt.data = data;
    evt.initEvent(name, true, false);
    element.dispatchEvent(evt);
    return element;
}

function position(element) {
    return { left: element.offsetLeft, top: element.offsetTop };
}

function offset(element) {
    let rect = element.getBoundingClientRect(),
        top  = rect.top + window.pageYOffset - document.documentElement.clientTop,
        left = rect.left + window.pageXOffset - document.documentElement.clientLeft;

    return { rect, top, left };
}

function offsetParent(element) {
    return $dom(element.offsetParent);
}

function remove(element) {
    element.parentNode.removeChild(element);
}

function html(element, content) {
    if (content === undefined ) { 
        return element.innerHTML; 
    }
    element.innerHTML = String(content.nodeType ? content.outerHTML : content);
    return element;
}

function text(element, content) {
    if (content === undefined) { 
        return element.textContent; 
    }
    element.textContent = content;
    return element;
}

function replaceWith(element, content) {

    let ele;

    if (typeof(content) === 'string') {
        let tmp = document.createElement('div');
        tmp.innerHTML = content;
        ele = tmp.children[0];
    } else {
        ele = content;
    }

    element.parentNode.replaceChild(ele, element);
    
    return $dom(ele);
}

function children(element, selector) {
    return toArray(element.children).filter(ele => ele.matches(selector)).map(ele => $dom(ele)); 
}

function parent(element) {
    return element.parentNode && $dom(element.parentNode); 
}



function prev(element) {
    return element.previousElementSibling && $dom(element.previousElementSibling);
}

function next(element) {
    return element.nextElementSibling && $dom(element.nextElementSibling);
}


function $dom(element) {
    
    let fns = {
        attr, find, parent, children, prev, next,
        on, trigger, 
        hasClass, addClass, removeClass, 
        position, offset, offsetParent,
        html, text, replaceWith, remove
    };

    Object.keys(fns).forEach(fn => {
        element[`\$${fn}`] = function() { return fns[fn].apply(element, [element, ...arguments]); };
    });

    return element;
}

class StiloElement extends HTMLElement {

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

class StiloDrop extends StiloElement {
  
    connect() {

        console.log(this);
    }
}

customElements.define('s-drop', StiloDrop);

class StiloModal extends StiloElement {
  
    connect() {

        console.log(this);
    }
}

customElements.define('s-modal', StiloModal);

class StiloTab extends StiloElement {


    ready() {

        var tab = this;

        this.$on('click', 's-tabs a', function(e) {
            
            e.preventDefault();
            
            if (this.classList.contains('s-active')) {
                return;
            }

            let index = Array.prototype.indexOf.call(this.parentNode.children, this);

            tab.select(index);
        });

        this.select(0);
    }

    select(index) {

        let activeClass = this.$attr('activeClass') || 's-active';
        let tabs = this.$find('s-tabs > a');
        let contents = this.$find('s-content > div');

        tabs.forEach((tab, i) => tab.classList[ i === index ? 'add':'remove'](activeClass));
        contents.forEach((content, i) => content.classList[ i === index ? 'add':'remove'](activeClass));

        this.$trigger('s-tab-select', {index});
    }
}

customElements.define('s-tab', StiloTab);

on(document.documentElement, 'click', '[data-offcanvas-open]', function(e) {

    e.preventDefault();

    let offcanvas = document.querySelector(this.getAttribute('data-offcanvas-open') || this.href);

    if (offcanvas && offcanvas.open) {
        offcanvas.open();
    }
});


class StiloOffcanvas extends StiloElement {

    ready() {

        this.contentElement = this.children[0];

        this.$on('click', e => {

            if (e.target == this) {
                this.close();
            }
        })
        .$on('click', '[data-offcanvas-close]', e => this.close() )
        .$on('transitionend', e => {

            if (this.contentElement && e.target === this.contentElement && !this.isOpen) {
                this.style.display = '';
            }
        });
    }

    open() {

        this.isOpen = true;

        if (!this.$hasClass('open')) {
            this.$trigger('s-offcanvas-open');
            this.style.display = 'block';
            this.offsetWidth && this.$addClass('open');
        }
    }

    close() {
        this.isOpen = false;
        this.$trigger('s-offcanvas-close');
        this.$removeClass('open');
    }
}

customElements.define('s-offcanvas', StiloOffcanvas);

class StiloDirective {

    constructor(element, option) {
        this.element = $dom(element);
        this.option = option;
        domReady.then(() => requestAnimationFrame(() => this.ready()));
    }

    ready() {}
}

let directives = {};

function register(name, def) {
    directives[name] = def;
}

function init(root) {
    
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

    init();
});

let Directive = StiloDirective;

let cache = {};

register('svg', class Test extends Directive {
    
    ready() {

        let url = this.element.$attr('src') || this.option;

        if (!url.trim()) {
            return;
        }

        if (!cache[url]) {
            cache[url] = fetch(url).then(response => response.text());
        }

        cache[url].then(content => {

            let attrs = {
                id:this.element.$attr('id'),
                style:this.element.$attr('style'),
                'class':this.element.$attr('class'),
                width:this.element.$attr('width') || '',
                height:this.element.$attr('height') || ''
            };

            this.element = this.element.$replaceWith(content);

            Object.keys(attrs).forEach(attr => attrs[attr] && this.element.$attr(attr, attrs[attr]));
        });
    }
});

})));
//# sourceMappingURL=stilo.js.map
