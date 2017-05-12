var rollup = require('rollup');
var rollupNodeResolve = require('rollup-plugin-node-resolve');
var rollupUglify = require('rollup-plugin-uglify');
var rollupBabel = require('rollup-plugin-babel');
var minify = require('uglify-js-harmony').minify;

var postcss = require("postcss");
var atImport = require("postcss-import");
var cssnext = require('postcss-cssnext');
var clean = require("postcss-clean");
var fs = require("fs");

// Build Css

var css = fs.readFileSync("css/stilo.css", "utf8");

postcss([
    atImport({ 
        path: ["css"] 
    })
]).process(css).then(function (result) {
    
    fs.writeFileSync("dist/stilo.css", result.css);
    console.log('built: dist/stilo.css');

    postcss([
        atImport({ 
            path: ["css"] 
        }), 
        cssnext({
            features: {
                customProperties: {preserve:true}
            }
        })
    ]).process(css).then(function (result) {
        fs.writeFileSync("dist/stilo.legacy.css", result.css);
        console.log('built: dist/stilo.legacy.css');
    });

});


// Build Js

rollup.rollup({ entry: "./js/stilo.js", plugins: [ rollupNodeResolve() ] }).then(function(bundle) {
    
    bundle.write({
        format: "umd",
        moduleName: "stilo",
        dest: "./dist/stilo.js",
        sourceMap: true
    });

    console.log('built: dist/stilo.js');
});

rollup.rollup({ entry: "./js/stilo.js", plugins: [ rollupNodeResolve(), rollupBabel({exclude: 'node_modules/**'}) ] }).then(function(bundle) {
    
    bundle.write({
        format: "umd",
        moduleName: "stilo",
        dest: "./dist/stilo.legacy.js",
        sourceMap: true
    });

    console.log('built: dist/stilo.legacy.js');
});