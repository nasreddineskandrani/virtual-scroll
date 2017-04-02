'use strict';

var NB_ITEMS = 1000000;

function VirtualScroll() {
	
	var _pageSize = 100;
	var _rowHeight = 30;
	var _rowHeightScroll = _rowHeight;

	var _options = null;
	var _data = null;
	
	var _nbPages = null;
	var _pageHeightScroll = null;
	var _currentPageId = 0;
	var _lastPageLoadedId = _currentPageId;
	
	var CONTAINER_ID;
	var SCROLL_TOP_ID;
	var SCROLL_BOTTOM_ID;
	
	var PAGE_PREFIX_ID;
	var PAGE_CLASS;
	
	var ITEM_PREFIX_ID;
	
	function init(data, options) {
		_options = options;
		_data = data;
		
		CONTAINER_ID = _options.id;
		SCROLL_TOP_ID = 'scroll-padded-top-' + _options.id;
		SCROLL_BOTTOM_ID = 'scroll-padded-bottom-' + _options.id;
		PAGE_PREFIX_ID = 'page-';
		PAGE_CLASS = 'page';
		ITEM_PREFIX_ID = 'ps-item-';
		
		createScrollBar(_rowHeightScroll);
			
		var firstPageData = _data.slice(_pageSize * _currentPageId, _pageSize * (_currentPageId + 1));
		addPageToDom(firstPageData, 0);
		
		var newPageDataB = _data.slice(_pageSize * (_currentPageId + 1), _pageSize * (_currentPageId + 1 + 1));
		_currentPageId  =+ 1;
		addPageToDom(newPageDataB, _currentPageId);
			
		_nbPages = Math.floor(_data.length / _pageSize);
		
		updateScrollBar(_pageSize, _rowHeightScroll, _nbPages);
				
		var container = document.getElementById(_options.id);
		_pageHeightScroll = _pageSize * _rowHeightScroll;
	}
	
	function addPageToDom(pageData, id) {
		var container = document.getElementById(CONTAINER_ID);
		var page = document.createElement('div'); 
		page.setAttribute('id', PAGE_PREFIX_ID + id);
		page.setAttribute('class', PAGE_CLASS);
		for (var i = 0; i < pageData.length; ++i) {
			var newNode = document.createElement('div'); 
			newNode.setAttribute('id', ITEM_PREFIX_ID + i);		
			newNode.style['height'] = _rowHeight + 'px';		
			newNode.innerHTML = pageData[i];
			
			/*var checkbox = document.createElement("INPUT");
			checkbox.setAttribute("type", "checkbox");
			
			newNode.appendChild(checkbox);*/
			page.appendChild(newNode)
		}
		
		var scrollBottomContainer = document.getElementById(SCROLL_BOTTOM_ID); 
		container.insertBefore(page, scrollBottomContainer);
	}
	
	function updateScrollBar(pageSize, rowHeightScroll, nbPages) {
		var container = document.getElementById(_options.id);
		
		var t = container.getElementsByClassName('page');
		
		var firstId = parseInt(t[0].getAttribute('id').replace('page-', ''));
		
		///TOP
		var scrollTopContainer = document.getElementById(SCROLL_TOP_ID);
		var updatedScrollHeightTOP = firstId * pageSize * rowHeightScroll;
		scrollTopContainer.style['height'] = updatedScrollHeightTOP + 'px';
		//fix for ie
		scrollTopContainer.style['min-height'] = updatedScrollHeightTOP + 'px';
		//console.log('updatedScrollHeightTOP', updatedScrollHeightTOP);

		///BOTTOM
		var scrollBottomContainer = document.getElementById(SCROLL_BOTTOM_ID);
		var t = container.getElementsByClassName('page');
		var nbPagesInDom = t ? t.length : 0;
		var updatedScrollHeightBOTTOM = (nbPages - firstId - nbPagesInDom) * pageSize * rowHeightScroll;
		//console.log('updatedScrollHeightBOTTOM', updatedScrollHeightBOTTOM);
		
		scrollBottomContainer.style['height'] = updatedScrollHeightBOTTOM + 'px';
		//fix for ie
		scrollBottomContainer.style['min-height'] = updatedScrollHeightBOTTOM + 'px';

	}
	
	function createScrollBar(rowHeight) {
		var container = document.getElementById(_options.id);
		
		var scrollTopContainer = document.createElement('div'); 
		scrollTopContainer.setAttribute('id', SCROLL_TOP_ID);	
		scrollTopContainer.style['position'] = 'relative';
		
		var scrollBottomContainer = document.createElement('div'); 
		scrollBottomContainer.setAttribute('id', SCROLL_BOTTOM_ID);	
		scrollBottomContainer.style['position'] = 'relative';
		
		var wantedScrollTopHeight = 0;
		scrollTopContainer.style['height'] = wantedScrollHeight + 'px';
		//fix for ie
		scrollTopContainer.style['min-height'] = wantedScrollHeight + 'px';	
		container.appendChild(scrollTopContainer);
		

//TODO make this condition execute only for IE
		var wantedScrollHeight = _data.length * _rowHeightScroll;
		if (detectIE() && wantedScrollHeight > 1500000) {
			console.log('SPECIAL ALGO');
			wantedScrollHeight = 1500000;
			_rowHeightScroll = wantedScrollHeight / _data.length;
			var tmp = Math.floor(_rowHeightScroll);
			_rowHeightScroll = tmp;
			wantedScrollHeight = _data.length * _rowHeightScroll; 
		}

		scrollBottomContainer.style['height'] = wantedScrollHeight + 'px';
		//fix for ie
		scrollBottomContainer.style['min-height'] = wantedScrollHeight + 'px';	
		container.appendChild(scrollBottomContainer);

		//bind event
		container.addEventListener('scroll', onScroll);

		//limit of IE scroll height to 1533917 px
		//console.log('container.scrollHeight', container.scrollHeight);
	}
	
	function fromScrollYToPageId() {
		var container = document.getElementById(_options.id);
		var currentPageId = Math.floor(container.scrollTop / _pageHeightScroll);

		if (isNaN(currentPageId)) {
			return 0;
		}

		if (currentPageId > _nbPages) {
			return _nbPages;
		}

		return currentPageId;
	}
	
	////events
	function onScroll() {
		var container = document.getElementById(_options.id);
		
		var old = _currentPageId;

		_currentPageId = fromScrollYToPageId();
		
		if (old !== _currentPageId) {
			var container = document.getElementById(_options.id);
		
			//remove old page(s)
			for (var i = 0; i < _nbPages; ++i) {
				var child = document.getElementById(PAGE_PREFIX_ID + i);
				if (child) {
					container.removeChild(child);
				}
			}
			
			if ((_currentPageId - 1) > 0) {
				var newPageDataA = _data.slice(_pageSize * (_currentPageId - 1), _pageSize * (_currentPageId + 1 - 1));
				addPageToDom(newPageDataA, _currentPageId - 1);
			}
			
			if (_currentPageId < _nbPages) {
				var newPageDataB = _data.slice(_pageSize * _currentPageId, _pageSize * (_currentPageId + 1));
				addPageToDom(newPageDataB, _currentPageId);
			}
			
			if ((_currentPageId + 1) < _nbPages) {
				var newPageDataC = _data.slice(_pageSize * (_currentPageId + 1), _pageSize * (_currentPageId + 1 + 1));
				addPageToDom(newPageDataC, _currentPageId + 1);
			}
			
			updateScrollBar(_pageSize, _rowHeightScroll, _nbPages);
		}
	}
	
	function detectIE() {
		var ua = window.navigator.userAgent;

		// Test values; Uncomment to check result …

		// IE 10
		// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
		
		// IE 11
		// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
		
		// Edge 12 (Spartan)
		// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
		
		// Edge 13
		// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}

	return {
		init: init
	};
}

function getData() {
	var _data = [];	
	var nbItems = NB_ITEMS;
	for (var i = 0; i < nbItems; ++i) {
		_data.push('item: ' + i);
	}
	return _data;
}

//use it
var options = {
	'id': 'virtual-scroll-1'
};
var virtualScroll = VirtualScroll();
virtualScroll.init(getData(), options);


//by defaut 400000 to test 

//Problems
//chrome
//1. loading 1.000.000 items with a string + a checkbox take a lot of time => crash browser 

//ie
//1. loading only 100.000 items take a lot of time => hang browser and scroll dont work proprely 