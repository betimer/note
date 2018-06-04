
console.log('arguments:',arguments);

const os = require('os');

console.log('arguments[0]:', arguments[0]);
console.log('arguments[1] === require:', arguments[1] === require);
console.log('arguments[2] === module:', arguments[2] === module);
console.log('arguments[3] === __filename:', arguments[3] === __filename);
console.log('arguments[4] === __dirname:', arguments[4] === __dirname);
