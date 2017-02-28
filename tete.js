
require('moment-duration-format');
var moment =  require('moment');

console.log(moment.duration((parseInt(0) * 60) + parseInt(0), "minutes").format("hh:mm"));

let date = new Date();
console.log(date.getFullYear());
console.log(date.getMonth());
console.log(date.getDate());
