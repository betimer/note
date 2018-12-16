
// To access: obj.__proto__ / func.prototype

let obj = {}; obj.__proto__ === Object.prototype // true
Number.prototype.__proto__ === Object.prototype // true
Array.prototype.__proto__ === Object.prototype // true
Function.prototype.__proto__ === Object.prototype // true

myFunc.__proto__ === Function.prototype // true
console.__proto__.__proto__ === Object.prototype // true


let arr = [1, 2, 3];
// it inherits from Array.prototype?
alert(arr.__proto__ === Array.prototype); // true
// then from Object.prototype?
alert(arr.__proto__.__proto__ === Object.prototype); // true
// and null on the top.
alert(arr.__proto__.__proto__.__proto__); // null


// Add method "f.defer(ms)" to all functions
// https://javascript.info/native-prototypes
Function.prototype.defer = function(ms) {
    setTimeout(this, ms);
};


Function.prototype.defer3 = function(ms) {
    let f = this;
    console.log('this1', this); // the function f body
    return function(...args) {
        setTimeout(() => { console.log('this2', this); f.apply(this, args) }, ms); // this is global
    }
};

Car.prototype.drive = function(fff) {
    this.speed = fff;
}.bind(this);

