/**
 * @fileoverviev A decompressor for cmptxt.js
 * For more info, look at cmptxt.js
 */

var fs = require('fs');

if (process.argv.length != 4) {
	console.error('Ussage: node cmptxt.js <file> <out>');
	console.error(`Used: ${Array.prototype.join.call(process.argv, ' ')} (${process.argv.length})`);
	process.exit(1);
}

var to_uncompress = fs.readFileSync(process.argv[2], {encoding: 'ASCII'});

if (to_uncompress.substr(0,2) != 'CT') {
	console.error('Invalid format!');
	process.exit(2);
}

var mi, raw;
var data = [];

mi = to_uncompress.charCodeAt(2);
raw = to_uncompress.substr(3);
if (isNaN(mi) || mi <= 0) {
	console.error('Invalid length format!');
	process.exit(3);
};

var tmp = '';
raw.split('').forEach(function(ch){
	tmp = tmp.concat(ch);
	if (tmp.length >= mi+1) {data.push(tmp); tmp = '';};
});

var n;
data = data.map(function(s){
	n = s.substr(0,s.length-1);
	if ( isNaN(n) ) {
		console.error('Invalid data format!');
		process.exit(4);
	}
	return [ Number(n), s.substr(-1) ];
});

var result = data.map(function(p){
	return p[1].repeat(p[0]);
}).join('');

console.log('DeCompressed file!');

process.argv[3] == '-' ? console.log('DeCompressed:', result) : fs.writeFileSync(process.argv[3], result);