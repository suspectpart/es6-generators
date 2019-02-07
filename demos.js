/* eslint-disable no-undef,no-console */

const { Stream, range } = require('./lib');

const stream = Stream
    .from(range(20))
    .filter(v => v === 3 || v === 7 || v === 9)
    .map(c => c * 2)
    .take(2);

console.log(...stream);
console.log(stream);
