import { addClass, removeClass, Touch, remove, EventHandler, Browser } from '-syncfusion/ej2-base';
import { closest, isNullOrUndefined } from '-syncfusion/ej2-base';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * `touch` module is used to handle touch interactions.
 */
var ScheduleTouch = /** @class */ (function () {
    function ScheduleTouch(parent) {
        this.parent = parent;
        this.element = this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS);
        this.touchObj = new Touch(this.element, {
            scroll: this.scrollHandler.bind(this),
            swipe: this.swipeHandler.bind(this),
            tapHold: this.tapHoldHandler.bind(this),
            swipeSettings: { swipeThresholdDistance: 1 }
        });
        EventHandler.add(this.element, 'transitionend', this.onTransitionEnd, this);
        this.touchLeftDirection = this.parent.enableRtl ? 'Right' : 'Left';
        this.touchRightDirection = this.parent.enableRtl ? 'Left' : 'Right';
    }
    ScheduleTouch.prototype.scrollHandler = function (e) {
        if (this.parent.currentView === 'Agenda' || this.parent.uiStateValues.action ||
            (e.originalEvent && (e.originalEvent.target.classList.contains(cls.APPOINTMENT_CLASS) ||
                closest(e.originalEvent.target, '.' + cls.APPOINTMENT_CLASS)))) {
            return;
        }
        if (!this.timeStampStart) {
            this.timeStampStart = Date.now();
        }
        if (this.element.classList.contains(cls.TRANSLATE_CLASS)) {
            this.onTransitionEnd();
        }
        if (e.scrollDirection === 'Left' || e.scrollDirection === 'Right') {
            var args = { requestType: 'dateNavigate', cancel: false, event: e.originalEvent };
            this.parent.trigger(events.actionBegin, args);
            if (args.cancel) {
                return;
            }
            var scrollDiv = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            if (scrollDiv && scrollDiv.scrollWidth > scrollDiv.clientWidth) {
                return;
            }
            else {
                this.isScrollTriggered = true;
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
            }
        }
        if (e.scrollDirection === this.touchLeftDirection) {
            if (!this.nextPanel) {
                this.renderPanel(cls.NEXT_PANEL_CLASS, 'next');
                this.nextPanel = {
                    element: this.parent.activeView.getPanel(),
                    selectedDate: new Date(this.parent.selectedDate.getTime())
                };
                this.setDimensions(this.nextPanel.element);
            }
            var x = this.parent.enableRtl ? e.distanceX : -e.distanceX;
            this.element.style.transform = 'translatex(' + (this.getTranslateX(this.element) + x) + 'px)';
        }
        else if (e.scrollDirection === this.touchRightDirection) {
            var prevWidth = 0;
            if (!this.previousPanel) {
                this.renderPanel(cls.PREVIOUS_PANEL_CLASS, 'previous');
                this.previousPanel = {
                    element: this.parent.activeView.getPanel(),
                    selectedDate: new Date(this.parent.selectedDate.getTime())
                };
                this.setDimensions(this.previousPanel.element);
                prevWidth = this.previousPanel.element.offsetWidth;
            }
            var x = this.parent.enableRtl ? prevWidth - e.distanceX : -prevWidth + e.distanceX;
            this.element.style.transform = 'translatex(' + (this.getTranslateX(this.element) + x) + 'px)';
        }
    };
    ScheduleTouch.prototype.swipeHandler = function (e) {
        if (!this.isScrollTriggered || this.parent.uiStateValues.action) {
            return;
        }
        this.isScrollTriggered = false;
        if (e.swipeDirection === 'Left' || e.swipeDirection === 'Right') {
            var time = Date.now() - this.timeStampStart;
            var offsetDist = (e.distanceX * (Browser.isDevice ? 6 : 1.66));
            if (offsetDist > time || (e.distanceX > (this.parent.element.offsetWidth / 2))) {
                this.swapPanels(e.swipeDirection);
                if (offsetDist > time && (e.distanceX > (this.parent.element.offsetWidth / 2))) {
                    this.element.style.transitionDuration = ((offsetDist / time) / 10) + 's';
                }
                this.confirmSwipe(e.swipeDirection);
            }
            else {
                this.cancelSwipe();
            }
            var args = { requestType: 'dateNavigate', cancel: false, event: e.originalEvent };
            this.parent.trigger(events.actionComplete, args);
        }
        else {
            this.cancelSwipe();
        }
        this.timeStampStart = null;
    };
    ScheduleTouch.prototype.tapHoldHandler = function (e) {
        var target = closest(e.originalEvent.target, '.' + cls.APPOINTMENT_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            this.parent.quickPopup.tapHoldEventPopup(e.originalEvent);
            return;
        }
    };
    ScheduleTouch.prototype.renderPanel = function (clsName, nextPrevType) {
        if (!this.currentPanel) {
            this.currentPanel = {
                element: this.parent.activeView.getPanel(),
                selectedDate: new Date(this.parent.selectedDate.getTime())
            };
            this.setDimensions(this.currentPanel.element);
        }
        else {
            this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        }
        this.parent.setProperties({ selectedDate: this.parent.activeView.getNextPreviousDate(nextPrevType) }, true);
        this.parent.activeView.getRenderDates();
        this.parent.activeView.renderLayout(clsName);
    };
    ScheduleTouch.prototype.swapPanels = function (direction) {
        if (direction === this.touchLeftDirection) {
            var temp = this.nextPanel;
            this.nextPanel = this.currentPanel;
            this.currentPanel = temp;
        }
        else {
            var temp = this.previousPanel;
            this.previousPanel = this.currentPanel;
            this.currentPanel = temp;
        }
    };
    ScheduleTouch.prototype.confirmSwipe = function (swipeDirection) {
        var previousDate = swipeDirection === this.touchLeftDirection ? this.nextPanel.selectedDate : this.previousPanel.selectedDate;
        var navArgs = {
            action: 'date', cancel: false, previousDate: previousDate, currentDate: this.currentPanel.selectedDate
        };
        this.parent.trigger(events.navigating, navArgs);
        if (navArgs.cancel) {
            this.swapPanels(swipeDirection);
            this.cancelSwipe();
            return;
        }
        this.parent.activeView.setPanel(this.currentPanel.element);
        this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        var translateX;
        if (this.parent.enableRtl) {
            translateX = swipeDirection === this.touchLeftDirection ?
                (this.previousPanel ? this.previousPanel.element.offsetLeft : this.currentPanel.element.offsetWidth) : 0;
        }
        else {
            translateX = swipeDirection === this.touchLeftDirection ? -this.currentPanel.element.offsetLeft : 0;
        }
        addClass([this.element], cls.TRANSLATE_CLASS);
        this.element.style.transform = 'translatex(' + (translateX) + 'px)';
        if (this.parent.headerModule) {
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
        }
        this.parent.renderModule.refreshDataManager();
    };
    ScheduleTouch.prototype.cancelSwipe = function () {
        this.parent.activeView.setPanel(this.currentPanel.element);
        this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        this.parent.activeView.getRenderDates();
        this.parent.activeView.generateColumnLevels();
        addClass([this.element], cls.TRANSLATE_CLASS);
        var prevWidth = this.previousPanel ? this.previousPanel.element.offsetWidth : 0;
        this.element.style.transform = 'translatex(' + (this.parent.enableRtl ? prevWidth : -this.currentPanel.element.offsetLeft) + 'px)';
    };
    ScheduleTouch.prototype.onTransitionEnd = function () {
        removeClass([this.element], cls.TRANSLATE_CLASS);
        this.element.style.transitionDuration = '';
        this.element.style.transform = '';
        if (this.previousPanel) {
            remove(this.previousPanel.element);
            this.previousPanel = null;
            removeClass([this.currentPanel.element], cls.PREVIOUS_PANEL_CLASS);
            addClass([this.currentPanel.element], cls.CURRENT_PANEL_CLASS);
        }
        if (this.nextPanel) {
            remove(this.nextPanel.element);
            this.nextPanel = null;
            removeClass([this.currentPanel.element], cls.NEXT_PANEL_CLASS);
            addClass([this.currentPanel.element], cls.CURRENT_PANEL_CLASS);
        }
        this.currentPanel = null;
        this.parent.activeView.getPanel().style.width = '';
    };
    ScheduleTouch.prototype.getTranslateX = function (element) {
        var style = window.getComputedStyle(element);
        return new WebKitCSSMatrix(style.webkitTransform).m41;
    };
    ScheduleTouch.prototype.setDimensions = function (element) {
        element.style.width = (this.parent.element.clientWidth) + 'px';
    };
    ScheduleTouch.prototype.resetValues = function () {
        this.currentPanel = null;
        this.previousPanel = null;
        this.nextPanel = null;
        this.timeStampStart = null;
        this.element.style.transform = '';
        this.element.innerHTML = '';
        removeClass([this.element], cls.TRANSLATE_CLASS);
    };
    /**
     * @hidden
     */
    ScheduleTouch.prototype.destroy = function () {
        this.touchObj.destroy();
        EventHandler.remove(this.element, 'transitionend', this.onTransitionEnd);
        this.resetValues();
    };
    return ScheduleTouch;
}());
export { ScheduleTouch };
