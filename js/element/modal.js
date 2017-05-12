import { StiloElement } from './../api/stilo-element';

class StiloModal extends StiloElement {
  
    connect() {

        console.log(this)
    }
}

customElements.define('s-modal', StiloModal);