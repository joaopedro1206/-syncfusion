import { isNullOrUndefined, append, createElement } from '-syncfusion/ej2-base';
import { Tooltip } from '-syncfusion/ej2-popups';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
/**
 * Tooltip for Schedule
 */
var EventTooltip = /** @class */ (function () {
    function EventTooltip(parent) {
        this.parent = parent;
        this.tooltipObj = new Tooltip({
            content: 'No title',
            position: 'BottomRight',
            offsetY: 10,
            mouseTrail: this.parent.isAdaptive ? false : true,
            showTipPointer: false,
            cssClass: this.parent.cssClass + ' ' + cls.EVENT_TOOLTIP_ROOT_CLASS,
            target: this.getTargets(),
            beforeRender: this.onBeforeRender.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.tooltipObj.appendTo(this.parent.element);
    }
    EventTooltip.prototype.getTargets = function () {
        var targets = [];
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            targets.push('.' + cls.RESOURCE_CELLS_CLASS);
        }
        if (this.parent.eventSettings.enableTooltip) {
            targets.push('.' + cls.APPOINTMENT_CLASS);
        }
        return targets.join(',');
    };
    EventTooltip.prototype.onBeforeRender = function (args) {
        if (!isNullOrUndefined(args.target.getAttribute('data-tooltip-id'))) {
            return;
        }
        if (args.target.classList.contains(cls.RESOURCE_CELLS_CLASS) && this.parent.activeViewOptions.group.resources.length > 0) {
            var resCollection = void 0;
            if (this.parent.activeView.isTimelineView()) {
                var index = parseInt(args.target.getAttribute('data-group-index'), 0);
                resCollection = this.parent.resourceBase.lastResourceLevel[index];
            }
            else {
                var rowIndex = args.target.parentNode.sectionRowIndex;
                var cellIndex = args.target.cellIndex;
                resCollection = this.parent.activeView.getColumnLevels()[rowIndex][cellIndex];
            }
            var data = {
                resource: resCollection.resource,
                resourceData: resCollection.resourceData
            };
            var contentContainer = createElement('div');
            append(this.parent.getHeaderTooltipTemplate()(data), contentContainer);
            this.setContent(contentContainer);
            return;
        }
        var record = this.parent.eventBase.getEventByGuid(args.target.getAttribute('data-guid'));
        if (!isNullOrUndefined(this.parent.eventSettings.tooltipTemplate)) {
            var contentContainer = createElement('div');
            append(this.parent.getEventTooltipTemplate()(record), contentContainer);
            this.setContent(contentContainer);
        }
        else {
            var globalize = this.parent.globalize;
            var fields = this.parent.eventFields;
            var eventStart = new Date('' + record[fields.startTime]);
            var eventEnd = new Date('' + record[fields.endTime]);
            eventEnd = (eventEnd.getHours() === 0 && eventEnd.getMinutes() === 0) ? new Date(eventEnd.setMilliseconds(-1000)) : eventEnd;
            var startDate = util.resetTime(new Date('' + eventStart));
            var endDate = util.resetTime(new Date('' + eventEnd));
            var tooltipSubject = (record[fields.subject] || this.parent.eventSettings.fields.subject.default);
            var tooltipLocation = !isNullOrUndefined(record[fields.location]) ? record[fields.location] : '';
            var startMonthDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'MMMd', calendar: this.parent.getCalendarMode()
            });
            var startMonthYearDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            var endMonthYearDate = globalize.formatDate(eventEnd, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            var startTime = globalize.formatDate(eventStart, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            var endTime = globalize.formatDate(eventEnd, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            var tooltipDetails = void 0;
            if (startDate.getTime() === endDate.getTime()) {
                tooltipDetails = globalize.formatDate(eventStart, {
                    type: 'date', skeleton: 'long', calendar: this.parent.getCalendarMode()
                });
            }
            else {
                tooltipDetails = (startDate.getFullYear() === endDate.getFullYear()) ? (startMonthDate + ' - ' + endMonthYearDate) :
                    (startMonthYearDate + ' - ' + endMonthYearDate);
            }
            var tooltipTime = (record[fields.isAllDay]) ? this.parent.localeObj.getConstant('allDay') :
                (startTime + ' - ' + endTime);
            var content = '<div><div class="e-subject">' + tooltipSubject + '</div>' +
                '<div class="e-location">' + tooltipLocation + '</div>' +
                '<div class="e-details">' + tooltipDetails + '</div>' +
                '<div class="e-all-day">' + tooltipTime + '</div></div>';
            this.setContent(content);
        }
    };
    EventTooltip.prototype.setContent = function (content) {
        this.tooltipObj.setProperties({ content: content }, true);
    };
    EventTooltip.prototype.close = function () {
        this.tooltipObj.close();
    };
    /**
     * To destroy the event tooltip.
     * @return {void}
     * @private
     */
    EventTooltip.prototype.destroy = function () {
        this.tooltipObj.destroy();
        this.tooltipObj = null;
    };
    return EventTooltip;
}());
export { EventTooltip };
