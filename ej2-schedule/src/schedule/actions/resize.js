var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { addClass, Browser, EventHandler, closest, extend, formatUnit, setStyleAttribute } from '-syncfusion/ej2-base';
import { ActionBase } from '../actions/action-base';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * Schedule events resize actions
 */
var Resize = /** @class */ (function (_super) {
    __extends(Resize, _super);
    function Resize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Resize.prototype.wireResizeEvent = function (element) {
        var _this = this;
        var resizeElement = [].slice.call(element.querySelectorAll('.' + cls.EVENT_RESIZE_CLASS));
        resizeElement.forEach(function (element) { return EventHandler.add(element, Browser.touchStartEvent, _this.resizeStart, _this); });
    };
    Resize.prototype.resizeHelper = function () {
        var _this = this;
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            this.actionObj.originalElement.forEach(function (element, index) {
                var cloneElement = _this.createCloneElement(element);
                _this.actionObj.cloneElement[index] = cloneElement;
                if (_this.actionObj.element === element) {
                    _this.actionObj.clone = cloneElement;
                }
            });
        }
        else {
            this.actionObj.clone = this.createCloneElement(this.actionObj.element);
            this.actionObj.cloneElement = [this.actionObj.clone];
            this.actionObj.originalElement = [this.actionObj.element];
        }
    };
    Resize.prototype.resizeStart = function (e) {
        this.actionObj.action = 'resize';
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        var resizeTarget = closest(e.target, '.' + cls.EVENT_RESIZE_CLASS);
        this.actionObj.element = closest(resizeTarget, '.' + cls.APPOINTMENT_CLASS);
        this.actionObj.event = this.parent.eventBase.getEventByGuid(this.actionObj.element.getAttribute('data-guid'));
        var eventObj = extend({}, this.actionObj.event, null, true);
        var resizeArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            interval: this.actionObj.interval,
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(event.resizeStart, resizeArgs);
        if (resizeArgs.cancel) {
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.resizeEdges = {
            left: resizeTarget.classList.contains(cls.LEFT_RESIZE_HANDLER),
            right: resizeTarget.classList.contains(cls.RIGHT_RESIZE_HANDLER),
            top: resizeTarget.classList.contains(cls.TOP_RESIZE_HANDLER),
            bottom: resizeTarget.classList.contains(cls.BOTTOM_RESIZE_HANDLER)
        };
        this.actionObj.groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : 0;
        var workCell = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
        var headerRows = this.parent.activeViewOptions.headerRows.map(function (row) { return row.option; });
        if (this.parent.activeView.isTimelineView() && headerRows.length > 0 && ['Date', 'Hour'].indexOf(headerRows.slice(-1)[0]) < 0) {
            var tr = this.parent.getContentTable().querySelector('tr');
            var noOfDays_1 = 0;
            var tdCollections = [].slice.call(tr.childNodes);
            tdCollections.forEach(function (td) { return noOfDays_1 += parseInt(td.getAttribute('colspan'), 10); });
            this.actionObj.cellWidth = tr.offsetWidth / noOfDays_1;
            this.actionObj.cellHeight = tr.offsetHeight;
        }
        var pages = this.getPageCoordinates(e);
        this.actionObj.X = pages.pageX;
        this.actionObj.Y = pages.pageY;
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = resizeArgs.interval;
        this.actionObj.scroll = resizeArgs.scroll;
        this.actionObj.start = new Date(eventObj[this.parent.eventFields.startTime].getTime());
        this.actionObj.end = new Date(eventObj[this.parent.eventFields.endTime].getTime());
        this.actionObj.originalElement = this.getOriginalElement(this.actionObj.element);
        var viewElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
        EventHandler.add(document, Browser.touchMoveEvent, this.resizing, this);
        EventHandler.add(document, Browser.touchEndEvent, this.resizeStop, this);
    };
    Resize.prototype.resizing = function (e) {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.element.querySelectorAll('.' + cls.RESIZE_CLONE_CLASS).length === 0) {
            this.resizeHelper();
        }
        var pages = this.getPageCoordinates(e);
        this.actionObj.pageX = pages.pageX;
        this.actionObj.pageY = pages.pageY;
        this.updateScrollPosition(e);
        this.updateResizingDirection(e);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var resizeArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            startTime: this.actionObj.start,
            endTime: this.actionObj.end
        };
        this.parent.trigger(event.resizing, resizeArgs);
    };
    Resize.prototype.updateResizingDirection = function (e) {
        var resizeValidation = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                var leftStyles = this.getLeftRightStyles(e, true);
                for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
                    var cloneElement = _a[_i];
                    setStyleAttribute(cloneElement, leftStyles);
                    addClass([cloneElement], cls.LEFT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(!this.parent.enableRtl);
        }
        if (this.resizeEdges.right) {
            if (resizeValidation) {
                var rightStyles = this.getLeftRightStyles(e, false);
                for (var _b = 0, _c = this.actionObj.cloneElement; _b < _c.length; _b++) {
                    var cloneElement = _c[_b];
                    setStyleAttribute(cloneElement, rightStyles);
                    addClass([cloneElement], cls.RIGHT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(this.parent.enableRtl);
        }
        if (this.resizeEdges.top) {
            if (resizeValidation) {
                var topStyles = this.getTopBottomStyles(e, true);
                for (var _d = 0, _e = this.actionObj.cloneElement; _d < _e.length; _d++) {
                    var cloneElement = _e[_d];
                    setStyleAttribute(cloneElement, topStyles);
                    addClass([cloneElement], cls.TOP_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(true);
        }
        if (this.resizeEdges.bottom) {
            if (resizeValidation) {
                var bottomStyles = this.getTopBottomStyles(e, false);
                for (var _f = 0, _g = this.actionObj.cloneElement; _f < _g.length; _f++) {
                    var cloneElement = _g[_f];
                    setStyleAttribute(cloneElement, bottomStyles);
                    addClass([cloneElement], cls.BOTTOM_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(false);
        }
    };
    Resize.prototype.resizeStop = function (e) {
        EventHandler.remove(document, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeStop);
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.removeCloneElement();
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        var resizeArgs = { cancel: false, data: this.getChangedData(), element: this.actionObj.element, event: e };
        this.parent.trigger(event.resizeStop, resizeArgs);
        if (resizeArgs.cancel) {
            return;
        }
        this.saveChangedData(resizeArgs);
    };
    Resize.prototype.verticalResizing = function (isTop) {
        var offsetValue = this.actionObj.clone.offsetTop;
        if (!isTop) {
            offsetValue += this.actionObj.clone.offsetHeight;
        }
        var minutes = (offsetValue / this.actionObj.cellHeight) * this.actionObj.slotInterval;
        var resizeTime = util.resetTime(new Date(parseInt(this.actionObj.clone.offsetParent.getAttribute('data-date'), 10)));
        resizeTime.setHours(this.parent.activeView.getStartHour().getHours());
        resizeTime.setMinutes(minutes);
        if (isTop) {
            this.actionObj.start = this.calculateIntervalTime(resizeTime);
        }
        else {
            this.actionObj.end = this.calculateIntervalTime(resizeTime);
        }
        this.updateTimePosition(resizeTime);
    };
    Resize.prototype.horizontalResizing = function (isLeft) {
        var eventStart = new Date(this.actionObj.event[this.parent.eventFields.startTime].getTime());
        var eventEnd = new Date(this.actionObj.event[this.parent.eventFields.endTime].getTime());
        var resizeTime;
        if (this.parent.activeView.isTimelineView()) {
            var tr = this.parent.getContentTable().querySelector('tr');
            var headerName = this.parent.currentView;
            if (this.parent.activeViewOptions.headerRows.length > 0) {
                var rows = this.parent.activeViewOptions.headerRows.map(function (row) { return row.option; });
                headerName = rows.slice(-1)[0];
                if (this.parent.currentView === 'TimelineMonth' && headerName === 'Hour') {
                    headerName = rows.slice(-2)[0] || 'Month';
                }
            }
            resizeTime = isLeft ? eventStart : eventEnd;
            var cellIndex = 0;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                var noOfDays_2 = 0;
                var tdCollections = [].slice.call(tr.childNodes);
                tdCollections.forEach(function (td) { return noOfDays_2 += parseInt(td.getAttribute('colspan'), 10); });
                var offsetValue = this.parent.enableRtl ? parseInt(this.actionObj.clone.style.right, 10) :
                    parseInt(this.actionObj.clone.style.left, 10);
                if (!isLeft) {
                    offsetValue += (this.actionObj.clone.offsetWidth - this.actionObj.cellWidth);
                }
                cellIndex = Math.floor(offsetValue / (tr.offsetWidth / noOfDays_2));
                cellIndex = (cellIndex < 0) ? 0 : (cellIndex >= noOfDays_2) ? noOfDays_2 - 1 : cellIndex;
            }
            else {
                var cellWidth = this.parent.currentView === 'TimelineMonth' || !this.parent.activeViewOptions.timeScale.enable ?
                    this.actionObj.cellWidth : 0;
                cellIndex = isLeft ? Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth) :
                    Math.ceil((this.actionObj.clone.offsetLeft + (this.actionObj.clone.offsetWidth - cellWidth)) /
                        this.actionObj.cellWidth);
                if (this.parent.enableRtl) {
                    var cellOffsetWidth = 0;
                    if (headerName === 'TimelineMonth' || (!this.parent.activeViewOptions.timeScale.enable &&
                        this.parent.currentView !== 'TimelineMonth')) {
                        cellOffsetWidth = this.actionObj.cellWidth;
                    }
                    var offsetWidth = (Math.floor(parseInt(this.actionObj.clone.style.right, 10) / this.actionObj.cellWidth) *
                        this.actionObj.cellWidth) + (isLeft ? 0 : this.actionObj.clone.offsetWidth - cellOffsetWidth);
                    cellIndex = Math.ceil(offsetWidth / this.actionObj.cellWidth);
                }
                cellIndex = this.getIndex(cellIndex);
            }
            var resizeDate = void 0;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                resizeDate = new Date(this.parent.activeView.renderDates[cellIndex].getTime());
            }
            else {
                resizeDate = new Date(parseInt(tr.childNodes.item(cellIndex).getAttribute('data-date'), 10));
            }
            if (['TimelineMonth', 'Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1 ||
                !this.parent.activeViewOptions.timeScale.enable) {
                resizeTime = new Date(resizeDate.setHours(resizeTime.getHours(), resizeTime.getMinutes(), resizeTime.getSeconds()));
            }
            else {
                var offsetValue = this.parent.enableRtl ? parseFloat(this.actionObj.clone.style.right) :
                    parseFloat(this.actionObj.clone.style.left);
                if (!isLeft) {
                    offsetValue += this.actionObj.clone.offsetWidth;
                }
                var spanMinutes = Math.ceil((this.actionObj.slotInterval / this.actionObj.cellWidth) *
                    (offsetValue - Math.floor(offsetValue / this.actionObj.cellWidth) * this.actionObj.cellWidth));
                resizeTime = new Date(resizeDate.getTime());
                resizeTime.setMinutes(resizeTime.getMinutes() + spanMinutes);
                this.updateTimePosition(resizeTime);
            }
        }
        else {
            var cloneIndex = closest(this.actionObj.clone, 'td').cellIndex;
            var originalWidth = Math.ceil((isLeft ? this.actionObj.element.offsetWidth : 0) / this.actionObj.cellWidth) *
                this.actionObj.cellWidth;
            var noOfDays = Math.ceil((this.actionObj.clone.offsetWidth - originalWidth) / this.actionObj.cellWidth);
            var tr = closest(this.actionObj.clone, 'tr');
            var dayIndex = isLeft ? cloneIndex - noOfDays : cloneIndex + noOfDays - 1;
            dayIndex = this.getIndex(dayIndex);
            resizeTime = new Date(parseInt(tr.childNodes.item(dayIndex).getAttribute('data-date'), 10));
            if (isLeft) {
                resizeTime.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            }
            else {
                resizeTime.setHours(eventEnd.getHours(), eventEnd.getMinutes(), eventEnd.getSeconds());
            }
        }
        if (isLeft) {
            this.actionObj.start = this.parent.activeViewOptions.timeScale.enable ? this.calculateIntervalTime(resizeTime) : resizeTime;
        }
        else {
            var resizeEnd = (this.actionObj.event[this.parent.eventFields.isAllDay] && resizeTime.getHours() === 0 &&
                resizeTime.getMinutes() === 0) ? util.addDays(resizeTime, 1) : resizeTime;
            this.actionObj.end = this.parent.activeViewOptions.timeScale.enable && this.parent.currentView !== 'Month' ?
                this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    };
    Resize.prototype.getTopBottomStyles = function (e, isTop) {
        var viewElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var slotInterval = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        var clnHeight = isTop ? this.actionObj.element.offsetHeight + (this.actionObj.Y - this.actionObj.pageY) :
            this.actionObj.element.offsetHeight + (this.actionObj.pageY - this.actionObj.Y);
        var clnTop = isTop ? this.actionObj.element.offsetTop -
            (this.actionObj.Y - this.actionObj.pageY) : this.actionObj.clone.offsetTop;
        clnHeight = (clnTop < 0) ? this.actionObj.clone.offsetHeight :
            (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) > this.scrollArgs.height ?
                this.actionObj.clone.offsetHeight : clnHeight;
        clnTop = (clnTop < 0) ? 0 : clnTop;
        clnTop = Math.floor(clnTop / slotInterval) * slotInterval;
        clnHeight = clnTop + clnHeight >= viewElement.scrollHeight ? viewElement.scrollHeight - clnTop :
            Math.ceil(clnHeight / slotInterval) * slotInterval;
        var styles = {
            height: formatUnit(clnHeight < this.actionObj.cellHeight ? this.actionObj.cellHeight : clnHeight),
            top: formatUnit((clnHeight < this.actionObj.cellHeight && isTop) ? this.actionObj.clone.offsetTop : clnTop),
            left: '0px', right: '0px', width: '100%'
        };
        return styles;
    };
    Resize.prototype.getLeftRightStyles = function (e, isLeft) {
        var styles = {};
        var isTimelineView = this.parent.activeView.isTimelineView();
        var isTimeViews = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > 0 &&
            this.parent.activeViewOptions.timeScale.enable;
        var slotInterval = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
        var pageWidth = isLeft ? (this.actionObj.X - this.actionObj.pageX) : (this.actionObj.pageX - this.actionObj.X);
        var targetWidth = isTimelineView ?
            (this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth :
            this.parent.currentView === 'Month' ? this.actionObj.element.offsetWidth :
                Math.ceil(this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        var offsetWidth = targetWidth + (Math.ceil(pageWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth);
        if (isTimeViews) {
            offsetWidth = targetWidth + (Math.ceil(pageWidth / slotInterval) * slotInterval);
            this.actionObj.event[this.parent.eventFields.isAllDay] = false;
        }
        styles.width = formatUnit((offsetWidth < this.actionObj.cellWidth) ? this.actionObj.cellWidth : offsetWidth);
        if (this.parent.enableRtl) {
            var rightValue = isTimelineView ?
                Math.floor(parseInt(this.actionObj.element.style.right, 10) / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                -(offsetWidth - this.actionObj.cellWidth);
            rightValue = isTimelineView ? rightValue : isLeft ? 0 : rightValue > 0 ? 0 : rightValue;
            if (isTimelineView && !isLeft) {
                rightValue = Math.ceil((this.actionObj.element.offsetLeft + (this.actionObj.element.offsetWidth +
                    (this.actionObj.pageX - this.actionObj.X))) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
                rightValue = rightValue < 0 ? Math.abs(rightValue) : -rightValue;
            }
            styles.right = formatUnit(rightValue);
        }
        else {
            var offsetLeft = isLeft ? this.actionObj.element.offsetLeft - (this.actionObj.X - this.actionObj.pageX) :
                this.parent.enableRtl ? this.actionObj.element.offsetLeft : 0;
            if (isTimelineView) {
                offsetLeft = isLeft ? offsetLeft : parseInt(this.actionObj.clone.style.left, 10);
                if (this.parent.enableRtl) {
                    offsetLeft = !isLeft ? (this.actionObj.pageX < this.actionObj.X - this.actionObj.clone.offsetWidth) ?
                        parseInt(this.actionObj.clone.style.right, 10) : offsetLeft : offsetLeft;
                }
                else {
                    offsetLeft = isLeft ? (this.actionObj.pageX > this.actionObj.X + this.actionObj.clone.offsetWidth &&
                        this.actionObj.clone.offsetWidth === this.actionObj.cellWidth) ?
                        parseInt(this.actionObj.clone.style.left, 10) : offsetLeft : offsetLeft;
                }
            }
            var leftValue = offsetLeft;
            offsetLeft = isTimelineView ? isTimeViews ? isLeft ? Math.floor(offsetLeft / slotInterval) * slotInterval : offsetLeft :
                Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                Math.ceil(Math.abs(offsetLeft) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            var cloneWidth = Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (isLeft) {
                styles.left = formatUnit(isTimelineView ? offsetLeft : isLeft ? leftValue < 0 ? -offsetLeft :
                    (Math.ceil((targetWidth - cloneWidth) / this.actionObj.cellWidth) * this.actionObj.cellWidth) : offsetLeft);
            }
        }
        return styles;
    };
    Resize.prototype.resizeValidation = function (e) {
        var pages = this.getPageCoordinates(e);
        var viewDimension = this.getContentAreaDimension();
        var resizeValidation = false;
        if (this.resizeEdges.left) {
            resizeValidation = (pages.pageX - this.actionObj.cellWidth) >= viewDimension.left;
        }
        if (this.resizeEdges.right) {
            resizeValidation = (pages.pageX + this.actionObj.cellWidth) <= viewDimension.right;
        }
        if (this.resizeEdges.top) {
            resizeValidation = this.actionObj.clone.offsetTop >= viewDimension.top;
        }
        if (this.resizeEdges.bottom) {
            resizeValidation = (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) <= this.scrollArgs.height;
        }
        return resizeValidation;
    };
    /**
     * Get module name.
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    return Resize;
}(ActionBase));
export { Resize };
