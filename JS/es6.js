
// 1. const keyword is using: reference
// and its properties are still updatable



// 2. prevent object property update
Object.freeze(global); // looks like only level 1 property, not grand property



// 3. var scope problem
// 3.1. what does 'var' really do for the full namespace?
var x = 'ff'; // means: this.x = 'ff'
// because this === window in browser, that also means window.x = 'ff'; 
// node: global.x = 'ff'; this.global.global.global.global === this



// 3.2. for loop makes global variables
for(var i in myObj) { console.log(i); } console.log(i); // same as below
var i; for(i in myObj) { console.log(i); } console.log(i);
// 3.3. how to hide local variables in ES5 ?
(function() {
  // Your code here
  var var1; // local variable, protect from making global variables
  function f1() {
    if(var1) { }
  }

  window.var_name = something; // if you have to have global var
  window.glob_func = function() { } // or global function
})();


// 3.5
var varT = 1;
let letT = 2; // do not hurt 'this'
const constT = 3; // do not hurt 'this'
console.log(varT); // 1
console.log(letT); // 2
console.log(constT); // 3
console.log(this.varT); // 1
console.log(this.letT); // undefined 
console.log(this.constT); // undefined



// 6. using let/const in for loop
for(let prop in object) { }
// more recommend using const: for(const prop in object)

// Actually both let and const is scoped:
// there is no error below // just different scope
let l = 1;
const c = 1;
{
  let l = 2;
  const c = 2;
}


const myThing = {
  aa: function() {
    fetch(url).then(() => this.bb());
  },
  bb: function() { }
}


// 8. Map
let store = new Map();
// under the hook [["ff", value1], ["gg", value2]];

for(let keyAndValue of store) { }
for(let [key, value] of store) { }
for(let key of store.keys()) { }


