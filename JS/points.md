# JS Points

## execute js script dynamically

Adding one more scripts to download and execute
If this one runs multiple times, the script will also be executed multiple times (Instead of executing once)

```js
var script = document.createElement('script');
script.src = 'https://www.web.com/bundle.js';
document.head.appendChild(script);
```

## flout number format

> 1.1-1
0.10000000000000009

## Arrow function cannot replace all traditional function definition way

```js
function Person() {
  this.id = 'id_1';
}
Person.prototype.setName = function(name) {this.name = name};
Person.prototype.setNameBad = name => this.name = name; // this will be global/window
```
