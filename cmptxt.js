/**
 * @fileoverview A simple text compressor
 * Format:
 * CT(bin-max-length)(times)(char)
 * Example:
 * *****-----_____aaabbcdfe
 * VVVVVVVVVVVVVVVVVVVVVVVV
 * CT\x015*5-5_3a2b1c1d1f1e
 * Other Example:
 * ***************-----
 * VVVVVVVVVVVVVVVVVVVV
 * CT\x0215*05-
 *
 * Ussage:
 * node cmptxt.js <input-file> <output-file>
 * node cmptxt.js <file> -
 *
 * when <output-file> is "-", then output writes to console
 */

var fs = require('fs');

if (process.argv.length != 4) {
	console.error('Ussage: node cmptxt.js <file> <out>');
	console.error(`Used: ${Array.prototype.join.call(process.argv, ' ')} (${process.argv.length})`);
	process.exit(1);
}

var to_compress = fs.readFileSync(process.argv[2], {encoding: 'ASCII'});

var i = 0, mi = 0, ch;
var compressed = [];
to_compress.split('').forEach(function(_ch){
	if (ch != _ch) { if(ch) compressed.push([i.toString(),ch]); ch = _ch; i = 0; }
	++i; if (i > mi) mi = i;
});

if (i>0) compressed.push([i,ch]);

var l = mi.toString().length;
compressed = 'CT' + String.fromCharCode(l) + compressed.map(function(pair){
	var ii = (('0'.repeat(l)) + pair[0]).substr(-l);
	return ii + pair[1];
}).join('');

var messages = {
	lt: 'Yay, compressing result have &% of original version!',
	eq: 'Huh, compressing result have the same size like original.',
	gt: 'Oh, no! Compressing result have &% of original! :/'
}
var msg;

var average = compressed.length / to_compress.length;

if (average < 1) {
	msg = messages.lt;
} else if (average > 1) {
	msg = messages.gt;
} else if (average == 1) {
	msg = messages.eq;
} else {
	console.error('Invalid error!');
	process.exit(2);
}

console.log( msg.replace('&', Math.round(average*100)) );

process.argv[3] == '-' ? console.log('Compressed:', compressed) : fs.writeFileSync(process.argv[3], compressed);