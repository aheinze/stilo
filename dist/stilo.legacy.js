(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function toArray(list) {
    for (var a = [], l = list.length; l--; a[l] = list[l]) {}return a;
}

var domReady = new Promise(function (resolve) {

    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        requestAnimationFrame(function () {
            return resolve();
        });
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            return requestAnimationFrame(function () {
                return resolve();
            });
        });
    }
});

function observe(element, fn, config) {

    config = Object.assign({
        attributes: true,
        childList: true
    }, config || {});

    return new MutationObserver(function (mutations) {
        return fn(mutations);
    }).observe(element, config);
}

function attr(element, name, value) {
    if (value !== undefined) {
        element[value === '' ? 'removeAttribute' : 'setAttribute'](name, value);
        return element;
    }
    return element.getAttribute(name);
}

function find(element, selector) {
    return toArray(element.querySelectorAll(selector)).map(function (ele) {
        return $dom(ele);
    });
}

function on(element, name, delegate, fn) {

    if (!fn) {
        element.addEventListener(name, arguments[2]);
    } else {
        element.addEventListener(name, function (e) {

            var target = e.target;

            while (target !== element) {

                if (target.matches(delegate)) {
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
    name.split(' ').forEach(function (cls) {
        return element.classList.add(cls);
    });
    return element;
}

function removeClass(element, name) {
    name.split(' ').forEach(function (cls) {
        return element.classList.remove(cls);
    });
    return element;
}



function trigger(element, name, data) {
    var evt = document.createEvent('HTMLEvents');
    evt.data = data;
    evt.initEvent(name, true, false);
    element.dispatchEvent(evt);
    return element;
}

function position(element) {
    return { left: element.offsetLeft, top: element.offsetTop };
}

function offset(element) {
    var rect = element.getBoundingClientRect(),
        top = rect.top + window.pageYOffset - document.documentElement.clientTop,
        left = rect.left + window.pageXOffset - document.documentElement.clientLeft;

    return { rect: rect, top: top, left: left };
}

function offsetParent(element) {
    return $dom(element.offsetParent);
}

function remove(element) {
    element.parentNode.removeChild(element);
}

function html(element, content) {
    if (content === undefined) {
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

    var ele = void 0;

    if (typeof content === 'string') {
        var tmp = document.createElement('div');
        tmp.innerHTML = content;
        ele = tmp.children[0];
    } else {
        ele = content;
    }

    element.parentNode.replaceChild(ele, element);

    return $dom(ele);
}

function children(element, selector) {
    return toArray(element.children).filter(function (ele) {
        return ele.matches(selector);
    }).map(function (ele) {
        return $dom(ele);
    });
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

    var fns = {
        attr: attr, find: find, parent: parent, children: children, prev: prev, next: next,
        on: on, trigger: trigger,
        hasClass: hasClass, addClass: addClass, removeClass: removeClass,
        position: position, offset: offset, offsetParent: offsetParent,
        html: html, text: text, replaceWith: replaceWith, remove: remove
    };

    Object.keys(fns).forEach(function (fn) {
        element['$' + fn] = function () {
            return fns[fn].apply(element, [element].concat(Array.prototype.slice.call(arguments)));
        };
    });

    return element;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var StiloElement = function (_HTMLElement) {
    inherits(StiloElement, _HTMLElement);

    function StiloElement() {
        classCallCheck(this, StiloElement);

        var _this = possibleConstructorReturn(this, (StiloElement.__proto__ || Object.getPrototypeOf(StiloElement)).call(this));

        $dom(_this);
        return _this;
    }

    createClass(StiloElement, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            var _this2 = this;

            this.connect();
            domReady.then(function () {
                return requestAnimationFrame(function () {
                    return _this2.ready();
                });
            });
        }
    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            this.disconnect();
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback() {
            this.disconnect();
        }
    }, {
        key: 'ready',
        value: function ready() {}
    }, {
        key: 'connect',
        value: function connect() {}
    }, {
        key: 'disconnect',
        value: function disconnect() {}
    }]);
    return StiloElement;
}(HTMLElement);

var StiloDrop = function (_StiloElement) {
    inherits(StiloDrop, _StiloElement);

    function StiloDrop() {
        classCallCheck(this, StiloDrop);
        return possibleConstructorReturn(this, (StiloDrop.__proto__ || Object.getPrototypeOf(StiloDrop)).apply(this, arguments));
    }

    createClass(StiloDrop, [{
        key: 'connect',
        value: function connect() {

            console.log(this);
        }
    }]);
    return StiloDrop;
}(StiloElement);

customElements.define('s-drop', StiloDrop);

var StiloModal = function (_StiloElement) {
    inherits(StiloModal, _StiloElement);

    function StiloModal() {
        classCallCheck(this, StiloModal);
        return possibleConstructorReturn(this, (StiloModal.__proto__ || Object.getPrototypeOf(StiloModal)).apply(this, arguments));
    }

    createClass(StiloModal, [{
        key: 'connect',
        value: function connect() {

            console.log(this);
        }
    }]);
    return StiloModal;
}(StiloElement);

customElements.define('s-modal', StiloModal);

var StiloTab = function (_StiloElement) {
    inherits(StiloTab, _StiloElement);

    function StiloTab() {
        classCallCheck(this, StiloTab);
        return possibleConstructorReturn(this, (StiloTab.__proto__ || Object.getPrototypeOf(StiloTab)).apply(this, arguments));
    }

    createClass(StiloTab, [{
        key: 'ready',
        value: function ready() {

            var tab = this;

            this.$on('click', 's-tabs a', function (e) {

                e.preventDefault();

                if (this.classList.contains('s-active')) {
                    return;
                }

                var index = Array.prototype.indexOf.call(this.parentNode.children, this);

                tab.select(index);
            });

            this.select(0);
        }
    }, {
        key: 'select',
        value: function select(index) {

            var activeClass = this.$attr('activeClass') || 's-active';
            var tabs = this.$find('s-tabs > a');
            var contents = this.$find('s-content > div');

            tabs.forEach(function (tab, i) {
                return tab.classList[i === index ? 'add' : 'remove'](activeClass);
            });
            contents.forEach(function (content, i) {
                return content.classList[i === index ? 'add' : 'remove'](activeClass);
            });

            this.$trigger('s-tab-select', { index: index });
        }
    }]);
    return StiloTab;
}(StiloElement);

customElements.define('s-tab', StiloTab);

on(document.documentElement, 'click', '[data-offcanvas-open]', function (e) {

    e.preventDefault();

    var offcanvas = document.querySelector(this.getAttribute('data-offcanvas-open') || this.href);

    if (offcanvas && offcanvas.open) {
        offcanvas.open();
    }
});

var StiloOffcanvas = function (_StiloElement) {
    inherits(StiloOffcanvas, _StiloElement);

    function StiloOffcanvas() {
        classCallCheck(this, StiloOffcanvas);
        return possibleConstructorReturn(this, (StiloOffcanvas.__proto__ || Object.getPrototypeOf(StiloOffcanvas)).apply(this, arguments));
    }

    createClass(StiloOffcanvas, [{
        key: 'ready',
        value: function ready() {
            var _this2 = this;

            this.contentElement = this.children[0];

            this.$on('click', function (e) {

                if (e.target == _this2) {
                    _this2.close();
                }
            }).$on('click', '[data-offcanvas-close]', function (e) {
                return _this2.close();
            }).$on('transitionend', function (e) {

                if (_this2.contentElement && e.target === _this2.contentElement && !_this2.isOpen) {
                    _this2.style.display = '';
                }
            });
        }
    }, {
        key: 'open',
        value: function open() {

            this.isOpen = true;

            if (!this.$hasClass('open')) {
                this.$trigger('s-offcanvas-open');
                this.style.display = 'block';
                this.offsetWidth && this.$addClass('open');
            }
        }
    }, {
        key: 'close',
        value: function close() {
            this.isOpen = false;
            this.$trigger('s-offcanvas-close');
            this.$removeClass('open');
        }
    }]);
    return StiloOffcanvas;
}(StiloElement);

customElements.define('s-offcanvas', StiloOffcanvas);

var StiloDirective = function () {
    function StiloDirective(element, option) {
        var _this = this;

        classCallCheck(this, StiloDirective);

        this.element = $dom(element);
        this.option = option;
        domReady.then(function () {
            return requestAnimationFrame(function () {
                return _this.ready();
            });
        });
    }

    createClass(StiloDirective, [{
        key: 'ready',
        value: function ready() {}
    }]);
    return StiloDirective;
}();

var directives = {};

function register(name, def) {
    directives[name] = def;
}

function init(root) {

    domReady.then(function () {

        root = $dom(root || document.body);

        var names = Object.keys(directives);
        var selector = names.map(function (name) {
            return '[s-' + name + ']';
        }).join(',');

        if (!selector) {
            return;
        }

        root.$find(selector).forEach(function (element) {
            names.forEach(function (name) {
                if (!element.hasAttribute('s-' + name)) {
                    return;
                }
                new directives[name](element, element.getAttribute('s-' + name));
                element.removeAttribute('s-' + name);
            });
        });
    });
}

domReady.then(function () {

    observe(document.body, function (mutations) {

        mutations.forEach(function (_ref) {
            var addedNodes = _ref.addedNodes,
                removedNodes = _ref.removedNodes,
                target = _ref.target;


            for (var i = 0; i < addedNodes.length; i++) {

                if (addedNodes[i].nodeType == Node.ELEMENT_NODE) {
                    init(addedNodes[i]);
                }
            }
        });
    });

    init();
});

var Directive = StiloDirective;

var cache = {};

register('svg', function (_Directive) {
    inherits(Test, _Directive);

    function Test() {
        classCallCheck(this, Test);
        return possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).apply(this, arguments));
    }

    createClass(Test, [{
        key: 'ready',
        value: function ready() {
            var _this2 = this;

            var url = this.element.$attr('src') || this.option;

            if (!url.trim()) {
                return;
            }

            if (!cache[url]) {
                cache[url] = fetch(url).then(function (response) {
                    return response.text();
                });
            }

            cache[url].then(function (content) {

                var attrs = {
                    id: _this2.element.$attr('id'),
                    style: _this2.element.$attr('style'),
                    'class': _this2.element.$attr('class'),
                    width: _this2.element.$attr('width') || '',
                    height: _this2.element.$attr('height') || ''
                };

                _this2.element = _this2.element.$replaceWith(content);

                Object.keys(attrs).forEach(function (attr) {
                    return attrs[attr] && _this2.element.$attr(attr, attrs[attr]);
                });
            });
        }
    }]);
    return Test;
}(Directive));

})));
//# sourceMappingURL=stilo.legacy.js.map
