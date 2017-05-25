import { VirtualScroll } from '../src/virtual-scroll';
function getData() {
	const NB_ITEMS = 50000; // let 50k for now - IE limitation
	const _data = [];
	const nbItems = NB_ITEMS;
	for (let i = 0; i < nbItems; ++i) {
		_data.push('item: ' + i);
	}
	return _data;
}

/*
var options = <VirtualScrollOptions>{
	ID: 'virtual-scroll',
	data: getData(),
	rowHeight: 30,
	templates: {
		row: `
		<span>{{checkbox}}</span>
		<span>{{icon}}</span>
		span>{{title}}</span>
		span>{{others}}</span>`
	}
};
*/

/**
 * by defaut 400000 to test 
 * Problems
 * chrome
 * 1. loading 1.000.000 items with a string + a checkbox take a lot of time => crash browser 
 * ie
 * 1. loading only 100.000 items take a lot of time => hang browser and scroll dont work proprely 
 */

// initialization
let options = {
	'id': 'virtual-scroll'
};
let virtualScroll = VirtualScroll();
virtualScroll.init(getData(), options);