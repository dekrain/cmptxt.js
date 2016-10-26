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
 * cmptxt <input-file> <output-file>
 * cmptxt <file> -
 *
 * when <output-file> is "-", then output writes to console
 */

const decompress = require('./de-cmptxt.js');

function compress (data) {
	var i = 0, mi = 0, ch;
	var compressed = [];
	data.split('').forEach(function(_ch){
		if (ch != _ch) { if(ch) compressed.push([i.toString(),ch]); ch = _ch; i = 0; }
		++i; if (i > mi) mi = i;
	});

	if (i>0) compressed.push([i,ch]);

	var l = mi.toString().length;
	compressed = 'CT' + String.fromCharCode(l) + compressed.map(function(pair){
		var ii = (('0'.repeat(l)) + pair[0]).substr(-l);
		return ii + pair[1];
	}).join('');

	return {
		data: compressed,
		length: compressed.length,
		average: compressed.length / data.length
	};
}

module.exports = compress;
compress.decompress = decompress;
