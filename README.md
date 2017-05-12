# Stilo

Stilo - A minimal functional front-end library


## Build

```npm install && node build```


## Usage

With legacy browser support (e.g. IE > = 11):

```html
<!-- polyfills -->
<script src="shim/dom4.js"></script>
<script src="shim/es6-shim.js"></script>
<script src="shim/fetch.js"></script>
<script src="shim/document-register-element.js"></script>

<!-- stilo -->
<link rel="stylesheet" type="text/css" href="dist/stilo.legacy.css">
<script src="dist/stilo.legacy.js"></script>
```

Latest Browsers generation:

```html
<!-- stilo -->
<link rel="stylesheet" type="text/css" href="css/stilo.css">
<script src="js/stilo.js" type="module"></script>
```