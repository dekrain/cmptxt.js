/**
 * @fileoverviev A decompressor for cmptxt.js
 * For more info, look at cmptxt.js
 */

function decompress (data) {
	if (data.substr(0,2) != 'CT') {
		throw new TypeError('Invalid format!');
	}

	var mi, raw;
	var _data = [];

	mi = data.charCodeAt(2);
	raw = data.substr(3);
	if (isNaN(mi) || mi <= 0) {
		throw new TypeError('Invalid length format!');
	};

	var tmp = '';
	raw.split('').forEach(function(ch){
		tmp = tmp.concat(ch);
		if (tmp.length >= mi+1) {_data.push(tmp); tmp = '';};
	});

	var n;
	_data = _data.map(function(s){
		n = s.substr(0,s.length-1);
		if ( isNaN(n) ) {
			throw new TypeError('Invalid data format!');
		}
		return [ Number(n), s.substr(-1) ];
	});

	var result = _data.map(function(p){
		return p[1].repeat(p[0]);
	}).join('');

	return {
		data: result,
		length: result.length,
		average: result.length / data.length
	};
}

module.exports = decompress;
