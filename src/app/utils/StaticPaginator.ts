import {assign, isNumber, noop} from 'fjl';

import {resolvePointer} from './pointer-helpers';

const enumerable = true;

export default class StaticPaginator {
    pageNumber = 0;
    itemNumber = 0;
    itemsPerPage = 1;
    itemsLength: Num;
    pagesLength: Num;
    items: Array<any> = [];
    autoWrap = true;
    autoUpdatePageNumber = true;
    onGotoPage = noop;
    onGotoItem = noop;
    readonly firstItemIndexOnPage;
    readonly lastItemIndexOnPage;
    readonly firstItemOnPage;
    readonly lastItemOnPage;

    constructor (options?: object) {
        let _pageNumber = 0,
            _itemNumber = 0;
        Object.defineProperties(this, {
            pageNumber: {
                get () {
                    return _pageNumber;
                },
                set (x: Num) {
                    const _pagesLength = this.pagesLength;
                    _pageNumber = resolvePointer(this.autoWrap, 0, !_pagesLength ? 0 : _pagesLength - 1, x);
                },
                enumerable
            },
            itemNumber: {
                get () {
                    return _itemNumber;
                },
                set (x: Num) {
                    _itemNumber = resolvePointer(this.autoWrap, 0, !this.itemsLength ? 0 :  this.itemsLength - 1, x);
                },
                enumerable
            },
            firstItemIndexOnPage: {
                get () {
                    return this.lastItemIndexOnPage - this.itemsPerPage + 1;
                },
                enumerable
            },
            lastItemIndexOnPage: {
                get() {
                    const {itemsPerPage, pageNumber} = this,
                        designatedPage = pageNumber + 1;
                    return itemsPerPage * designatedPage;
                },
                enumerable
            },
            firstItemOnPage: {
                get () {
                    return this.items[this.firstItemIndexOnPage];
                },
                enumerable
            },
            lastItemOnPage: {
                get () {
                    return this.items[this.lastItemIndexOnPage];
                },
                enumerable
            },
            itemsLength: {get () { return this.items.length; }, enumerable},
            pagesLength: {get () { return Math.ceil(this.itemsLength / this.itemsPerPage); }, enumerable}
        });
        if (options) {
            assign(this, options);
        }
    }

    gotoPage (index) {
        if (!this.pagesLength) { return this; }
        this.pageNumber = index;
        this.onGotoPage.call(this, this.pageNumber);
        return this;
    }

    gotoItem (index) {
        if (!this.itemsLength) { return this; }
        this.itemNumber = index;
        if (this.autoUpdatePageNumber) {
            this.pageNumber = this.getPageNumberByItemIndex(this.itemNumber);
        }
        this.onGotoItem.call(this, this.itemNumber);
        return this;
    }

    nextPage () {
        return this.gotoPage(this.pageNumber + 1);
    }

    prevPage () {
        return this.gotoPage(this.pageNumber - 1);
    }

    nextItem () {
        return this.gotoItem(this.itemNumber + 1);
    }

    prevItem () {
        return this.gotoItem(this.itemNumber - 1);
    }

    getPageNumberByItemIndex (index) {
        const {itemsPerPage, itemsLength} = this;
        let pageNumber = -1,
            ind;
        for (ind = 0; ind < itemsLength; ind += 1) {
            if (ind % itemsPerPage === 0) {
                pageNumber += 1;
            }
            if (ind === index) {
                break;
            }
        }
        return pageNumber;
    }
}
