import { StiloElement } from './../api/stilo-element';
import { on } from './../api/dom';


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