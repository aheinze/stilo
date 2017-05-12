import { StiloElement } from './../api/stilo-element';


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