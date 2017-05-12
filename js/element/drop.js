import { StiloElement } from './../api/stilo-element';

class StiloDrop extends StiloElement {
  
    connect() {

        console.log(this)
    }
}

customElements.define('s-drop', StiloDrop);