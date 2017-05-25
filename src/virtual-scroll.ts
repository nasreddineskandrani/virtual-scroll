export function VirtualScroll() {
	
	let _pageSize = 100;
	let _rowHeight = 30;
	let _rowHeightScroll = _rowHeight;

	let _options: any = null;
	let _data: any = null;
	
	let _nbPages: any = null;
	let _pageHeightScroll: any = null;
	let _currentPageId = 0;
	let _lastPageLoadedId = _currentPageId;
	
	let CONTAINER_ID: any;
	let SCROLL_TOP_ID: any;
	let SCROLL_BOTTOM_ID: any;
	
	let PAGE_PREFIX_ID: any;
	let PAGE_CLASS: any;
	
	let ITEM_PREFIX_ID: any;
	
	function init(data: any, options: any) {
		_options = options;
		_data = data;
		
		CONTAINER_ID = _options.id;
		SCROLL_TOP_ID = 'scroll-padded-top-' + _options.id;
		SCROLL_BOTTOM_ID = 'scroll-padded-bottom-' + _options.id;
		PAGE_PREFIX_ID = 'page-';
		PAGE_CLASS = 'page';
		ITEM_PREFIX_ID = 'ps-item-';
		
		createScrollBar(_rowHeightScroll);
			
		let firstPageData = _data.slice(_pageSize * _currentPageId, _pageSize * (_currentPageId + 1));
		addPageToDom(firstPageData, 0);
		
		let newPageDataB = _data.slice(_pageSize * (_currentPageId + 1), _pageSize * (_currentPageId + 1 + 1));
		_currentPageId  =+ 1;
		addPageToDom(newPageDataB, _currentPageId);
			
		_nbPages = Math.floor(_data.length / _pageSize);
		
		updateScrollBar(_pageSize, _rowHeightScroll, _nbPages);
				
		let container = document.getElementById(_options.id);
		_pageHeightScroll = _pageSize * _rowHeightScroll;
	}
	
	function addPageToDom(pageData: any, id: any) {
		let container = document.getElementById(CONTAINER_ID);
		let page = document.createElement('div'); 
		page.setAttribute('id', PAGE_PREFIX_ID + id);
		page.setAttribute('class', PAGE_CLASS);
		for (let i = 0; i < pageData.length; ++i) {
			let newNode = document.createElement('div'); 
			newNode.setAttribute('id', ITEM_PREFIX_ID + i);		
			newNode.style['height'] = _rowHeight + 'px';		
			newNode.innerHTML = pageData[i];
			
			/*let checkbox = document.createElement("INPUT");
			checkbox.setAttribute("type", "checkbox");
			
			newNode.appendChild(checkbox);*/
			page.appendChild(newNode)
		}
		
		let scrollBottomContainer = document.getElementById(SCROLL_BOTTOM_ID); 
		container.insertBefore(page, scrollBottomContainer);
	}
	
	function updateScrollBar(pageSize: any, rowHeightScroll: any, nbPages: any) {
		let container = document.getElementById(_options.id);
		
		let t = container.getElementsByClassName('page');
		
		let firstId = parseInt(t[0].getAttribute('id').replace('page-', ''));
		
		///TOP
		let scrollTopContainer = document.getElementById(SCROLL_TOP_ID);
		let updatedScrollHeightTOP = firstId * pageSize * rowHeightScroll;
		scrollTopContainer.style.height = updatedScrollHeightTOP + 'px';
		//fix for ie
		scrollTopContainer.style.minHeight = updatedScrollHeightTOP + 'px';
		//console.log('updatedScrollHeightTOP', updatedScrollHeightTOP);

		///BOTTOM
		let scrollBottomContainer = document.getElementById(SCROLL_BOTTOM_ID);

		let nbPagesInDom = t ? t.length : 0;
		let updatedScrollHeightBOTTOM = (nbPages - firstId - nbPagesInDom) * pageSize * rowHeightScroll;
		//console.log('updatedScrollHeightBOTTOM', updatedScrollHeightBOTTOM);
		
		scrollBottomContainer.style.height = updatedScrollHeightBOTTOM + 'px';
		//fix for ie
		scrollBottomContainer.style.minHeight = updatedScrollHeightBOTTOM + 'px';

	}
	
	function createScrollBar(rowHeight: any) {
		let container = document.getElementById(_options.id);
		
		let scrollTopContainer = document.createElement('div'); 
		scrollTopContainer.setAttribute('id', SCROLL_TOP_ID);	
		scrollTopContainer.style['position'] = 'relative';
		
		let scrollBottomContainer = document.createElement('div'); 
		scrollBottomContainer.setAttribute('id', SCROLL_BOTTOM_ID);	
		scrollBottomContainer.style['position'] = 'relative';
		
		let wantedScrollTopHeight = 0;
        let wantedScrollHeight = _data.length * _rowHeightScroll;

		scrollTopContainer.style.height = wantedScrollHeight + 'px';
		//fix for ie
		scrollTopContainer.style.minHeight = wantedScrollHeight + 'px';	
		container.appendChild(scrollTopContainer);

		scrollBottomContainer.style.height = wantedScrollHeight + 'px';
		//fix for ie
		scrollBottomContainer.style.minHeight = wantedScrollHeight + 'px';	
		container.appendChild(scrollBottomContainer);

		//bind event
		container.addEventListener('scroll', onScroll);

		//limit of IE scroll height to 1533917 px
		//console.log('container.scrollHeight', container.scrollHeight);
	}
	
	function fromScrollYToPageId() {
		let container = document.getElementById(_options.id);
		let currentPageId = Math.floor(container.scrollTop / _pageHeightScroll);

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
		let container = document.getElementById(_options.id);
		
		let old = _currentPageId;

		_currentPageId = fromScrollYToPageId();
		
		if (old !== _currentPageId) {
			let container = document.getElementById(_options.id);
		
			//remove old page(s)
			for (let i = 0; i < _nbPages; ++i) {
				let child = document.getElementById(PAGE_PREFIX_ID + i);
				if (child) {
					container.removeChild(child);
				}
			}
			
			if ((_currentPageId - 1) > 0) {
				let newPageDataA = _data.slice(_pageSize * (_currentPageId - 1), _pageSize * (_currentPageId + 1 - 1));
				addPageToDom(newPageDataA, _currentPageId - 1);
			}
			
			if (_currentPageId < _nbPages) {
				let newPageDataB = _data.slice(_pageSize * _currentPageId, _pageSize * (_currentPageId + 1));
				addPageToDom(newPageDataB, _currentPageId);
			}
			
			if ((_currentPageId + 1) < _nbPages) {
				let newPageDataC = _data.slice(_pageSize * (_currentPageId + 1), _pageSize * (_currentPageId + 1 + 1));
				addPageToDom(newPageDataC, _currentPageId + 1);
			}
			
			updateScrollBar(_pageSize, _rowHeightScroll, _nbPages);
		}
	}
	
	function detectIE() {
		let ua = window.navigator.userAgent;

		// Test values; Uncomment to check result …

		// IE 10
		// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
		
		// IE 11
		// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
		
		// Edge 12 (Spartan)
		// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
		
		// Edge 13
		// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

		let msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		let trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			let rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		let edge = ua.indexOf('Edge/');
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