import { append, addClass, remove, isNullOrUndefined, setStyleAttribute, createElement } from '-syncfusion/ej2-base';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
/**
 * Virtual Scroll
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent) {
        this.translateY = 0;
        this.itemSize = 60;
        this.bufferCount = 3;
        this.renderedLength = 0;
        this.parent = parent;
        this.addEventListener();
    }
    VirtualScroll.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.virtualScroll, this.virtualScrolling, this);
    };
    VirtualScroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.virtualScroll, this.virtualScrolling);
    };
    VirtualScroll.prototype.getRenderedCount = function () {
        this.setItemSize();
        return Math.ceil(this.parent.element.clientHeight / this.itemSize) + this.bufferCount;
    };
    VirtualScroll.prototype.renderVirtualTrack = function (contentWrap) {
        var wrap = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS });
        wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
        contentWrap.appendChild(wrap);
    };
    VirtualScroll.prototype.updateVirtualTrackHeight = function (wrap) {
        var resourceCount = this.parent.resourceBase.renderedResources.length;
        if (resourceCount !== this.getRenderedCount()) {
            wrap.style.height = this.parent.element.querySelector('.e-content-wrap').clientHeight + 'px';
            var resWrap = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
            var conWrap = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            var eventWrap = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
            this.translateY = 0;
            this.setTranslate(resWrap, conWrap, eventWrap);
        }
        else {
            var lastRenderIndex = this.parent.resourceBase.renderedResources[resourceCount - 1].groupIndex;
            var lastCollIndex = this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
            var renderedResConut = resourceCount + (lastCollIndex - lastRenderIndex);
            renderedResConut = (renderedResConut > this.parent.resourceBase.expandedResources.length) ?
                this.parent.resourceBase.expandedResources.length : renderedResConut;
            wrap.style.height = (renderedResConut * this.itemSize) + 'px';
        }
    };
    VirtualScroll.prototype.setItemSize = function () {
        this.itemSize = util.getElementHeightFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
    };
    VirtualScroll.prototype.virtualScrolling = function () {
        this.parent.quickPopup.quickPopupHide();
        this.parent.quickPopup.morePopup.hide();
        var resWrap = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        var conWrap = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var eventWrap = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        addClass([conWrap], 'e-transition');
        var resCollection = [];
        if ((conWrap.scrollTop) - this.translateY < 0) {
            resCollection = this.upScroll(resWrap, conWrap);
        }
        else if ((conWrap.scrollTop - this.translateY > this.bufferCount * this.itemSize)) {
            resCollection = this.downScroll(conWrap);
        }
        if (!isNullOrUndefined(resCollection) && resCollection.length > 0) {
            this.updateContent(resWrap, conWrap, eventWrap, resCollection);
            this.parent.notify(events.dataReady, {});
            if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                this.parent.dragAndDropModule.navigationWrapper();
            }
            this.setTranslate(resWrap, conWrap, eventWrap);
        }
    };
    VirtualScroll.prototype.upScroll = function (resWrap, conWrap) {
        var index = (~~(conWrap.scrollTop / this.itemSize) + Math.ceil(conWrap.clientHeight / this.itemSize)) - this.renderedLength;
        index = (index > 0) ? index : 0;
        var prevSetCollection = this.getBufferCollection(index, index + this.renderedLength);
        this.parent.resourceBase.renderedResources = prevSetCollection;
        var firstTDIndex = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        }
        else {
            this.translateY = (conWrap.scrollTop - (this.bufferCount * this.itemSize) > 0) ?
                conWrap.scrollTop - (this.bufferCount * this.itemSize) : 0;
        }
        return prevSetCollection;
    };
    VirtualScroll.prototype.downScroll = function (conWrap) {
        var lastResource = this.parent.resourceBase.
            renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        var lastResourceIndex = this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        if (lastResource === lastResourceIndex) {
            return null;
        }
        var nextSetResIndex = ~~(conWrap.scrollTop / this.itemSize);
        var lastIndex = nextSetResIndex + this.renderedLength;
        lastIndex = (lastIndex > this.parent.resourceBase.expandedResources.length) ?
            nextSetResIndex + (this.parent.resourceBase.expandedResources.length - nextSetResIndex) : lastIndex;
        var nextSetCollection = this.getBufferCollection(lastIndex - this.renderedLength, lastIndex);
        this.translateY = conWrap.scrollTop;
        return nextSetCollection;
    };
    VirtualScroll.prototype.updateContent = function (resWrap, conWrap, eventWrap, resCollection) {
        var renderedLenth = resWrap.querySelector('tbody').children.length;
        for (var i = 0; i < renderedLenth; i++) {
            remove(resWrap.querySelector('tbody tr'));
            remove(conWrap.querySelector('tbody tr'));
            remove(eventWrap.querySelector('div'));
        }
        this.parent.resourceBase.renderedResources = resCollection;
        var resourceRows = this.parent.resourceBase.getContentRows(resCollection);
        var contentRows = this.parent.activeView.getContentRows();
        var eventRows = this.parent.activeView.getEventRows(resCollection.length);
        append(resourceRows, resWrap.querySelector('tbody'));
        append(contentRows, conWrap.querySelector('tbody'));
        append(eventRows, eventWrap);
    };
    VirtualScroll.prototype.getBufferCollection = function (startIndex, endIndex) {
        return this.parent.resourceBase.expandedResources.slice(startIndex, endIndex);
    };
    VirtualScroll.prototype.setTranslate = function (resWrap, conWrap, eventWrap) {
        setStyleAttribute(resWrap.querySelector('table'), {
            transform: "translateY(" + this.translateY + "px)"
        });
        setStyleAttribute(conWrap.querySelector('table'), {
            transform: "translateY(" + this.translateY + "px)"
        });
        setStyleAttribute(eventWrap, {
            transform: "translateY(" + this.translateY + "px)"
        });
    };
    VirtualScroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return VirtualScroll;
}());
export { VirtualScroll };
