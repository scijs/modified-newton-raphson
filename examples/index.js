'use strict';

var nr = require('newton-raphson');
var mnr = require('../');

function f (x) { return Math.pow(x - 1, 4) * (x + 2); }
function fp (x) { return 4 * Math.pow(x - 1, 3) * (x + 2) + Math.pow(x - 1, 4); }
function fpp (x) { return 12 * Math.pow(x - 1, 2) * (x + 2) + 8 * Math.pow(x - 1, 3); }

console.log('Using derivatives:', mnr(f, fp, fpp, 2, {verbose: true}));

console.log('Using numerical second derivatives:', mnr(f, fp, 2, {verbose: true}));

console.log('Using numerical first and second derivatives:', mnr(f, 2, {verbose: true}));

console.log(nr(f, fp, 2));
