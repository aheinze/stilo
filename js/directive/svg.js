import { register, Directive } from './../api/directive';

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
