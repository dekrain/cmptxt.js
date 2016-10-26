const fs = require('fs');
const cmptxt = require('.');

var tasks = ['cmp', 'decmp'];

if (process.argv.length != 5 || !(tasks.indexOf(process.argv[2]) > -1)) {
	console.error(`Ussage: cmptxt <${tasks.join('|')}> <file> <out>`);
	console.error(`Used: ${Array.prototype.join.call(process.argv, ' ')} (${process.argv.length})`);
	process.exit(1);
}


var to_compress = fs.readFileSync(process.argv[3], {encoding: 'UTF-8'});

var messages = {
	lt: 'Yay, compressing result have &% of original version!',
	eq: 'Huh, compressing result have the same size like original.',
	gt: 'Oh, no! compressing result have &% of original! :/'
}
var msg, task = process.argv[2];

var compressed, average, result = task === 'cmp' ? cmptxt(to_compress) : task === 'decmp' ? cmptxt.decompress(to_compress) : {};
compressed = result.data;
average = result.average;

if (task === 'cmp') {
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
}

process.argv[4] == '-' ? console.log((task === 'decmp' ? 'De-' : '') + 'Compressed:', compressed) : fs.writeFileSync(process.argv[4], compressed);
