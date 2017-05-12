import { toArray } from './utils';

export let domReady = new Promise(resolve => {
    
    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        requestAnimationFrame(() => resolve() );
    } else {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => resolve() ));
    }
});

export function observe(element, fn, config) {

    config = Object.assign({
        attributes: true,
        childList: true,
    }, config || {});

    return (new MutationObserver(mutations => fn(mutations))).observe(element, config);
}

export function attr(element, name, value) {
    if (value !== undefined) {
        element[value==='' ? 'removeAttribute':'setAttribute'](name, value);
        return element;
    }
    return element.getAttribute(name);
};

export function find(element, selector) {
    return toArray(element.querySelectorAll(selector)).map(ele => $dom(ele));
};

export function on(element, name, delegate, fn) {

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
};

export function hasClass(element, name) {
    return element.classList.contains(name);
}

export function addClass(element, name) {
    name.split(' ').forEach(cls => element.classList.add(cls)); 
    return element;
}

export function removeClass(element, name) {
    name.split(' ').forEach(cls => element.classList.remove(cls));
    return element;
}

export function css(element, prop, value){
    
    var args = arguments, props = {};

    if (!args[1] && typeof(args[0]) == 'string') {
        return window.getComputedStyle(element)[args[1]];
    }

    if (args[1]) {
        props[args[0]] = args[1];
    } else if (args.length == 2) {
        props = args[0] || {};
    }

    for (let prop in props) {
        element[prop] = props[prop];
    }

    return element;
}

export function trigger(element, name, data) {
    let evt = document.createEvent('HTMLEvents');
    evt.data = data;
    evt.initEvent(name, true, false);
    element.dispatchEvent(evt);
    return element;
}

export function position(element) {
    return { left: element.offsetLeft, top: element.offsetTop };
}

export function offset(element) {
    let rect = element.getBoundingClientRect(),
        top  = rect.top + window.pageYOffset - document.documentElement.clientTop,
        left = rect.left + window.pageXOffset - document.documentElement.clientLeft;

    return { rect, top, left };
}

export function offsetParent(element) {
    return $dom(element.offsetParent);
}

export function remove(element) {
    element.parentNode.removeChild(element);
}

export function html(element, content) {
    if (content === undefined ) { 
        return element.innerHTML; 
    }
    element.innerHTML = String(content.nodeType ? content.outerHTML : content);
    return element;
}

export function text(element, content) {
    if (content === undefined) { 
        return element.textContent; 
    }
    element.textContent = content;
    return element;
}

export function replaceWith(element, content) {

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

export function children(element, selector) {
    return toArray(element.children).filter(ele => ele.matches(selector)).map(ele => $dom(ele)); 
}

export function parent(element) {
    return element.parentNode && $dom(element.parentNode); 
}

export function parents(element, selector) {
    let list = [], _el = element;

    while(_ele.parentNode) {

        if (!selector || _ele.parentNode.matches(selector)) {
            list.push($dom(_ele.parentNode));
        }
        _ele = _ele.parentNode;
    }

    return list;
}

export function prev(element) {
    return element.previousElementSibling && $dom(element.previousElementSibling);
}

export function next(element) {
    return element.nextElementSibling && $dom(element.nextElementSibling);
}


export function $dom(element) {
    
    let fns = {
        attr, find, parent, children, prev, next,
        on, trigger, 
        hasClass, addClass, removeClass, 
        position, offset, offsetParent,
        html, text, replaceWith, remove
    };

    Object.keys(fns).forEach(fn => {
        element[`\$${fn}`] = function() { return fns[fn].apply(element, [element, ...arguments]); }
    });

    return element;
}