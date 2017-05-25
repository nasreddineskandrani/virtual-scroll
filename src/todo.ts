//transfert this new version slowly to the file
//C:\Users\nas\Desktop\virtual-scroll\src\virtual-scroll.ts
//and make sure the demo keep working

/*
export type VirtualScrollOptions = {
    ID?: string;
    pageSize?: number;
    rowHeight?: number;
    data?: any[];
    templates?: {
        row?: string;
        columns?: string;
    };
};

export class VirtualScroll {
    private options: VirtualScrollOptions;
    private containerElement: HTMLElement;
    private topScroll: HTMLElement;
    private bottomScroll: HTMLElement;
    private pageClassName: string;

    constructor(options: VirtualScrollOptions = {
        ID: 'virtual-scroll',
        data: [],
        pageSize: 300,
        rowHeight: 30,
        templates: {
            row: ''
        }
    }) {
        this.options = options;

        console.log(this.options);

        this.init();
    }

    init() {
        this.createScrollSimulation();
    }

    dom(): HTMLElement {
        if (this.containerElement) {
            return this.containerElement;
        } else {
            this.containerElement = document.getElementById(this.options.ID);
            this.containerElement.innerHTML = 'CHECK';

            return this.containerElement;
        }
    }

    createScrollSimulation() {
        this.topScroll = document.createElement('div');
        this.topScroll.setAttribute('class', `${ this.options.ID }-top-scroll`);

        this.bottomScroll = document.createElement('div');
        this.bottomScroll.setAttribute('class', `${ this.options.ID }-bottom-scroll`);

        // scrollTopContainer.setAttribute('id', scrollTopID);	
        this.topScroll.style['position'] = 'relative';
        
        // scrollBottomContainer.setAttribute('id', scrollBottomID);	
        this.bottomScroll.style['position'] = 'relative';
        
        const wantedScrollTopHeight = 0;
        this.topScroll.style['height'] = wantedScrollHeight + 'px';
        //fix for ie
        this.topScroll.style['minHeight'] = wantedScrollHeight + 'px';	

        //TODO make this condition execute only for IE
        let wantedScrollHeight = this.options.data.length * this.options.rowHeight;

        // TODO: Turn this code to TypeScript
        // if (detectIE() && wantedScrollHeight > 1500000) {
        //     console.log('SPECIAL ALGO');
        //     wantedScrollHeight = 1500000;
        //     _rowHeightScroll = wantedScrollHeight / _data.length;
        //     let tmp = Math.floor(_rowHeightScroll);
        //     _rowHeightScroll = tmp;
        //     wantedScrollHeight = _data.length * _rowHeightScroll; 
        // }

        this.topScroll.style['height'] = wantedScrollHeight + 'px';
        //fix for ie
        this.bottomScroll.style['minHeight'] = wantedScrollHeight + 'px';

        this.dom().appendChild(this.topScroll);
        this.dom().appendChild(this.bottomScroll);

        this.dom().addEventListener('scroll', this.updateScrollBars);

        //limit of IE scroll height to 1533917 px
        //console.log('container.scrollHeight', container.scrollHeight);
    }

    addItemsPage(data: any[], collectionNumber: number) {

    }

    updateScrollBars() {

    }
}
*/