import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, HijriParser, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, cldrData, closest, compile, createElement, extend, formatUnit, getDefaultDateObject, getValue, isNullOrUndefined, prepend, remove, removeClass, setStyleAttribute, uniqueID } from '-syncfusion/ej2-base';
import { Dialog, Popup, Tooltip, createSpinner, hideSpinner, isCollide, showSpinner } from '-syncfusion/ej2-popups';
import { Toolbar, TreeView } from '-syncfusion/ej2-navigations';
import { Calendar, DatePicker, DateTimePicker } from '-syncfusion/ej2-calendars';
import { DataManager, Predicate, Query } from '-syncfusion/ej2-data';
import { Button, CheckBox, RadioButton } from '-syncfusion/ej2-buttons';
import { FormValidator, Input, NumericTextBox } from '-syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '-syncfusion/ej2-dropdowns';
import { ListBase } from '-syncfusion/ej2-lists';

/**
 * Constants
 */
/** @hidden */
var cellClick = 'cellClick';
/** @hidden */
var cellDoubleClick = 'cellDoubleClick';
/** @hidden */
var actionBegin = 'actionBegin';
/** @hidden */
var actionComplete = 'actionComplete';
/** @hidden */
var actionFailure = 'actionFailure';
/** @hidden */
var navigating = 'navigating';
/** @hidden */
var renderCell = 'renderCell';
/** @hidden */
var eventClick = 'eventClick';
/** @hidden */
var eventRendered = 'eventRendered';
/** @hidden */
var dataBinding = 'dataBinding';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var popupOpen = 'popupOpen';
/** @hidden */
var dragStart = 'dragStart';
/** @hidden */
var drag = 'drag';
/** @hidden */
var dragStop = 'dragStop';
/** @hidden */
var resizeStart = 'resizeStart';
/** @hidden */
var resizing = 'resizing';
/** @hidden */
var resizeStop = 'resizeStop';
/**
 * Specifies schedule internal events
 */
/** @hidden */
var initialLoad = 'initial-load';
/** @hidden */
var initialEnd = 'initial-end';
/** @hidden */
var dataReady = 'data-ready';
/** @hidden */
var contentReady = 'content-ready';
/** @hidden */
var scroll = 'scroll';
/** @hidden */
var virtualScroll = 'virtual-scroll';
/** @hidden */
var scrollUiUpdate = 'scroll-ui-update';
/** @hidden */
var uiUpdate = 'ui-update';
/** @hidden */
var documentClick = 'document-click';
/** @hidden */
var cellMouseDown = 'cell-mouse-down';

/**
 * Schedule common utilities
 */
var WEEK_LENGTH = 7;
var MS_PER_DAY = 86400000;
var MS_PER_MINUTE = 60000;
function getElementHeightFromClass(container, elementClass) {
    var height = 0;
    var el = createElement('div', { className: elementClass }).cloneNode();
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getOuterHeight(el);
    remove(el);
    return height;
}
function getTranslateY(element) {
    var style = getComputedStyle(element);
    return window.WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}
function getWeekFirstDate(date1, firstDayOfWeek) {
    var date = new Date(date1.getTime());
    firstDayOfWeek = (firstDayOfWeek - date.getDay() + 7 * (-1)) % 7;
    return new Date(date.setDate(date.getDate() + firstDayOfWeek));
}
function firstDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
}
function lastDateOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
}
function getWeekNumber(dt) {
    var currentDate = new Date('' + dt).valueOf();
    var date = new Date(dt.getFullYear(), 0, 1).valueOf();
    var a = (currentDate - date);
    return Math.ceil((((a) / MS_PER_DAY) + new Date(date).getDay() + 1) / 7);
}
function setTime(date, time) {
    var tzOffsetBefore = date.getTimezoneOffset();
    var d = new Date(date.getTime() + time);
    var tzOffsetDiff = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}
function resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
}
function getDateInMs(date) {
    return date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
}
function addDays(date, i) {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + i));
}
function addMonths(date, i) {
    date = new Date('' + date);
    var day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
function addYears(date, i) {
    date = new Date('' + date);
    var day = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
function getStartEndHours(date, startHour, endHour) {
    var date1 = new Date(date.getTime());
    date1.setHours(startHour.getHours());
    date1.setMinutes(startHour.getMinutes());
    date1.setSeconds(startHour.getSeconds());
    var date2 = new Date(date.getTime());
    if (endHour.getHours() === 0) {
        date2 = addDays(date2, 1);
    }
    else {
        date2.setHours(endHour.getHours());
        date2.setMinutes(endHour.getMinutes());
        date2.setSeconds(endHour.getSeconds());
    }
    return { startHour: date1, endHour: date2 };
}
function getMaxDays(d) {
    var date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
}
function getDaysCount(startDate, endDate) {
    var strTime = resetTime(new Date(startDate));
    var endTime = resetTime(new Date(endDate));
    return (endTime.getTime() - strTime.getTime()) / MS_PER_DAY;
}
function getDateFromString(date) {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}
/** @hidden */
var scrollWidth = null;
/** @hidden */
function getScrollBarWidth() {
    if (scrollWidth !== null) {
        return scrollWidth;
    }
    var divNode = createElement('div');
    var value = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}
function findIndexInData(data, property, value) {
    for (var i = 0, length_1 = data.length; i < length_1; i++) {
        if (data[i][property] === value) {
            return i;
        }
    }
    return -1;
}
function getOuterHeight(element) {
    var style = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}

/**
 * CSS Constants
 */
/** @hidden */
var ROOT = 'e-schedule';
/** @hidden */
var RTL = 'e-rtl';
/** @hidden */
var DEVICE_CLASS = 'e-device';
/** @hidden */
var ICON = 'e-icons';
/** @hidden */
var ENABLE_CLASS = 'e-enable';
/** @hidden */
var DISABLE_CLASS = 'e-disable';
/** @hidden */
var TABLE_CONTAINER_CLASS = 'e-table-container';
/** @hidden */
var SCHEDULE_TABLE_CLASS = 'e-schedule-table';
/** @hidden */
var ALLDAY_CELLS_CLASS = 'e-all-day-cells';
/** @hidden */
var HEADER_POPUP_CLASS = 'e-header-popup';
/** @hidden */
var HEADER_CALENDAR_CLASS = 'e-header-calendar';
/** @hidden */
var ALLDAY_ROW_CLASS = 'e-all-day-row';
/** @hidden */
var CONTENT_TABLE_CLASS = 'e-content-table';
/** @hidden */
var WORK_CELLS_CLASS = 'e-work-cells';
/** @hidden */
var WORK_HOURS_CLASS = 'e-work-hours';
/** @hidden */
var POPUP_OPEN = 'e-popup-open';
/** @hidden */
var DATE_HEADER_WRAP_CLASS = 'e-date-header-wrap';
/** @hidden */
var DATE_HEADER_CONTAINER_CLASS = 'e-date-header-container';
/** @hidden */
var HEADER_CELLS_CLASS = 'e-header-cells';
/** @hidden */
var WORKDAY_CLASS = 'e-work-days';
/** @hidden */
var OTHERMONTH_CLASS = 'e-other-month';
/** @hidden */
var CURRENT_DAY_CLASS = 'e-current-day';
/** @hidden */
var CURRENTDATE_CLASS = 'e-current-date';
/** @hidden */
var CURRENT_PANEL_CLASS = 'e-current-panel';
/** @hidden */
var PREVIOUS_PANEL_CLASS = 'e-previous-panel';
/** @hidden */
var NEXT_PANEL_CLASS = 'e-next-panel';
/** @hidden */
var TRANSLATE_CLASS = 'e-translate';
/** @hidden */
var LEFT_INDENT_CLASS = 'e-left-indent';
/** @hidden */
var LEFT_INDENT_WRAP_CLASS = 'e-left-indent-wrap';
/** @hidden */
var EVENT_TABLE_CLASS = 'e-event-table';
/** @hidden */
var RESOURCE_LEFT_TD_CLASS = 'e-resource-left-td';
/** @hidden */
var RESOURCE_GROUP_CELLS_CLASS = 'e-resource-group-cells';
/** @hidden */
var RESOURCE_TEXT_CLASS = 'e-resource-text';
/** @hidden */
var RESOURCE_COLUMN_WRAP_CLASS = 'e-resource-column-wrap';
/** @hidden */
var RESOURCE_COLUMN_TABLE_CLASS = 'e-resource-column-table';
/** @hidden */
var RESOURCE_CHILD_CLASS = 'e-child-node';
/** @hidden */
var RESOURCE_PARENT_CLASS = 'e-parent-node';
/** @hidden */
var RESOURCE_EXPAND_CLASS = 'e-resource-expand';
/** @hidden */
var RESOURCE_COLLAPSE_CLASS = 'e-resource-collapse';
/** @hidden */
var RESOURCE_TREE_ICON_CLASS = 'e-resource-tree-icon';
/** @hidden */
var RESOURCE_CELLS_CLASS = 'e-resource-cells';
/** @hidden */
var TIME_CELLS_WRAP_CLASS = 'e-time-cells-wrap';
/** @hidden */
var TIME_CELLS_CLASS = 'e-time-cells';
/** @hidden */
var ALTERNATE_CELLS_CLASS = 'e-alternate-cells';
/** @hidden */
var CURRENT_TIME_CLASS = 'e-current-time';
/** @hidden */
var CURRENT_TIMELINE_CLASS = 'e-current-timeline';
/** @hidden */
var PREVIOUS_TIMELINE_CLASS = 'e-previous-timeline';
/** @hidden */
var HIDE_CHILDS_CLASS = 'e-hide-childs';
/** @hidden */
var SCROLL_CONTAINER_CLASS = 'e-scroll-container';
/** @hidden */

/** @hidden */
var TIMELINE_WRAPPER_CLASS = 'e-timeline-wrapper';
/** @hidden */
var APPOINTMENT_WRAPPER_CLASS = 'e-appointment-wrapper';
/** @hidden */
var DAY_WRAPPER_CLASS = 'e-day-wrapper';
/** @hidden */
var TOOLBAR_CONTAINER = 'e-schedule-toolbar-container';
/** @hidden */
var RESOURCE_TOOLBAR_CONTAINER = 'e-schedule-resource-toolbar-container';
/** @hidden */
var HEADER_TOOLBAR = 'e-schedule-toolbar';
/** @hidden */
var RESOURCE_HEADER_TOOLBAR = 'e-schedule-resource-toolbar';
/** @hidden */
var SELECTED_CELL_CLASS = 'e-selected-cell';
/** @hidden */
var WEEK_NUMBER_WRAPPER_CLASS = 'e-week-number-wrapper';
/** @hidden */
var WEEK_NUMBER_CLASS = 'e-week-number';
/** @hidden */
var APPOINTMENT_WRAP_CLASS = 'e-appointment-wrap';
/** @hidden */
var WRAPPER_CONTAINER_CLASS = 'e-wrapper-container';
/** @hidden */
var APPOINTMENT_CONTAINER_CLASS = 'e-appointment-container';
/** @hidden */
var APPOINTMENT_CLASS = 'e-appointment';
/** @hidden */
var BLOCK_APPOINTMENT_CLASS = 'e-block-appointment';
/** @hidden */
var BLOCK_INDICATOR_CLASS = 'e-block-indicator';
/** @hidden */
var APPOINTMENT_BORDER = 'e-appointment-border';
/** @hidden */
var APPOINTMENT_DETAILS = 'e-appointment-details';
/** @hidden */
var SUBJECT_WRAP = 'e-subject-wrap';
/** @hidden */
var RESOURCE_NAME = 'e-resource-name';
/** @hidden */
var APPOINTMENT_TIME = 'e-time';
/** @hidden */
var TABLE_WRAP_CLASS = 'e-table-wrap';
/** @hidden */
var OUTER_TABLE_CLASS = 'e-outer-table';
/** @hidden */
var CONTENT_WRAP_CLASS = 'e-content-wrap';
/** @hidden */
var VIRTUAL_TRACK_CLASS = 'e-virtual-track';
/** @hidden */
var AGENDA_CELLS_CLASS = 'e-agenda-cells';
/** @hidden */
var AGENDA_CURRENT_DAY_CLASS = 'e-current-day';
/** @hidden */
var AGENDA_SELECTED_CELL = 'e-active-appointment-agenda';
/** @hidden */
var AGENDA_MONTH_HEADER_CLASS = 'e-month-header';
/** @hidden */
var AGENDA_HEADER_CLASS = 'e-day-date-header';
/** @hidden */
var AGENDA_RESOURCE_CLASS = 'e-resource-column';
/** @hidden */
var AGENDA_DATE_CLASS = 'e-date-column';
/** @hidden */
var NAVIGATE_CLASS = 'e-navigate';
/** @hidden */
var DATE_HEADER_CLASS = 'e-date-header';
/** @hidden */
var AGENDA_DAY_BORDER_CLASS = 'e-day-border';
/** @hidden */
var DATE_BORDER_CLASS = 'e-date-border';
/** @hidden */
var AGENDA_DAY_PADDING_CLASS = 'e-day-padding';
/** @hidden */
var DATE_TIME_CLASS = 'e-date-time';
/** @hidden */
var DATE_TIME_WRAPPER_CLASS = 'e-date-time-wrapper';
/** @hidden */
var AGENDA_EMPTY_EVENT_CLASS = 'e-empty-event';
/** @hidden */
var AGENDA_NO_EVENT_CLASS = 'e-no-event';
/** @hidden */
var APPOINTMENT_INDICATOR_CLASS = 'e-appointment-indicator';
/** @hidden */
var EVENT_INDICATOR_CLASS = 'e-indicator';
/** @hidden */
var EVENT_ICON_UP_CLASS = 'e-up-icon';
/** @hidden */
var EVENT_ICON_DOWN_CLASS = 'e-down-icon';
/** @hidden */
var EVENT_ICON_LEFT_CLASS = 'e-left-icon';
/** @hidden */
var EVENT_ICON_RIGHT_CLASS = 'e-right-icon';
/** @hidden */
var EVENT_ACTION_CLASS = 'e-event-action';
/** @hidden */
var NEW_EVENT_CLASS = 'e-new-event';
/** @hidden */
var CLONE_ELEMENT_CLASS = 'e-schedule-event-clone';
/** @hidden */
var MONTH_CLONE_ELEMENT_CLASS = 'e-month-event';
/** @hidden */
var CLONE_TIME_INDICATOR_CLASS = 'e-clone-time-indicator';
/** @hidden */
var DRAG_CLONE_CLASS = 'e-drag-clone';
/** @hidden */
var EVENT_RESIZE_CLASS = 'e-event-resize';
/** @hidden */
var RESIZE_CLONE_CLASS = 'e-resize-clone';
/** @hidden */
var LEFT_RESIZE_HANDLER = 'e-left-handler';
/** @hidden */
var RIGHT_RESIZE_HANDLER = 'e-right-handler';
/** @hidden */
var TOP_RESIZE_HANDLER = 'e-top-handler';
/** @hidden */
var BOTTOM_RESIZE_HANDLER = 'e-bottom-handler';
/** @hidden */
var EVENT_RECURRENCE_ICON_CLASS = 'e-recurrence-icon';
/** @hidden */
var EVENT_RECURRENCE_EDIT_ICON_CLASS = 'e-recurrence-edit-icon';
/** @hidden */
var HEADER_ROW_CLASS = 'e-header-row';
/** @hidden */
var ALLDAY_APPOINTMENT_WRAPPER_CLASS = 'e-all-day-appointment-wrapper';
/** @hidden */
var ALLDAY_APPOINTMENT_CLASS = 'e-all-day-appointment';
/** @hidden */
var EVENT_COUNT_CLASS = 'e-appointment-hide';
/** @hidden */
var ROW_COUNT_WRAPPER_CLASS = 'e-row-count-wrapper';
/** @hidden */
var ALLDAY_APPOINTMENT_SECTION_CLASS = 'e-all-day-appointment-section';
/** @hidden */
var APPOINTMENT_ROW_EXPAND_CLASS = 'e-appointment-expand';
/** @hidden */
var APPOINTMENT_ROW_COLLAPSE_CLASS = 'e-appointment-collapse';
/** @hidden */
var MORE_INDICATOR_CLASS = 'e-more-indicator';
/** @hidden */
var CELL_POPUP_CLASS = 'e-cell-popup';
/** @hidden */
var EVENT_POPUP_CLASS = 'e-event-popup';
/** @hidden */
var MULTIPLE_EVENT_POPUP_CLASS = 'e-multiple-event-popup';
/** @hidden */
var POPUP_HEADER_CLASS = 'e-popup-header';
/** @hidden */
var POPUP_HEADER_ICON_WRAPPER = 'e-header-icon-wrapper';
/** @hidden */
var POPUP_CONTENT_CLASS = 'e-popup-content';
/** @hidden */
var POPUP_FOOTER_CLASS = 'e-popup-footer';
/** @hidden */
var DATE_TIME_DETAILS_CLASS = 'e-date-time-details';
/** @hidden */
var RECURRENCE_SUMMARY_CLASS = 'e-recurrence-summary';
/** @hidden */
var QUICK_POPUP_EVENT_DETAILS_CLASS = 'e-event-details';
/** @hidden */
var EVENT_CREATE_CLASS = 'e-event-create';
/** @hidden */
var EDIT_EVENT_CLASS = 'e-event-edit';
/** @hidden */
var DELETE_EVENT_CLASS = 'e-event-delete';
/** @hidden */
var TEXT_ELLIPSIS = 'e-text-ellipsis';
/** @hidden */
var MORE_POPUP_WRAPPER_CLASS = 'e-more-popup-wrapper';
/** @hidden */
var MORE_EVENT_POPUP_CLASS = 'e-more-event-popup';
/** @hidden */
var MORE_EVENT_HEADER_CLASS = 'e-more-event-header';
/** @hidden */
var MORE_EVENT_DATE_HEADER_CLASS = 'e-more-event-date-header';
/** @hidden */
var MORE_EVENT_HEADER_DAY_CLASS = 'e-header-day';
/** @hidden */
var MORE_EVENT_HEADER_DATE_CLASS = 'e-header-date';
/** @hidden */
var MORE_EVENT_CLOSE_CLASS = 'e-more-event-close';
/** @hidden */
var MORE_EVENT_CONTENT_CLASS = 'e-more-event-content';
/** @hidden */
var MORE_EVENT_WRAPPER_CLASS = 'e-more-appointment-wrapper';
/** @hidden */
var QUICK_DIALOG_CLASS = 'e-quick-dialog';
/** @hidden */
var QUICK_DIALOG_EDIT_EVENT_CLASS = 'e-quick-dialog-edit-event';
/** @hidden */
var QUICK_DIALOG_EDIT_SERIES_CLASS = 'e-quick-dialog-edit-series';
/** @hidden */
var QUICK_DIALOG_DELETE_CLASS = 'e-quick-dialog-delete';
/** @hidden */
var QUICK_DIALOG_CANCEL_CLASS = 'e-quick-dialog-cancel';
/** @hidden */
var QUICK_DIALOG_ALERT_BTN_CLASS = 'e-quick-dialog-alert-btn';
/** @hidden */
var EVENT_WINDOW_DIALOG_CLASS = 'e-schedule-dialog';
/** @hidden */
var FORM_CONTAINER_CLASS = 'e-form-container';
/** @hidden */
var FORM_CLASS = 'e-schedule-form';
/** @hidden */
var EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS = 'e-all-day-time-zone-row';
/** @hidden */
var EVENT_WINDOW_ALL_DAY_CLASS = 'e-all-day';
/** @hidden */
var TIME_ZONE_CLASS = 'e-time-zone';
/** @hidden */
var TIME_ZONE_ICON_CLASS = 'e-time-zone-icon';
/** @hidden */
var TIME_ZONE_DETAILS_CLASS = 'e-time-zone-details';
/** @hidden */
var EVENT_WINDOW_REPEAT_DIV_CLASS = 'e-repeat-parent-row';
/** @hidden */
var EVENT_WINDOW_REPEAT_CLASS = 'e-repeat';
/** @hidden */
var EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS = 'e-title-location-row';
/** @hidden */
var SUBJECT_CLASS = 'e-subject';
/** @hidden */
var LOCATION_CLASS = 'e-location';
/** @hidden */
var LOCATION_ICON_CLASS = 'e-location-icon';
/** @hidden */
var LOCATION_DETAILS_CLASS = 'e-location-details';
/** @hidden */
var EVENT_WINDOW_START_END_DIV_CLASS = 'e-start-end-row';
/** @hidden */
var EVENT_WINDOW_START_CLASS = 'e-start';
/** @hidden */
var EVENT_WINDOW_END_CLASS = 'e-end';
/** @hidden */
var EVENT_WINDOW_RESOURCES_DIV_CLASS = 'e-resources-row';
/** @hidden */
var DESCRIPTION_CLASS = 'e-description';
/** @hidden */
var DESCRIPTION_ICON_CLASS = 'e-description-icon';
/** @hidden */
var DESCRIPTION_DETAILS_CLASS = 'e-description-details';
/** @hidden */
var EVENT_WINDOW_TIME_ZONE_DIV_CLASS = 'e-time-zone-row';
/** @hidden */
var EVENT_WINDOW_START_TZ_CLASS = 'e-start-time-zone';
/** @hidden */
var EVENT_WINDOW_END_TZ_CLASS = 'e-end-time-zone';
/** @hidden */
var EVENT_WINDOW_BACK_ICON_CLASS = 'e-back-icon';
/** @hidden */
var EVENT_WINDOW_SAVE_ICON_CLASS = 'e-save-icon';
/** @hidden */
var EVENT_WINDOW_DELETE_BUTTON_CLASS = 'e-event-delete';
/** @hidden */
var EVENT_WINDOW_CANCEL_BUTTON_CLASS = 'e-event-cancel';
/** @hidden */
var EVENT_WINDOW_SAVE_BUTTON_CLASS = 'e-event-save';
/** @hidden */
var EVENT_WINDOW_DIALOG_PARENT_CLASS = 'e-dialog-parent';
/** @hidden */
var EVENT_WINDOW_TITLE_TEXT_CLASS = 'e-title-text';
/** @hidden */
var EVENT_WINDOW_ICON_DISABLE_CLASS = 'e-icon-disable';
/** @hidden */
var EDIT_CLASS = 'e-edit';
/** @hidden */
var EDIT_ICON_CLASS = 'e-edit-icon';
/** @hidden */
var DELETE_CLASS = 'e-delete';
/** @hidden */
var DELETE_ICON_CLASS = 'e-delete-icon';
/** @hidden */
var CLOSE_CLASS = 'e-close';
/** @hidden */
var CLOSE_ICON_CLASS = 'e-close-icon';
/** @hidden */
var ERROR_VALIDATION_CLASS = 'e-schedule-error';
/** @hidden */
var EVENT_TOOLTIP_ROOT_CLASS = 'e-schedule-event-tooltip';
/** @hidden */
var ALLDAY_ROW_ANIMATE_CLASS = 'e-animate';
/** @hidden */
var TIMESCALE_DISABLE = 'e-timescale-disable';
/** @hidden */
var DISABLE_DATE = 'e-disable-date';
/** @hidden */
var HIDDEN_CLASS = 'e-hidden';
/** @hidden */
var POPUP_WRAPPER_CLASS = 'e-quick-popup-wrapper';
/** @hidden */
var POPUP_TABLE_CLASS = 'e-popup-table';
/** @hidden */
var RESOURCE_MENU = 'e-resource-menu';
/** @hidden */
var RESOURCE_MENU_ICON = 'e-icon-menu';
/** @hidden */
var RESOURCE_LEVEL_TITLE = 'e-resource-level-title';
/** @hidden */
var RESOURCE_TREE = 'e-resource-tree';
/** @hidden */
var RESOURCE_TREE_POPUP_OVERLAY = 'e-resource-tree-popup-overlay';
/** @hidden */
var RESOURCE_TREE_POPUP = 'e-resource-tree-popup';
/** @hidden */
var RESOURCE_CLASS = 'e-resource';
/** @hidden */
var RESOURCE_ICON_CLASS = 'e-resource-icon';
/** @hidden */
var RESOURCE_DETAILS_CLASS = 'e-resource-details';
/** @hidden */
var DATE_TIME_ICON_CLASS = 'e-date-time-icon';
/** @hidden */
var VIRTUAL_SCROLL_CLASS = 'e-virtual-scroll';
/** @hidden */
var ICON_DISABLE_CLASS = 'e-icon-disable';

/**
 * Header module
 */
var HeaderRenderer = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for render module
     */
    function HeaderRenderer(parent) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.renderHeader();
        this.addEventListener();
    }
    HeaderRenderer.prototype.addEventListener = function () {
        this.parent.on(documentClick, this.closeHeaderPopup, this);
    };
    HeaderRenderer.prototype.removeEventListener = function () {
        this.parent.off(documentClick, this.closeHeaderPopup);
    };
    HeaderRenderer.prototype.closeHeaderPopup = function (e) {
        var closestEle = closest(e.event.target, '.e-date-range,.e-header-popup,.e-day,.e-selected');
        if (!isNullOrUndefined(closestEle)) {
            return;
        }
        this.hideHeaderPopup();
    };
    /** @hidden */
    HeaderRenderer.prototype.hideHeaderPopup = function () {
        if (this.headerPopup) {
            this.headerPopup.hide();
        }
    };
    HeaderRenderer.prototype.renderHeader = function () {
        this.element = createElement('div', { className: TOOLBAR_CONTAINER });
        var toolbarEle = createElement('div', { className: HEADER_TOOLBAR });
        this.element.appendChild(toolbarEle);
        this.parent.element.insertBefore(this.element, this.parent.element.firstElementChild);
        this.renderToolbar();
    };
    HeaderRenderer.prototype.renderToolbar = function () {
        var items = this.getItems();
        var args = { requestType: 'toolbarItemRendering', items: items };
        this.parent.trigger(actionBegin, args);
        this.toolbarObj = new Toolbar({
            items: args.items,
            overflowMode: 'Popup',
            clicked: this.toolbarClickHandler.bind(this),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale
        });
        this.toolbarObj.appendTo(this.parent.element.querySelector('.' + HEADER_TOOLBAR));
        var prevNavEle = this.toolbarObj.element.querySelector('.e-prev');
        if (prevNavEle) {
            prevNavEle.firstChild.setAttribute('title', this.l10n.getConstant('previous'));
        }
        var nextNavEle = this.toolbarObj.element.querySelector('.e-next');
        if (nextNavEle) {
            nextNavEle.firstChild.setAttribute('title', this.l10n.getConstant('next'));
        }
        this.updateActiveView();
        this.parent.trigger(actionComplete, { requestType: 'toolBarItemRendered', items: this.toolbarObj.items });
    };
    HeaderRenderer.prototype.updateItems = function () {
        if (this.toolbarObj) {
            var items = this.getItems();
            var args = { requestType: 'toolbarItemRendering', items: items };
            this.parent.trigger(actionBegin, args);
            this.toolbarObj.items = args.items;
            this.toolbarObj.dataBind();
            this.parent.trigger(actionComplete, {
                requestType: 'toolBarItemRendered',
                items: this.toolbarObj.items
            });
        }
    };
    HeaderRenderer.prototype.getPopUpRelativeElement = function () {
        if (this.parent.isAdaptive) {
            return this.toolbarObj.element;
        }
        return this.element.querySelector('.e-date-range');
    };
    HeaderRenderer.prototype.setDayOfWeek = function (index) {
        if (this.headerCalendar) {
            this.headerCalendar.firstDayOfWeek = index;
            this.headerCalendar.dataBind();
        }
    };
    HeaderRenderer.prototype.setCalendarDate = function (date) {
        if (this.headerCalendar) {
            this.headerCalendar.value = date;
            this.headerCalendar.dataBind();
        }
    };
    HeaderRenderer.prototype.getCalendarView = function () {
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda') {
            return 'Year';
        }
        return 'Month';
    };
    HeaderRenderer.prototype.setCalendarView = function () {
        if (this.headerCalendar) {
            var calendarView = this.getCalendarView();
            this.headerCalendar.depth = calendarView;
            this.headerCalendar.start = calendarView;
            this.headerCalendar.refresh();
        }
    };
    HeaderRenderer.prototype.updateActiveView = function () {
        var selEle = this.toolbarObj.element.querySelectorAll('.e-views');
        removeClass(selEle, ['e-active-view']);
        if (selEle.length > 0 && selEle[this.parent.viewIndex]) {
            addClass([selEle[this.parent.viewIndex]], ['e-active-view']);
        }
    };
    HeaderRenderer.prototype.updateDateRange = function (text) {
        var selEle = this.toolbarObj.element.querySelector('.e-date-range');
        if (selEle) {
            selEle.setAttribute('aria-label', text);
            selEle.querySelector('.e-tbar-btn-text').innerHTML = text;
            this.toolbarObj.refreshOverflow();
        }
    };
    HeaderRenderer.prototype.getDateRangeText = function () {
        return this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
    };
    HeaderRenderer.prototype.getItems = function () {
        var items = [];
        var showInPopup = this.parent.isAdaptive;
        items.push({
            align: 'Left', prefixIcon: 'e-icon-prev', tooltipText: 'Previous', overflow: 'Show',
            cssClass: 'e-prev', htmlAttributes: { 'aria-label': 'previous period' }
        });
        items.push({
            align: 'Left', prefixIcon: 'e-icon-next', tooltipText: 'Next', overflow: 'Show',
            cssClass: 'e-next', htmlAttributes: { 'aria-label': 'next period' }
        });
        items.push({
            align: 'Left', text: this.getDateRangeText(), suffixIcon: 'e-icon-down-arrow', cssClass: 'e-date-range',
            overflow: 'Show', htmlAttributes: { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title' }
        });
        if (this.parent.isAdaptive) {
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-add', text: this.l10n.getConstant('newEvent'),
                cssClass: 'e-add', overflow: 'Show'
            });
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-today', text: this.l10n.getConstant('today'),
                cssClass: 'e-today', overflow: 'Show'
            });
        }
        else {
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-day', text: this.l10n.getConstant('today'),
                cssClass: 'e-today', overflow: 'Show'
            });
            if (this.parent.views.length > 1) {
                items.push({
                    align: 'Right', type: 'Separator', cssClass: 'e-schedule-seperator'
                });
            }
        }
        if (this.parent.views.length > 1) {
            for (var _i = 0, _a = this.parent.views; _i < _a.length; _i++) {
                var item = _a[_i];
                typeof (item) === 'string' ? items.push(this.getItemObject(item.toLowerCase(), null)) :
                    items.push(this.getItemObject(item.option.toLowerCase(), item.displayName));
            }
        }
        return items;
    };
    HeaderRenderer.prototype.getItemObject = function (viewName, displayName) {
        var view;
        var showInPopup = this.parent.isAdaptive;
        switch (viewName) {
            case 'day':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-day',
                    text: displayName || this.l10n.getConstant('day'), cssClass: 'e-views e-day'
                };
                break;
            case 'week':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-week',
                    text: displayName || this.l10n.getConstant('week'), cssClass: 'e-views e-week'
                };
                break;
            case 'workweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-workweek',
                    text: displayName || this.l10n.getConstant('workWeek'), cssClass: 'e-views e-work-week'
                };
                break;
            case 'month':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-month',
                    text: displayName || this.l10n.getConstant('month'), cssClass: 'e-views e-month'
                };
                break;
            case 'agenda':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-agenda', text: this.l10n.getConstant('agenda'),
                    cssClass: 'e-views e-agenda'
                };
                break;
            case 'monthagenda':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-month-agenda',
                    text: this.l10n.getConstant('monthAgenda'), cssClass: 'e-views e-month-agenda'
                };
                break;
            case 'timelineday':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-day',
                    text: displayName || this.l10n.getConstant('timelineDay'), cssClass: 'e-views e-timeline-day'
                };
                break;
            case 'timelineweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-week',
                    text: displayName || this.l10n.getConstant('timelineWeek'), cssClass: 'e-views e-timeline-week'
                };
                break;
            case 'timelineworkweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-workweek',
                    text: displayName || this.l10n.getConstant('timelineWorkWeek'), cssClass: 'e-views e-timeline-work-week'
                };
                break;
            case 'timelinemonth':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-month',
                    text: displayName || this.l10n.getConstant('timelineMonth'), cssClass: 'e-views e-timeline-month'
                };
                break;
        }
        return view;
    };
    HeaderRenderer.prototype.renderHeaderPopup = function () {
        var headerPopupEle = createElement('div', { className: HEADER_POPUP_CLASS });
        var headerCalendarEle = createElement('div', { className: HEADER_CALENDAR_CLASS });
        headerPopupEle.appendChild(headerCalendarEle);
        this.element.appendChild(headerPopupEle);
        this.headerPopup = new Popup(headerPopupEle, {
            actionOnScroll: 'hide',
            targetType: 'relative',
            relateTo: this.getPopUpRelativeElement(),
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.parent.enableRtl
        });
        var calendarView = this.getCalendarView();
        this.headerCalendar = new Calendar({
            value: this.parent.selectedDate,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            depth: calendarView,
            start: calendarView,
            calendarMode: this.parent.calendarMode,
            change: this.calendarChange.bind(this)
        });
        this.headerCalendar.appendTo(headerCalendarEle);
        this.headerPopup.hide();
    };
    HeaderRenderer.prototype.calendarChange = function (args) {
        if (args.value.getTime() !== this.parent.selectedDate.getTime()) {
            this.parent.changeDate(args.value);
        }
        this.headerPopup.hide();
    };
    HeaderRenderer.prototype.calculateViewIndex = function (args) {
        var target = closest(args.originalEvent.target, '.e-views');
        var views = [].slice.call(this.element.querySelectorAll('.e-views'));
        return views.indexOf(target);
    };
    HeaderRenderer.prototype.toolbarClickHandler = function (args) {
        if (!args.item) {
            return;
        }
        var strClass = args.item.cssClass.replace('e-views ', '');
        switch (strClass) {
            case 'e-date-range':
                if (!this.headerPopup) {
                    this.renderHeaderPopup();
                }
                if (this.headerPopup.element.classList.contains(POPUP_OPEN)) {
                    this.headerPopup.hide();
                }
                else {
                    this.headerPopup.show();
                }
                break;
            case 'e-day':
                this.parent.changeView('Day', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-week':
                this.parent.changeView('Week', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-work-week':
                this.parent.changeView('WorkWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-month':
                this.parent.changeView('Month', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-agenda':
                this.parent.changeView('Agenda', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            // case 'e-week-agenda':
            //     this.parent.changeView('weekAgenda', args.originalEvent);
            //     break;
            // case 'e-work-week-agenda':
            //     this.parent.changeView('workWeekAgenda', args.originalEvent);
            //     break;
            case 'e-month-agenda':
                this.parent.changeView('MonthAgenda', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-day':
                this.parent.changeView('TimelineDay', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-week':
                this.parent.changeView('TimelineWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-work-week':
                this.parent.changeView('TimelineWorkWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-month':
                this.parent.changeView('TimelineMonth', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-today':
                if (!this.parent.isSelectedDate(resetTime(new Date()))) {
                    this.parent.changeDate(resetTime(new Date()), args.originalEvent);
                }
                break;
            case 'e-prev':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), args.originalEvent);
                break;
            case 'e-next':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), args.originalEvent);
                break;
            case 'e-add':
                var data = void 0;
                var isSameTime = this.parent.activeCellsData.startTime.getTime() === this.parent.activeCellsData.endTime.getTime();
                if (this.parent.activeCellsData && !isSameTime) {
                    data = this.parent.activeCellsData;
                }
                else {
                    var interval = this.parent.activeViewOptions.timeScale.interval;
                    var slotCount = this.parent.activeViewOptions.timeScale.slotCount;
                    var msInterval = (interval * MS_PER_MINUTE) / slotCount;
                    var startTime = new Date(this.parent.selectedDate.getTime());
                    startTime.setHours(new Date().getHours(), (Math.round(startTime.getMinutes() / msInterval) * msInterval), 0);
                    var endTime = new Date(new Date(startTime.getTime()).setMilliseconds(startTime.getMilliseconds() + msInterval));
                    data = { startTime: startTime, endTime: endTime, isAllDay: false };
                }
                this.parent.eventWindow.openEditor(extend(data, { cancel: false, event: args.originalEvent }), 'Add');
                break;
        }
        var toolbarPopUp = this.toolbarObj.element.querySelector('.e-toolbar-pop');
        if (toolbarPopUp) {
            toolbarPopUp.ej2_instances[0].hide({ name: 'SlideUp', duration: 100 });
        }
    };
    HeaderRenderer.prototype.getHeaderElement = function () {
        return this.toolbarObj.element;
    };
    HeaderRenderer.prototype.updateHeaderItems = function (classType) {
        var prevNavEle = this.toolbarObj.element.querySelector('.e-prev');
        var nextNavEle = this.toolbarObj.element.querySelector('.e-next');
        var dateRangeEle = this.toolbarObj.element.querySelector('.e-date-range');
        if (prevNavEle) {
            (classType === 'add') ? addClass([prevNavEle], HIDDEN_CLASS) : removeClass([prevNavEle], HIDDEN_CLASS);
        }
        if (nextNavEle) {
            (classType === 'add') ? addClass([nextNavEle], HIDDEN_CLASS) : removeClass([nextNavEle], HIDDEN_CLASS);
        }
        if (dateRangeEle) {
            (classType === 'add') ? addClass([dateRangeEle], TEXT_ELLIPSIS) : removeClass([dateRangeEle], TEXT_ELLIPSIS);
        }
    };
    /**
     * Get module name.
     */
    HeaderRenderer.prototype.getModuleName = function () {
        return 'headerbar';
    };
    /**
     * To destroy the headerbar.
     * @return {void}
     * @private
     */
    HeaderRenderer.prototype.destroy = function () {
        if (this.headerPopup) {
            this.headerPopup.destroy();
        }
        if (this.headerCalendar) {
            this.headerCalendar.destroy();
        }
        if (!this.toolbarObj.isDestroyed) {
            this.toolbarObj.destroy();
            this.removeEventListener();
            remove(this.element);
        }
    };
    return HeaderRenderer;
}());

/**
 * `Scroll` module
 */
var Scroll = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the scrolling.
     * @hidden
     */
    function Scroll(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    /**
     * @hidden
     */
    Scroll.prototype.setWidth = function () {
        this.parent.element.style.width = formatUnit(this.parent.width);
    };
    /**
     * @hidden
     */
    Scroll.prototype.setHeight = function () {
        this.parent.element.style.height = formatUnit(this.parent.height);
    };
    /**
     * @hidden
     */
    Scroll.prototype.addEventListener = function () {
        this.parent.on(contentReady, this.setDimensions, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    };
    /**
     * @hidden
     */
    Scroll.prototype.removeEventListener = function () {
        this.parent.off(contentReady, this.setDimensions);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    };
    /**
     * @hidden
     */
    Scroll.prototype.setDimensions = function () {
        this.setWidth();
        this.setHeight();
        var data = { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() };
        this.parent.notify(scrollUiUpdate, data);
    };
    /**
     * @hidden
     */
    Scroll.prototype.onPropertyChanged = function (e) {
        this.setDimensions();
    };
    /**
     * @hidden
     */
    Scroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Scroll;
}());

/**
 * `touch` module is used to handle touch interactions.
 */
var ScheduleTouch = /** @__PURE__ @class */ (function () {
    function ScheduleTouch(parent) {
        this.parent = parent;
        this.element = this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS);
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
            (e.originalEvent && (e.originalEvent.target.classList.contains(APPOINTMENT_CLASS) ||
                closest(e.originalEvent.target, '.' + APPOINTMENT_CLASS)))) {
            return;
        }
        if (!this.timeStampStart) {
            this.timeStampStart = Date.now();
        }
        if (this.element.classList.contains(TRANSLATE_CLASS)) {
            this.onTransitionEnd();
        }
        if (e.scrollDirection === 'Left' || e.scrollDirection === 'Right') {
            var args = { requestType: 'dateNavigate', cancel: false, event: e.originalEvent };
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
            var scrollDiv = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
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
                this.renderPanel(NEXT_PANEL_CLASS, 'next');
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
                this.renderPanel(PREVIOUS_PANEL_CLASS, 'previous');
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
            this.parent.trigger(actionComplete, args);
        }
        else {
            this.cancelSwipe();
        }
        this.timeStampStart = null;
    };
    ScheduleTouch.prototype.tapHoldHandler = function (e) {
        var target = closest(e.originalEvent.target, '.' + APPOINTMENT_CLASS);
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
        this.parent.trigger(navigating, navArgs);
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
        addClass([this.element], TRANSLATE_CLASS);
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
        addClass([this.element], TRANSLATE_CLASS);
        var prevWidth = this.previousPanel ? this.previousPanel.element.offsetWidth : 0;
        this.element.style.transform = 'translatex(' + (this.parent.enableRtl ? prevWidth : -this.currentPanel.element.offsetLeft) + 'px)';
    };
    ScheduleTouch.prototype.onTransitionEnd = function () {
        removeClass([this.element], TRANSLATE_CLASS);
        this.element.style.transitionDuration = '';
        this.element.style.transform = '';
        if (this.previousPanel) {
            remove(this.previousPanel.element);
            this.previousPanel = null;
            removeClass([this.currentPanel.element], PREVIOUS_PANEL_CLASS);
            addClass([this.currentPanel.element], CURRENT_PANEL_CLASS);
        }
        if (this.nextPanel) {
            remove(this.nextPanel.element);
            this.nextPanel = null;
            removeClass([this.currentPanel.element], NEXT_PANEL_CLASS);
            addClass([this.currentPanel.element], CURRENT_PANEL_CLASS);
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
        removeClass([this.element], TRANSLATE_CLASS);
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

/**
 * Keyboard interaction
 */
var KeyboardInteraction = /** @__PURE__ @class */ (function () {
    function KeyboardInteraction(parent) {
        this.selectedCells = [];
        this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDownArrow: 'shift+downarrow',
            shiftUpArrow: 'shift+uparrow',
            shiftRightArrow: 'shift+rightarrow',
            shiftLeftArrow: 'shift+leftarrow',
            ctrlLeftArrow: 'ctrl+leftarrow',
            ctrlRightArrow: 'ctrl+rightarrow',
            altOne: 'alt+1',
            altTwo: 'alt+2',
            altThree: 'alt+3',
            altFour: 'alt+4',
            altFive: 'alt+5',
            altSix: 'alt+6',
            enter: 'enter',
            escape: 'escape',
            delete: 'delete',
            home: 'home',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            tab: 'tab',
            shiftTab: 'shift+tab'
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        this.addEventListener();
    }
    KeyboardInteraction.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'downArrow':
            case 'shiftDownArrow':
                this.processDown(e, e.shiftKey);
                break;
            case 'upArrow':
            case 'shiftUpArrow':
                this.processUp(e, e.shiftKey);
                break;
            case 'leftArrow':
            case 'shiftLeftArrow':
                this.processLeft(e, e.shiftKey);
                break;
            case 'rightArrow':
            case 'shiftRightArrow':
                this.processRight(e, e.shiftKey);
                break;
            case 'ctrlLeftArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                if (this.parent.headerModule) {
                    this.parent.headerModule.element.querySelector('.e-prev button').focus();
                }
                break;
            case 'ctrlRightArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                if (this.parent.headerModule) {
                    this.parent.headerModule.element.querySelector('.e-next button').focus();
                }
                break;
            case 'altOne':
            case 'altTwo':
            case 'altThree':
            case 'altFour':
            case 'altFive':
            case 'altSix':
                this.processViewNavigation(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'home':
                this.focusFirstCell();
                break;
            case 'tab':
            case 'shiftTab':
                this.processTab(e, e.shiftKey);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'escape':
                this.processEscape();
        }
    };
    KeyboardInteraction.prototype.addEventListener = function () {
        this.parent.on(cellMouseDown, this.onCellMouseDown, this);
    };
    KeyboardInteraction.prototype.removeEventListener = function () {
        this.parent.off(cellMouseDown, this.onCellMouseDown);
    };
    KeyboardInteraction.prototype.onCellMouseDown = function (e) {
        if (e.event.shiftKey) {
            return;
        }
        this.initialTarget = this.getClosestCell(e.event);
        if (this.parent.activeViewOptions.readonly || this.parent.currentView === 'MonthAgenda' || !this.initialTarget) {
            return;
        }
        if (e.event.target.classList.contains(WORK_CELLS_CLASS)) {
            EventHandler.add(this.parent.getContentTable(), 'mousemove', this.onMouseSelection, this);
            EventHandler.add(this.parent.getContentTable(), 'mouseup', this.onMoveup, this);
        }
        if (e.event.target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var allDayRow = this.parent.getAllDayRow();
            EventHandler.add(allDayRow, 'mousemove', this.onMouseSelection, this);
            EventHandler.add(allDayRow, 'mouseup', this.onMoveup, this);
        }
    };
    KeyboardInteraction.prototype.onMouseSelection = function (e) {
        var selectionEdges = this.parent.boundaryValidation(e.pageY, e.pageX);
        if (selectionEdges.bottom || selectionEdges.top || selectionEdges.left || selectionEdges.right) {
            var parent_1 = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            var yInBounds = parent_1.offsetHeight <= parent_1.scrollHeight && parent_1.scrollTop >= 0 &&
                parent_1.scrollTop + parent_1.offsetHeight <= parent_1.scrollHeight;
            var xInBounds = parent_1.offsetWidth <= parent_1.scrollWidth && parent_1.scrollLeft >= 0 &&
                parent_1.scrollLeft + parent_1.offsetWidth <= parent_1.scrollWidth;
            if (yInBounds && (selectionEdges.top || selectionEdges.bottom)) {
                parent_1.scrollTop += selectionEdges.top ?
                    -e.target.offsetHeight : e.target.offsetHeight;
            }
            if (xInBounds && (selectionEdges.left || selectionEdges.right)) {
                parent_1.scrollLeft += selectionEdges.left ?
                    -e.target.offsetWidth : e.target.offsetWidth;
            }
        }
        var target = this.getClosestCell(e);
        if (target) {
            this.selectCells(true, target);
        }
    };
    KeyboardInteraction.prototype.getClosestCell = function (e) {
        return closest(e.target, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS);
    };
    KeyboardInteraction.prototype.onMoveup = function (e) {
        if (e.target.classList.contains(WORK_CELLS_CLASS)) {
            EventHandler.remove(this.parent.getContentTable(), 'mousemove', this.onMouseSelection);
            EventHandler.remove(this.parent.getContentTable(), 'mouseup', this.onMoveup);
        }
        if (e.target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var allDayRow = this.parent.getAllDayRow();
            EventHandler.remove(allDayRow, 'mousemove', this.onMouseSelection);
            EventHandler.remove(allDayRow, 'mouseup', this.onMoveup);
        }
    };
    KeyboardInteraction.prototype.processEnter = function (e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        var target = (e.target);
        if (closest(target, '.' + POPUP_WRAPPER_CLASS)) {
            if (target.classList.contains(QUICK_POPUP_EVENT_DETAILS_CLASS) ||
                target.classList.contains(EVENT_CREATE_CLASS) ||
                target.classList.contains(EDIT_EVENT_CLASS) ||
                target.classList.contains(DELETE_EVENT_CLASS) ||
                target.classList.contains(CLOSE_CLASS)) {
                target.click();
                e.preventDefault();
            }
            else if (target.classList.contains(SUBJECT_CLASS)) {
                this.parent.element.querySelector('.' + EVENT_CREATE_CLASS).click();
                e.preventDefault();
            }
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) || target.classList.contains(ALLDAY_CELLS_CLASS)) {
            if (this.selectedCells.length > 1) {
                var start = this.parent.getCellDetails(this.selectedCells[0]);
                var end = this.parent.getCellDetails(this.selectedCells[this.selectedCells.length - 1]);
                start.endTime = end.endTime;
                start.element = target;
                this.parent.activeCellsData = start;
            }
            else {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
            }
            var args = extend(this.parent.activeCellsData, { cancel: false, event: e });
            this.parent.notify(cellClick, args);
            return;
        }
        if (target.classList.contains(APPOINTMENT_CLASS) || target.classList.contains(MORE_EVENT_CLOSE_CLASS) ||
            target.classList.contains(ALLDAY_APPOINTMENT_SECTION_CLASS) || target.classList.contains(MORE_INDICATOR_CLASS)) {
            target.click();
            return;
        }
        if (target.classList.contains(MORE_EVENT_HEADER_DATE_CLASS)) {
            this.parent.setProperties({ selectedDate: new Date(parseInt(target.getAttribute('data-date'), 10)) }, true);
            this.parent.changeView(this.parent.getNavigateView());
            this.processEscape();
            return;
        }
    };
    KeyboardInteraction.prototype.getCells = function (isInverseTable, start, end) {
        var tableEle = this.parent.getContentTable();
        var cells = [].slice.call(tableEle.querySelectorAll('td'));
        var maxRow = tableEle.rows.length;
        var maxColumn = tableEle.rows[0].cells.length;
        if (start.classList.contains(ALLDAY_CELLS_CLASS)) {
            var allDayRow = this.parent.getAllDayRow();
            cells = [].slice.call(allDayRow.cells);
            maxRow = 1;
            maxColumn = allDayRow.cells.length;
        }
        var startIndex = cells.indexOf(start);
        var endIndex = cells.indexOf(end);
        var inverseCells = [];
        if (isInverseTable) {
            for (var i = 0; i < maxColumn; i++) {
                for (var j = 0; j < maxRow; j++) {
                    inverseCells.push(cells[maxColumn * j + i]);
                }
            }
            startIndex = inverseCells.indexOf(start);
            endIndex = inverseCells.indexOf(end);
        }
        if (startIndex > endIndex) {
            var temp = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        var sCells = isInverseTable ? inverseCells : cells;
        return sCells.slice(startIndex, endIndex + 1);
    };
    KeyboardInteraction.prototype.focusFirstCell = function () {
        if (this.parent.currentView === 'Agenda') {
            var focusCell = this.parent.getContentTable().querySelector('.' + AGENDA_CELLS_CLASS);
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        if (this.parent.activeView.isTimelineView()) {
            var cell = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS +
                ' tr:not(.' + HIDDEN_CLASS + ') .' + WORK_CELLS_CLASS + ':not(.' + RESOURCE_GROUP_CELLS_CLASS + ')');
            this.selectCells(false, cell);
        }
        else {
            this.selectCells(false, this.parent.getWorkCellElements()[0]);
        }
    };
    KeyboardInteraction.prototype.isInverseTableSelect = function () {
        return this.parent.activeView.isInverseTableSelect;
    };
    /** @hidden */
    KeyboardInteraction.prototype.selectCells = function (isMultiple, targetCell) {
        this.parent.removeSelectedClass();
        var target = (targetCell instanceof Array) ? targetCell.slice(-1)[0] : targetCell;
        if (isMultiple) {
            var initialId = void 0;
            var selectedCells = this.getCells(this.isInverseTableSelect(), this.initialTarget, target);
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                initialId = this.initialTarget.getAttribute('data-group-index');
                var resourceSelectedCells = [];
                for (var i = 0; i < selectedCells.length; i++) {
                    if (selectedCells[i].getAttribute('data-group-index') === initialId) {
                        resourceSelectedCells.push(selectedCells[i]);
                    }
                }
                selectedCells = resourceSelectedCells;
            }
            this.selectedCells = selectedCells;
            if (selectedCells.length > 2 && !target.classList.contains(ALLDAY_CELLS_CLASS)) {
                var allDayCells = this.getAllDayCells(selectedCells);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    var resourceAllDayCells = [];
                    for (var i = 0; i < allDayCells.length; i++) {
                        if (allDayCells[i].getAttribute('data-group-index') === initialId) {
                            resourceAllDayCells.push(allDayCells[i]);
                        }
                    }
                    allDayCells = resourceAllDayCells;
                }
                selectedCells = selectedCells.concat(allDayCells);
            }
            if ((target.getAttribute('data-group-index') !== initialId) && this.parent.activeViewOptions.group.resources.length > 0) {
                target = this.selectedCells[this.selectedCells.length - 1];
            }
            this.parent.addSelectedClass(selectedCells, target);
        }
        else {
            this.initialTarget = target;
            this.selectedCells = [target];
            this.parent.addSelectedClass([target], target);
        }
    };
    KeyboardInteraction.prototype.selectAppointment = function (isReverse, target) {
        var appointments = this.getAppointmentElements();
        if (appointments.length < 0) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        var nextAppEle;
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            var targetIndex = appointments.indexOf(target);
            nextAppEle = appointments[(isReverse ? targetIndex - 1 : targetIndex + 1)];
        }
        else {
            nextAppEle = isReverse ? appointments[appointments.length - 1] : appointments[0];
        }
        if (nextAppEle) {
            this.parent.eventBase.addSelectedAppointments([nextAppEle]);
            nextAppEle.focus();
            addClass([nextAppEle], AGENDA_SELECTED_CELL);
        }
    };
    KeyboardInteraction.prototype.selectAppointmentElementFromWorkCell = function (isReverse, target) {
        var _this = this;
        this.parent.eventBase.removeSelectedAppointmentClass();
        this.parent.removeSelectedClass();
        if (target.classList.contains(WORK_CELLS_CLASS) || target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var appointmentElements_1 = this.getUniqueAppointmentElements();
            var filteredElements_1 = [];
            var selectedDate_1 = parseInt(target.getAttribute('data-date'), 10);
            var selectedSeriesEvents = this.parent.eventsProcessed.filter(function (eventObject) {
                return (!isReverse ? (eventObject[_this.parent.eventFields.startTime].getTime() >= selectedDate_1) :
                    (eventObject[_this.parent.eventFields.startTime].getTime() <= selectedDate_1));
            });
            selectedSeriesEvents.filter(function (event) {
                appointmentElements_1.filter(function (element) {
                    if (JSON.stringify(event.Guid) === JSON.stringify(element.getAttribute('data-guid'))) {
                        filteredElements_1.push(element);
                    }
                });
            });
            if (filteredElements_1.length > 0) {
                var selectedElement = isReverse ? filteredElements_1[filteredElements_1.length - 1] : filteredElements_1[0];
                var focusElements = this.getAppointmentElementsByGuid(selectedElement.getAttribute('data-guid'));
                this.parent.eventBase.addSelectedAppointments(focusElements);
                (focusElements[focusElements.length - 1]).focus();
            }
        }
    };
    KeyboardInteraction.prototype.getAllDayCells = function (cells) {
        var allDayRow = this.parent.getAllDayRow();
        if (!allDayRow) {
            return [];
        }
        var startCell = cells[0];
        var endCell = cells[cells.length - 1];
        var start = this.parent.getCellDetails(startCell);
        var end = this.parent.getCellDetails(endCell);
        if (end.endTime.getTime() - start.startTime.getTime() >= MS_PER_DAY) {
            var allDayCells = [].slice.call(allDayRow.cells);
            return allDayCells.slice(startCell.cellIndex, endCell.cellIndex + 1);
        }
        return [];
    };
    KeyboardInteraction.prototype.getAppointmentElements = function () {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
    };
    KeyboardInteraction.prototype.getAppointmentElementsByGuid = function (guid) {
        return [].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]'));
    };
    KeyboardInteraction.prototype.getUniqueAppointmentElements = function () {
        var appointments = this.getAppointmentElements();
        var appointmentElements = [];
        appointments.map(function (value) {
            return value.getAttribute('data-guid');
        }).filter(function (value, index, self) {
            if (self.indexOf(value) === index) {
                appointmentElements.push(appointments[index]);
            }
        });
        return appointmentElements;
    };
    KeyboardInteraction.prototype.getWorkCellFromAppointmentElement = function (target) {
        var selectedObject = this.parent.eventBase.getEventByGuid(target.getAttribute('data-guid'));
        return this.parent.eventBase.selectWorkCellByTime([selectedObject]);
    };
    KeyboardInteraction.prototype.processViewNavigation = function (e) {
        var index = parseInt(e.key, 10) - 1;
        if (index < this.parent.views.length) {
            var view = this.parent.viewCollections[index].option;
            this.parent.changeView(view, e, undefined, index);
            if (this.parent.headerModule) {
                this.parent.headerModule.element.querySelector('.e-active-view button').focus();
            }
        }
    };
    KeyboardInteraction.prototype.processUp = function (e, isMultiple) {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        var target = (e.target);
        var selectedElements = this.parent.getSelectedElements();
        var selectedEventElements = this.parent.eventBase.getSelectedAppointments();
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (selectedElements.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedElements[selectedElements.length - 1];
        }
        if (selectedEventElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedEventElements[selectedEventElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            var tableRows = this.parent.getTableRows();
            var curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex > 0 && curRowIndex < tableRows.length) {
                this.selectCells(isMultiple, (tableRows[curRowIndex - 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(true, target);
        }
    };
    KeyboardInteraction.prototype.processDown = function (e, isMultiple) {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        var target = (e.target);
        var selectedCells = this.parent.getSelectedElements();
        var selectedElements = this.parent.eventBase.getSelectedAppointments();
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (selectedCells.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        if (selectedElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        var tableRows = this.parent.getTableRows();
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            var curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex >= 0 && curRowIndex < tableRows.length - 1) {
                this.selectCells(isMultiple, (tableRows[curRowIndex + 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(false, target);
        }
    };
    KeyboardInteraction.prototype.processLeftRight = function (target) {
        var tableEle = this.parent.getContentTable();
        var curRowIndex = target.parentNode.sectionRowIndex;
        var key = {
            element: tableEle,
            rowIndex: curRowIndex,
            columnIndex: target.cellIndex,
            maxIndex: tableEle.rows[curRowIndex].cells.length
        };
        return key;
    };
    KeyboardInteraction.prototype.getQuickPopupElement = function () {
        return (this.parent.isAdaptive ? document.body : this.parent.element).querySelector('.' + POPUP_WRAPPER_CLASS);
    };
    KeyboardInteraction.prototype.isCancelLeftRightAction = function (e, isMultiple) {
        if (this.parent.currentView === 'Agenda' || (isMultiple && this.parent.currentView === 'MonthAgenda')) {
            return true;
        }
        if ((this.isPreventAction(e) && isMultiple)) {
            return true;
        }
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (moreEventWrapper.classList.contains(POPUP_OPEN) || quickPopupWrapper.classList.contains(POPUP_OPEN)) {
            return true;
        }
        return false;
    };
    KeyboardInteraction.prototype.processRight = function (e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        var selectedCells = this.parent.getSelectedElements();
        var targetCell;
        var selectedAppointments = this.parent.eventBase.getSelectedAppointments();
        var target = (e.target);
        if (selectedCells.length > 0 && !target.classList.contains(WORK_CELLS_CLASS) &&
            !target.classList.contains(ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        if (selectedAppointments.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedAppointments[selectedAppointments.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(WORK_CELLS_CLASS)) {
            var key = this.processLeftRight(target);
            if (key.columnIndex >= 0 && key.columnIndex < key.maxIndex - 1) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex + 1], 'right');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === key.maxIndex - 1) {
                if (!this.isInverseTableSelect() && key.rowIndex < key.element.rows.length - 1) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex + 1].cells[0], 'right');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    var rowIndex = this.isInverseTableSelect() ? key.rowIndex : 0;
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                    var tableEle = this.parent.getContentTable();
                    this.selectCells(false, tableEle.rows[rowIndex].cells[0]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var curColIndex = target.cellIndex;
            var allDayRow = this.parent.getAllDayRow();
            var maxColIndex = allDayRow.cells.length;
            if (curColIndex >= 0 && curColIndex < maxColIndex - 1) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex + 1]);
            }
            else if (curColIndex === maxColIndex - 1 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                var allDayRow_1 = this.parent.getAllDayRow();
                this.selectCells(false, allDayRow_1.cells[0]);
            }
        }
    };
    KeyboardInteraction.prototype.processLeft = function (e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        var target = (e.target);
        var selectedCells = this.parent.getSelectedElements();
        var targetCell;
        if (selectedCells.length > 0 && !target.classList.contains(WORK_CELLS_CLASS) &&
            !target.classList.contains(ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        var selectedElements = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(WORK_CELLS_CLASS)) {
            var key = this.processLeftRight(target);
            if (key.columnIndex > 0 && key.columnIndex < key.maxIndex) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex - 1], 'left');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === 0) {
                if (!this.isInverseTableSelect() && key.rowIndex > 0) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex - 1].cells[key.maxIndex - 1], 'left');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                    var tableEle = this.parent.getContentTable();
                    var rowIndex = this.isInverseTableSelect() ? key.rowIndex : tableEle.rows.length - 1;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[key.maxIndex - 1]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var curColIndex = target.cellIndex;
            var allDayRow = this.parent.getAllDayRow();
            var maxColIndex = allDayRow.cells.length;
            if (curColIndex > 0 && curColIndex < maxColIndex) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex - 1]);
            }
            else if (curColIndex === 0 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                var allDayRow_2 = this.parent.getAllDayRow();
                this.selectCells(false, allDayRow_2.cells[maxColIndex - 1]);
            }
        }
    };
    KeyboardInteraction.prototype.calculateNextPrevDate = function (currentCell, target, type) {
        var initialId = this.initialTarget.getAttribute('data-group-index');
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.currentView === 'Month') {
            if (target.getAttribute('data-group-index') !== initialId) {
                var currentDate = new Date(parseInt(currentCell.getAttribute('data-date'), 10));
                var nextPrevDate = (type === 'right') ? new Date(currentDate.setDate(currentDate.getDate() + 1))
                    : new Date(currentDate.setDate(currentDate.getDate() - 1));
                target = [].slice.call(this.parent.element.querySelectorAll('td[data-date="'
                    + nextPrevDate.getTime().toString() + '"]' + '[data-group-index="' + initialId + '"]'))[0];
            }
        }
        return target;
    };
    KeyboardInteraction.prototype.getFocusableElements = function (container) {
        var queryString = 'a[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),' +
            'textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),' +
            'select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])';
        return [].slice.call(container.querySelectorAll(queryString));
    };
    KeyboardInteraction.prototype.processTabOnPopup = function (e, popupElement) {
        var _this = this;
        var focusableElements = this.getFocusableElements(popupElement);
        focusableElements = focusableElements.filter(function (element) {
            var footerEle = _this.parent.element.querySelector('.' + POPUP_FOOTER_CLASS);
            if (footerEle && footerEle.offsetParent) {
                return !(element.classList.contains(EDIT_CLASS) || element.classList.contains(DELETE_CLASS));
            }
            else {
                return !(element.classList.contains(EDIT_EVENT_CLASS) || element.classList.contains(DELETE_EVENT_CLASS));
            }
        });
        var firstEle = focusableElements[0];
        var lastEle = focusableElements[focusableElements.length - 1];
        if (!isNullOrUndefined(lastEle) && document.activeElement === lastEle && !e.shiftKey) {
            e.preventDefault();
            firstEle.focus();
        }
        if (!isNullOrUndefined(firstEle) && document.activeElement === firstEle && e.shiftKey) {
            e.preventDefault();
            lastEle.focus();
        }
    };
    KeyboardInteraction.prototype.processTab = function (e, isReverse) {
        var target = e.target;
        var popupWrapper = closest(target, '.' + POPUP_WRAPPER_CLASS + ',.' + MORE_POPUP_WRAPPER_CLASS);
        if (popupWrapper && popupWrapper.classList.contains(POPUP_OPEN)) {
            if (popupWrapper.classList.contains(MORE_POPUP_WRAPPER_CLASS)) {
                this.parent.eventBase.removeSelectedAppointmentClass();
            }
            this.processTabOnPopup(e, popupWrapper);
            return;
        }
        if (target.classList.contains(ROOT)) {
            this.parent.eventBase.removeSelectedAppointmentClass();
            return;
        }
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            var appointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
            var selectedAppointments = this.parent.eventBase.getSelectedAppointments();
            if (selectedAppointments.length > 0) {
                target = selectedAppointments[selectedAppointments.length - 1];
            }
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!isReverse && target.getAttribute('data-guid') === appointments[appointments.length - 1].getAttribute('data-guid') ||
                isReverse && target.getAttribute('data-guid') === appointments[0].getAttribute('data-guid')) {
                return;
            }
            if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                this.selectAppointment(isReverse, target);
                e.preventDefault();
            }
            return;
        }
        var selectedCells = this.parent.getSelectedElements();
        if (selectedCells.length > 0 && !target.classList.contains(APPOINTMENT_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
            this.selectAppointmentElementFromWorkCell(isReverse, target);
            e.preventDefault();
            return;
        }
    };
    KeyboardInteraction.prototype.processDelete = function (e) {
        if (document.activeElement.classList.contains(APPOINTMENT_CLASS)) {
            addClass([document.activeElement], APPOINTMENT_BORDER);
            this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
            this.parent.quickPopup.deleteClick();
        }
    };
    KeyboardInteraction.prototype.processEscape = function () {
        this.parent.quickPopup.onClosePopup();
        this.parent.quickPopup.morePopup.hide();
        if (this.parent.headerModule) {
            this.parent.headerModule.hideHeaderPopup();
        }
    };
    KeyboardInteraction.prototype.isPreventAction = function (e) {
        var target = closest(e.target, '.' + RESOURCE_GROUP_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    };
    /**
     * Get module name.
     */
    KeyboardInteraction.prototype.getModuleName = function () {
        return 'keyboard';
    };
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    KeyboardInteraction.prototype.destroy = function () {
        this.removeEventListener();
        this.keyboardModule.destroy();
    };
    return KeyboardInteraction;
}());

/**
 * data module is used to generate query and data source.
 * @hidden
 */
var Data = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for data module
     * @private
     */
    function Data(dataSource, query) {
        this.initDataManager(dataSource, query);
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    };
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    Data.prototype.generateQuery = function (startDate, endDate) {
        var query = this.query.clone();
        if (startDate) {
            query.addParams('StartDate', startDate.toISOString());
        }
        if (endDate) {
            query.addParams('EndDate', endDate.toISOString());
        }
        return query;
    };
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        return this.dataManager.executeQuery(query);
    };
    return Data;
}());

/**
 * Time zone
 */
var Timezone = /** @__PURE__ @class */ (function () {
    function Timezone() {
    }
    Timezone.prototype.offset = function (date, timezone) {
        var localOffset = date.getTimezoneOffset();
        try {
            var convertedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
            if (!isNaN(convertedDate.getTime())) {
                return ((date.getTime() - convertedDate.getTime()) / 60000) + localOffset;
            }
            return 0;
        }
        catch (error) {
            return 0;
        }
    };
    Timezone.prototype.convert = function (date, fromOffset, toOffset) {
        if (typeof fromOffset === 'string') {
            fromOffset = this.offset(date, fromOffset);
        }
        if (typeof toOffset === 'string') {
            toOffset = this.offset(date, toOffset);
        }
        var fromLocalOffset = date.getTimezoneOffset();
        date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);
        var toLocalOffset = date.getTimezoneOffset();
        return new Date(date.getTime() + (toLocalOffset - fromLocalOffset) * 60000);
    };
    Timezone.prototype.add = function (date, timezone) {
        return this.convert(date, date.getTimezoneOffset(), timezone);
    };
    Timezone.prototype.remove = function (date, timezone) {
        return this.convert(date, timezone, date.getTimezoneOffset());
    };
    Timezone.prototype.removeLocalOffset = function (date) {
        return new Date(+date - (date.getTimezoneOffset() * 60000));
    };
    Timezone.prototype.getLocalTimezoneName = function () {
        return window.Intl ?
            Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC';
    };
    return Timezone;
}());
var timezoneData = [
    { Value: 'Pacific/Niue', Text: '(UTC-11:00) Niue' },
    { Value: 'Pacific/Pago_Pago', Text: '(UTC-11:00) Pago Pago' },
    { Value: 'Pacific/Honolulu', Text: '(UTC-10:00) Hawaii Time' },
    { Value: 'Pacific/Rarotonga', Text: '(UTC-10:00) Rarotonga' },
    { Value: 'Pacific/Tahiti', Text: '(UTC-10:00) Tahiti' },
    { Value: 'Pacific/Marquesas', Text: '(UTC-09:30) Marquesas' },
    { Value: 'America/Anchorage', Text: '(UTC-09:00) Alaska Time' },
    { Value: 'Pacific/Gambier', Text: '(UTC-09:00) Gambier' },
    { Value: 'America/Los_Angeles', Text: '(UTC-08:00) Pacific Time' },
    { Value: 'America/Tijuana', Text: '(UTC-08:00) Pacific Time - Tijuana' },
    { Value: 'America/Vancouver', Text: '(UTC-08:00) Pacific Time - Vancouver' },
    { Value: 'America/Whitehorse', Text: '(UTC-08:00) Pacific Time - Whitehorse' },
    { Value: 'Pacific/Pitcairn', Text: '(UTC-08:00) Pitcairn' },
    { Value: 'America/Denver', Text: '(UTC-07:00) Mountain Time' },
    { Value: 'America/Phoenix', Text: '(UTC-07:00) Mountain Time - Arizona' },
    { Value: 'America/Mazatlan', Text: '(UTC-07:00) Mountain Time - Chihuahua, Mazatlan' },
    { Value: 'America/Dawson_Creek', Text: '(UTC-07:00) Mountain Time - Dawson Creek' },
    { Value: 'America/Edmonton', Text: '(UTC-07:00) Mountain Time - Edmonton' },
    { Value: 'America/Hermosillo', Text: '(UTC-07:00) Mountain Time - Hermosillo' },
    { Value: 'America/Yellowknife', Text: '(UTC-07:00) Mountain Time - Yellowknife' },
    { Value: 'America/Belize', Text: '(UTC-06:00) Belize' },
    { Value: 'America/Chicago', Text: '(UTC-06:00) Central Time' },
    { Value: 'America/Mexico_City', Text: '(UTC-06:00) Central Time - Mexico City' },
    { Value: 'America/Regina', Text: '(UTC-06:00) Central Time - Regina' },
    { Value: 'America/Tegucigalpa', Text: '(UTC-06:00) Central Time - Tegucigalpa' },
    { Value: 'America/Winnipeg', Text: '(UTC-06:00) Central Time - Winnipeg' },
    { Value: 'America/Costa_Rica', Text: '(UTC-06:00) Costa Rica' },
    { Value: 'America/El_Salvador', Text: '(UTC-06:00) El Salvador' },
    { Value: 'Pacific/Galapagos', Text: '(UTC-06:00) Galapagos' },
    { Value: 'America/Guatemala', Text: '(UTC-06:00) Guatemala' },
    { Value: 'America/Managua', Text: '(UTC-06:00) Managua' },
    { Value: 'America/Cancun', Text: '(UTC-05:00) America Cancun' },
    { Value: 'America/Bogota', Text: '(UTC-05:00) Bogota' },
    { Value: 'Pacific/Easter', Text: '(UTC-05:00) Easter Island' },
    { Value: 'America/New_York', Text: '(UTC-05:00) Eastern Time' },
    { Value: 'America/Iqaluit', Text: '(UTC-05:00) Eastern Time - Iqaluit' },
    { Value: 'America/Toronto', Text: '(UTC-05:00) Eastern Time - Toronto' },
    { Value: 'America/Guayaquil', Text: '(UTC-05:00) Guayaquil' },
    { Value: 'America/Havana', Text: '(UTC-05:00) Havana' },
    { Value: 'America/Jamaica', Text: '(UTC-05:00) Jamaica' },
    { Value: 'America/Lima', Text: '(UTC-05:00) Lima' },
    { Value: 'America/Nassau', Text: '(UTC-05:00) Nassau' },
    { Value: 'America/Panama', Text: '(UTC-05:00) Panama' },
    { Value: 'America/Port-au-Prince', Text: '(UTC-05:00) Port-au-Prince' },
    { Value: 'America/Rio_Branco', Text: '(UTC-05:00) Rio Branco' },
    { Value: 'America/Halifax', Text: '(UTC-04:00) Atlantic Time - Halifax' },
    { Value: 'America/Barbados', Text: '(UTC-04:00) Barbados' },
    { Value: 'Atlantic/Bermuda', Text: '(UTC-04:00) Bermuda' },
    { Value: 'America/Boa_Vista', Text: '(UTC-04:00) Boa Vista' },
    { Value: 'America/Caracas', Text: '(UTC-04:00) Caracas' },
    { Value: 'America/Curacao', Text: '(UTC-04:00) Curacao' },
    { Value: 'America/Grand_Turk', Text: '(UTC-04:00) Grand Turk' },
    { Value: 'America/Guyana', Text: '(UTC-04:00) Guyana' },
    { Value: 'America/La_Paz', Text: '(UTC-04:00) La Paz' },
    { Value: 'America/Manaus', Text: '(UTC-04:00) Manaus' },
    { Value: 'America/Martinique', Text: '(UTC-04:00) Martinique' },
    { Value: 'America/Port_of_Spain', Text: '(UTC-04:00) Port of Spain' },
    { Value: 'America/Porto_Velho', Text: '(UTC-04:00) Porto Velho' },
    { Value: 'America/Puerto_Rico', Text: '(UTC-04:00) Puerto Rico' },
    { Value: 'America/Santo_Domingo', Text: '(UTC-04:00) Santo Domingo' },
    { Value: 'America/Thule', Text: '(UTC-04:00) Thule' },
    { Value: 'America/St_Johns', Text: '(UTC-03:30) Newfoundland Time - St. Johns' },
    { Value: 'America/Araguaina', Text: '(UTC-03:00) Araguaina' },
    { Value: 'America/Asuncion', Text: '(UTC-03:00) Asuncion' },
    { Value: 'America/Belem', Text: '(UTC-03:00) Belem' },
    { Value: 'America/Argentina/Buenos_Aires', Text: '(UTC-03:00) Buenos Aires' },
    { Value: 'America/Campo_Grande', Text: '(UTC-03:00) Campo Grande' },
    { Value: 'America/Cayenne', Text: '(UTC-03:00) Cayenne' },
    { Value: 'America/Cuiaba', Text: '(UTC-03:00) Cuiaba' },
    { Value: 'America/Fortaleza', Text: '(UTC-03:00) Fortaleza' },
    { Value: 'America/Godthab', Text: '(UTC-03:00) Godthab' },
    { Value: 'America/Maceio', Text: '(UTC-03:00) Maceio' },
    { Value: 'America/Miquelon', Text: '(UTC-03:00) Miquelon' },
    { Value: 'America/Montevideo', Text: '(UTC-03:00) Montevideo' },
    { Value: 'Antarctica/Palmer', Text: '(UTC-03:00) Palmer' },
    { Value: 'America/Paramaribo', Text: '(UTC-03:00) Paramaribo' },
    { Value: 'America/Punta_Arenas', Text: '(UTC-03:00) Punta Arenas' },
    { Value: 'America/Recife', Text: '(UTC-03:00) Recife' },
    { Value: 'Antarctica/Rothera', Text: '(UTC-03:00) Rothera' },
    { Value: 'America/Bahia', Text: '(UTC-03:00) Salvador' },
    { Value: 'America/Santiago', Text: '(UTC-03:00) Santiago' },
    { Value: 'Atlantic/Stanley', Text: '(UTC-03:00) Stanley' },
    { Value: 'America/Noronha', Text: '(UTC-02:00) Noronha' },
    { Value: 'America/Sao_Paulo', Text: '(UTC-02:00) Sao Paulo' },
    { Value: 'Atlantic/South_Georgia', Text: '(UTC-02:00) South Georgia' },
    { Value: 'Atlantic/Azores', Text: '(UTC-01:00) Azores' },
    { Value: 'Atlantic/Cape_Verde', Text: '(UTC-01:00) Cape Verde' },
    { Value: 'America/Scoresbysund', Text: '(UTC-01:00) Scoresbysund' },
    { Value: 'Africa/Abidjan', Text: '(UTC+00:00) Abidjan' },
    { Value: 'Africa/Accra', Text: '(UTC+00:00) Accra' },
    { Value: 'Africa/Bissau', Text: '(UTC+00:00) Bissau' },
    { Value: 'Atlantic/Canary', Text: '(UTC+00:00) Canary Islands' },
    { Value: 'Africa/Casablanca', Text: '(UTC+00:00) Casablanca' },
    { Value: 'America/Danmarkshavn', Text: '(UTC+00:00) Danmarkshavn' },
    { Value: 'Europe/Dublin', Text: '(UTC+00:00) Dublin' },
    { Value: 'Africa/El_Aaiun', Text: '(UTC+00:00) El Aaiun' },
    { Value: 'Atlantic/Faroe', Text: '(UTC+00:00) Faeroe' },
    { Value: 'Etc/UTC', Text: '(UTC+00:00) UTC (no daylight saving)' },
    { Value: 'Europe/Lisbon', Text: '(UTC+00:00) Lisbon' },
    { Value: 'Europe/London', Text: '(UTC+00:00) London' },
    { Value: 'Africa/Monrovia', Text: '(UTC+00:00) Monrovia' },
    { Value: 'Atlantic/Reykjavik', Text: '(UTC+00:00) Reykjavik' },
    { Value: 'UTC', Text: 'UTC' },
    { Value: 'Africa/Algiers', Text: '(UTC+01:00) Algiers' },
    { Value: 'Europe/Amsterdam', Text: '(UTC+01:00) Amsterdam' },
    { Value: 'Europe/Andorra', Text: '(UTC+01:00) Andorra' },
    { Value: 'Europe/Berlin', Text: '(UTC+01:00) Berlin' },
    { Value: 'Europe/Brussels', Text: '(UTC+01:00) Brussels' },
    { Value: 'Europe/Budapest', Text: '(UTC+01:00) Budapest' },
    { Value: 'Europe/Belgrade', Text: '(UTC+01:00) Central European Time - Belgrade' },
    { Value: 'Europe/Prague', Text: '(UTC+01:00) Central European Time - Prague' },
    { Value: 'Africa/Ceuta', Text: '(UTC+01:00) Ceuta' },
    { Value: 'Europe/Copenhagen', Text: '(UTC+01:00) Copenhagen' },
    { Value: 'Europe/Gibraltar', Text: '(UTC+01:00) Gibraltar' },
    { Value: 'Africa/Lagos', Text: '(UTC+01:00) Lagos' },
    { Value: 'Europe/Luxembourg', Text: '(UTC+01:00) Luxembourg' },
    { Value: 'Europe/Madrid', Text: '(UTC+01:00) Madrid' },
    { Value: 'Europe/Malta', Text: '(UTC+01:00) Malta' },
    { Value: 'Europe/Monaco', Text: '(UTC+01:00) Monaco' },
    { Value: 'Africa/Ndjamena', Text: '(UTC+01:00) Ndjamena' },
    { Value: 'Europe/Oslo', Text: '(UTC+01:00) Oslo' },
    { Value: 'Europe/Paris', Text: '(UTC+01:00) Paris' },
    { Value: 'Europe/Rome', Text: '(UTC+01:00) Rome' },
    { Value: 'Europe/Stockholm', Text: '(UTC+01:00) Stockholm' },
    { Value: 'Europe/Tirane', Text: '(UTC+01:00) Tirane' },
    { Value: 'Africa/Tunis', Text: '(UTC+01:00) Tunis' },
    { Value: 'Europe/Vienna', Text: '(UTC+01:00) Vienna' },
    { Value: 'Europe/Warsaw', Text: '(UTC+01:00) Warsaw' },
    { Value: 'Europe/Zurich', Text: '(UTC+01:00) Zurich' },
    { Value: 'Asia/Amman', Text: '(UTC+02:00) Amman' },
    { Value: 'Europe/Athens', Text: '(UTC+02:00) Athens' },
    { Value: 'Asia/Beirut', Text: '(UTC+02:00) Beirut' },
    { Value: 'Europe/Bucharest', Text: '(UTC+02:00) Bucharest' },
    { Value: 'Africa/Cairo', Text: '(UTC+02:00) Cairo' },
    { Value: 'Europe/Chisinau', Text: '(UTC+02:00) Chisinau' },
    { Value: 'Asia/Damascus', Text: '(UTC+02:00) Damascus' },
    { Value: 'Asia/Gaza', Text: '(UTC+02:00) Gaza' },
    { Value: 'Europe/Helsinki', Text: '(UTC+02:00) Helsinki' },
    { Value: 'Asia/Jerusalem', Text: '(UTC+02:00) Jerusalem' },
    { Value: 'Africa/Johannesburg', Text: '(UTC+02:00) Johannesburg' },
    { Value: 'Africa/Khartoum', Text: '(UTC+02:00) Khartoum' },
    { Value: 'Europe/Kiev', Text: '(UTC+02:00) Kiev' },
    { Value: 'Africa/Maputo', Text: '(UTC+02:00) Maputo' },
    { Value: 'Europe/Kaliningrad', Text: '(UTC+02:00) Moscow-01 - Kaliningrad' },
    { Value: 'Asia/Nicosia', Text: '(UTC+02:00) Nicosia' },
    { Value: 'Europe/Riga', Text: '(UTC+02:00) Riga' },
    { Value: 'Europe/Sofia', Text: '(UTC+02:00) Sofia' },
    { Value: 'Europe/Tallinn', Text: '(UTC+02:00) Tallinn' },
    { Value: 'Africa/Tripoli', Text: '(UTC+02:00) Tripoli' },
    { Value: 'Europe/Vilnius', Text: '(UTC+02:00) Vilnius' },
    { Value: 'Africa/Windhoek', Text: '(UTC+02:00) Windhoek' },
    { Value: 'Asia/Baghdad', Text: '(UTC+03:00) Baghdad' },
    { Value: 'Europe/Istanbul', Text: '(UTC+03:00) Istanbul' },
    { Value: 'Europe/Minsk', Text: '(UTC+03:00) Minsk' },
    { Value: 'Europe/Moscow', Text: '(UTC+03:00) Moscow+00 - Moscow' },
    { Value: 'Africa/Nairobi', Text: '(UTC+03:00) Nairobi' },
    { Value: 'Asia/Qatar', Text: '(UTC+03:00) Qatar' },
    { Value: 'Asia/Riyadh', Text: '(UTC+03:00) Riyadh' },
    { Value: 'Antarctica/Syowa', Text: '(UTC+03:00) Syowa' },
    { Value: 'Asia/Tehran', Text: '(UTC+03:30) Tehran' },
    { Value: 'Asia/Baku', Text: '(UTC+04:00) Baku' },
    { Value: 'Asia/Dubai', Text: '(UTC+04:00) Dubai' },
    { Value: 'Indian/Mahe', Text: '(UTC+04:00) Mahe' },
    { Value: 'Indian/Mauritius', Text: '(UTC+04:00) Mauritius' },
    { Value: 'Europe/Samara', Text: '(UTC+04:00) Moscow+01 - Samara' },
    { Value: 'Indian/Reunion', Text: '(UTC+04:00) Reunion' },
    { Value: 'Asia/Tbilisi', Text: '(UTC+04:00) Tbilisi' },
    { Value: 'Asia/Yerevan', Text: '(UTC+04:00) Yerevan' },
    { Value: 'Asia/Kabul', Text: '(UTC+04:30) Kabul' },
    { Value: 'Asia/Aqtau', Text: '(UTC+05:00) Aqtau' },
    { Value: 'Asia/Aqtobe', Text: '(UTC+05:00) Aqtobe' },
    { Value: 'Asia/Ashgabat', Text: '(UTC+05:00) Ashgabat' },
    { Value: 'Asia/Dushanbe', Text: '(UTC+05:00) Dushanbe' },
    { Value: 'Asia/Karachi', Text: '(UTC+05:00) Karachi' },
    { Value: 'Indian/Kerguelen', Text: '(UTC+05:00) Kerguelen' },
    { Value: 'Indian/Maldives', Text: '(UTC+05:00) Maldives' },
    { Value: 'Antarctica/Mawson', Text: '(UTC+05:00) Mawson' },
    { Value: 'Asia/Yekaterinburg', Text: '(UTC+05:00) Moscow+02 - Yekaterinburg' },
    { Value: 'Asia/Tashkent', Text: '(UTC+05:00) Tashkent' },
    { Value: 'Asia/Colombo', Text: '(UTC+05:30) Colombo' },
    { Value: 'Asia/Kolkata', Text: '(UTC+05:30) India Standard Time' },
    { Value: 'Asia/Katmandu', Text: '(UTC+05:45) Katmandu' },
    { Value: 'Asia/Almaty', Text: '(UTC+06:00) Almaty' },
    { Value: 'Asia/Bishkek', Text: '(UTC+06:00) Bishkek' },
    { Value: 'Indian/Chagos', Text: '(UTC+06:00) Chagos' },
    { Value: 'Asia/Dhaka', Text: '(UTC+06:00) Dhaka' },
    { Value: 'Asia/Omsk', Text: '(UTC+06:00) Moscow+03 - Omsk' },
    { Value: 'Asia/Thimphu', Text: '(UTC+06:00) Thimphu' },
    { Value: 'Antarctica/Vostok', Text: '(UTC+06:00) Vostok' },
    { Value: 'Indian/Cocos', Text: '(UTC+06:30) Cocos' },
    { Value: 'Asia/Yangon', Text: '(UTC+06:30) Rangoon' },
    { Value: 'Asia/Bangkok', Text: '(UTC+07:00) Bangkok' },
    { Value: 'Indian/Christmas', Text: '(UTC+07:00) Christmas' },
    { Value: 'Antarctica/Davis', Text: '(UTC+07:00) Davis' },
    { Value: 'Asia/Saigon', Text: '(UTC+07:00) Hanoi' },
    { Value: 'Asia/Hovd', Text: '(UTC+07:00) Hovd' },
    { Value: 'Asia/Jakarta', Text: '(UTC+07:00) Jakarta' },
    { Value: 'Asia/Krasnoyarsk', Text: '(UTC+07:00) Moscow+04 - Krasnoyarsk' },
    { Value: 'Asia/Brunei', Text: '(UTC+08:00) Brunei' },
    { Value: 'Asia/Shanghai', Text: '(UTC+08:00) China Time - Beijing' },
    { Value: 'Asia/Choibalsan', Text: '(UTC+08:00) Choibalsan' },
    { Value: 'Asia/Hong_Kong', Text: '(UTC+08:00) Hong Kong' },
    { Value: 'Asia/Kuala_Lumpur', Text: '(UTC+08:00) Kuala Lumpur' },
    { Value: 'Asia/Macau', Text: '(UTC+08:00) Macau' },
    { Value: 'Asia/Makassar', Text: '(UTC+08:00) Makassar' },
    { Value: 'Asia/Manila', Text: '(UTC+08:00) Manila' },
    { Value: 'Asia/Irkutsk', Text: '(UTC+08:00) Moscow+05 - Irkutsk' },
    { Value: 'Asia/Singapore', Text: '(UTC+08:00) Singapore' },
    { Value: 'Asia/Taipei', Text: '(UTC+08:00) Taipei' },
    { Value: 'Asia/Ulaanbaatar', Text: '(UTC+08:00) Ulaanbaatar' },
    { Value: 'Australia/Perth', Text: '(UTC+08:00) Western Time - Perth' },
    { Value: 'Asia/Pyongyang', Text: '(UTC+08:30) Pyongyang' },
    { Value: 'Asia/Dili', Text: '(UTC+09:00) Dili' },
    { Value: 'Asia/Jayapura', Text: '(UTC+09:00) Jayapura' },
    { Value: 'Asia/Yakutsk', Text: '(UTC+09:00) Moscow+06 - Yakutsk' },
    { Value: 'Pacific/Palau', Text: '(UTC+09:00) Palau' },
    { Value: 'Asia/Seoul', Text: '(UTC+09:00) Seoul' },
    { Value: 'Asia/Tokyo', Text: '(UTC+09:00) Tokyo' },
    { Value: 'Australia/Darwin', Text: '(UTC+09:30) Central Time - Darwin' },
    { Value: 'Antarctica/DumontDUrville', Text: '(UTC+10:00) Dumont D"Urville' },
    { Value: 'Australia/Brisbane', Text: '(UTC+10:00) Eastern Time - Brisbane' },
    { Value: 'Pacific/Guam', Text: '(UTC+10:00) Guam' },
    { Value: 'Asia/Vladivostok', Text: '(UTC+10:00) Moscow+07 - Vladivostok' },
    { Value: 'Pacific/Port_Moresby', Text: '(UTC+10:00) Port Moresby' },
    { Value: 'Pacific / Chuuk', Text: '(UTC+10:00) Truk' },
    { Value: 'Australia/Adelaide', Text: '(UTC+10:30) Central Time - Adelaide' },
    { Value: 'Antarctica/Casey', Text: '(UTC+11:00) Casey' },
    { Value: 'Australia/Hobart', Text: '(UTC+11:00) Eastern Time - Hobart' },
    { Value: 'Australia/Sydney', Text: '(UTC+11:00) Eastern Time - Melbourne, Sydney' },
    { Value: 'Pacific/Efate', Text: '(UTC+11:00) Efate' },
    { Value: 'Pacific/Guadalcanal', Text: '(UTC+11:00) Guadalcanal' },
    { Value: 'Pacific/Kosrae', Text: '(UTC+11:00) Kosrae' },
    { Value: 'Asia/Magadan', Text: '(UTC+11:00) Moscow+08 - Magadan' },
    { Value: 'Pacific / Norfolk', Text: '(UTC+11:00) Norfolk' },
    { Value: 'Pacific/Noumea', Text: '(UTC+11:00) Noumea' },
    { Value: 'Pacific/Pohnpei', Text: '(UTC+11:00) Ponape' },
    { Value: 'Pacific/Funafuti', Text: '(UTC+12:00) Funafuti' },
    { Value: 'Pacific/Kwajalein', Text: '(UTC+12:00) Kwajalein' },
    { Value: 'Pacific/Majuro', Text: '(UTC+12:00) Majuro' },
    { Value: 'Asia/Kamchatka', Text: '(UTC+12:00) Moscow+09 - Petropavlovsk - Kamchatskiy' },
    { Value: 'Pacific / Nauru', Text: '(UTC+12:00) Nauru' },
    { Value: 'Pacific/Tarawa', Text: '(UTC+12:00) Tarawa' },
    { Value: 'Pacific/Wake', Text: '(UTC+12:00) Wake' },
    { Value: 'Pacific/Wallis', Text: '(UTC+12:00) Wallis' },
    { Value: 'Pacific/Auckland', Text: '(UTC+13:00) Auckland' },
    { Value: 'Pacific/Enderbury', Text: '(UTC+13:00) Enderbury' },
    { Value: 'Pacific/Fakaofo', Text: '(UTC+13:00) Fakaofo' },
    { Value: 'Pacific/Fiji', Text: '(UTC+13:00) Fiji' },
    { Value: 'Pacific/Tongatapu', Text: '(UTC+13:00) Tongatapu' },
    { Value: 'Pacific/Apia', Text: '(UTC+14:00) Apia' },
    { Value: 'Pacific/Kiritimati', Text: '(UTC+14:00) Kiritimati' }
];

/**
 * Date Generator from Recurrence Rule
 */
function generateSummary(rule, localeObject, locale) {
    var ruleObject = extractObjectFromRule(rule);
    var summary = localeObject.getConstant(EVERY) + ' ';
    var cldrObj;
    var cldrObj1;
    if (locale === 'en' || locale === 'en-US') {
        cldrObj1 = (getValue('months.stand-alone.abbreviated', getDefaultDateObject()));
        cldrObj = (getValue('days.stand-alone.abbreviated', getDefaultDateObject()));
    }
    else {
        cldrObj1 = (getValue('main.' + '' + locale + '.dates.calendars.gregorian.months.stand-alone.abbreviated', cldrData));
        cldrObj = (getValue('main.' + '' + locale + '.dates.calendars.gregorian.days.stand-alone.abbreviated', cldrData));
    }
    if (ruleObject.interval > 1) {
        summary += ruleObject.interval + ' ';
    }
    switch (ruleObject.freq) {
        case 'DAILY':
            summary += localeObject.getConstant(DAYS);
            break;
        case 'WEEKLY':
            summary += localeObject.getConstant(WEEKS) + ' ' + localeObject.getConstant(ON) + ' ';
            ruleObject.day.forEach(function (day, index) {
                summary += getValue(DAYINDEXOBJECT[day], cldrObj);
                summary += (((ruleObject.day.length - 1) === index) ? '' : ', ');
            });
            break;
        case 'MONTHLY':
            summary += localeObject.getConstant(MONTHS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
        case 'YEARLY':
            summary += localeObject.getConstant(YEARS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getValue((ruleObject.month[0]).toString(), cldrObj1) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
    }
    if (ruleObject.count) {
        summary += ', ' + (ruleObject.count) + ' ' + localeObject.getConstant(TIMES);
    }
    else if (ruleObject.until) {
        var tempDate = ruleObject.until;
        summary += ', ' + localeObject.getConstant(UNTIL)
            + ' ' + tempDate.getDate()
            + ' ' + getValue((tempDate.getMonth() + 1).toString(), cldrObj1)
            + ' ' + tempDate.getFullYear();
    }
    return summary;
}
function getMonthSummary(ruleObject, cldrObj, localeObj) {
    var summary = '';
    if (ruleObject.monthDay.length) {
        summary += ruleObject.monthDay[0];
    }
    else if (ruleObject.day) {
        var pos = ruleObject.setPosition - 1;
        summary += localeObj.getConstant(WEEKPOS[pos > -1 ? pos : (WEEKPOS.length - 1)])
            + ' ' + getValue(DAYINDEXOBJECT[ruleObject.day[0]], cldrObj);
    }
    return summary;
}
function generate(startDate, rule, excludeDate, startDayOfWeek, maximumCount, viewDate) {
    if (maximumCount === void 0) { maximumCount = MAXOCCURRENCE; }
    if (viewDate === void 0) { viewDate = null; }
    var ruleObject = extractObjectFromRule(rule);
    var cacheDate;
    var data = [];
    var modifiedDate = new Date(startDate.getTime());
    if (viewDate && viewDate > startDate && !ruleObject.count) {
        tempViewDate = new Date(new Date(viewDate.getTime()).setHours(0, 0, 0));
    }
    else {
        tempViewDate = null;
    }
    if (!ruleObject.until && tempViewDate) {
        cacheDate = new Date(tempViewDate.getTime());
        cacheDate.setDate(tempViewDate.getDate() + 42 * (ruleObject.interval));
        ruleObject.until = cacheDate;
    }
    if (ruleObject.until && startDate > ruleObject.until) {
        return data;
    }
    maxOccurrence = maximumCount;
    setFirstDayOfWeek(DAYINDEX[startDayOfWeek]);
    tempExcludeDate = [];
    var tempDate = isNullOrUndefined(excludeDate) ? [] : excludeDate.split(',');
    tempDate.forEach(function (content) {
        var parsedDate = getDateFromRecurrenceDateString(content);
        tempExcludeDate.push(new Date(parsedDate.getTime()).setHours(0, 0, 0, 0));
    });
    switch (ruleObject.freq) {
        case 'DAILY':
            dailyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'WEEKLY':
            weeklyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'MONTHLY':
            monthlyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'YEARLY':
            yearlyType(modifiedDate, ruleObject.until, data, ruleObject);
    }
    return data;
}
function getDateFromRecurrenceDateString(recDateString) {
    return new Date(recDateString.substr(0, 4) +
        '-' + recDateString.substr(4, 2) +
        '-' + recDateString.substr(6, 5) +
        ':' + recDateString.substr(11, 2) +
        ':' + recDateString.substr(13));
}
function excludeDateHandler(data, date) {
    var zeroIndex = new Date(date).setHours(0, 0, 0, 0);
    if (tempExcludeDate.indexOf(zeroIndex) === -1 && (!tempViewDate || zeroIndex >= tempViewDate.getTime())) {
        data.push(date);
    }
}
function dailyType(startDate, endDate, data, ruleObject) {
    var tempDate = new Date(startDate.getTime());
    var interval = ruleObject.interval;
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var state;
    while (compareDates(tempDate, endDate)) {
        state = true;
        state = validateRules(tempDate, ruleObject);
        if (state) {
            excludeDateHandler(data, tempDate.getTime());
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
        }
        tempDate.setDate(tempDate.getDate() + interval);
    }
}
function weeklyType(startDate, endDate, data, ruleObject) {
    var tempDate = getStartDateForWeek(startDate, ruleObject.day);
    var interval = ruleObject.interval;
    var expectedDays = ruleObject.day;
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var weekState;
    while (compareDates(tempDate, endDate)) {
        weekState = true;
        weekState = validateRules(tempDate, ruleObject);
        if (weekState) {
            excludeDateHandler(data, tempDate.getTime());
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
        }
        if (expectedDays.length > 1) {
            var days = ((expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === expectedDays.length - 1) ? ((interval - 1) * 7) : 0);
            tempDate.setDate(tempDate.getDate() + 1 + days);
        }
        else {
            tempDate.setDate(tempDate.getDate()
                + (interval * 7));
        }
    }
}
function monthlyType(startDate, endDate, data, ruleObject) {
    var ruleType = validateMonthlyRuleType(ruleObject);
    switch (ruleType) {
        case 'day':
            monthlyDayTypeProcess(startDate, endDate, data, ruleObject);
            break;
        case 'both':
        case 'date':
            monthlyDateTypeProcess(startDate, endDate, data, ruleObject);
            break;
    }
}
function yearlyType(startDate, endDate, data, ruleObject) {
    var typeValue = checkYearlyType(ruleObject);
    switch (typeValue) {
        case 'MONTH':
            monthlyType(startDate, endDate, data, ruleObject);
            break;
        case 'WEEKNO':
            processWeekNo(startDate, endDate, data, ruleObject);
            break;
        case 'YEARDAY':
            processYearDay(startDate, endDate, data, ruleObject);
            break;
    }
}
function processWeekNo(startDate, endDate, data, ruleObject) {
    var stDate = new Date(startDate.getFullYear(), 0, 0);
    var tempDate;
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var state;
    var startDay;
    var firstWeekSpan;
    var weekNos = ruleObject.weekNo;
    var weekNo;
    var maxDate;
    var minDate;
    while (compareDates(stDate, endDate)) {
        startDay = dayIndex.indexOf(DAYINDEX[stDate.getDay()]);
        firstWeekSpan = (6 - startDay) + 1;
        for (var index = 0; index < weekNos.length; index++) {
            weekNo = weekNos[index];
            weekNo = (weekNo > 0) ? weekNo : 53 + weekNo + 1;
            maxDate = (weekNo === 1) ? firstWeekSpan : firstWeekSpan + ((weekNo - 1) * 7);
            minDate = (weekNo === 1) ? firstWeekSpan - 7 : firstWeekSpan + ((weekNo - 2) * 7);
            while (minDate < maxDate) {
                tempDate = new Date(stDate.getTime() + (MS_PER_DAY * minDate));
                state = validateRules(tempDate, ruleObject);
                if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                    excludeDateHandler(data, tempDate.getTime());
                    if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                        return;
                    }
                }
                minDate++;
            }
        }
        stDate = new Date(tempDate.getFullYear() + ruleObject.interval, 0, 0);
    }
}
function processYearDay(startDate, endDate, data, ruleObject) {
    var stDate = new Date(startDate.getFullYear(), 0, 0);
    var tempDate;
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var state;
    var date;
    while (compareDates(stDate, endDate)) {
        for (var index = 0; index < ruleObject.yearDay.length; index++) {
            date = ruleObject.yearDay[index];
            tempDate = new Date(stDate.getTime());
            if ((date === LEAPYEAR || date === -LEAPYEAR) && ((tempDate.getFullYear() + 1) % 4 !== 0)) {
                tempDate.setDate(tempDate.getDate() + 1);
                continue;
            }
            tempDate.setDate(tempDate.getDate() + ((date < 0) ? getMaxYearDay(tempDate.getFullYear() + 1) + 1 + date : date));
            state = validateRules(tempDate, ruleObject);
            if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                excludeDateHandler(data, tempDate.getTime());
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
            }
        }
        stDate = new Date(tempDate.getFullYear() + ruleObject.interval, 0, 0);
    }
}
function getMaxYearDay(date) {
    return (date % 4 === 0) ? LEAPYEAR : NORMALYEAR;
}
function checkYearlyType(ruleObject) {
    if (ruleObject.yearDay.length) {
        return 'YEARDAY';
    }
    else if (ruleObject.weekNo.length) {
        return 'WEEKNO';
    }
    return 'MONTH';
}
function monthlyDateTypeProcess(startDate, endDate, data, ruleObject) {
    var tempDate = new Date(startDate.getTime());
    var mainDate = new Date(startDate.getTime());
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var interval = ruleObject.interval;
    var monthInit = 0;
    var date;
    var state;
    tempDate.setDate(1);
    mainDate.setDate(1);
    if (ruleObject.month.length) {
        tempDate.setMonth(ruleObject.month[0] - 1);
    }
    while (compareDates(tempDate, endDate)) {
        for (var index = 0; index < ruleObject.monthDay.length; index++) {
            date = ruleObject.monthDay[index];
            var maxDate = (tempDate.getMonth() === 1) ?
                (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
            date = date > 0 ? date : (maxDate + date + 1);
            if ((date > 0) && validateProperDate(tempDate, date, mainDate)) {
                tempDate.setDate(date);
                if (endDate && tempDate > endDate) {
                    return;
                }
                state = validateRules(tempDate, ruleObject);
                if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                    excludeDateHandler(data, tempDate.getTime());
                    if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                        return;
                    }
                }
            }
        }
        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, interval);
    }
}
function setNextValidDate(tempDate, ruleObject, monthInit, interval, beginDate) {
    if (beginDate === void 0) { beginDate = null; }
    var monthData = beginDate ? beginDate.getMonth() : 0;
    tempDate.setDate(1);
    if (ruleObject.month.length) {
        monthInit++;
        monthInit = monthInit % ruleObject.month.length;
        tempDate.setMonth(ruleObject.month[monthInit] - 1);
        if (monthInit === 0) {
            tempDate.setFullYear(tempDate.getFullYear() + interval);
        }
    }
    else {
        if (beginDate && (beginDate.getFullYear() < tempDate.getFullYear())) {
            monthData = tempDate.getMonth() - 1;
        }
        tempDate.setMonth((beginDate ?
            monthData :
            tempDate.getMonth()) + interval);
    }
    return monthInit;
}
function monthlyDayTypeProcess(startDate, endDate, data, ruleObject) {
    var tempDate = new Date(startDate.getTime());
    var expectedDays = ruleObject.day;
    var expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    var dayCycleData = processWeekDays(expectedDays);
    var interval = ruleObject.interval;
    var state;
    var monthCollection = [];
    var weekCollection = [];
    var month;
    var index;
    var beginDate;
    var monthInit = 0;
    tempDate.setDate(1);
    if (ruleObject.month.length) {
        tempDate.setMonth(ruleObject.month[0] - 1);
    }
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate)) {
        month = tempDate.getMonth();
        beginDate = new Date(tempDate.getTime());
        if (expectedDays.length > 1) {
            while (tempDate.getMonth() === month) {
                weekCollection.push(tempDate.getTime());
                if (DAYINDEX[tempDate.getDay()] === expectedDays[expectedDays.length - 1]) {
                    monthCollection.push(weekCollection);
                    weekCollection = [];
                }
                tempDate.setDate(tempDate.getDate()
                    + dayCycleData[DAYINDEX[tempDate.getDay()]]);
            }
        }
        else {
            var currentMonthDate = new Date(tempDate.getTime());
            while (currentMonthDate.getMonth() === month) {
                monthCollection.push([currentMonthDate.getTime()]);
                currentMonthDate.setDate(currentMonthDate.getDate() + (7));
            }
        }
        index = ((ruleObject.setPosition < 1) ? (monthCollection.length + ruleObject.setPosition) : ruleObject.setPosition - 1);
        if (ruleObject.setPosition === null) {
            index = 0;
            var datas = [];
            for (var week = 0; week < monthCollection.length; week++) {
                for (var row = 0; row < monthCollection[week].length; row++) {
                    datas.push(monthCollection[week][row]);
                }
            }
            monthCollection = [datas];
        }
        for (var week = 0; week < monthCollection[index].length; week++) {
            var dayData = monthCollection[index][week];
            var chDate = new Date(dayData);
            state = validateRules(chDate, ruleObject);
            if ((chDate >= startDate) && compareDates(chDate, endDate) && state) {
                excludeDateHandler(data, dayData);
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
            }
        }
        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, interval, beginDate);
        monthCollection = [];
        weekCollection = [];
        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    }
}
function compareDates(startDate, endDate) {
    return endDate ? (startDate <= endDate) : true;
}
function checkDayIndex(day, expectedDays) {
    return (expectedDays.indexOf(DAYINDEX[day]) === -1);
}
function getStartDateForWeek(startDate, expectedDays) {
    var tempDate = new Date(startDate.getTime());
    if (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === -1) {
        do {
            tempDate.setDate(tempDate.getDate() + 1);
        } while (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === -1);
    }
    return tempDate;
}
function extractObjectFromRule(rules) {
    var ruleObject = {
        freq: null,
        interval: 1,
        count: null,
        until: null,
        day: [],
        month: [],
        weekNo: [],
        monthDay: [],
        yearDay: [],
        setPosition: null,
        validRules: []
    };
    var rulesList = rules.split(';');
    var splitData = [];
    var temp;
    rulesList.forEach(function (data) {
        splitData = data.split('=');
        switch (splitData[0]) {
            case 'UNTIL':
                temp = splitData[1];
                ruleObject.until = getDateFromRecurrenceDateString(temp);
                break;
            case 'BYDAY':
                ruleObject.day = splitData[1].split(',');
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTHDAY':
                ruleObject.monthDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTH':
                ruleObject.month = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYYEARDAY':
                ruleObject.yearDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYWEEKNO':
                ruleObject.weekNo = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'INTERVAL':
                ruleObject.interval = parseInt(splitData[1], 10);
                break;
            case 'COUNT':
                ruleObject.count = parseInt(splitData[1], 10);
                break;
            case 'BYSETPOS':
                ruleObject.setPosition = parseInt(splitData[1], 10);
                break;
            case 'FREQ':
                ruleObject.freq = splitData[1];
                break;
        }
    });
    if ((ruleObject.freq === 'MONTHLY') && (ruleObject.monthDay.length === 0)) {
        var index = ruleObject.validRules.indexOf('BYDAY');
        ruleObject.validRules.splice(index, 1);
    }
    return ruleObject;
}
function validateProperDate(tempDate, data, startDate) {
    var maxDate = (tempDate.getMonth() === 1) ? (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
    return (data <= maxDate) && (tempDate >= startDate);
}
function processWeekDays(expectedDays) {
    var dayCycle = {};
    expectedDays.forEach(function (element, index) {
        if (index === expectedDays.length - 1) {
            var startIndex = dayIndex.indexOf(element);
            var temp = startIndex;
            while (temp % 7 !== dayIndex.indexOf(expectedDays[0])) {
                temp++;
            }
            dayCycle[element] = temp - startIndex;
        }
        else {
            dayCycle[element] = dayIndex.indexOf(expectedDays[(index + 1)]) - dayIndex.indexOf(element);
        }
    });
    return dayCycle;
}
function checkMonth(tempDate, expectedMonth) {
    return (expectedMonth.indexOf(tempDate.getMonth() + 1) === -1);
}
function checkDate(tempDate, expectedDate) {
    var temp = expectedDate.slice(0);
    var data;
    var maxDate = (tempDate.getMonth() === 1) ?
        (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = data + maxDate + 1;
        }
        if (data === tempDate.getDate()) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}
function checkYear(tempDate, expectedyearDay) {
    var temp = expectedyearDay.slice(0);
    var data;
    var yearDay = getYearDay(tempDate);
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = data + getMaxYearDay(tempDate.getFullYear()) + 1;
        }
        if (data === yearDay) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}
function getYearDay(currentDate) {
    if (!startDateCollection[currentDate.getFullYear()]) {
        startDateCollection[currentDate.getFullYear()] = new Date(currentDate.getFullYear(), 0, 0);
    }
    var tempDate = startDateCollection[currentDate.getFullYear()];
    var diff = currentDate.getTime() - tempDate.getTime();
    return Math.ceil(diff / MS_PER_DAY);
}
function validateMonthlyRuleType(ruleObject) {
    if (ruleObject.monthDay.length && !ruleObject.day.length) {
        return 'date';
    }
    else if (!ruleObject.monthDay.length && ruleObject.day.length) {
        return 'day';
    }
    return 'both';
}
function rotate(days) {
    var data = days.shift();
    days.push(data);
}
function setFirstDayOfWeek(day) {
    while (dayIndex[0] !== day) {
        rotate(dayIndex);
    }
}
function validateRules(tempDate, ruleObject) {
    var state = true;
    var expectedDays = ruleObject.day;
    var expectedMonth = ruleObject.month;
    var expectedDate = ruleObject.monthDay;
    var expectedyearDay = ruleObject.yearDay;
    ruleObject.validRules.forEach(function (rule) {
        switch (rule) {
            case 'BYDAY':
                if (checkDayIndex(tempDate.getDay(), expectedDays)) {
                    state = false;
                }
                break;
            case 'BYMONTH':
                if (checkMonth(tempDate, expectedMonth)) {
                    state = false;
                }
                break;
            case 'BYMONTHDAY':
                if (checkDate(tempDate, expectedDate)) {
                    state = false;
                }
                break;
            case 'BYYEARDAY':
                if (checkYear(tempDate, expectedyearDay)) {
                    state = false;
                }
                break;
        }
    });
    return state;
}
var startDateCollection = {};
var tempExcludeDate;
var dayIndex = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
var maxOccurrence;
var tempViewDate;
var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYINDEX = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
var MAXOCCURRENCE = 43;
var LEAPYEAR = 366;
var NORMALYEAR = 365;
var WEEKPOS = ['first', 'second', 'third', 'fourth', 'last'];
var TIMES = 'summaryTimes';
var ON = 'summaryOn';
var EVERY = 'every';
var UNTIL = 'summaryUntil';
var DAYS = 'summaryDay';
var WEEKS = 'summaryWeek';
var MONTHS = 'summaryMonth';
var YEARS = 'summaryYear';
var DAYINDEXOBJECT = {
    SU: 'sun',
    MO: 'mon',
    TU: 'tue',
    WE: 'wed',
    TH: 'thu',
    FR: 'fri',
    SA: 'sat'
};
function getRecurrenceStringFromDate(date) {
    return [date.getUTCFullYear(),
        roundDateValues(date.getUTCMonth() + 1),
        roundDateValues(date.getUTCDate()),
        'T',
        roundDateValues(date.getUTCHours()),
        roundDateValues(date.getUTCMinutes()),
        roundDateValues(date.getUTCSeconds()),
        'Z'].join('');
}
function roundDateValues(date) {
    return ('0' + date).slice(-2);
}

/**
 * EventBase for appointment rendering
 */
var EventBase = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for EventBase
     */
    function EventBase(parent) {
        this.slots = [];
        this.parent = parent;
        this.timezone = new Timezone();
    }
    EventBase.prototype.processData = function (events, timeZonePropChanged, oldTimezone) {
        var _this = this;
        var start = this.parent.activeView.startDate();
        var end = this.parent.activeView.endDate();
        var fields = this.parent.eventFields;
        this.parent.eventsProcessed = [];
        var processed = [];
        var temp = 1;
        var generateID = false;
        if (events.length > 0 && isNullOrUndefined(events[0][fields.id])) {
            generateID = true;
        }
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            if (generateID) {
                event_1[fields.id] = temp++;
            }
            if (typeof event_1[fields.startTime] === 'string') {
                event_1[fields.startTime] = getDateFromString(event_1[fields.startTime]);
            }
            if (typeof event_1[fields.endTime] === 'string') {
                event_1[fields.endTime] = getDateFromString(event_1[fields.endTime]);
            }
            if (timeZonePropChanged) {
                this.processTimezoneChange(event_1, oldTimezone);
            }
            else {
                this.processTimezone(event_1);
            }
            if (!isNullOrUndefined(event_1[fields.recurrenceRule]) && isNullOrUndefined(event_1[fields.recurrenceID])) {
                processed = processed.concat(this.generateOccurrence(event_1));
            }
            else {
                event_1.Guid = this.generateGuid();
                processed.push(event_1);
            }
        }
        var eventData = processed.filter(function (data) { return !data[_this.parent.eventFields.isBlock]; });
        this.parent.eventsProcessed = this.filterEvents(start, end, eventData);
        var blockData = processed.filter(function (data) { return data[_this.parent.eventFields.isBlock]; });
        blockData.forEach(function (eventObj) {
            if (eventObj[fields.isAllDay]) {
                eventObj[fields.startTime] = resetTime(eventObj[fields.startTime]);
                eventObj[fields.endTime] = addDays(resetTime(eventObj[fields.endTime]), 1);
            }
        });
        this.parent.blockProcessed = this.filterEvents(start, end, blockData);
        return eventData;
    };
    EventBase.prototype.timezonePropertyChange = function (oldTimezone) {
        var processed = this.processData(this.parent.eventsData, true, oldTimezone);
        this.parent.notify(dataReady, { processedData: processed });
    };
    /** @private */
    EventBase.prototype.timezoneConvert = function (eventData) {
        var fields = this.parent.eventFields;
        eventData[fields.startTimezone] = eventData[fields.startTimezone] || eventData[fields.endTimezone];
        eventData[fields.endTimezone] = eventData[fields.endTimezone] || eventData[fields.startTimezone];
        if (this.parent.timezone) {
            var startTz = eventData[fields.startTimezone];
            var endTz = eventData[fields.endTimezone];
            eventData[fields.startTime] =
                this.timezone.convert(eventData[fields.startTime], this.parent.timezone, startTz);
            eventData[fields.endTime] =
                this.timezone.convert(eventData[fields.endTime], this.parent.timezone, endTz);
        }
    };
    EventBase.prototype.processTimezoneChange = function (event, oldTimezone) {
        var fields = this.parent.eventFields;
        if (oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.convert(event[fields.startTime], oldTimezone, this.parent.timezone);
            event[fields.endTime] = this.timezone.convert(event[fields.endTime], oldTimezone, this.parent.timezone);
        }
        else if (!oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], this.parent.timezone);
        }
        else if (oldTimezone && !this.parent.timezone) {
            event[fields.startTime] = this.timezone.remove(event[fields.startTime], oldTimezone);
            event[fields.endTime] = this.timezone.remove(event[fields.endTime], oldTimezone);
        }
    };
    EventBase.prototype.processTimezone = function (event) {
        var fields = this.parent.eventFields;
        if (event[fields.startTimezone] || event[fields.endTimezone]) {
            var startTimezone = event[fields.startTimezone] || event[fields.endTimezone];
            var endTimezone = event[fields.endTimezone] || event[fields.startTimezone];
            event[fields.startTime] = this.timezone.add(event[fields.startTime], startTimezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], endTimezone);
            if (this.parent.timezone) {
                var zone = this.parent.timezone;
                event[fields.startTime] = this.timezone.convert(event[fields.startTime], startTimezone, zone);
                event[fields.endTime] = this.timezone.convert(event[fields.endTime], endTimezone, zone);
            }
        }
        else if (this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], this.parent.timezone);
        }
    };
    EventBase.prototype.filterBlockEvents = function (eventObj) {
        var eStart = eventObj[this.parent.eventFields.startTime];
        var eEnd = eventObj[this.parent.eventFields.endTime];
        var resourceData;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var data = this.getGroupIndexFromEvent(eventObj);
            resourceData = this.parent.resourceBase.lastResourceLevel[data];
        }
        return this.filterEvents(eStart, eEnd, this.parent.blockProcessed, resourceData);
    };
    EventBase.prototype.filterEvents = function (startDate, endDate, appointments, resourceTdData) {
        if (appointments === void 0) { appointments = this.parent.eventsProcessed; }
        var fieldMapping = this.parent.eventFields;
        var predicate = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate)).
            and(new Predicate(fieldMapping.startTime, 'lessthan', endDate)).
            or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        var filter = new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
        if (resourceTdData) {
            filter = this.filterEventsByResource(resourceTdData, filter);
        }
        return this.sortByTime(filter);
    };
    EventBase.prototype.filterEventsByResource = function (resourceTdData, appointments) {
        if (appointments === void 0) { appointments = this.parent.eventsProcessed; }
        var predicate;
        var resourceCollection = this.parent.resourceBase.resourceCollection;
        for (var level = 0; level < resourceCollection.length; level++) {
            var operator = this.parent.activeViewOptions.group.allowGroupEdit && resourceCollection[level].allowMultiple ?
                'contains' : 'equal';
            var tempPredicate = new Predicate(resourceCollection[level].field, operator, resourceTdData.groupOrder[level]);
            predicate = predicate ? predicate.and(tempPredicate) : tempPredicate;
        }
        return new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
    };
    EventBase.prototype.sortByTime = function (appointments) {
        var fieldMapping = this.parent.eventFields;
        appointments.sort(function (a, b) {
            var d1 = a[fieldMapping.startTime];
            var d2 = b[fieldMapping.startTime];
            return d1.getTime() - d2.getTime();
        });
        return appointments;
    };
    EventBase.prototype.sortByDateTime = function (appointments) {
        var fieldMapping = this.parent.eventFields;
        appointments.sort(function (object1, object2) {
            var d3 = object1[fieldMapping.startTime];
            var d4 = object2[fieldMapping.startTime];
            var d5 = object1[fieldMapping.endTime];
            var d6 = object2[fieldMapping.endTime];
            var d1 = d5.getTime() - d3.getTime();
            var d2 = d6.getTime() - d4.getTime();
            return (d3.getTime() - d4.getTime() || d2 - d1);
        });
        return appointments;
    };
    EventBase.prototype.getSmallestMissingNumber = function (array) {
        var large = Math.max.apply(Math, array);
        for (var i = 0; i < large; i++) {
            if (array.indexOf(i) === -1) {
                return i;
            }
        }
        return large + 1;
    };
    EventBase.prototype.splitEventByDay = function (event) {
        var eventFields = this.parent.eventFields;
        var data = [];
        var eventStartTime = event[eventFields.startTime];
        var eventEndTime = event[eventFields.endTime];
        var isDifferentDate = resetTime(new Date(eventStartTime.getTime())) <
            resetTime(new Date(eventEndTime.getTime()));
        if (isDifferentDate) {
            var start = new Date(eventStartTime.getTime());
            var end = addDays(resetTime(new Date(eventStartTime.getTime())), 1);
            var endDate = (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0) ?
                eventEndTime : addDays(eventEndTime, 1);
            var index = 1;
            var eventLength = getDaysCount(eventStartTime.getTime(), endDate.getTime());
            while (end <= eventEndTime) {
                var app = extend({}, event);
                app[eventFields.startTime] = start;
                app[eventFields.endTime] = end;
                app.data = { index: index, count: eventLength };
                app.Guid = this.generateGuid();
                app.isSpanned = true;
                data.push(app);
                start = end;
                if ((new Date(start.getTime()).setHours(0, 0, 0, 0) === new Date(eventEndTime.getTime()).setHours(0, 0, 0, 0))
                    && !(end.getTime() === eventEndTime.getTime())) {
                    end = new Date(new Date(start.getTime()).setHours(eventEndTime.getHours(), eventEndTime.getMinutes()));
                }
                else {
                    end = addDays(resetTime(new Date(start.getTime())), 1);
                }
                index++;
            }
        }
        else {
            data.push(event);
        }
        return data;
    };
    EventBase.prototype.splitEvent = function (event, dateRender) {
        var fields = this.parent.eventFields;
        var start = resetTime(new Date(event[fields.startTime] + '')).getTime();
        var end = resetTime(new Date(event[fields.endTime] + '')).getTime();
        if (getDateInMs(event[fields.endTime]) <= 0) {
            var temp = addDays(resetTime(new Date(event[fields.endTime] + '')), -1).getTime();
            end = start > temp ? start : temp;
        }
        var orgStart = start;
        var orgEnd = end;
        var ranges = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            var cStart = start;
            for (var level = 0; level < this.slots.length; level++) {
                var slot = this.slots[level];
                var firstSlot = slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.currentView !== 'WorkWeek' && this.parent.currentView !== 'TimelineWorkWeek') {
                    var startIndex = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        var endIndex = slot.indexOf(end);
                        var hasBreak = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        var count = ((endIndex - startIndex) + 1);
                        var isLeft = (slot[startIndex] !== orgStart);
                        var isRight = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                }
                else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        var availSlot = [];
                        for (var i = 0; i < slot.length; i++) {
                            if (this.dateInRange(slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                var isLeft = (availSlot[0] !== orgStart);
                                var isRight = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            }
                            else {
                                for (var _i = 0, availSlot_1 = availSlot; _i < availSlot_1.length; _i++) {
                                    var slot_1 = availSlot_1[_i];
                                    ranges.push(this.cloneEventObject(event, slot_1, slot_1, 1, (slot_1 !== orgStart), (slot_1 !== orgEnd)));
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            ranges.push(this.cloneEventObject(event, start, end, 1, false, false));
        }
        return ranges;
    };
    EventBase.prototype.cloneEventObject = function (event, start, end, count, isLeft, isRight) {
        var fields = this.parent.eventFields;
        var e = extend({}, event, null, true);
        var data = { count: count, isLeft: isLeft, isRight: isRight };
        data[fields.startTime] = event[fields.startTime];
        data[fields.endTime] = event[fields.endTime];
        e.data = data;
        e[fields.startTime] = new Date(start);
        e[fields.endTime] = new Date(end);
        return e;
    };
    EventBase.prototype.dateInRange = function (date, start, end) {
        return start <= date && date <= end;
    };
    EventBase.prototype.getSelectedEventElements = function (target) {
        this.removeSelectedAppointmentClass();
        if (this.parent.selectedElements.length <= 0) {
            this.parent.selectedElements.push(target);
        }
        else {
            var isAlreadySelected = this.parent.selectedElements.filter(function (element) {
                return element.getAttribute('data-guid') === target.getAttribute('data-guid');
            });
            if (isAlreadySelected.length <= 0) {
                var focusElements = [].slice.call(this.parent.element.
                    querySelectorAll('div[data-guid="' + target.getAttribute('data-guid') + '"]'));
                for (var _i = 0, focusElements_1 = focusElements; _i < focusElements_1.length; _i++) {
                    var element = focusElements_1[_i];
                    this.parent.selectedElements.push(element);
                }
            }
            else {
                var selectedElements = this.parent.selectedElements.filter(function (element) {
                    return element.getAttribute('data-guid') !== target.getAttribute('data-guid');
                });
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    };
    EventBase.prototype.getSelectedEvents = function () {
        var _this = this;
        var eventSelect = [];
        var elementSelect = [];
        var selectAppointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
        selectAppointments.filter(function (element) {
            eventSelect.push(_this.getEventByGuid(element.getAttribute('data-guid')));
            elementSelect.push(element);
        });
        return {
            event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0]
        };
    };
    EventBase.prototype.removeSelectedAppointmentClass = function () {
        var selectedAppointments = this.getSelectedAppointments();
        for (var _i = 0, selectedAppointments_1 = selectedAppointments; _i < selectedAppointments_1.length; _i++) {
            var appointment = selectedAppointments_1[_i];
            appointment.setAttribute('aria-selected', 'false');
        }
        removeClass(selectedAppointments, APPOINTMENT_BORDER);
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, AGENDA_SELECTED_CELL);
        }
    };
    EventBase.prototype.addSelectedAppointments = function (cells) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.setAttribute('aria-selected', 'true');
        }
        this.parent.removeSelectedClass();
        addClass(cells, APPOINTMENT_BORDER);
    };
    EventBase.prototype.getSelectedAppointments = function () {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER + ',.' + APPOINTMENT_CLASS + ':focus'));
    };
    EventBase.prototype.focusElement = function () {
        var selectedCell = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                var target = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]);
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
            }
            return;
        }
        var selectedAppointments = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            selectedAppointments[selectedAppointments.length - 1].focus();
            return;
        }
    };
    EventBase.prototype.selectWorkCellByTime = function (eventsData) {
        var target;
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            return target;
        }
        if (eventsData.length > 0) {
            var selectedObject = eventsData[eventsData.length - 1];
            var eventStartTime = selectedObject[this.parent.eventFields.startTime];
            var nearestTime = new Date(+eventStartTime).setMinutes(0, 0, 0);
            var isAllDay = this.isAllDayAppointment(selectedObject);
            if (this.parent.currentView === 'Month' || isAllDay) {
                nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
            }
            var targetArea = void 0;
            if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
                targetArea = this.parent.getAllDayRow();
            }
            else {
                targetArea = this.parent.getContentTable();
            }
            var queryString = '[data-date="' + nearestTime + '"]';
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                queryString += '[data-group-index="' + this.getGroupIndexFromEvent(selectedObject) + '"]';
            }
            target = targetArea.querySelector(queryString);
            if (target) {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
                if (this.parent.keyboardInteractionModule) {
                    this.parent.keyboardInteractionModule.selectCells(false, target);
                }
                return target;
            }
        }
        return target;
    };
    EventBase.prototype.getGroupIndexFromEvent = function (eventData) {
        var groupOrder = [];
        var groupIndex = 0;
        for (var _i = 0, _a = this.parent.resourceBase.resourceCollection; _i < _a.length; _i++) {
            var resourceData = _a[_i];
            groupOrder.push(eventData[resourceData.field]);
        }
        this.parent.resourceBase.lastResourceLevel.forEach(function (resource) {
            var count;
            var order = resource.groupOrder;
            order.forEach(function (resIndex, index) {
                var resValue = (groupOrder[index] instanceof Array) ? groupOrder[index][index] : groupOrder[index];
                if (resValue === resIndex) {
                    count = count ? count + 1 : 1;
                }
            });
            if (order.length === count) {
                groupIndex = resource.groupIndex;
            }
        });
        return groupIndex;
    };
    EventBase.prototype.isAllDayAppointment = function (event) {
        var fieldMapping = this.parent.eventFields;
        var isAllDay = event[fieldMapping.isAllDay];
        var isFullDay = ((event[fieldMapping.endTime].getTime() - event[fieldMapping.startTime].getTime())
            / MS_PER_DAY) >= 1;
        return (isAllDay || isFullDay) ? true : false;
    };
    EventBase.prototype.addEventListener = function () {
        this.parent.on(documentClick, this.appointmentBorderRemove, this);
    };
    EventBase.prototype.appointmentBorderRemove = function (event) {
        var element = event.event.target;
        if (closest(element, '.' + APPOINTMENT_CLASS)) {
            this.parent.removeSelectedClass();
        }
        else if (!closest(element, '.' + POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    };
    EventBase.prototype.wireAppointmentEvents = function (element, isAllDay, event) {
        if (isAllDay === void 0) { isAllDay = false; }
        if (this.parent.calendarMode === 'Islamic' && (!isNullOrUndefined(event[this.parent.eventFields.recurrenceRule]) ||
            !isNullOrUndefined(event[this.parent.eventFields.recurrenceID]))) {
            return;
        }
        var isReadOnly = (!isNullOrUndefined(event)) ? event[this.parent.eventFields.isReadonly] : false;
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
            EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
        }
        if (!this.parent.activeViewOptions.readonly && !isReadOnly && ['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) === -1) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element, isAllDay);
            }
        }
    };
    EventBase.prototype.renderResizeHandler = function (element, spanEvent, isReadOnly) {
        if (!this.parent.resizeModule || !this.parent.allowResizing || this.parent.activeViewOptions.readonly || isReadOnly) {
            return;
        }
        for (var _i = 0, _a = Object.keys(spanEvent); _i < _a.length; _i++) {
            var resizeEdge = _a[_i];
            var resizeHandler = createElement('div', { className: EVENT_RESIZE_CLASS });
            switch (resizeEdge) {
                case 'isLeft':
                    if (!spanEvent.isLeft) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? RIGHT_RESIZE_HANDLER : LEFT_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isRight':
                    if (!spanEvent.isRight) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? LEFT_RESIZE_HANDLER : RIGHT_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
                case 'isTop':
                    if (!spanEvent.isTop) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], TOP_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isBottom':
                    if (!spanEvent.isBottom) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], BOTTOM_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
            }
        }
    };
    EventBase.prototype.eventClick = function (eventData) {
        var _this = this;
        var target = eventData.target;
        if (target.classList.contains(DRAG_CLONE_CLASS) || target.classList.contains(RESIZE_CLONE_CLASS)) {
            return;
        }
        var raiseClickEvent = function (isMultiple) {
            _this.activeEventData(eventData, isMultiple);
            var args = extend(_this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            _this.parent.trigger(eventClick, args);
            return args.cancel;
        };
        if (eventData.ctrlKey && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
            var target_1 = closest(eventData.target, '.' + APPOINTMENT_CLASS);
            this.getSelectedEventElements(target_1);
            raiseClickEvent(false);
            return;
        }
        this.removeSelectedAppointmentClass();
        if (raiseClickEvent(true)) {
            this.removeSelectedAppointmentClass();
            return;
        }
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            addClass([this.parent.activeEventData.element], AGENDA_SELECTED_CELL);
        }
        this.parent.notify(eventClick, this.parent.activeEventData);
    };
    EventBase.prototype.eventDoubleClick = function (e) {
        this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        if (!isNullOrUndefined(this.parent.activeEventData.event) &&
            isNullOrUndefined(this.parent.activeEventData.event[this.parent.eventFields.recurrenceID])) {
            this.parent.currentAction = 'Save';
            this.parent.eventWindow.openEditor(this.parent.activeEventData.event, 'Save');
        }
        else {
            this.parent.currentAction = 'EditOccurrence';
            this.parent.quickPopup.openRecurrenceAlert();
        }
    };
    EventBase.prototype.getEventByGuid = function (guid) {
        return new DataManager({ json: this.parent.eventsProcessed }).executeLocal(new Query().where('Guid', 'equal', guid))[0];
    };
    EventBase.prototype.generateGuid = function () {
        return 'xyxxxxyx-xxxy-yxxx-xyxx-xxyxxxxyyxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    EventBase.prototype.getEventIDType = function () {
        if (this.parent.eventsData.length !== 0) {
            return typeof (this.parent.eventsData[0][this.parent.eventFields.id]);
        }
        if (this.parent.blockData.length !== 0) {
            return typeof (this.parent.blockData[0][this.parent.eventFields.id]);
        }
        return 'string';
    };
    EventBase.prototype.getEventMaxID = function (resourceId) {
        var _this = this;
        if (this.parent.eventsData.length < 1 && this.parent.blockData.length < 1) {
            return 1;
        }
        var eventId;
        var idType = this.getEventIDType();
        if (idType === 'string') {
            eventId = uniqueID().toString();
        }
        if (idType === 'number') {
            var datas = this.parent.eventsData.concat(this.parent.blockData);
            var maxId = Math.max.apply(Math, datas.map(function (event) { return event[_this.parent.eventFields.id]; }));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    };
    EventBase.prototype.activeEventData = function (eventData, isMultiple) {
        var _this = this;
        var target = closest(eventData.target, '.' + APPOINTMENT_CLASS);
        var guid = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
        }
        var eventObject = this.getEventByGuid(guid);
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter(function (obj) {
                return obj[_this.parent.eventFields.id] === eventObject[_this.parent.eventFields.id];
            })[0];
        }
        this.parent.activeEventData = { event: eventObject, element: target };
    };
    EventBase.prototype.generateOccurrence = function (event, viewDate) {
        var fields = this.parent.eventFields;
        var startDate = event[fields.startTime];
        var endDate = event[fields.endTime];
        var occurrenceCollection = [];
        var currentViewDate = isNullOrUndefined(viewDate) ? this.parent.activeView.startDate() : viewDate;
        var eventRule = event[fields.recurrenceRule];
        var duration = endDate.getTime() - startDate.getTime();
        currentViewDate = new Date(+currentViewDate - duration);
        var dates = generate(startDate, eventRule, event[fields.recurrenceException], this.parent.firstDayOfWeek, undefined, currentViewDate);
        if (this.parent.currentView === 'Agenda' && eventRule.indexOf('COUNT') === -1 && eventRule.indexOf('UNTIL') === -1) {
            if (isNullOrUndefined(event.generatedDates)) {
                event.generatedDates = { start: new Date(dates[0]), end: new Date(dates[dates.length - 1]) };
            }
            else {
                if (dates[0] < event.generatedDates.start.getTime()) {
                    event.generatedDates.start = new Date(dates[0]);
                }
                if (dates[dates.length - 1] > event.generatedDates.end.getTime()) {
                    event.generatedDates.end = new Date(dates[dates.length - 1]);
                }
            }
        }
        var date = dates.shift();
        while (date) {
            var clonedObject = extend({}, event, null, true);
            clonedObject[fields.startTime] = new Date(date);
            clonedObject[fields.endTime] = new Date(new Date(date).setMilliseconds(duration));
            clonedObject[fields.recurrenceID] = clonedObject[fields.id];
            clonedObject.Guid = this.generateGuid();
            occurrenceCollection.push(clonedObject);
            date = dates.shift();
        }
        return occurrenceCollection;
    };
    EventBase.prototype.getRecurrenceEvent = function (eventData) {
        var eventFields = this.parent.eventFields;
        var parentApp = new DataManager(this.parent.eventsData).
            executeLocal(new Query().where(eventFields.id, 'equal', eventData[eventFields.recurrenceID]));
        return parentApp[0];
    };
    EventBase.prototype.getOccurrencesByID = function (id) {
        var fields = this.parent.eventFields;
        var occurrenceCollection = [];
        var parentObject = this.parent.eventsData.filter(function (obj) { return obj[fields.id] === id; });
        for (var _i = 0, _a = parentObject; _i < _a.length; _i++) {
            var event_2 = _a[_i];
            if (!isNullOrUndefined(event_2[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event_2));
            }
        }
        return occurrenceCollection;
    };
    EventBase.prototype.getOccurrencesByRange = function (startTime, endTime) {
        var fields = this.parent.eventFields;
        var occurrenceCollection = [];
        for (var _i = 0, _a = this.parent.eventsData; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            if (!isNullOrUndefined(event_3[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event_3));
            }
        }
        var filter = occurrenceCollection.filter(function (obj) {
            return obj[fields.startTime] >= startTime && obj[fields.endTime] <= endTime && !isNullOrUndefined(obj[fields.recurrenceID]);
        });
        return filter;
    };
    EventBase.prototype.applyResourceColor = function (element, eventData, type, groupOrder, alpha) {
        if (!this.parent.resourceBase) {
            return;
        }
        var alphaColor = function (color, alpha) {
            color = color.replace('#', '');
            var r = parseInt(color.substring(0, color.length / 3), 16);
            var g = parseInt(color.substring(color.length / 3, 2 * color.length / 3), 16);
            var b = parseInt(color.substring(2 * color.length / 3, 3 * color.length / 3), 16);
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        };
        var color = this.parent.resourceBase.getResourceColor(eventData, groupOrder);
        if (color) {
            // tslint:disable-next-line:no-any
            element.style[type] = !isNullOrUndefined(alpha) ? alphaColor(color, alpha) : color;
        }
    };
    EventBase.prototype.createBlockAppointmentElement = function (record, resIndex) {
        var eventSubject = (record[this.parent.eventFields.subject] || this.parent.eventSettings.fields.subject.default);
        var appointmentWrapper = createElement('div', {
            className: BLOCK_APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.parent.eventFields.id],
                'aria-readonly': 'true', 'aria-selected': 'false', 'aria-label': eventSubject
            }
        });
        var templateElement;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            var appointmentSubject = createElement('div', {
                className: SUBJECT_CLASS, innerHTML: eventSubject
            });
            templateElement = [appointmentSubject];
        }
        append(templateElement, appointmentWrapper);
        this.setWrapperAttributes(appointmentWrapper, resIndex);
        return appointmentWrapper;
    };
    EventBase.prototype.setWrapperAttributes = function (appointmentWrapper, resIndex) {
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
    };
    EventBase.prototype.getReadonlyAttribute = function (event) {
        return (event[this.parent.eventFields.isReadonly]) ?
            event[this.parent.eventFields.isReadonly] : 'false';
    };
    EventBase.prototype.isBlockRange = function (eventData) {
        var _this = this;
        var eventCollection = (eventData instanceof Array) ? eventData : [eventData];
        var isBlockAlert = false;
        var fields = this.parent.eventFields;
        eventCollection.forEach(function (event) {
            var dataCol = [];
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                dataCol = _this.parent.eventBase.generateOccurrence(event);
            }
            else {
                dataCol.push(event);
            }
            for (var _i = 0, dataCol_1 = dataCol; _i < dataCol_1.length; _i++) {
                var data = dataCol_1[_i];
                var filterBlockEvents = _this.parent.eventBase.filterBlockEvents(data);
                if (filterBlockEvents.length > 0) {
                    isBlockAlert = true;
                    break;
                }
            }
        });
        this.parent.uiStateValues.isBlock = isBlockAlert;
        return isBlockAlert;
    };
    return EventBase;
}());

/**
 * Schedule CRUD operations
 */
var Crud = /** @__PURE__ @class */ (function () {
    function Crud(parent) {
        this.parent = parent;
        this.timezone = new Timezone();
    }
    Crud.prototype.getQuery = function () {
        var start = this.parent.activeView.startDate();
        var end = this.parent.activeView.endDate();
        return this.parent.dataModule.generateQuery(start, end);
    };
    Crud.prototype.getTable = function () {
        if (this.parent.eventSettings.query) {
            var query = this.parent.eventSettings.query.clone();
            return query.fromTable;
        }
        return null;
    };
    Crud.prototype.refreshData = function (args) {
        var _this = this;
        var actionArgs = { requestType: args.requestType, cancel: false, data: args.data };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(actionComplete, actionArgs);
            this.parent.renderModule.refreshDataManager();
            return;
        }
        else {
            args.promise.then(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(actionComplete, actionArgs);
                if (actionArgs.cancel) {
                    return;
                }
                _this.parent.renderModule.refreshDataManager();
            }).catch(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(actionFailure, { error: e });
            });
        }
    };
    Crud.prototype.addEvent = function (eventData) {
        if (this.parent.eventBase.isBlockRange(eventData)) {
            this.parent.quickPopup.openValidationError('blockAlert');
            return;
        }
        var fields = this.parent.eventFields;
        var promise = null;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        var args = {
            cancel: false,
            data: (eventData instanceof Array) ? eventData : [eventData],
            requestType: 'eventCreate'
        };
        this.parent.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        if (eventData instanceof Array) {
            for (var _i = 0, _a = eventData; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                this.processCrudTimezone(event_1);
                editParms.addedRecords.push(event_1);
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        else {
            this.processCrudTimezone(eventData);
            promise = this.parent.dataModule.dataManager.insert(eventData, this.getTable(), this.getQuery());
        }
        var crudArgs = { requestType: 'eventCreated', cancel: false, data: eventData, promise: promise };
        this.refreshData(crudArgs);
    };
    Crud.prototype.saveEvent = function (event, action) {
        if (this.parent.eventBase.isBlockRange(event)) {
            this.parent.quickPopup.openValidationError('blockAlert');
            return;
        }
        var fields = this.parent.eventFields;
        var promise = null;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        var args = { requestType: 'eventChange', cancel: false };
        var data = event;
        if (isNullOrUndefined(action)) {
            args.data = data;
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
            this.processCrudTimezone(data);
            if ((event instanceof Array)) {
                editParms.changedRecords = event;
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
            }
            else {
                promise = this.parent.dataModule.dataManager.update(fields.id, event, this.getTable(), this.getQuery());
            }
        }
        else {
            var parentEvent = this.parent.eventBase.getRecurrenceEvent(data);
            var query = void 0;
            switch (action) {
                case 'EditOccurrence':
                    args.data = { occurrence: event, parent: parentEvent };
                    this.parent.trigger(actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where('Guid', 'equal', data.Guid);
                    var edited = new DataManager(this.parent.eventsProcessed).executeLocal(query);
                    var exDate = this.excludeDateCheck(edited[0][fields.startTime], parentEvent[fields.recurrenceException]);
                    if (exDate !== parentEvent[fields.recurrenceException]) {
                        parentEvent[fields.recurrenceException] = exDate;
                        data[fields.recurrenceID] = parentEvent[fields.id];
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        this.processCrudTimezone(data);
                        editParms.addedRecords.push(data);
                    }
                    else {
                        this.processCrudTimezone(data);
                        editParms.changedRecords.push(data);
                    }
                    break;
                case 'EditSeries':
                    args.data = data;
                    this.parent.trigger(actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where(fields.recurrenceID, 'equal', parentEvent[fields.id]);
                    var delApp = new DataManager(this.parent.eventsData).executeLocal(query);
                    data[fields.id] = parentEvent[fields.id];
                    data[fields.recurrenceException] = null;
                    data[fields.recurrenceID] = null;
                    this.processCrudTimezone(data);
                    editParms.changedRecords.push(data);
                    for (var _i = 0, delApp_1 = delApp; _i < delApp_1.length; _i++) {
                        var event_2 = delApp_1[_i];
                        editParms.deletedRecords.push(event_2);
                    }
                    break;
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        // if (!this.parent.activeView.isTimelineView()) {
        //     this.parent.eventBase.selectWorkCellByTime(dataObj);
        // }
        var crudArgs = { requestType: 'eventChanged', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    };
    Crud.prototype.deleteEvent = function (id, action) {
        var fields = this.parent.eventFields;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        var dataObj = [];
        var normalEvent = [];
        var recEvent = [];
        switch (typeof id) {
            case 'string':
            case 'number':
                dataObj = new DataManager(this.parent.eventsData).executeLocal(new Query().where(fields.id, 'equal', id));
                break;
            case 'object':
                dataObj = (id instanceof Array) ? id : [id];
                break;
        }
        for (var _i = 0, _a = dataObj; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            (!isNullOrUndefined(event_3[fields.recurrenceRule])) ? recEvent.push(event_3) : normalEvent.push(event_3);
        }
        var args = { requestType: 'eventRemove', cancel: false };
        if (action !== 'DeleteOccurrence') {
            args.data = dataObj;
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
        }
        if (isNullOrUndefined(action) || normalEvent.length > 0) {
            for (var _b = 0, normalEvent_1 = normalEvent; _b < normalEvent_1.length; _b++) {
                var event_4 = normalEvent_1[_b];
                editParms.deletedRecords.push(event_4);
            }
        }
        if (recEvent.length > 0) {
            switch (action) {
                case 'Delete':
                case 'DeleteOccurrence':
                    for (var i = 0; i < recEvent.length; i++) {
                        var parentEvent = this.parent.eventBase.getRecurrenceEvent(recEvent[i]);
                        args.data = { occurrence: recEvent[i], parent: parentEvent };
                        this.parent.trigger(actionBegin, args);
                        if (args.cancel) {
                            return;
                        }
                        parentEvent[fields.recurrenceException] =
                            this.excludeDateCheck(recEvent[i][fields.startTime], parentEvent[fields.recurrenceException]);
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        if (recEvent[i][fields.id] !== parentEvent[fields.id]) {
                            editParms.deletedRecords.push(recEvent[i]);
                        }
                    }
                    break;
                case 'DeleteSeries':
                    for (var _c = 0, recEvent_1 = recEvent; _c < recEvent_1.length; _c++) {
                        var app = recEvent_1[_c];
                        var predicate = new Predicate(fields.id, 'equal', (app[fields.recurrenceID] || id)).
                            or(new Predicate(fields.recurrenceID, 'equal', (app[fields.recurrenceID] || id)));
                        var delApp = new DataManager(this.parent.eventsData).executeLocal(new Query().where(predicate));
                        for (var _d = 0, delApp_2 = delApp; _d < delApp_2.length; _d++) {
                            var event_5 = delApp_2[_d];
                            editParms.deletedRecords.push(event_5);
                        }
                    }
                    break;
            }
        }
        var promise;
        if (editParms.deletedRecords.length === 1 && editParms.changedRecords.length === 0) {
            var deleteEvent = editParms.deletedRecords[0];
            promise =
                this.parent.dataModule.dataManager.remove(fields.id, deleteEvent, this.getTable(), this.getQuery());
        }
        else {
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        this.parent.eventBase.selectWorkCellByTime(dataObj);
        var crudArgs = { requestType: 'eventRemoved', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    };
    Crud.prototype.processCrudTimezone = function (events) {
        var fields = this.parent.eventFields;
        if (events[fields.startTimezone] || events[fields.endTimezone]) {
            var startTimezone = events[fields.startTimezone] || events[fields.endTimezone];
            var endTimezone = events[fields.endTimezone] || events[fields.startTimezone];
            if (this.parent.timezone) {
                var zone = this.parent.timezone;
                events[fields.startTime] = this.timezone.convert(events[fields.startTime], startTimezone, zone);
                events[fields.endTime] = this.timezone.convert(events[fields.endTime], endTimezone, zone);
                events[fields.startTime] = this.timezone.remove(events[fields.startTime], zone);
                events[fields.endTime] = this.timezone.remove(events[fields.endTime], zone);
            }
            else {
                events[fields.startTime] = this.timezone.remove(events[fields.startTime], startTimezone);
                events[fields.endTime] = this.timezone.remove(events[fields.endTime], endTimezone);
            }
        }
        else if (this.parent.timezone) {
            events[fields.startTime] = this.timezone.remove(events[fields.startTime], this.parent.timezone);
            events[fields.endTime] = this.timezone.remove(events[fields.endTime], this.parent.timezone);
        }
    };
    Crud.prototype.excludeDateCheck = function (eventStartTime, exceptionDateList) {
        var exDate = getRecurrenceStringFromDate(eventStartTime);
        if (!isNullOrUndefined(exceptionDateList)) {
            if (exceptionDateList.indexOf(exDate) === -1) {
                exceptionDateList = !(isNullOrUndefined(exceptionDateList)) ? exceptionDateList + ',' + exDate : exDate;
            }
        }
        else {
            exceptionDateList = exDate;
        }
        return exceptionDateList;
    };
    return Crud;
}());

/**
 * Appointment window field validation
 */
var FieldValidator = /** @__PURE__ @class */ (function () {
    function FieldValidator() {
    }
    FieldValidator.prototype.renderFormValidator = function (form, rules, element) {
        var _this = this;
        this.element = element;
        this.formObj = new FormValidator(form, {
            customPlacement: function (inputElement, error) {
                _this.errorPlacement(inputElement, error);
            },
            rules: rules,
            validationComplete: function (args) {
                _this.validationComplete(args);
            }
        });
    };
    FieldValidator.prototype.validationComplete = function (args) {
        var elem = this.element.querySelector('#' + args.inputName + '_Error');
        if (elem) {
            elem.style.display = (args.status === 'failure') ? '' : 'none';
        }
    };
    FieldValidator.prototype.errorPlacement = function (inputElement, error) {
        var id = error.getAttribute('for');
        var elem = this.element.querySelector('#' + id + '_Error');
        if (!elem) {
            this.createTooltip(inputElement, error, id, '');
        }
    };
    FieldValidator.prototype.createTooltip = function (element, error, name, display) {
        var dlgContent;
        var client;
        var inputClient = element.getBoundingClientRect();
        if (this.element.classList.contains(POPUP_WRAPPER_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        }
        else {
            dlgContent = this.element.querySelector('.e-schedule-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        var div = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        var content = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        var arrow = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    };
    FieldValidator.prototype.destroyToolTip = function () {
        if (this.element) {
            var elements = [].slice.call(this.element.querySelectorAll('.' + ERROR_VALIDATION_CLASS));
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var elem = elements_1[_i];
                remove(elem);
            }
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    };
    /**
     * @hidden
     */
    FieldValidator.prototype.destroy = function () {
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
    };
    return FieldValidator;
}());

var EVENT_FIELD = 'e-field';
/**
 * Quick Popups interactions
 */
var QuickPopups = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for QuickPopups
     */
    function QuickPopups(parent) {
        this.isMultipleEventSelect = false;
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.crudAction = new Crud(parent);
        this.fieldValidator = new FieldValidator();
        this.render();
        this.addEventListener();
    }
    QuickPopups.prototype.render = function () {
        this.renderQuickPopup();
        this.renderMorePopup();
        this.renderQuickDialog();
    };
    QuickPopups.prototype.renderQuickPopup = function () {
        var quickPopupWrapper = createElement('div', { className: POPUP_WRAPPER_CLASS + ' e-popup-close' });
        if (this.parent.isAdaptive) {
            document.body.appendChild(quickPopupWrapper);
            addClass([quickPopupWrapper], DEVICE_CLASS);
        }
        else {
            this.parent.element.appendChild(quickPopupWrapper);
        }
        this.quickPopup = new Popup(quickPopupWrapper, {
            actionOnScroll: 'hide',
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            open: this.quickPopupOpen.bind(this),
            close: this.quickPopupClose.bind(this),
            hideAnimation: (this.parent.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
            showAnimation: (this.parent.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } : { X: 'none', Y: 'fit' }),
            position: (this.parent.isAdaptive ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1000 : 3)
        });
    };
    QuickPopups.prototype.renderMorePopup = function () {
        var moreEventPopup = "<div class=\"" + MORE_EVENT_POPUP_CLASS + "\"><div class=\"" + MORE_EVENT_HEADER_CLASS + "\">" +
            ("<div class=\"" + MORE_EVENT_CLOSE_CLASS + "\" title=\"" + this.l10n.getConstant('close') + "\" tabindex=\"0\"></div>") +
            ("<div class=\"" + MORE_EVENT_DATE_HEADER_CLASS + "\"><div class=\"" + MORE_EVENT_HEADER_DAY_CLASS + "\"></div>") +
            ("<div class=\"" + MORE_EVENT_HEADER_DATE_CLASS + " " + NAVIGATE_CLASS + "\" tabindex=\"0\"></div></div></div></div>");
        var moreEventWrapper = createElement('div', {
            className: MORE_POPUP_WRAPPER_CLASS + ' e-popup-close',
            innerHTML: moreEventPopup
        });
        this.parent.element.appendChild(moreEventWrapper);
        this.morePopup = new Popup(moreEventWrapper, {
            targetType: 'relative',
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'ZoomOut', duration: 300 },
            showAnimation: { name: 'ZoomIn', duration: 300 },
            open: this.morePopupOpen.bind(this),
            close: this.morePopupClose.bind(this),
            collision: { X: 'flip', Y: 'flip' },
            viewPortElement: this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS),
            zIndex: 2
        });
        var closeButton = this.morePopup.element.querySelector('.' + MORE_EVENT_CLOSE_CLASS);
        this.renderButton('e-round', ICON + ' ' + CLOSE_ICON_CLASS, false, closeButton, this.closeClick);
        EventHandler.add(this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS), 'click', this.navigationClick, this);
    };
    QuickPopups.prototype.renderQuickDialog = function () {
        this.quickDialog = new Dialog({
            animationSettings: { effect: 'Zoom' },
            buttons: [
                { buttonModel: { cssClass: 'e-quick-alertok e-flat', isPrimary: true }, click: this.dialogButtonClick.bind(this) },
                { buttonModel: { cssClass: 'e-quick-alertcancel e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this) }
            ],
            cssClass: QUICK_DIALOG_CLASS,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            beforeClose: this.beforeQuickDialogClose.bind(this),
            isModal: true,
            position: { X: 'center', Y: 'center' },
            showCloseIcon: true,
            target: document.body,
            visible: false,
            width: 'auto'
        });
        var dialogElement = createElement('div', { id: this.parent.element.id + 'QuickDialog' });
        this.parent.element.appendChild(dialogElement);
        this.quickDialog.appendTo(dialogElement);
        var okButton = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.setAttribute('aria-label', this.l10n.getConstant('occurrence'));
        }
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('series'));
        }
    };
    QuickPopups.prototype.renderButton = function (className, iconName, isDisabled, element, clickEvent) {
        var buttonObj = new Button({
            cssClass: className,
            disabled: isDisabled,
            enableRtl: this.parent.enableRtl,
            iconCss: iconName
        });
        buttonObj.appendTo(element);
        EventHandler.add(element, 'click', clickEvent, this);
    };
    QuickPopups.prototype.quickDialogClass = function (action) {
        var classList$$1 = [
            QUICK_DIALOG_EDIT_EVENT_CLASS, QUICK_DIALOG_EDIT_SERIES_CLASS, QUICK_DIALOG_DELETE_CLASS,
            QUICK_DIALOG_CANCEL_CLASS, QUICK_DIALOG_ALERT_BTN_CLASS, DISABLE_CLASS
        ];
        var okButton = this.quickDialog.element.querySelector('.e-quick-alertok');
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        removeClass([okButton, cancelButton], classList$$1);
        switch (action) {
            case 'Recurrence':
                addClass([okButton], QUICK_DIALOG_EDIT_EVENT_CLASS);
                addClass([cancelButton], QUICK_DIALOG_EDIT_SERIES_CLASS);
                break;
            case 'Delete':
                addClass([okButton], QUICK_DIALOG_DELETE_CLASS);
                addClass([cancelButton], QUICK_DIALOG_CANCEL_CLASS);
                break;
            case 'Alert':
                addClass([okButton], QUICK_DIALOG_ALERT_BTN_CLASS);
                addClass([cancelButton], DISABLE_CLASS);
                break;
        }
    };
    QuickPopups.prototype.applyFormValidation = function () {
        var form = this.quickPopup.element.querySelector('.' + FORM_CLASS);
        var rules = {};
        rules[this.parent.eventSettings.fields.subject.name] = this.parent.eventSettings.fields.subject.validation;
        this.fieldValidator.renderFormValidator(form, rules, this.quickPopup.element);
    };
    QuickPopups.prototype.openRecurrenceAlert = function () {
        var editDeleteOnly = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (editDeleteOnly) {
            editDeleteOnly.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        }
        var editDeleteSeries = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (editDeleteSeries) {
            editDeleteSeries.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteSeries' : 'editSeries');
        }
        this.quickDialog.content =
            this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteRecurrenceContent' : 'editContent');
        this.quickDialog.header = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        this.quickDialogClass('Recurrence');
        this.showQuickDialog('RecurrenceAlert');
    };
    QuickPopups.prototype.openRecurrenceValidationAlert = function (type) {
        var okButton = this.quickDialog.element.querySelector('.e-quick-alertok');
        removeClass([okButton], QUICK_DIALOG_EDIT_EVENT_CLASS);
        okButton.innerHTML = this.l10n.getConstant('ok');
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        cancelButton.innerHTML = this.l10n.getConstant('cancel');
        this.quickDialog.header = this.l10n.getConstant('alert');
        switch (type) {
            case 'wrongPattern':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('wrongPattern');
                break;
            case 'dateValidation':
                removeClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('recurrenceDateValidation');
                break;
            case 'createError':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('createError');
                break;
            case 'sameDayAlert':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('sameDayAlert');
                break;
            case 'seriesChangeAlert':
                removeClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('seriesChangeAlert');
                break;
        }
        if (!cancelButton.classList.contains(DISABLE_CLASS)) {
            addClass([cancelButton], 'e-quick-alert-cancelpresent');
        }
        this.showQuickDialog('RecurrenceValidationAlert');
    };
    QuickPopups.prototype.openDeleteAlert = function () {
        if (this.parent.activeViewOptions.readonly) {
            return;
        }
        var okButton = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('delete');
        }
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialog.content = (this.parent.activeEventData.event.length > 1) ?
            this.l10n.getConstant('deleteMultipleContent') : this.l10n.getConstant('deleteContent');
        this.quickDialog.header = (this.parent.activeEventData.event.length > 1) ?
            this.l10n.getConstant('deleteMultipleEvent') : this.l10n.getConstant('deleteEvent');
        this.quickDialogClass('Delete');
        this.showQuickDialog('DeleteAlert');
    };
    QuickPopups.prototype.openValidationError = function (type) {
        this.quickDialog.header = this.l10n.getConstant('alert');
        this.quickDialog.content = this.l10n.getConstant(type);
        var okButton = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('ok');
        }
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialogClass('Alert');
        this.showQuickDialog('ValidationAlert');
    };
    QuickPopups.prototype.showQuickDialog = function (popupType) {
        this.quickDialog.dataBind();
        var eventProp = {
            type: popupType, cancel: false, data: this.parent.activeEventData, element: this.quickDialog.element
        };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.quickDialog.show();
    };
    QuickPopups.prototype.createMoreEventList = function (eventCollection, groupOrder, groupIndex) {
        var fields = this.parent.eventFields;
        var moreEventContentEle = createElement('div', { className: MORE_EVENT_CONTENT_CLASS });
        var moreEventWrapperEle = createElement('div', { className: MORE_EVENT_WRAPPER_CLASS });
        if (eventCollection.length === 0) {
            moreEventWrapperEle = createElement('div', {
                className: MORE_EVENT_CONTENT_CLASS,
                innerHTML: this.l10n.getConstant('emptyContainer')
            });
        }
        else {
            for (var _i = 0, eventCollection_1 = eventCollection; _i < eventCollection_1.length; _i++) {
                var eventData = eventCollection_1[_i];
                var eventText = (eventData[fields.subject] || this.parent.eventSettings.fields.subject.default);
                var appointmentEle = createElement('div', {
                    className: APPOINTMENT_CLASS,
                    attrs: {
                        'data-id': '' + eventData[fields.id],
                        'data-guid': eventData.Guid, 'role': 'button', 'tabindex': '0',
                        'aria-readonly': this.parent.eventBase.getReadonlyAttribute(eventData),
                        'aria-selected': 'false', 'aria-grabbed': 'true', 'aria-label': eventText
                    }
                });
                appointmentEle.appendChild(createElement('div', { className: SUBJECT_CLASS, innerHTML: eventText }));
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    appointmentEle.setAttribute('data-group-index', groupIndex);
                }
                if (!isNullOrUndefined(eventData[fields.recurrenceRule])) {
                    var iconClass = (eventData[fields.id] === eventData[fields.recurrenceID]) ?
                        EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
                    appointmentEle.appendChild(createElement('div', { className: ICON + ' ' + iconClass }));
                }
                var args = { data: eventData, element: appointmentEle, cancel: false };
                this.parent.trigger(eventRendered, args);
                if (!args.cancel) {
                    moreEventWrapperEle.appendChild(appointmentEle);
                    this.parent.eventBase.wireAppointmentEvents(appointmentEle, false, eventData);
                    this.parent.eventBase.applyResourceColor(appointmentEle, eventData, 'backgroundColor', groupOrder);
                }
            }
        }
        moreEventContentEle.appendChild(moreEventWrapperEle);
        return moreEventContentEle;
    };
    QuickPopups.prototype.tapHoldEventPopup = function (e) {
        var target = closest(e.target, '.' + APPOINTMENT_CLASS);
        this.isMultipleEventSelect = false;
        this.parent.selectedElements = [];
        this.isMultipleEventSelect = true;
        this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        var guid = target.getAttribute('data-guid');
        var eventObj = this.parent.eventBase.getEventByGuid(guid);
        var eventTitle = (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle'));
        var eventTemplate = "<div class=\"" + MULTIPLE_EVENT_POPUP_CLASS + "\"><div class=\"" + POPUP_HEADER_CLASS + "\">" +
            ("<button class=\"" + CLOSE_CLASS + "\" title=\"" + this.l10n.getConstant('close') + "\"></button>") +
            ("<div class=\"" + SUBJECT_CLASS + "\">" + eventTitle + "</div>") +
            ("<button class=\"" + EDIT_CLASS + "\" title=\"" + this.l10n.getConstant('edit') + "\"></button>") +
            ("<button class=\"" + DELETE_CLASS + "\" title=\"" + this.l10n.getConstant('delete') + "\"></button></div></div>");
        this.quickPopup.element.innerHTML = eventTemplate;
        var closeIcon = this.quickPopup.element.querySelector('.' + CLOSE_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.closeClick);
        var editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + EDIT_ICON_CLASS, false, editIcon, this.editClick);
        var deleteIcon = this.quickPopup.element.querySelector('.' + DELETE_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + DELETE_ICON_CLASS, false, deleteIcon, this.deleteClick);
        this.beforeQuickPopupOpen(target);
    };
    QuickPopups.prototype.isCellBlocked = function (args) {
        var tempObj = {};
        tempObj[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        tempObj[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        tempObj[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var targetCell = args.element instanceof Array ? args.element[0] : args.element;
            this.parent.resourceBase.setResourceValues(tempObj, true, parseInt(targetCell.getAttribute('data-group-index'), 10));
        }
        return this.parent.eventBase.isBlockRange(tempObj);
    };
    QuickPopups.prototype.cellClick = function (args) {
        if (!this.parent.showQuickInfo || this.parent.currentView === 'MonthAgenda' || this.isCellBlocked(args)) {
            this.quickPopupHide();
            return;
        }
        var targetEle = args.event.target;
        if (this.parent.isAdaptive) {
            this.quickPopupHide();
            var newEventClone = this.parent.element.querySelector('.' + NEW_EVENT_CLASS);
            if (isNullOrUndefined(newEventClone)) {
                newEventClone = createElement('div', {
                    className: NEW_EVENT_CLASS,
                    innerHTML: "<div class=\"e-title\">+ " + this.l10n.getConstant('newEvent') + "</div>"
                });
            }
            var targetCell = closest(targetEle, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS);
            if (targetCell) {
                targetCell.appendChild(newEventClone);
            }
            return;
        }
        var target = closest(targetEle, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' +
            HEADER_CELLS_CLASS);
        if (isNullOrUndefined(target) || targetEle.classList.contains(MORE_INDICATOR_CLASS)) {
            return;
        }
        var isSameTarget = this.quickPopup.relateTo === target;
        if (isSameTarget && this.quickPopup.element.classList.contains(POPUP_OPEN)) {
            var subjectElement_1 = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (subjectElement_1) {
                subjectElement_1.focus();
            }
            return;
        }
        var temp = {};
        temp[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        temp[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        temp[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        var cellDetails = this.getFormattedString(temp);
        var quickCellPopup = createElement('div', { className: CELL_POPUP_CLASS });
        var templateArgs = extend({}, temp, { elementType: 'cell' }, true);
        if (this.parent.quickInfoTemplates.header) {
            append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickCellPopup);
        }
        else {
            var headerTemplate = createElement('div', {
                className: POPUP_HEADER_CLASS,
                innerHTML: "<div class=\"" + POPUP_HEADER_ICON_WRAPPER + "\">" +
                    ("<button class=\"" + CLOSE_CLASS + "\" title=\"" + this.l10n.getConstant('close') + "\"></button></div>")
            });
            quickCellPopup.appendChild(headerTemplate);
        }
        if (this.parent.quickInfoTemplates.content) {
            append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickCellPopup);
        }
        else {
            var tempStr = "<table class=\"" + POPUP_TABLE_CLASS + "\"><tbody><tr><td>" +
                ("<form class=\"" + FORM_CLASS + "\" onsubmit=\"return false;\"><input class=\"" + SUBJECT_CLASS + " " + EVENT_FIELD + "\" type=\"text\" ") +
                ("name=\"" + this.parent.eventFields.subject + "\" /></form></td></tr><tr><td><div class=\"" + DATE_TIME_CLASS + "\">") +
                ("<div class=\"" + DATE_TIME_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + DATE_TIME_DETAILS_CLASS + " ") +
                (TEXT_ELLIPSIS + "\">" + cellDetails.details + "</div></div>") +
                ((this.parent.activeViewOptions.group.resources.length > 0 ? "<div class=\"" + RESOURCE_CLASS + "\">" +
                    ("<div class=\"" + RESOURCE_ICON_CLASS + " " + ICON + " \"></div><div class=\"" + RESOURCE_DETAILS_CLASS + " ") +
                    (TEXT_ELLIPSIS + "\">" + this.getResourceText(args, 'cell') + "</div></div>") : '') + "</td></tr></tbody></table>");
            var contentTemplate = createElement('div', {
                className: POPUP_CONTENT_CLASS, innerHTML: tempStr
            });
            quickCellPopup.appendChild(contentTemplate);
        }
        if (this.parent.quickInfoTemplates.footer) {
            append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickCellPopup);
        }
        else {
            var footerTemplate = createElement('div', {
                className: POPUP_FOOTER_CLASS, innerHTML: "<button class=\"" + (QUICK_POPUP_EVENT_DETAILS_CLASS + ' ' +
                    TEXT_ELLIPSIS) + "\" title=\"" + this.l10n.getConstant('moreDetails') + "\">" + this.l10n.getConstant('moreDetails') + "</button>" +
                    ("<button class=\"" + EVENT_CREATE_CLASS + " " + TEXT_ELLIPSIS + "\" title=\"" + this.l10n.getConstant('save') + "\">") +
                    (this.l10n.getConstant('save') + "</button>")
            });
            quickCellPopup.appendChild(footerTemplate);
        }
        var subjectElement = quickCellPopup.querySelector('.' + SUBJECT_CLASS);
        if (subjectElement) {
            Input.createInput({ element: subjectElement, properties: { placeholder: this.l10n.getConstant('addTitle') } });
        }
        var closeIcon = quickCellPopup.querySelector('.' + CLOSE_CLASS);
        if (closeIcon) {
            this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
        }
        var moreButton = quickCellPopup.querySelector('.' + QUICK_POPUP_EVENT_DETAILS_CLASS);
        if (moreButton) {
            this.renderButton('e-flat', '', false, moreButton, this.detailsClick);
        }
        var saveButton = quickCellPopup.querySelector('.' + EVENT_CREATE_CLASS);
        if (saveButton) {
            this.renderButton('e-flat e-primary', '', this.parent.activeViewOptions.readonly, saveButton, this.saveClick);
        }
        this.quickPopup.content = quickCellPopup;
        this.quickPopup.dataBind();
        this.applyFormValidation();
        if (this.morePopup) {
            this.morePopup.hide();
        }
        this.quickPopup.relateTo = target;
        this.beforeQuickPopupOpen(target);
    };
    QuickPopups.prototype.isSameEventClick = function (events) {
        var isSameTarget = this.quickPopup.relateTo === closest(events.element, '.' + APPOINTMENT_CLASS);
        if (isSameTarget && this.quickPopup.element.classList.contains(POPUP_OPEN)) {
            var editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                editIcon.focus();
            }
            if (!this.parent.isAdaptive) {
                var editButton = this.quickPopup.element.querySelector('.' + EDIT_EVENT_CLASS);
                if (editButton) {
                    editButton.focus();
                }
            }
            return true;
        }
        return false;
    };
    QuickPopups.prototype.eventClick = function (events) {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        if (!this.parent.showQuickInfo) {
            return;
        }
        if (this.parent.isAdaptive && this.isMultipleEventSelect) {
            this.updateTapHoldEventPopup(closest(events.element, '.' + APPOINTMENT_CLASS));
        }
        else {
            var isSameTarget = this.isSameEventClick(events);
            if (isSameTarget) {
                return;
            }
            var eventData = events.event;
            var args = this.getFormattedString(eventData);
            var quickEventPopup = createElement('div', { className: EVENT_POPUP_CLASS });
            var templateArgs = extend({}, eventData, { elementType: 'event' }, true);
            if (this.parent.quickInfoTemplates.header) {
                append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickEventPopup);
            }
            else {
                var headerTemplate = createElement('div', {
                    className: POPUP_HEADER_CLASS,
                    innerHTML: "<div class=\"" + POPUP_HEADER_ICON_WRAPPER + "\">" +
                        ("<button class=\"" + (EDIT_CLASS + ' ' + ICON) + "\" title=\"" + this.l10n.getConstant('edit') + "\"></button>") +
                        ("<button class=\"" + (DELETE_CLASS + ' ' + ICON) + "\" title=\"" + this.l10n.getConstant('delete') + "\"></button>") +
                        ("<button class=\"" + CLOSE_CLASS + "\" title=\"" + this.l10n.getConstant('close') + "\"></button></div>") +
                        ("<div class=\"" + SUBJECT_WRAP + "\"><div class=\"" + SUBJECT_CLASS + " " + TEXT_ELLIPSIS + "\" ") +
                        ("title=\"" + args.eventSubject + "\">" + args.eventSubject + "</div></div >")
                });
                quickEventPopup.appendChild(headerTemplate);
            }
            if (this.parent.quickInfoTemplates.content) {
                append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickEventPopup);
            }
            else {
                var tempStr = "<div class=\"" + DATE_TIME_CLASS + "\">" +
                    ("<div class=\"" + DATE_TIME_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + DATE_TIME_WRAPPER_CLASS + " ") +
                    (TEXT_ELLIPSIS + "\"><div class=\"" + DATE_TIME_DETAILS_CLASS + " " + TEXT_ELLIPSIS + "\">" + args.details + "</div>") +
                    ((eventData[this.parent.eventFields.recurrenceRule] ? "<div class=\"" + RECURRENCE_SUMMARY_CLASS + " " +
                        (TEXT_ELLIPSIS + "\">" + this.getRecurrenceSummary(eventData) + "</div>") : '') + "</div></div>") +
                    ("" + (eventData[this.parent.eventFields.location] ? "<div class=\"" + LOCATION_CLASS + "\"><div class=\"" +
                        (LOCATION_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + LOCATION_DETAILS_CLASS + " " + TEXT_ELLIPSIS + "\">") +
                        (eventData[this.parent.eventFields.location] + "</div></div>") : '')) +
                    ("" + (eventData[this.parent.eventFields.startTimezone] ||
                        eventData[this.parent.eventFields.endTimezone] ? "<div class=\"" + TIME_ZONE_CLASS + "\"><div class=\"" +
                        (TIME_ZONE_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + TIME_ZONE_DETAILS_CLASS + " " + TEXT_ELLIPSIS + "\">") +
                        (this.getTimezone(eventData) + " </div></div>") : '')) +
                    ("" + (eventData[this.parent.eventFields.description] ? "<div class=\"" + DESCRIPTION_CLASS + "\"><div class=\"" +
                        (DESCRIPTION_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + DESCRIPTION_DETAILS_CLASS + " ") +
                        (TEXT_ELLIPSIS + "\">" + eventData[this.parent.eventFields.description] + "</div></div>") : '')) +
                    ("" + (this.parent.resources.length > 0 ? "<div class=\"" + RESOURCE_CLASS + "\"><div class=\"" +
                        (RESOURCE_ICON_CLASS + " " + ICON + "\"></div><div class=\"" + RESOURCE_DETAILS_CLASS + " " + TEXT_ELLIPSIS + "\">") +
                        (this.getResourceText(events, 'event') + "</div></div>") : ''));
                var contentTemplate = createElement('div', {
                    className: POPUP_CONTENT_CLASS, innerHTML: tempStr
                });
                quickEventPopup.appendChild(contentTemplate);
            }
            if (this.parent.quickInfoTemplates.footer) {
                append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickEventPopup);
            }
            else {
                var footerTemplate = createElement('div', {
                    className: POPUP_FOOTER_CLASS,
                    innerHTML: "" + (this.parent.isAdaptive ? '' : "<button class=\"" + EDIT_EVENT_CLASS + " " +
                        (TEXT_ELLIPSIS + "\" title=\"" + this.l10n.getConstant('edit') + "\">" + this.l10n.getConstant('edit') + "</button>") +
                        ("<button class=\"" + DELETE_EVENT_CLASS + " " + TEXT_ELLIPSIS + "\" title=\"" + this.l10n.getConstant('delete') + "\">") +
                        (this.l10n.getConstant('delete') + "</button>"))
                });
                quickEventPopup.appendChild(footerTemplate);
            }
            var readonly = this.parent.activeViewOptions.readonly || eventData[this.parent.eventFields.isReadonly];
            var editIcon = quickEventPopup.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + EDIT_ICON_CLASS, readonly, editIcon, this.editClick);
            }
            var deleteIcon = quickEventPopup.querySelector('.' + DELETE_CLASS);
            if (deleteIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + DELETE_ICON_CLASS, readonly, deleteIcon, this.deleteClick);
            }
            var closeIcon = quickEventPopup.querySelector('.' + CLOSE_CLASS);
            if (closeIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
            }
            var editButton = quickEventPopup.querySelector('.' + EDIT_EVENT_CLASS);
            if (editButton) {
                this.renderButton('e-flat e-primary', '', readonly, editButton, this.editClick);
            }
            var deleteButton = quickEventPopup.querySelector('.' + DELETE_EVENT_CLASS);
            if (deleteButton) {
                this.renderButton('e-flat', '', readonly, deleteButton, this.deleteClick);
            }
            this.quickPopup.content = quickEventPopup;
            this.quickPopup.dataBind();
            if (this.morePopup && !closest(events.element, '.' + MORE_EVENT_WRAPPER_CLASS)) {
                this.morePopup.hide();
            }
            this.quickPopup.relateTo = this.parent.isAdaptive ? document.body :
                closest(events.element, '.' + APPOINTMENT_CLASS);
            this.beforeQuickPopupOpen(events.element);
        }
    };
    QuickPopups.prototype.getResourceText = function (args, type) {
        var resourceValue = '';
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            var resourceCollection_1 = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            var resourceData = resourceCollection_1.dataSource;
            var resourceIndex_1 = 0;
            var eventData_1 = args.event;
            resourceData.forEach(function (resource, index) {
                if (resource[resourceCollection_1.idField] === eventData_1[resourceCollection_1.field]) {
                    resourceIndex_1 = index;
                }
            });
            resourceValue = resourceData[resourceIndex_1][resourceCollection_1.textField];
        }
        else {
            if (type === 'event') {
                var eventData = args.event;
                var resourceData = void 0;
                var lastResource_1;
                for (var i = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
                    resourceData = eventData[this.parent.resourceBase.resourceCollection[i].field];
                    if (!isNullOrUndefined(resourceData)) {
                        lastResource_1 = this.parent.resourceBase.resourceCollection[i];
                        break;
                    }
                }
                if (!Array.isArray(resourceData)) {
                    resourceData = [resourceData];
                }
                var resNames_1 = [];
                var lastResourceData_1 = lastResource_1.dataSource;
                resourceData.map(function (value) {
                    var i = findIndexInData(lastResourceData_1, lastResource_1.idField, value);
                    var text = lastResourceData_1[i][lastResource_1.textField];
                    if (text) {
                        resNames_1.push(text);
                    }
                });
                resourceValue = resNames_1.join(', ');
            }
            else {
                var argsData = args;
                var groupIndex = !isNullOrUndefined(argsData.groupIndex) ? argsData.groupIndex : 0;
                var resourceDetails = this.parent.resourceBase.lastResourceLevel[groupIndex];
                resourceValue = resourceDetails.resourceData[resourceDetails.resource.textField];
            }
        }
        return resourceValue;
    };
    QuickPopups.prototype.getFormattedString = function (eventData) {
        var fields = this.parent.eventFields;
        var eventSubject = (eventData[fields.subject] || this.l10n.getConstant('noTitle'));
        var startDate = eventData[fields.startTime];
        var endDate = eventData[fields.endTime];
        var startDateDetails = this.getDateFormat(startDate, 'long');
        var endDateDetails = (eventData[fields.isAllDay] && endDate.getHours() === 0 && endDate.getMinutes() === 0) ?
            this.getDateFormat(addDays(new Date(endDate.getTime()), -1), 'long') : this.getDateFormat(endDate, 'long');
        var startTimeDetail = this.parent.getTimeString(startDate);
        var endTimeDetail = this.parent.getTimeString(endDate);
        var details;
        var allDayLength = (endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
        var spanLength = endDate.getDate() !== startDate.getDate() &&
            (endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) < 24 ? 1 : 0;
        if (eventData[fields.isAllDay] || allDayLength >= 1 || spanLength > 0) {
            details = startDateDetails + ' (' +
                (eventData[fields.isAllDay] ? this.l10n.getConstant('allDay') : startTimeDetail) + ')';
            if (allDayLength > 1 || spanLength > 0) {
                details += '&nbsp;-&nbsp;' + endDateDetails + ' (' +
                    (eventData[fields.isAllDay] ? this.l10n.getConstant('allDay') : endTimeDetail) + ')';
            }
        }
        else {
            details = startDateDetails + ' (' + (startTimeDetail + '&nbsp;-&nbsp;' + endTimeDetail) + ')';
        }
        return { eventSubject: eventSubject, details: details };
    };
    QuickPopups.prototype.moreEventClick = function (data, endDate, groupIndex) {
        this.quickPopupHide(true);
        var moreEventContentEle = this.morePopup.element.querySelector('.' + MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        var selectedDate = ((data.date).getTime()).toString();
        var target = closest(data.element, '.' + MORE_INDICATOR_CLASS);
        this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DAY_CLASS).innerHTML = this.getDateFormat(data.date, 'E');
        var dateElement = this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS);
        dateElement.innerHTML = this.getDateFormat(data.date, 'd');
        dateElement.setAttribute('data-date', selectedDate);
        dateElement.setAttribute('data-end-date', endDate.getTime().toString());
        var groupOrder;
        if (!isNullOrUndefined(groupIndex)) {
            dateElement.setAttribute('data-group-index', groupIndex);
            groupOrder = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)].groupOrder;
        }
        var moreEventElements = this.createMoreEventList(data.event, groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + MORE_EVENT_POPUP_CLASS).appendChild(moreEventElements);
        removeClass(this.morePopup.element.querySelector('.' + MORE_EVENT_DATE_HEADER_CLASS).childNodes, CURRENTDATE_CLASS);
        if (resetTime(data.date).getTime() === resetTime(new Date()).getTime()) {
            addClass(this.morePopup.element.querySelector('.' + MORE_EVENT_DATE_HEADER_CLASS).childNodes, CURRENTDATE_CLASS);
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1) {
            var gIndex = target.getAttribute('data-group-index');
            var startDate = target.getAttribute('data-start-date');
            if (isNullOrUndefined(gIndex)) {
                this.morePopup.relateTo = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                    ' tbody tr td[data-date="' + startDate + '"]');
            }
            else {
                this.morePopup.relateTo = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                    ' tbody tr td[data-group-index="' + gIndex + '"][data-date="' + startDate + '"]');
            }
        }
        else {
            this.morePopup.relateTo = closest(target, '.' + WORK_CELLS_CLASS);
        }
        var eventProp = { type: 'EventContainer', data: data, cancel: false, element: this.morePopup.element };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.morePopup.show();
    };
    QuickPopups.prototype.saveClick = function () {
        if (!this.quickPopup.element.querySelector('.' + FORM_CLASS).ej2_instances[0].validate()) {
            return;
        }
        var fields = this.parent.eventFields;
        var saveObj = extend({}, this.parent.eventWindow.getObjectFromFormData(POPUP_WRAPPER_CLASS));
        this.parent.eventWindow.setDefaultValueToObject(saveObj);
        saveObj[fields.id] = this.parent.eventBase.getEventMaxID();
        saveObj[fields.startTime] = this.parent.activeCellsData.startTime;
        saveObj[fields.endTime] = this.parent.activeCellsData.endTime;
        saveObj[fields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.resourceBase) {
            this.parent.resourceBase.setResourceValues(saveObj, true);
        }
        this.parent.currentAction = 'Add';
        this.crudAction.addEvent(saveObj);
        this.quickPopupHide();
    };
    QuickPopups.prototype.detailsClick = function () {
        var subjectEle = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
        if (subjectEle && subjectEle.value !== '') {
            var args = extend(this.parent.activeCellsData, { subject: subjectEle.value });
        }
        this.fieldValidator.destroyToolTip();
        this.quickPopupHide();
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    };
    QuickPopups.prototype.editClick = function () {
        this.quickPopupHide(true);
        var data = this.parent.activeEventData.event;
        this.parent.currentAction = 'EditSeries';
        if (!isNullOrUndefined(data[this.parent.eventFields.recurrenceRule])) {
            this.parent.currentAction = 'EditOccurrence';
            this.openRecurrenceAlert();
        }
        else {
            this.parent.eventWindow.openEditor(data, this.parent.currentAction);
        }
    };
    QuickPopups.prototype.deleteClick = function () {
        this.quickPopupHide(true);
        this.parent.currentAction = 'Delete';
        if (this.parent.activeEventData.event[this.parent.eventFields.recurrenceRule]) {
            this.openRecurrenceAlert();
        }
        else {
            this.openDeleteAlert();
        }
    };
    QuickPopups.prototype.updateMoreEventContent = function () {
        if (this.morePopup.element.classList.contains('e-popup-close')) {
            return;
        }
        var moreEventContentEle = this.morePopup.element.querySelector('.' + MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        var dateElement = this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS);
        var startDate = this.parent.getDateFromElement(dateElement);
        var endDate = new Date(parseInt(dateElement.getAttribute('data-end-date'), 10));
        var groupIndex = dateElement.getAttribute('data-group-index');
        var data;
        var groupOrder;
        if (!isNullOrUndefined(groupIndex)) {
            data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            groupOrder = data.groupOrder;
        }
        var filteredEvents = this.parent.eventBase.filterEvents(startDate, endDate, this.parent.eventsProcessed, data);
        var moreElement = this.createMoreEventList(filteredEvents, groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + MORE_EVENT_POPUP_CLASS).appendChild(moreElement);
    };
    QuickPopups.prototype.closeClick = function () {
        this.quickPopupHide();
        this.morePopup.hide();
    };
    QuickPopups.prototype.dialogButtonClick = function (event) {
        var cancelButton = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (event.target.classList.contains('e-quick-alertok') &&
            (cancelButton.classList.contains('e-quick-alert-cancelpresent'))) {
            removeClass([cancelButton], 'e-quick-alert-cancelpresent');
            this.parent.eventWindow.eventSave(this.l10n.getConstant('ok'));
            return;
        }
        this.quickDialog.hide();
        if (event.target.classList.contains(QUICK_DIALOG_EDIT_EVENT_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteOccurrence' : 'EditOccurrence';
            switch (this.parent.currentAction) {
                case 'EditOccurrence':
                    this.parent.eventWindow.openEditor(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
                case 'DeleteOccurrence':
                    this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        }
        else if (event.target.classList.contains(QUICK_DIALOG_EDIT_SERIES_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteSeries' : 'EditSeries';
            switch (this.parent.currentAction) {
                case 'EditSeries':
                    var parentEvent = this.parent.eventBase.getRecurrenceEvent(this.parent.activeEventData.event);
                    this.parent.eventWindow.openEditor(parentEvent, this.parent.currentAction);
                    break;
                case 'DeleteSeries':
                    this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        }
        else if (event.target.classList.contains(QUICK_DIALOG_DELETE_CLASS)) {
            this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
        }
    };
    QuickPopups.prototype.updateTapHoldEventPopup = function (target) {
        var selectedElements = this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        if (selectedElements.length > 0) {
            var eventObj = this.parent.eventBase.getEventByGuid(selectedElements[0].getAttribute('data-guid'));
            var titleContent = (selectedElements.length === 1) ?
                (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) :
                '(' + selectedElements.length + ')' + '&nbsp;' + this.l10n.getConstant('selectedItems');
            this.quickPopup.element.querySelector('.' + SUBJECT_CLASS).innerHTML = titleContent;
            if (selectedElements.length > 1) {
                addClass([this.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
            }
            else {
                removeClass([this.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
            }
        }
        else {
            this.parent.selectedElements = [];
            this.quickPopupHide();
        }
    };
    QuickPopups.prototype.getTimezone = function (event) {
        var zoneDetails = '';
        zoneDetails += event[this.parent.eventFields.startTimezone] || '';
        zoneDetails += zoneDetails === '' ? '' : ' - ';
        zoneDetails += event[this.parent.eventFields.endTimezone] || '';
        return zoneDetails;
    };
    QuickPopups.prototype.getRecurrenceSummary = function (event) {
        var recurrenceRule = event[this.parent.eventFields.recurrenceRule];
        var ruleSummary = generateSummary(recurrenceRule, this.parent.localeObj, this.parent.locale);
        return ruleSummary.charAt(0).toUpperCase() + ruleSummary.slice(1);
    };
    QuickPopups.prototype.getDateFormat = function (date, formatString) {
        return this.parent.globalize.formatDate(date, { skeleton: formatString, calendar: this.parent.getCalendarMode() });
    };
    QuickPopups.prototype.getDataFromTarget = function (target) {
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            return this.parent.activeEventData.event;
        }
        return this.parent.activeCellsData;
    };
    QuickPopups.prototype.beforeQuickDialogClose = function () {
        this.parent.eventBase.focusElement();
    };
    QuickPopups.prototype.beforeQuickPopupOpen = function (target) {
        var isEventPopup = this.quickPopup.element.querySelector('.' + EVENT_POPUP_CLASS);
        var popupType = this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo';
        var eventProp = {
            type: popupType, cancel: false, data: this.getDataFromTarget(target),
            target: target, element: this.quickPopup.element
        };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            this.destroyButtons();
            if (eventProp.element.classList.contains(POPUP_OPEN)) {
                this.quickPopupClose();
            }
            this.quickPopup.element.innerHTML = '';
            return;
        }
        var display = this.quickPopup.element.style.display;
        this.quickPopup.element.style.display = 'block';
        if (this.parent.isAdaptive) {
            this.quickPopup.element.removeAttribute('style');
            this.quickPopup.element.style.display = 'block';
            this.quickPopup.element.style.height = formatUnit((popupType === 'EditEventInfo') ? 65 : window.innerHeight);
        }
        else {
            this.quickPopup.offsetX = 10;
            this.quickPopup.collision = { X: 'none', Y: 'fit' };
            this.quickPopup.position = { X: 'right', Y: 'top' };
            this.quickPopup.dataBind();
            this.quickPopup.refreshPosition(null, true);
            var collide = isCollide(this.quickPopup.element, this.parent.element);
            if (collide.indexOf(this.parent.enableRtl ? 'left' : 'right') > -1) {
                this.quickPopup.offsetX = -target.offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                this.quickPopup.dataBind();
                var leftCollide = isCollide(this.quickPopup.element, this.parent.element);
                if (leftCollide.indexOf('left') > -1) {
                    this.quickPopup.position = { X: 'center', Y: 'center' };
                    this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                    this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                    this.quickPopup.dataBind();
                }
            }
            if (this.parent.virtualScrollModule && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                var element = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
                var translateY = getTranslateY(element);
                this.quickPopup.offsetY = translateY;
                this.quickPopup.dataBind();
            }
        }
        if (isEventPopup) {
            this.applyEventColor();
        }
        this.quickPopup.element.style.display = display;
        this.quickPopup.dataBind();
        this.quickPopup.show();
    };
    QuickPopups.prototype.applyEventColor = function () {
        var color = this.parent.activeEventData.element.style.backgroundColor;
        if (color === '') {
            return;
        }
        var colorEle = this.quickPopup.element.querySelector('.' + POPUP_HEADER_CLASS);
        var footerEle = this.quickPopup.element.querySelector('.' + POPUP_FOOTER_CLASS);
        if (footerEle && footerEle.offsetParent) {
            colorEle = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = "rgba(" + color.match(/\d+/g).join() + ",0.3)";
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    };
    QuickPopups.prototype.quickPopupOpen = function () {
        if (this.parent.isAdaptive) {
            return;
        }
        if (this.quickPopup.element.querySelector('.' + CELL_POPUP_CLASS)) {
            var subjectElement = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (subjectElement) {
                subjectElement.focus();
            }
        }
        else {
            var editElement = this.quickPopup.element.querySelector('.' + EDIT_EVENT_CLASS);
            if (editElement) {
                editElement.focus();
            }
            var editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                editIcon.focus();
            }
        }
    };
    QuickPopups.prototype.quickPopupClose = function () {
        this.parent.eventBase.focusElement();
        this.quickPopup.relateTo = WORK_CELLS_CLASS;
        this.fieldValidator.destroyToolTip();
        this.destroyButtons();
        this.quickPopup.element.innerHTML = '';
    };
    QuickPopups.prototype.morePopupOpen = function () {
        this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS).focus();
        this.morePopup.refreshPosition();
    };
    QuickPopups.prototype.morePopupClose = function () {
        var moreWrapper = this.parent.element.querySelector('.' + MORE_EVENT_WRAPPER_CLASS);
        if (moreWrapper) {
            remove(moreWrapper);
        }
    };
    QuickPopups.prototype.quickPopupHide = function (hideAnimation) {
        if (this.quickPopup.element.classList.contains('e-popup-open')) {
            if (hideAnimation) {
                var animation = this.quickPopup.hideAnimation;
                this.quickPopup.hideAnimation = null;
                this.quickPopup.hide();
                this.quickPopup.hideAnimation = animation;
            }
            else {
                this.quickPopup.hide();
            }
            this.isMultipleEventSelect = false;
        }
    };
    QuickPopups.prototype.navigationClick = function (e) {
        var navigateEle = closest(e.target, '.' + NAVIGATE_CLASS);
        if (!isNullOrUndefined(navigateEle)) {
            var date = this.parent.getDateFromElement(e.currentTarget);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.closeClick();
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView());
            }
        }
    };
    QuickPopups.prototype.documentClick = function (e) {
        var target = e.event.target;
        var classNames = '.' + POPUP_WRAPPER_CLASS + ',.' + HEADER_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS +
            ',.' + WORK_CELLS_CLASS + ',.' + APPOINTMENT_CLASS;
        if (closest(target, '.' + APPOINTMENT_CLASS + ',.' + HEADER_CELLS_CLASS)) {
            this.parent.removeNewEventElement();
        }
        if (!closest(target, classNames)) {
            this.quickPopupHide();
            this.parent.removeNewEventElement();
        }
        if (!closest(target, '.' + MORE_POPUP_WRAPPER_CLASS) && !target.classList.contains(MORE_INDICATOR_CLASS)
            && (!closest(target, '.' + POPUP_OPEN))) {
            this.morePopup.hide();
        }
    };
    QuickPopups.prototype.onClosePopup = function () {
        this.quickPopupHide();
        this.parent.eventBase.focusElement();
    };
    QuickPopups.prototype.addEventListener = function () {
        this.parent.on(cellClick, this.cellClick, this);
        this.parent.on(eventClick, this.eventClick, this);
        this.parent.on(documentClick, this.documentClick, this);
        this.parent.on(dataReady, this.updateMoreEventContent, this);
    };
    QuickPopups.prototype.removeEventListner = function () {
        this.parent.off(cellClick, this.cellClick);
        this.parent.off(eventClick, this.eventClick);
        this.parent.off(documentClick, this.documentClick);
        this.parent.off(dataReady, this.updateMoreEventContent);
    };
    QuickPopups.prototype.destroyButtons = function () {
        var buttonCollections = [].slice.call(this.quickPopup.element.querySelectorAll('.e-control.e-btn'));
        buttonCollections.forEach(function (button) {
            var instance = button.ej2_instances[0];
            if (instance) {
                instance.destroy();
            }
        });
    };
    QuickPopups.prototype.destroy = function () {
        this.fieldValidator.destroy();
        this.removeEventListner();
        this.destroyButtons();
        this.quickPopup.destroy();
        remove(this.quickPopup.element);
        this.morePopup.destroy();
        remove(this.morePopup.element);
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog.element = null;
        }
    };
    return QuickPopups;
}());

/**
 * Tooltip for Schedule
 */
var EventTooltip = /** @__PURE__ @class */ (function () {
    function EventTooltip(parent) {
        this.parent = parent;
        this.tooltipObj = new Tooltip({
            content: 'No title',
            position: 'BottomRight',
            offsetY: 10,
            mouseTrail: this.parent.isAdaptive ? false : true,
            showTipPointer: false,
            cssClass: this.parent.cssClass + ' ' + EVENT_TOOLTIP_ROOT_CLASS,
            target: this.getTargets(),
            beforeRender: this.onBeforeRender.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.tooltipObj.appendTo(this.parent.element);
    }
    EventTooltip.prototype.getTargets = function () {
        var targets = [];
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            targets.push('.' + RESOURCE_CELLS_CLASS);
        }
        if (this.parent.eventSettings.enableTooltip) {
            targets.push('.' + APPOINTMENT_CLASS);
        }
        return targets.join(',');
    };
    EventTooltip.prototype.onBeforeRender = function (args) {
        if (!isNullOrUndefined(args.target.getAttribute('data-tooltip-id'))) {
            return;
        }
        if (args.target.classList.contains(RESOURCE_CELLS_CLASS) && this.parent.activeViewOptions.group.resources.length > 0) {
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
            var startDate = resetTime(new Date('' + eventStart));
            var endDate = resetTime(new Date('' + eventEnd));
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

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HEADER = 'e-editor';
var INPUTWARAPPER = 'e-input-wrapper';
var INPUTWARAPPERSIDE = 'e-input-wrapper-side';
var REPEATELEMENT = 'e-repeat-element';
var REPEATINTERVAL = 'e-repeat-interval';
var INTERVALCLASS = 'e-interval';
var DAYWRAPPER = 'e-days';
var WEEKWRAPPER = 'e-non-week';
var WEEKPOSITION = 'e-week-position';
var YEAREXPANDERWRAPPER = 'e-year-expander';
var YEAREXPANDERELEMENT = 'e-year-expander-element';
var MONETHEXPANDERWRAPPER = 'e-month-expander';
var MONETHEXPANDWRAPPER = 'e-month-expand-wrapper';
var MONTHEXPANDERELEMENT = 'e-month-expander-element';
var MONTHEXPANDERCHECKBOXWRAPPER = 'e-month-expander-checkbox-wrapper';
var FORMLEFT = 'e-form-left';
var FORMRIGHT = 'e-form-right';
var MONTHDAYWRAPPER = 'e-month-day';
var MONTHEXPANNDERELEM = 'e-month-expander-wrapper';
var MONTHPOS = 'e-month-pos';
var MONTHWEEK = 'e-month-week';
var ENDON = 'e-end-on';
var MONTHEXPANDERLABEL = 'e-month-expander-label';
var WEEKEXPANDERLABEL = 'e-week-expander-label';
var ENDONLABEL = 'e-end-on-label';
var ENDONLEFT = 'e-end-on-left';
var MONTHDAYELEMENT = 'e-monthday-element';
var ENDONELEMENT = 'e-end-on-element';
var ENDONDATE = 'e-end-on-date';
var UNTILDATE = 'e-until-date';
var ENDONCOUNTWRAPPER = 'e-end-on-count';
var ENDONCOUNT = 'e-recurrence-count';
var HIDEWRAPPER = 'e-hide-recurrence-element';
var RTLCLASS = 'e-rtl';
var PRIMARY = 'e-primary';
var ACTIVE = 'e-active';
var RECURRENCETABLE = 'e-recurrence-table';
var REPEATCONTENT = 'e-repeat-content';
var REPEATCONTENTWRAPPER = 'e-repeat-content-wrapper';
var NONE = 'none';
var DAILY = 'daily';
var WEEKLY = 'weekly';
var MONTHLY = 'monthly';
var YEARLY = 'yearly';
var NEVER = 'never';
var UNTIL$1 = 'until';
var COUNT = 'count';
var TEXTFIELD = 'text';
var VALUEFIELD = 'value';
var LAST = 'last';
var REPEAT = 'repeat';
var REPEATEVERY = 'repeatEvery';
var ON$1 = 'on';
var END = 'end';
var RADIOLABEL = 'onDay';
var RULEUNTIL = 'UNTIL';
var RULEBYDAY = 'BYDAY';
var RULEBYMONTHDAY = 'BYMONTHDAY';
var RULEBYMONTH = 'BYMONTH';
var RULEINTERVAL = 'INTERVAL';
var RULECOUNT = 'COUNT';
var RULESETPOS = 'BYSETPOS';
var RULEFREQ = 'FREQ';
var RULEDAILY = 'DAILY';
var RULEWEEKLY = 'WEEKLY';
var RULEMONTHLY = 'MONTHLY';
var RULEYEARLY = 'YEARLY';
var RULESUNDAY = 'SU';
var RULEMONDAY = 'MO';
var RULETUESDAY = 'TU';
var RULEWEDNESDAY = 'WE';
var RULETHURSDAY = 'TH';
var RULEFRIDAY = 'FR';
var RULESATURDAY = 'SA';
var KEYSUNDAY = 'sun';
var KEYMONDAY = 'mon';
var KEYTUESDAY = 'tue';
var KEYWEDNESDAY = 'wed';
var KEYTHURSDAY = 'thu';
var KEYFRIDAY = 'fri';
var KEYSATURDAY = 'sat';
var EQUAL = '=';
var SEMICOLON = ';';
var COMMA = ',';
var FIRST = 'first';
var SECOND = 'second';
var THIRD = 'third';
var FOURTH = 'fourth';
var contentType = {
    none: '',
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
};
var valueData = {
    'sun': RULESUNDAY,
    'mon': RULEMONDAY,
    'tue': RULETUESDAY,
    'wed': RULEWEDNESDAY,
    'thu': RULETHURSDAY,
    'fri': RULEFRIDAY,
    'sat': RULESATURDAY
};
var neverClassList = [DAYWRAPPER, WEEKWRAPPER, ENDON, INTERVALCLASS, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
var weekClassList = [WEEKWRAPPER];
var monthClassList = [DAYWRAPPER, YEAREXPANDERWRAPPER];
var yearClassList = [DAYWRAPPER];
var dailyClassList = [DAYWRAPPER, WEEKWRAPPER, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
var noEndClassList = [ENDONDATE, ENDONCOUNTWRAPPER];
var endOnCountClassList = [ENDONDATE];
var endOnDateClassList = [ENDONCOUNTWRAPPER];
/**
 * Represents the RecurrenceEditor component.
 * ```html
 * <div id="recurrence"></div>
 * ```
 * ```typescript
 * <script>
 *   var recObj = new RecurrenceEditor();
 *   recObj.appendTo("#recurrence");
 * </script>
 * ```
 */
var RecurrenceEditor = /** @__PURE__ @class */ (function (_super) {
    __extends$1(RecurrenceEditor, _super);
    /**
     * Constructor for creating the widget
     * @param  {object} options?
     */
    function RecurrenceEditor(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.defaultLocale = {
            none: 'None',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            month: 'Month',
            yearly: 'Yearly',
            never: 'Never',
            until: 'Until',
            count: 'Count',
            first: 'First',
            second: 'Second',
            third: 'Third',
            fourth: 'Fourth',
            last: 'Last',
            repeat: 'Repeat',
            repeatEvery: 'Repeat every',
            on: 'Repeat On',
            end: 'End',
            onDay: 'Day',
            days: 'Day(s)',
            weeks: 'Week(s)',
            months: 'Month(s)',
            years: 'Year(s)',
            every: 'every',
            summaryTimes: 'time(s)',
            summaryOn: 'on',
            summaryUntil: 'until',
            summaryRepeat: 'Repeats',
            summaryDay: 'day(s)',
            summaryWeek: 'week(s)',
            summaryMonth: 'month(s)',
            summaryYear: 'year(s)',
            monthWeek: 'Month Week',
            monthPosition: 'Month Position',
            monthExpander: 'Month Expander',
            yearExpander: 'Year Expander',
            repeatInterval: 'Repeat Interval'
        };
        _this.renderStatus = false;
        _this.dayButtons = [];
        _this.monthButtons = [];
        return _this;
    }
    RecurrenceEditor.prototype.startState = function (freq, endOn, startDate) {
        this.showFormElement();
        this.updateForm(freq);
        this.freshOnEndForm();
        this.updateEndOnForm(endOn);
        this.selectMonthDay(startDate);
        this.updateUntilDate(startDate);
        this.onMonthDay.setProperties({ checked: true });
    };
    RecurrenceEditor.prototype.preRender = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        // pre render code snippets
    };
    RecurrenceEditor.prototype.applyCustomClass = function (cssClass) {
        if (cssClass) {
            addClass([this.element], cssClass);
        }
    };
    RecurrenceEditor.prototype.initialize = function () {
        addClass([this.element], 'e-' + this.getModuleName());
        this.renderComponent();
        if (!isNullOrUndefined(this.value)) {
            this.setRecurrenceRule(this.value);
        }
        else {
            this.startState(this.repeatType.value.toString().toUpperCase(), NEVER, this.startDate);
            this.updateForm(this.repeatType.value.toString());
            if (this.selectedType > 0) {
                this.setProperties({ value: this.getRecurrenceRule() }, false);
            }
        }
        this.applyCustomClass(this.cssClass);
    };
    RecurrenceEditor.prototype.triggerChangeEvent = function () {
        if (this.renderStatus) {
            var value = this.getRecurrenceRule();
            this.trigger('change', { value: value });
            this.setProperties({ value: value }, false);
        }
    };
    RecurrenceEditor.prototype.resetDayButton = function () {
        var elements = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        elements.forEach(function (element) { return removeClass([element], [ACTIVE, PRIMARY]); });
    };
    RecurrenceEditor.prototype.daySelection = function (dayIndex) {
        this.resetDayButton();
        var days = [0, 1, 2, 3, 4, 5, 6];
        this.rotateArray(days, this.firstDayOfWeek);
        var element = this.element.querySelector('.' + DAYWRAPPER + ' button[data-index="' + days.indexOf(dayIndex) + '"]');
        if (element) {
            addClass([element], [ACTIVE, PRIMARY]);
        }
    };
    RecurrenceEditor.prototype.rtlClass = function (status) {
        if (status) {
            addClass([this.element], RTLCLASS);
        }
        else {
            removeClass([this.element], RTLCLASS);
        }
    };
    RecurrenceEditor.prototype.updateUntilDate = function (date) {
        var tempDate = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 60);
        this.untilDateObj.setProperties({ value: tempDate });
    };
    RecurrenceEditor.prototype.selectMonthDay = function (date) {
        var weekday = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        this.monthDate.setProperties({ value: date.getDate() });
        this.monthWeekDays.setProperties({ value: valueData[weekday[date.getDay()]] });
        this.monthValue.setProperties({ value: '' + (date.getMonth() + 1) });
        this.monthWeekPos.setProperties({ value: this.getDayPosition(date) });
        this.daySelection(date.getDay());
    };
    RecurrenceEditor.prototype.updateForm = function (state) {
        var _this = this;
        this.repeatType.setProperties({ value: state });
        var end = this.element.querySelector('.' + ENDON);
        if (state === DAILY) {
            classList(end, [FORMLEFT], [FORMRIGHT]);
        }
        else {
            classList(end, [FORMRIGHT], [FORMLEFT]);
        }
        switch (state) {
            case NONE:
                neverClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case WEEKLY:
                weekClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case MONTHLY:
                monthClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case YEARLY:
                yearClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case DAILY:
                dailyClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
        }
    };
    RecurrenceEditor.prototype.updateEndOnForm = function (state) {
        var _this = this;
        this.endType.setProperties({ value: state });
        switch (state) {
            case NEVER:
                noEndClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case UNTIL$1:
                endOnDateClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
            case COUNT:
                endOnCountClassList.forEach(function (className) { return addClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
                break;
        }
    };
    RecurrenceEditor.prototype.freshOnEndForm = function () {
        var _this = this;
        noEndClassList.forEach(function (className) {
            var element = _this.element.querySelector('.' + className);
            if (element) {
                removeClass([element], HIDEWRAPPER);
            }
        });
    };
    RecurrenceEditor.prototype.showFormElement = function () {
        var _this = this;
        neverClassList.forEach(function (className) { return removeClass([_this.element.querySelector('.' + className)], HIDEWRAPPER); });
    };
    RecurrenceEditor.prototype.renderDropdowns = function () {
        var _this = this;
        var self = this;
        this.repeatType = new DropDownList({
            //set the data to dataSource property
            dataSource: this.getRepeatData(),
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: this.selectedType,
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            placeholder: this.localeObj.getConstant(REPEAT),
            htmlAttributes: { 'title': this.localeObj.getConstant(REPEAT) },
            change: function (args) {
                self.setProperties({ selectedType: args.value }, false);
                self.element.querySelector('.' + REPEATCONTENT).innerHTML =
                    self.localeObj.getConstant(contentType[args.value]);
                self.showFormElement();
                self.updateForm(args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        // set placeholder to DropDownList input element
        this.repeatType.appendTo(this.element.querySelector('.' + REPEATELEMENT));
        this.endType = new DropDownList({
            dataSource: this.getEndData(),
            popupWidth: this.getPopupWidth(),
            enableRtl: this.enableRtl,
            index: 1,
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            change: function (args) {
                self.freshOnEndForm();
                self.updateEndOnForm(args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.endType.appendTo(this.element.querySelector('.' + ENDONELEMENT));
        var renderDropDownList = function (dropDownData) {
            return new DropDownList({
                dataSource: dropDownData,
                popupWidth: _this.getPopupWidth(),
                enableRtl: _this.enableRtl,
                fields: {
                    text: TEXTFIELD,
                    value: VALUEFIELD
                },
                index: 1,
                change: function (args) {
                    self.onWeekDay.setProperties({ checked: true });
                    self.resetFormValues();
                    self.triggerChangeEvent();
                }
            });
        };
        this.monthWeekPos = renderDropDownList(this.getMonthPosData());
        this.monthWeekPos.appendTo(this.element.querySelector('.' + MONTHPOS));
        this.monthWeekDays = renderDropDownList(this.getDayData('wide'));
        this.monthWeekDays.appendTo(this.element.querySelector('.' + MONTHWEEK));
        this.monthValue = new DropDownList({
            dataSource: this.getMonthData(),
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: 7,
            change: function (args) {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.monthValue.appendTo(this.element.querySelector('.' + YEAREXPANDERELEMENT));
    };
    RecurrenceEditor.prototype.setDefaultValue = function () {
        var formelement = [].slice.call(this.element.querySelectorAll('.e-control .e-numerictextbox'));
        for (var _i = 0, formelement_1 = formelement; _i < formelement_1.length; _i++) {
            var element = formelement_1[_i];
            var instance = element.ej2_instances[0];
            if (instance.element.classList.contains(REPEATINTERVAL)) {
                instance.value = 1;
                instance.dataBind();
            }
            else if (instance.element.classList.contains(ENDONCOUNT)) {
                instance.value = 10;
                instance.dataBind();
            }
        }
    };
    RecurrenceEditor.prototype.resetFormValues = function () {
        var recurreneElement = [].slice.call(this.element.querySelectorAll('.e-control [type="text"]'));
        for (var _i = 0, recurreneElement_1 = recurreneElement; _i < recurreneElement_1.length; _i++) {
            var element = recurreneElement_1[_i];
            var instance = void 0;
            if (element.classList.contains('e-datepicker')) {
                instance = element.ej2_instances[0];
                if (instance.value) {
                    instance.value = instance.value;
                    instance.dataBind();
                }
                else {
                    this.updateUntilDate(this.startDate);
                }
            }
            else if (element.classList.contains('e-dropdownlist')) {
                instance = element.ej2_instances[0];
                instance.index = instance.index || 0;
                instance.dataBind();
            }
            else if (element.classList.contains('e-numerictextbox')) {
                instance = element.ej2_instances[0];
                var value = void 0;
                if (instance.element.classList.contains(REPEATINTERVAL)) {
                    value = 1;
                }
                else if (instance.element.classList.contains(ENDONCOUNT)) {
                    value = 10;
                }
                else {
                    value = this.startDate.getDate();
                }
                instance.value = instance.value || value;
                instance.dataBind();
            }
        }
    };
    RecurrenceEditor.prototype.getPopupWidth = function () {
        return Browser.isDevice ? '100%' : 'auto';
    };
    RecurrenceEditor.prototype.renderDatePickers = function () {
        var self = this;
        this.untilDateObj = new DatePicker({
            enableRtl: this.enableRtl,
            min: this.minDate,
            max: this.maxDate,
            change: function (args) {
                if (args.value) {
                    self.triggerChangeEvent();
                }
            }
        });
        this.untilDateObj.appendTo(this.element.querySelector('.' + UNTILDATE));
    };
    RecurrenceEditor.prototype.dayButtonRender = function () {
        var _this = this;
        var btns = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        var self = this;
        for (var _i = 0, btns_1 = btns; _i < btns_1.length; _i++) {
            var btn = btns_1[_i];
            var button = new Button({ isToggle: true, enableRtl: this.enableRtl }, btn);
            this.dayButtons.push(button);
            EventHandler.add(btn, 'click', function (args) {
                var btns = [].slice.call(_this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY));
                var element = args.target;
                if (!element.classList.contains(PRIMARY)) {
                    addClass([element], PRIMARY);
                    self.triggerChangeEvent();
                }
                else if (btns.length > 1) {
                    removeClass([element], PRIMARY);
                    self.triggerChangeEvent();
                }
            });
        }
    };
    RecurrenceEditor.prototype.radioButtonRender = function () {
        var self = this;
        this.onMonthDay = new RadioButton({
            label: this.localeObj.getConstant(RADIOLABEL),
            enableRtl: this.enableRtl,
            name: 'monthType',
            value: 'day',
            change: function (args) {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onMonthDay.appendTo(this.element.querySelector('.' + MONTHEXPANDERELEMENT));
        this.monthButtons.push(this.onMonthDay);
        this.onWeekDay = new RadioButton({
            label: '',
            name: 'monthType',
            enableRtl: this.enableRtl,
            value: 'daypos',
            change: function (args) {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onWeekDay.appendTo(this.element.querySelector('.' + MONTHEXPANNDERELEM));
        this.monthButtons.push(this.onWeekDay);
    };
    RecurrenceEditor.prototype.numericTextboxRender = function () {
        var self = this;
        this.recurrenceCount = new NumericTextBox({
            value: 10,
            format: '#',
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            min: 1,
            change: function (args) {
                self.triggerChangeEvent();
            }
        });
        this.recurrenceCount.appendTo(this.element.querySelector('.' + ENDONCOUNT));
        this.monthDate = new NumericTextBox({
            value: 1,
            format: '#',
            enableRtl: this.enableRtl,
            min: 1,
            max: 31,
            change: function (args) {
                self.onMonthDay.setProperties({ checked: true });
                self.triggerChangeEvent();
            }
        });
        this.monthDate.appendTo(this.element.querySelector('.' + MONTHDAYWRAPPER));
        this.repeatInterval = new NumericTextBox({
            value: 1,
            format: '#',
            min: 1,
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            placeholder: this.localeObj.getConstant(REPEATEVERY),
            change: function (args) {
                self.triggerChangeEvent();
            }
        });
        this.repeatInterval.appendTo(this.element.querySelector('.' + REPEATINTERVAL));
    };
    RecurrenceEditor.prototype.renderComponent = function () {
        this.setTemplate();
        this.renderDropdowns();
        this.renderDatePickers();
        this.dayButtonRender();
        this.radioButtonRender();
        this.numericTextboxRender();
    };
    RecurrenceEditor.prototype.rotateArray = function (data, count) {
        var temp;
        for (var index = 0; index < count; index++) {
            temp = data.shift();
            data.push(temp);
        }
    };
    RecurrenceEditor.prototype.getEndData = function () {
        var endData = [NEVER, UNTIL$1, COUNT];
        var self = this;
        var dataSource = [];
        endData.forEach(function (data) {
            dataSource.push({ text: self.localeObj.getConstant(data), value: data });
        });
        return dataSource;
    };
    RecurrenceEditor.prototype.getDayPosition = function (date) {
        var temp = new Date(date.getTime());
        var endDate = new Date(date.getTime());
        var day = date.getDay();
        var positionCollection = [];
        temp.setDate(1);
        endDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        while (temp < endDate) {
            if (temp.getDay() === day) {
                positionCollection.push(temp.getTime());
            }
            temp.setDate(temp.getDate() + 1);
        }
        if (positionCollection.indexOf(date.getTime()) === positionCollection.length - 1) {
            return -1;
        }
        return (positionCollection.indexOf(date.getTime()) + 1);
    };
    RecurrenceEditor.prototype.getRepeatData = function () {
        var data = [];
        var self = this;
        this.frequencies.forEach(function (element) {
            var textValue = (element === NONE) ? NEVER : element;
            data.push({ text: self.localeObj.getConstant(textValue), value: element });
        });
        return data;
    };
    RecurrenceEditor.prototype.getMonthPosData = function () {
        var monthpos = [FIRST, SECOND, THIRD, FOURTH, LAST];
        var monthposValue = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            last: -1
        };
        var self = this;
        var dataSource = [];
        monthpos.forEach(function (data) {
            dataSource.push({ text: self.localeObj.getConstant(data), value: monthposValue[data] });
        });
        return dataSource;
    };
    RecurrenceEditor.prototype.getDayData = function (format) {
        var weekday = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        var dayData = [];
        var cldrObj;
        this.rotateArray(weekday, this.firstDayOfWeek);
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('days.stand-alone.' + format, getDefaultDateObject()));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.stand-alone.' + format, cldrData));
        }
        for (var _i = 0, weekday_1 = weekday; _i < weekday_1.length; _i++) {
            var obj = weekday_1[_i];
            dayData.push({ text: getValue(obj, cldrObj), value: valueData[obj] });
        }
        return dayData;
    };
    RecurrenceEditor.prototype.getMonthData = function () {
        var monthData = [];
        var cldrObj;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('months.stand-alone.wide', getDefaultDateObject()));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.months.stand-alone.wide', cldrData));
        }
        for (var _i = 0, _a = Object.keys(cldrObj); _i < _a.length; _i++) {
            var obj = _a[_i];
            monthData.push({
                text: getValue(obj, cldrObj),
                value: obj
            });
        }
        return monthData;
    };
    RecurrenceEditor.prototype.setTemplate = function () {
        var dayData = this.getDayData('narrow');
        var fullDay = this.getDayData('wide');
        this.element.innerHTML = '<div class="' + HEADER + '">' +
            '<div class="' + INPUTWARAPPER + ' ' + FORMLEFT + '">' +
            '<input type="text" tabindex="0" class="' + REPEATELEMENT +
            '"label="' + REPEATELEMENT.substr(2) + '" />' +
            '</div><div class="' + INPUTWARAPPER + ' ' +
            INTERVALCLASS + ' ' + FORMRIGHT + '"><table  class="' + RECURRENCETABLE + ' ' + REPEATCONTENTWRAPPER + '"><tr>' +
            '<td><input type="text" tabindex="0" class="' + REPEATINTERVAL +
            '"title="' + this.localeObj.getConstant('repeatInterval') + '" /></td>' +
            '<td><span class="' + REPEATCONTENT + '"></span></td>' +
            '</tr></table></div><div class="' + INPUTWARAPPERSIDE + ' ' + DAYWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + WEEKEXPANDERLABEL + '>' + this.localeObj.getConstant(ON$1) + '</div>' +
            '<button type="button" class="e-round" data-index="0" title="' + fullDay[0].text + '">' + dayData[0].text + '</button>' +
            '<button type="button" class="e-round" data-index="1" title="' + fullDay[1].text + '">' + dayData[1].text + '</button>' +
            '<button type="button" class="e-round" data-index="2" title="' + fullDay[2].text + '">' + dayData[2].text + '</button>' +
            '<button type="button" class="e-round" data-index="3" title="' + fullDay[3].text + '">' + dayData[3].text + '</button>' +
            '<button type="button" class="e-round" data-index="4" title="' + fullDay[4].text + '">' + dayData[4].text + '</button>' +
            '<button type="button" class="e-round" data-index="5" title="' + fullDay[5].text + '">' + dayData[5].text + '</button>' +
            '<button type="button" class="e-round" data-index="6" title="' + fullDay[6].text + '">' + dayData[6].text + '</button></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + WEEKWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + MONTHEXPANDERLABEL + '>' + this.localeObj.getConstant(ON$1) + '</div>' +
            '<div class="' + YEAREXPANDERWRAPPER + '">' +
            '<input class="' + YEAREXPANDERELEMENT + '" type="text" tabindex="0" title="' +
            this.localeObj.getConstant('yearExpander') + '"/>' +
            '</div>' +
            '<div class="' + MONETHEXPANDERWRAPPER + '">' +
            '<table class="' + RECURRENCETABLE + ' ' + MONETHEXPANDWRAPPER + '"><tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '">' +
            '<input class="' + MONTHEXPANDERELEMENT + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td colspan="2"><div class="' + INPUTWARAPPER + ' ' + MONTHDAYELEMENT + '">' +
            '<input type="text" tabindex="0" class="' + MONTHDAYWRAPPER + '"title="' +
            this.localeObj.getConstant('monthExpander') + '" />' +
            '</div></td></tr>' +
            '<tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '" style="min-width: 30px;margin-bottom:18px;">' +
            '<input class="' + MONTHEXPANNDERELEM + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + ' ' + WEEKPOSITION + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHPOS + '"title="' + this.localeObj.getConstant('monthPosition') + '" />' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHWEEK + '"title="' + this.localeObj.getConstant('monthWeek') + '" />' +
            '</div></td></tr></table>' +
            '</div></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + ENDON + ' ' + FORMRIGHT + '">' +
            '<div class=' + ENDONLABEL + '>' + this.localeObj.getConstant(END) + '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONLEFT + '">' +
            '<input type="text" tabindex="0" class="' + ENDONELEMENT + '"title="' + this.localeObj.getConstant(END) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONDATE + '" >' +
            '<input type="text" tabindex="0" class="' + UNTILDATE + '"title="' + this.localeObj.getConstant(UNTIL$1) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONCOUNTWRAPPER + '">' +
            '<input type="text" tabindex="0" class="' + ENDONCOUNT + '"title="' + this.localeObj.getConstant(COUNT) + '" />' +
            '</div></div>' +
            '</div></div>';
    };
    RecurrenceEditor.prototype.getSelectedDaysData = function () {
        var ruleData = RULEBYDAY + EQUAL;
        var elements = this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY);
        var weekday = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (var index = 0; index < elements.length; index++) {
            ruleData += weekday[parseInt(elements[index].getAttribute('data-index'), 10)] + (index === (elements.length - 1) ? '' : COMMA);
        }
        return ruleData + SEMICOLON;
    };
    RecurrenceEditor.prototype.getSelectedMonthData = function () {
        var ruleData;
        if (this.onWeekDay.checked) {
            ruleData = RULEBYDAY + EQUAL + this.monthWeekDays.value + SEMICOLON
                + RULESETPOS + EQUAL + this.monthWeekPos.value + SEMICOLON;
        }
        else {
            ruleData = RULEBYMONTHDAY + EQUAL + this.monthDate.value + SEMICOLON;
        }
        return ruleData;
    };
    RecurrenceEditor.prototype.getIntervalData = function () {
        return RULEINTERVAL + EQUAL + this.repeatInterval.value + SEMICOLON;
    };
    RecurrenceEditor.prototype.getEndOnCount = function () {
        return RULECOUNT + EQUAL + this.recurrenceCount.value + SEMICOLON;
    };
    RecurrenceEditor.prototype.getYearMonthRuleData = function () {
        return RULEBYMONTH + EQUAL + this.monthValue.value + SEMICOLON;
    };
    RecurrenceEditor.prototype.updateWeekButton = function (keys) {
        var weekday = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (var _i = 0, _a = this.dayButtons; _i < _a.length; _i++) {
            var obj = _a[_i];
            var index = parseInt(obj.element.getAttribute('data-index'), 10);
            if (keys.indexOf(weekday[index]) !== -1) {
                obj.setProperties({ isPrimary: true });
            }
            else {
                obj.setProperties({ isPrimary: false });
            }
        }
    };
    RecurrenceEditor.prototype.updateMonthUI = function () {
        if (this.ruleObject.monthDay.length) {
            this.monthDate.setProperties({ value: this.ruleObject.monthDay[0] });
            this.onMonthDay.setProperties({ checked: true });
        }
        else {
            this.onWeekDay.setProperties({ checked: true });
            this.monthWeekPos.setProperties({ value: this.ruleObject.setPosition });
            for (var _i = 0, _a = Object.keys(valueData); _i < _a.length; _i++) {
                var key = _a[_i];
                if (valueData[key] === this.ruleObject.day[0]) {
                    this.monthWeekDays.setProperties({ value: this.ruleObject.day[0] });
                    break;
                }
            }
        }
    };
    RecurrenceEditor.prototype.updateUI = function (repeat, state) {
        this.repeatInterval.setProperties({ value: this.ruleObject.interval });
        switch (state) {
            case UNTIL$1:
                this.untilDateObj.setProperties({ value: this.ruleObject.until });
                break;
            case COUNT:
                this.recurrenceCount.setProperties({ value: this.ruleObject.count });
                break;
        }
        switch (repeat) {
            case WEEKLY:
                this.updateWeekButton(this.ruleObject.day);
                break;
            case YEARLY:
                this.monthValue.setProperties({ index: (this.ruleObject.month[0] - 1) });
                this.updateMonthUI();
                break;
            case MONTHLY:
                this.updateMonthUI();
                break;
        }
    };
    RecurrenceEditor.prototype.getUntilData = function () {
        var tempStr = getRecurrenceStringFromDate(this.untilDateObj.value);
        return RULEUNTIL + EQUAL + tempStr + SEMICOLON;
    };
    RecurrenceEditor.prototype.destroyComponents = function () {
        if (!this.recurrenceCount.isDestroyed) {
            this.recurrenceCount.destroy();
        }
        if (!this.monthDate.isDestroyed) {
            this.monthDate.destroy();
        }
        if (!this.repeatInterval.isDestroyed) {
            this.repeatInterval.destroy();
        }
        if (!this.untilDateObj.isDestroyed) {
            this.untilDateObj.destroy();
        }
        if (!this.repeatType.isDestroyed) {
            this.repeatType.destroy();
        }
        if (!this.endType.isDestroyed) {
            this.endType.destroy();
        }
        if (!this.monthWeekPos.isDestroyed) {
            this.monthWeekPos.destroy();
        }
        if (!this.monthWeekDays.isDestroyed) {
            this.monthWeekDays.destroy();
        }
        if (!this.monthValue.isDestroyed) {
            this.monthValue.destroy();
        }
        this.dayButtons.forEach(function (element) {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.dayButtons = [];
        this.monthButtons.forEach(function (element) {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.monthButtons = [];
    };
    RecurrenceEditor.prototype.resetFields = function () {
        this.startState(NONE, NEVER, this.startDate);
        this.setDefaultValue();
    };
    RecurrenceEditor.prototype.getRuleSummary = function (rule) {
        if (rule === void 0) { rule = this.getRecurrenceRule(); }
        return generateSummary(rule, this.localeObj, this.locale);
    };
    RecurrenceEditor.prototype.getRecurrenceDates = function (startDate, rule, excludeDate, maximumCount, viewDate) {
        viewDate = isNullOrUndefined(viewDate) ? this.startDate : viewDate;
        return generate(startDate, rule, excludeDate, this.firstDayOfWeek, maximumCount, viewDate);
    };
    RecurrenceEditor.prototype.getRecurrenceRule = function () {
        var ruleData = RULEFREQ + EQUAL;
        switch (this.repeatType.value) {
            case DAILY:
                ruleData += RULEDAILY + SEMICOLON;
                break;
            case WEEKLY:
                ruleData += RULEWEEKLY + SEMICOLON + this.getSelectedDaysData();
                break;
            case MONTHLY:
                ruleData += RULEMONTHLY + SEMICOLON + this.getSelectedMonthData();
                break;
            case YEARLY:
                ruleData += RULEYEARLY + SEMICOLON + this.getSelectedMonthData() + this.getYearMonthRuleData();
                break;
            case NONE:
                return '';
        }
        ruleData += this.getIntervalData();
        switch (this.endType.value) {
            case UNTIL$1:
                ruleData += this.getUntilData();
                break;
            case COUNT:
                ruleData += this.getEndOnCount();
                break;
        }
        return ruleData;
    };
    RecurrenceEditor.prototype.setRecurrenceRule = function (rule, startDate) {
        if (startDate === void 0) { startDate = this.startDate; }
        if (!rule) {
            this.repeatType.setProperties({ value: NONE });
        }
        this.ruleObject = extractObjectFromRule(rule);
        var endon = this.ruleObject.count ? COUNT : (this.ruleObject.until ? UNTIL$1 : NEVER);
        switch (this.ruleObject.freq) {
            case RULEDAILY:
                this.startState(DAILY, endon, startDate);
                this.updateUI(DAILY, endon);
                break;
            case RULEWEEKLY:
                this.startState(WEEKLY, endon, startDate);
                this.updateUI(WEEKLY, endon);
                break;
            case RULEMONTHLY:
                this.startState(MONTHLY, endon, startDate);
                this.updateUI(MONTHLY, endon);
                break;
            case RULEYEARLY:
                this.startState(YEARLY, endon, startDate);
                this.updateUI(YEARLY, endon);
                break;
        }
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    RecurrenceEditor.prototype.destroy = function () {
        this.destroyComponents();
        _super.prototype.destroy.call(this);
        var removeClasses = ['e-' + this.getModuleName()];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        this.element.innerHTML = '';
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    RecurrenceEditor.prototype.getModuleName = function () {
        return 'recurrenceeditor';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    RecurrenceEditor.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    RecurrenceEditor.prototype.render = function () {
        this.initialize();
        this.rtlClass(this.enableRtl);
        this.renderStatus = true;
    };
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    RecurrenceEditor.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'startDate':
                    this.selectMonthDay(newProp.startDate);
                    this.updateUntilDate(newProp.startDate);
                    this.endType.setProperties({ index: 0 });
                    break;
                case 'enableRtl':
                    this.rtlClass(newProp.enableRtl);
                    break;
                case 'cssClass':
                    this.applyCustomClass(newProp.cssClass);
                    break;
                case 'selectedType':
                    this.repeatType.setProperties({ index: this.selectedType });
                    break;
                case 'minDate':
                    this.untilDateObj.setProperties({ minDate: this.minDate });
                    break;
                case 'maxDate':
                    this.untilDateObj.setProperties({ maxDate: this.maxDate });
                    break;
                case 'value':
                    if (this.getRecurrenceRule() !== this.value) {
                        this.setRecurrenceRule(this.value);
                    }
                    break;
                case 'locale':
                case 'frequencies':
                case 'firstDayOfWeek':
                    this.refresh();
                    break;
            }
        }
    };
    __decorate$1([
        Property(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    ], RecurrenceEditor.prototype, "frequencies", void 0);
    __decorate$1([
        Property(0)
    ], RecurrenceEditor.prototype, "firstDayOfWeek", void 0);
    __decorate$1([
        Property(new Date())
    ], RecurrenceEditor.prototype, "startDate", void 0);
    __decorate$1([
        Property()
    ], RecurrenceEditor.prototype, "dateFormat", void 0);
    __decorate$1([
        Property('en-US')
    ], RecurrenceEditor.prototype, "locale", void 0);
    __decorate$1([
        Property()
    ], RecurrenceEditor.prototype, "cssClass", void 0);
    __decorate$1([
        Property(false)
    ], RecurrenceEditor.prototype, "enableRtl", void 0);
    __decorate$1([
        Property()
    ], RecurrenceEditor.prototype, "value", void 0);
    __decorate$1([
        Property(new Date(1900, 1, 1))
    ], RecurrenceEditor.prototype, "minDate", void 0);
    __decorate$1([
        Property(new Date(2099, 12, 31))
    ], RecurrenceEditor.prototype, "maxDate", void 0);
    __decorate$1([
        Property(0)
    ], RecurrenceEditor.prototype, "selectedType", void 0);
    __decorate$1([
        Event()
    ], RecurrenceEditor.prototype, "change", void 0);
    RecurrenceEditor = __decorate$1([
        NotifyPropertyChanges
    ], RecurrenceEditor);
    return RecurrenceEditor;
}(Component));

var EVENT_FIELD$1 = 'e-field';
var REPEAT_CONTAINER_CLASS = 'e-recurrence-container';
var REPEAT_BUTTON_ICON_CLASS = 'e-recurrence-edit';
var REPEAT_BUTTON_CLASS = 'e-recurrence-edit-button';
var REPEAT_DIALOG_CLASS = 'e-recurrence-dialog';
var HIDE_STYLE_CLASS = 'e-hide';
/**
 * Event editor window
 */
var EventWindow = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for event window
     */
    function EventWindow(parent) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fields = this.parent.eventFields;
        this.fieldValidator = new FieldValidator();
        var timezone = new Timezone();
        this.localTimezoneName = timezone.getLocalTimezoneName();
        this.renderEventWindow();
    }
    EventWindow.prototype.renderEventWindow = function () {
        var dialogContent = this.getEventWindowContent();
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        if (this.parent.isAdaptive) {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                content: dialogContent,
                cssClass: EVENT_WINDOW_DIALOG_CLASS + ' ' + DEVICE_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                    this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>',
                height: '100%',
                isModal: true,
                showCloseIcon: false,
                target: document.body,
                visible: false,
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        }
        else {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                buttons: [{
                        buttonModel: { content: this.l10n.getConstant('deleteButton'), cssClass: EVENT_WINDOW_DELETE_BUTTON_CLASS },
                        click: this.eventDelete.bind(this)
                    }, {
                        buttonModel: {
                            content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary ' + EVENT_WINDOW_SAVE_BUTTON_CLASS,
                            isPrimary: true
                        },
                        click: this.eventSave.bind(this)
                    }, {
                        buttonModel: { cssClass: EVENT_WINDOW_CANCEL_BUTTON_CLASS, content: this.l10n.getConstant('cancelButton') },
                        click: this.dialogClose.bind(this)
                    }],
                content: dialogContent,
                cssClass: EVENT_WINDOW_DIALOG_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>',
                isModal: true,
                showCloseIcon: true,
                target: document.body,
                visible: false,
                width: '500px',
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        }
        this.dialogObject.appendTo(this.element);
        addClass([this.element.parentElement], EVENT_WINDOW_DIALOG_CLASS + '-container');
        if (this.parent.isAdaptive) {
            EventHandler.add(this.element.querySelector('.' + EVENT_WINDOW_BACK_ICON_CLASS), 'click', this.dialogClose, this);
            EventHandler.add(this.element.querySelector('.' + EVENT_WINDOW_SAVE_ICON_CLASS), 'click', this.eventSave, this);
        }
        this.applyFormValidation();
    };
    EventWindow.prototype.refresh = function () {
        this.destroy();
        this.renderEventWindow();
    };
    EventWindow.prototype.refreshRecurrenceEditor = function () {
        if (this.recurrenceEditor) {
            var recurrenceEditor = this.recurrenceEditor.element;
            this.recurrenceEditor.destroy();
            this.createRecurrenceEditor(recurrenceEditor);
        }
    };
    EventWindow.prototype.openEditor = function (data, type, isEventData, repeatType) {
        this.parent.removeNewEventElement();
        this.parent.quickPopup.quickPopupHide(true);
        if (this.parent.calendarMode === 'Islamic') {
            addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], DISABLE_CLASS);
        }
        else if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            removeClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], DISABLE_CLASS);
        }
        switch (type) {
            case 'Add':
                this.cellClickAction = !isEventData;
                this.parent.activeCellsData = data;
                this.onCellDetailsUpdate(data, repeatType);
                break;
            case 'Save':
            case 'EditOccurrence':
            case 'EditSeries':
                if (type === 'EditOccurrence' && !this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
                    addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], DISABLE_CLASS);
                }
                this.cellClickAction = false;
                this.onEventDetailsUpdate(data);
                break;
        }
    };
    EventWindow.prototype.setDialogContent = function () {
        this.dialogObject.content = this.getEventWindowContent();
        this.dialogObject.dataBind();
    };
    EventWindow.prototype.onBeforeOpen = function (args) {
        var eventProp = {
            type: 'Editor',
            data: this.eventData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element)
        };
        if (this.cellClickAction) {
            eventProp.duration = this.getSlotDuration();
        }
        this.parent.trigger(popupOpen, eventProp);
        args.cancel = eventProp.cancel;
        this.duration = this.cellClickAction ? eventProp.duration : null;
        this.refreshDateTimePicker(this.duration);
        if (this.cellClickAction && eventProp.duration !== this.getSlotDuration() && isNullOrUndefined(this.parent.editorTemplate)) {
            var startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
            var endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
            endObj.value = new Date(startObj.value.getTime() + (MS_PER_MINUTE * eventProp.duration));
            endObj.dataBind();
        }
    };
    EventWindow.prototype.onBeforeClose = function () {
        this.parent.eventBase.focusElement();
    };
    EventWindow.prototype.getEventWindowContent = function () {
        var container = createElement('div', { className: FORM_CONTAINER_CLASS });
        var form = createElement('form', {
            id: this.parent.element.id + 'EditForm',
            className: FORM_CLASS,
            attrs: { onsubmit: 'return false;' }
        });
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            append(this.parent.getEditorTemplate()(), form);
        }
        else {
            var content = this.getDefaultEventWindowContent();
            form.appendChild(content);
        }
        container.appendChild(form);
        return container;
    };
    EventWindow.prototype.getDefaultEventWindowContent = function () {
        var parentDiv = this.createDivElement(EVENT_WINDOW_DIALOG_PARENT_CLASS);
        var titleLocationDiv = this.createDivElement(EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS);
        var titleDiv = this.renderTextBox(SUBJECT_CLASS);
        var locationDiv = this.renderTextBox(LOCATION_CLASS);
        titleLocationDiv.appendChild(titleDiv);
        titleLocationDiv.appendChild(locationDiv);
        var startEndDateTimeDiv = this.createDivElement(EVENT_WINDOW_START_END_DIV_CLASS);
        var startDateTimeDiv = this.renderDateTimePicker(EVENT_WINDOW_START_CLASS, this.onTimeChange.bind(this));
        var endDateTimeDiv = this.renderDateTimePicker(EVENT_WINDOW_END_CLASS);
        startEndDateTimeDiv.appendChild(startDateTimeDiv);
        startEndDateTimeDiv.appendChild(endDateTimeDiv);
        var timezoneParentDiv = this.createDivElement(EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        var startTimezoneDiv = this.renderDropDown(EVENT_WINDOW_START_TZ_CLASS);
        var endTimezoneDiv = this.renderDropDown(EVENT_WINDOW_END_TZ_CLASS);
        timezoneParentDiv.appendChild(startTimezoneDiv);
        timezoneParentDiv.appendChild(endTimezoneDiv);
        var allDayTimezoneDiv = this.createDivElement(EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS);
        var allDayDiv = this.renderCheckBox(EVENT_WINDOW_ALL_DAY_CLASS);
        var timezoneDiv = this.renderCheckBox(TIME_ZONE_CLASS);
        allDayTimezoneDiv.appendChild(allDayDiv);
        allDayTimezoneDiv.appendChild(timezoneDiv);
        var repeatParentDiv = this.createDivElement(EVENT_WINDOW_REPEAT_DIV_CLASS);
        var repeatDiv = this.renderCheckBox(EVENT_WINDOW_REPEAT_CLASS);
        var repeatEditConainer = createElement('span', { className: REPEAT_CONTAINER_CLASS });
        var button = createElement('button', {
            className: REPEAT_BUTTON_CLASS,
            attrs: { type: 'button', 'title': this.l10n.getConstant('editRecurrence') }
        });
        this.buttonObj = new Button({ iconCss: REPEAT_BUTTON_ICON_CLASS + ' e-icons', cssClass: 'e-medium ' + this.parent.cssClass });
        repeatEditConainer.appendChild(button);
        this.buttonObj.appendTo(button);
        repeatDiv.appendChild(repeatEditConainer);
        repeatParentDiv.appendChild(repeatDiv);
        var description = this.createDivElement(DESCRIPTION_CLASS + '-row');
        var descriptionDiv = this.renderTextBox(DESCRIPTION_CLASS);
        description.appendChild(descriptionDiv);
        parentDiv.appendChild(titleLocationDiv);
        parentDiv.appendChild(startEndDateTimeDiv);
        parentDiv.appendChild(allDayTimezoneDiv);
        parentDiv.appendChild(timezoneParentDiv);
        parentDiv.appendChild(repeatParentDiv);
        if (!this.parent.isAdaptive) {
            this.createRecurrenceEditor(parentDiv);
        }
        else {
            EventHandler.add(button, 'click', this.loadRecurrenceEditor, this);
        }
        if (this.parent.resources.length > 0) {
            var resourceParentDiv = this.createDivElement(EVENT_WINDOW_RESOURCES_DIV_CLASS);
            for (var i = 0; i < this.parent.resourceBase.resourceCollection.length; i++) {
                resourceParentDiv.appendChild(this.renderResourceDetails(i));
            }
            parentDiv.appendChild(resourceParentDiv);
        }
        parentDiv.appendChild(description);
        var submit = createElement('button', { attrs: { type: 'hidden', title: 'submit', style: 'display:none' } });
        parentDiv.appendChild(submit);
        return parentDiv;
    };
    EventWindow.prototype.createRecurrenceEditor = function (parentDiv) {
        var recurrenceEditor = this.createDivElement();
        parentDiv.appendChild(recurrenceEditor);
        this.recurrenceEditor = this.renderRecurrenceEditor();
        this.recurrenceEditor.appendTo(recurrenceEditor);
    };
    EventWindow.prototype.createDivElement = function (className) {
        return createElement('div', { className: className });
    };
    EventWindow.prototype.createInputElement = function (className, fieldName, type) {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', name: fieldName, value: '',
                title: ((this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))) === '') ?
                    fieldName : this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))
            }
        });
    };
    EventWindow.prototype.getSlotDuration = function () {
        return this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
    };
    EventWindow.prototype.renderDateTimePicker = function (value, changeEvent) {
        var dateTimeDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var dateTimeInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        dateTimeDiv.appendChild(dateTimeInput);
        var dateTimePicker = new DateTimePicker({
            change: changeEvent,
            calendarMode: this.parent.calendarMode,
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            floatLabelType: 'Always',
            format: (isNullOrUndefined(this.parent.dateFormat) ?
                this.getFormat('dateFormats') : this.parent.dateFormat) + ' ' + this.getFormat('timeFormats'),
            placeholder: this.getFieldLabel(value),
            step: this.getSlotDuration(),
            value: new Date(), width: '100%'
        });
        dateTimePicker.appendTo(dateTimeInput);
        return dateTimeDiv;
    };
    EventWindow.prototype.refreshDateTimePicker = function (duration) {
        var _this = this;
        var startEndElement = [].slice.call(this.element.querySelectorAll('.' + EVENT_WINDOW_START_CLASS + ',.' +
            EVENT_WINDOW_END_CLASS));
        startEndElement.forEach(function (element) {
            var instance = element.ej2_instances[0];
            instance.step = duration || _this.getSlotDuration();
            instance.dataBind();
        });
    };
    EventWindow.prototype.onTimeChange = function () {
        var startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
        if (startObj.element.parentElement.classList.contains('e-input-focus')) {
            var endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
            var duration = 0;
            if (this.cellClickAction) {
                duration = MS_PER_MINUTE * this.duration;
            }
            else {
                duration = this.eventData[this.fields.endTime].getTime() - this.eventData[this.fields.startTime].getTime();
            }
            endObj.value = new Date(startObj.value.getTime() + duration);
            endObj.dataBind();
        }
    };
    EventWindow.prototype.renderResourceDetails = function (index) {
        var resourceData = this.parent.resourceBase.resourceCollection[index];
        var fieldName = resourceData.field;
        var value = 'e-' + fieldName;
        var labelValue = resourceData.title;
        var resourceDiv = this.createDivElement(value + '-container' + ' ' + 'e-resources');
        var resourceInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        resourceDiv.appendChild(resourceInput);
        var resourceTemplate = '<div class="e-resource-template"><div class="e-resource-color" style="background-color:${' +
            resourceData.colorField + '}"></div><div class="e-resource-text">${' + resourceData.textField + '}</div></div>';
        if (resourceData.allowMultiple) {
            var listObj = new MultiSelect({
                cssClass: this.parent.cssClass || '',
                dataSource: resourceData.dataSource,
                change: this.onMultiselectResourceChange.bind(this),
                itemTemplate: resourceTemplate,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                mode: 'Box'
            });
            listObj.appendTo(resourceInput);
        }
        else {
            var drowDownList = new DropDownList({
                cssClass: this.parent.cssClass || '',
                change: this.onDropdownResourceChange.bind(this),
                dataSource: resourceData.dataSource,
                enableRtl: this.parent.enableRtl,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                itemTemplate: resourceTemplate
            });
            drowDownList.appendTo(resourceInput);
        }
        return resourceDiv;
    };
    EventWindow.prototype.renderDropDown = function (value) {
        var fieldName = this.getFieldName(value);
        var timezoneDiv = this.createDivElement(value + '-container');
        var timezoneInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        timezoneDiv.appendChild(timezoneInput);
        var drowDownList = new DropDownList({
            allowFiltering: true,
            change: this.onTimezoneChange.bind(this),
            cssClass: this.parent.cssClass || '',
            dataSource: timezoneData,
            enableRtl: this.parent.enableRtl,
            fields: { text: 'Text', value: 'Value' },
            filterBarPlaceholder: 'Search Timezone',
            filtering: function (e) {
                var query = new Query();
                query = (e.text !== '') ? query.where('Text', 'contains', e.text, true) : query;
                e.updateData(timezoneData, query);
            },
            htmlAttributes: { 'title': this.getFieldLabel(value), 'name': fieldName },
            floatLabelType: 'Always',
            placeholder: this.getFieldLabel(value),
            popupHeight: '230px',
        });
        drowDownList.appendTo(timezoneInput);
        return timezoneDiv;
    };
    EventWindow.prototype.onMultiselectResourceChange = function (args) {
        if (!args.value || !this.parent.activeViewOptions.group.byGroupID || this.parent.resources.length <= 1) {
            return;
        }
        var resourceCollection = this.parent.resourceBase.resourceCollection;
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        for (var i = 0; i < resourceCollection.length; i++) {
            if (resourceCollection[i].field === fieldName && i < resourceCollection.length - 1) {
                var resObject = this.createInstance(i);
                var datasource = [];
                for (var j = 0; j < args.value.length; j++) {
                    var resourceData = resourceCollection[i + 1].dataSource;
                    var query = new Query().where(resourceCollection[i + 1].groupIDField, 'equal', args.value[j]);
                    var filter = new DataManager({ json: resourceData }).executeLocal(query)[0];
                    var groupId = filter[resourceCollection[i + 1].idField];
                    var filterRes = this.filterDatasource(i, groupId);
                    datasource = datasource.concat(filterRes);
                }
                resObject.dataSource = datasource;
                resObject.dataBind();
            }
        }
    };
    EventWindow.prototype.createInstance = function (index) {
        var resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        var resObject = this.element.querySelector('.e-' + resourceData.field).
            ej2_instances[0];
        return resObject;
    };
    EventWindow.prototype.onDropdownResourceChange = function (args) {
        if (!args.value || this.parent.resources.length <= 1 || !this.parent.activeViewOptions.group.byGroupID) {
            return;
        }
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        var resourceCollection = this.parent.resourceBase.resourceCollection;
        for (var i = 0; i < resourceCollection.length; i++) {
            if ((i < resourceCollection.length - 1) && resourceCollection[i].field === fieldName) {
                var resObj = this.createInstance(i);
                var groupId = args.itemData[resourceCollection[i].idField];
                resObj.dataSource = this.filterDatasource(i, groupId);
                resObj.dataBind();
                var resValue = resObj.dataSource[0][resourceCollection[i + 1].idField];
                resObj.value = (resourceCollection[i + 1].allowMultiple) ? [resValue] : resValue;
                resObj.dataBind();
            }
        }
    };
    EventWindow.prototype.filterDatasource = function (index, groupId) {
        var resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        var query = new Query().where(resourceData.groupIDField, 'equal', groupId);
        var filter = new DataManager({ json: resourceData.dataSource }).executeLocal(query);
        return filter;
    };
    EventWindow.prototype.onTimezoneChange = function (args) {
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        if (fieldName === this.parent.eventFields.startTimezone) {
            var startTimezoneObj = this.getInstance(EVENT_WINDOW_START_TZ_CLASS);
            var endTimezoneObj = this.getInstance(EVENT_WINDOW_END_TZ_CLASS);
            endTimezoneObj.value = startTimezoneObj.value;
            endTimezoneObj.dataBind();
        }
    };
    EventWindow.prototype.renderCheckBox = function (value) {
        var checkBoxDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var checkBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        checkBoxDiv.appendChild(checkBoxInput);
        var checkBox = new CheckBox({
            change: this.onChange.bind(this),
            cssClass: value + ' ' + this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            label: this.getFieldLabel(value)
        });
        checkBox.appendTo(checkBoxInput);
        checkBoxInput.setAttribute('name', fieldName);
        if (fieldName === 'Repeat') {
            this.repeatStatus = checkBox;
        }
        return checkBoxDiv;
    };
    EventWindow.prototype.renderTextBox = function (value) {
        var textBoxDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var elementType = (value === DESCRIPTION_CLASS) ? 'textarea' : 'input';
        var textBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName, elementType);
        textBoxDiv.appendChild(textBoxInput);
        Input.createInput({
            element: textBoxInput,
            floatLabelType: 'Always',
            properties: {
                enableRtl: this.parent.enableRtl,
                placeholder: this.getFieldLabel(value)
            }
        });
        return textBoxDiv;
    };
    EventWindow.prototype.getFieldName = function (name) {
        var fieldName = '';
        switch (name) {
            case SUBJECT_CLASS:
                fieldName = this.fields.subject;
                break;
            case LOCATION_CLASS:
                fieldName = this.fields.location;
                break;
            case EVENT_WINDOW_START_CLASS:
                fieldName = this.fields.startTime;
                break;
            case EVENT_WINDOW_END_CLASS:
                fieldName = this.fields.endTime;
                break;
            case DESCRIPTION_CLASS:
                fieldName = this.fields.description;
                break;
            case EVENT_WINDOW_ALL_DAY_CLASS:
                fieldName = this.fields.isAllDay;
                break;
            case EVENT_WINDOW_START_TZ_CLASS:
                fieldName = this.fields.startTimezone;
                break;
            case EVENT_WINDOW_END_TZ_CLASS:
                fieldName = this.fields.endTimezone;
                break;
            case TIME_ZONE_CLASS:
                fieldName = 'Timezone';
                break;
            case EVENT_WINDOW_REPEAT_CLASS:
                fieldName = 'Repeat';
                break;
        }
        return fieldName;
    };
    EventWindow.prototype.getFieldLabel = function (fieldName) {
        var labelText = '';
        switch (fieldName) {
            case SUBJECT_CLASS:
                labelText = this.parent.editorTitles.subject;
                break;
            case LOCATION_CLASS:
                labelText = this.parent.editorTitles.location;
                break;
            case DESCRIPTION_CLASS:
                labelText = this.parent.editorTitles.description;
                break;
            case EVENT_WINDOW_START_CLASS:
                labelText = this.parent.editorTitles.startTime;
                break;
            case EVENT_WINDOW_END_CLASS:
                labelText = this.parent.editorTitles.endTime;
                break;
            case EVENT_WINDOW_START_TZ_CLASS:
                labelText = this.parent.editorTitles.startTimezone;
                break;
            case EVENT_WINDOW_END_TZ_CLASS:
                labelText = this.parent.editorTitles.endTimezone;
                break;
            case EVENT_WINDOW_REPEAT_CLASS:
                labelText = this.parent.editorTitles.recurrenceRule;
                break;
            case EVENT_WINDOW_ALL_DAY_CLASS:
                labelText = this.parent.editorTitles.isAllDay;
                break;
            case TIME_ZONE_CLASS:
                labelText = this.l10n.getConstant('timezone');
                break;
        }
        return labelText;
    };
    EventWindow.prototype.onChange = function (args) {
        var target = (args.event.target);
        if (target.classList.contains(EVENT_WINDOW_ALL_DAY_CLASS)) {
            this.onAllDayChange(args.checked);
        }
        else if (target.classList.contains(TIME_ZONE_CLASS)) {
            this.timezoneChangeStyle(args.checked);
        }
        else if (target.classList.contains(EVENT_WINDOW_REPEAT_CLASS)) {
            this.onRepeatChange(args.checked);
        }
    };
    EventWindow.prototype.renderRepeatDialog = function () {
        var element = createElement('div');
        this.repeatDialogObject = new Dialog({
            header: this.l10n.getConstant('recurrence'),
            visible: false,
            content: '<div class="e-rec-editor"></div>',
            closeOnEscape: true,
            width: '90%',
            buttons: [{
                    click: this.repeatSaveDialog.bind(this),
                    buttonModel: { content: this.l10n.getConstant('save'), cssClass: 'e-save', isPrimary: true }
                },
                { click: this.repeatCancelDialog.bind(this), buttonModel: { cssClass: 'e-cancel', content: this.l10n.getConstant('cancel') } }],
            target: this.element,
            animationSettings: { effect: 'Zoom' },
            enableRtl: this.parent.enableRtl,
            isModal: true,
            cssClass: REPEAT_DIALOG_CLASS,
            open: this.repeatOpenDialog.bind(this)
        });
        this.element.appendChild(element);
        this.repeatDialogObject.appendTo(element);
        this.createRecurrenceEditor(this.repeatDialogObject.element.querySelector('.e-rec-editor'));
    };
    EventWindow.prototype.loadRecurrenceEditor = function () {
        this.repeatDialogObject.show();
        if (this.recurrenceEditor && this.repeatRule) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
        }
    };
    EventWindow.prototype.onRepeatChange = function (state) {
        if (state) {
            if (!this.repeatDialogObject) {
                this.renderRepeatDialog();
            }
            this.recurrenceEditor.setProperties({ startDate: this.repeatStartDate, selectedType: 0 });
            this.loadRecurrenceEditor();
        }
        else {
            if (this.repeatDialogObject) {
                this.repeatDialogObject.hide();
            }
            this.repeatRule = '';
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
                this.updateRepeatLabel(this.repeatRule);
            }
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
        }
    };
    EventWindow.prototype.repeatSaveDialog = function () {
        this.repeatRule = this.recurrenceEditor.getRecurrenceRule();
        var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
        if (this.recurrenceEditor.getRecurrenceRule()) {
            removeClass([element], HIDE_STYLE_CLASS);
        }
        else {
            addClass([element], HIDE_STYLE_CLASS);
            this.repeatStatus.setProperties({ checked: false });
        }
        this.updateRepeatLabel(this.repeatRule);
        this.closeRepeatDialog();
    };
    EventWindow.prototype.closeRepeatDialog = function () {
        this.repeatDialogObject.hide();
    };
    EventWindow.prototype.repeatCancelDialog = function () {
        this.closeRepeatDialog();
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatTempRule);
        }
        if (!this.repeatTempRule) {
            this.repeatStatus.setProperties({ checked: false });
        }
    };
    EventWindow.prototype.repeatOpenDialog = function () {
        this.repeatTempRule = this.recurrenceEditor.getRecurrenceRule();
    };
    EventWindow.prototype.onCellDetailsUpdate = function (event, repeatType) {
        this.element.querySelector('.' + FORM_CLASS).removeAttribute('data-id');
        this.element.querySelector('.' + EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('newEvent');
        var eventObj = {};
        if (this.cellClickAction) {
            if (event.subject) {
                eventObj[this.fields.subject] = event.subject;
            }
            eventObj[this.fields.startTime] = event.startTime;
            eventObj[this.fields.endTime] = event.endTime;
            eventObj[this.fields.isAllDay] = event.isAllDay;
            if (this.parent.resources.length > 0 || this.parent.activeViewOptions.group.resources.length > 0) {
                this.parent.resourceBase.setResourceValues(eventObj, false);
            }
        }
        else {
            this.parent.activeCellsData = {
                startTime: (event.startTime || event[this.fields.startTime]),
                endTime: (event.endTime || event[this.fields.endTime]),
                isAllDay: (event.isAllDay || event[this.fields.isAllDay]),
                element: event.element,
                groupIndex: event.groupIndex
            };
            eventObj = event;
        }
        eventObj.Timezone = false;
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        this.showDetails(eventObj);
        var deleteButton = this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS);
        if (deleteButton) {
            addClass([deleteButton], DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setProperties({ startDate: eventObj[this.fields.startTime], selectedType: repeatType || 0 });
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
            this.updateRepeatLabel(this.repeatRule);
        }
        else {
            var saveButton = this.element.querySelector('.' + EVENT_WINDOW_SAVE_BUTTON_CLASS);
            this.disableButton(saveButton, false);
        }
        this.dialogObject.show();
    };
    EventWindow.prototype.applyFormValidation = function () {
        var getValidationRule = function (rules) { return (rules && Object.keys(rules).length > 0) ? rules : undefined; };
        var form = this.element.querySelector('.' + FORM_CLASS);
        var rules = {};
        rules[this.parent.eventSettings.fields.subject.name] = getValidationRule(this.parent.eventSettings.fields.subject.validation);
        rules[this.parent.eventSettings.fields.location.name] = getValidationRule(this.parent.eventSettings.fields.location.validation);
        rules[this.parent.eventSettings.fields.startTime.name] = getValidationRule(this.parent.eventSettings.fields.startTime.validation);
        rules[this.parent.eventSettings.fields.endTime.name] = getValidationRule(this.parent.eventSettings.fields.endTime.validation);
        rules[this.parent.eventSettings.fields.description.name] =
            getValidationRule(this.parent.eventSettings.fields.description.validation);
        this.fieldValidator.renderFormValidator(form, rules, this.element);
    };
    EventWindow.prototype.showDetails = function (eventData) {
        var eventObj = extend({}, eventData, null, true);
        this.trimAllDay(eventObj);
        this.eventData = eventObj;
        var formelement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        var keyNames = Object.keys(eventObj);
        for (var _i = 0, formelement_1 = formelement; _i < formelement_1.length; _i++) {
            var curElement = formelement_1[_i];
            var columnName = curElement.name || this.getColumnName(curElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                if (keyNames.indexOf(columnName) !== -1) {
                    this.setValueToElement(curElement, eventObj[columnName]);
                }
                else {
                    this.setDefaultValueToElement(curElement);
                }
            }
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            this.onAllDayChange(eventObj[this.fields.isAllDay]);
            var timezoneObj = this.getInstance(TIME_ZONE_CLASS + '.' + EVENT_FIELD$1);
            if (!(isNullOrUndefined(eventObj[this.fields.startTimezone]) && isNullOrUndefined(eventObj[this.fields.endTimezone]))) {
                timezoneObj.checked = true;
                timezoneObj.dataBind();
            }
            this.timezoneChangeStyle(timezoneObj.checked);
            delete eventObj.Timezone;
        }
    };
    EventWindow.prototype.getColumnName = function (element) {
        var attrName = element.getAttribute('data-name') || '';
        if (attrName === '') {
            var isDropDowns = false;
            var fieldSelector = '';
            if (element.classList.contains('e-dropdownlist')) {
                fieldSelector = 'e-ddl';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-multiselect')) {
                fieldSelector = 'e-multiselect';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-datetimepicker')) {
                fieldSelector = 'e-datetimepicker';
            }
            else if (element.classList.contains('e-datepicker')) {
                fieldSelector = 'e-datepicker';
            }
            else if (element.classList.contains('e-checkbox')) {
                fieldSelector = 'e-checkbox';
            }
            var classSelector = isDropDowns ? "." + fieldSelector + ":not(.e-control)" : "." + fieldSelector;
            var control = closest(element, classSelector) || element.querySelector("." + fieldSelector);
            if (control) {
                var attrEle = control.querySelector('[name]');
                if (attrEle) {
                    attrName = attrEle.name;
                }
            }
        }
        return attrName;
    };
    EventWindow.prototype.onAllDayChange = function (allDayStatus) {
        var startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
        var endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
        var timezoneDiv = this.element.querySelector('.e-time-zone-container');
        var format;
        if (allDayStatus) {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') : this.parent.dateFormat;
            addClass(this.element.querySelectorAll('.e-time-icon'), EVENT_WINDOW_ICON_DISABLE_CLASS);
            addClass([timezoneDiv], DISABLE_CLASS);
            if (this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)) {
                removeClass([this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        else {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') + ' ' + this.getFormat('timeFormats') :
                this.parent.dateFormat + ' ' + this.getFormat('timeFormats');
            removeClass(this.element.querySelectorAll('.e-time-icon'), EVENT_WINDOW_ICON_DISABLE_CLASS);
            removeClass([timezoneDiv], DISABLE_CLASS);
            if (this.element.querySelector('.e-checkbox-wrapper .e-time-zone').checked) {
                addClass([this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        if (this.cellClickAction) {
            this.updateDateTime(allDayStatus, startObj, endObj);
        }
        startObj.dataBind();
        endObj.dataBind();
    };
    EventWindow.prototype.updateDateTime = function (allDayStatus, startObj, endObj) {
        var startDate;
        var endDate;
        if (allDayStatus) {
            startDate = resetTime(new Date(this.parent.activeCellsData.startTime.getTime()));
            if (this.parent.activeCellsData.isAllDay) {
                var temp = addDays(new Date(this.parent.activeCellsData.endTime.getTime()), -1).getTime();
                endDate = (+this.parent.activeCellsData.startTime > temp) ? this.parent.activeCellsData.endTime : new Date(temp);
            }
            else {
                endDate = resetTime(new Date(this.parent.activeCellsData.endTime.getTime()));
            }
        }
        else {
            startDate = new Date(this.parent.activeCellsData.startTime.getTime());
            if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda' || this.parent.activeCellsData.isAllDay) {
                var startHour = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
                startDate.setHours(startHour.getHours(), startHour.getMinutes(), startHour.getSeconds());
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(MS_PER_MINUTE * this.getSlotDuration());
            }
            else {
                endDate = new Date(this.parent.activeCellsData.endTime.getTime());
            }
        }
        startObj.value = startDate;
        endObj.value = endDate;
        startObj.dataBind();
        endObj.dataBind();
    };
    EventWindow.prototype.getFormat = function (formatType) {
        var format;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject());
        }
        else {
            format = getValue(
            // tslint:disable-next-line:max-line-length
            'main.' + '' + this.parent.locale + '.dates.calendars.' + this.parent.getCalendarMode() + '.' + formatType + '.short', cldrData);
        }
        return format;
    };
    EventWindow.prototype.onEventDetailsUpdate = function (eventObj) {
        if (!this.parent.isAdaptive) {
            removeClass([this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS)], DISABLE_CLASS);
        }
        this.element.querySelector('.' + EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('editEvent');
        this.element.querySelector('.' + FORM_CLASS).setAttribute('data-id', eventObj[this.fields.id].toString());
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            eventObj = extend({}, eventObj, null, true);
            var timezoneObj = this.getInstance(TIME_ZONE_CLASS + '.' + EVENT_FIELD$1);
            var timezoneValue = void 0;
            if (eventObj[this.fields.startTimezone] || eventObj[this.fields.endTimezone]) {
                timezoneValue = true;
                this.parent.eventBase.timezoneConvert(eventObj);
            }
            else {
                timezoneValue = false;
            }
            eventObj.Timezone = timezoneValue;
            timezoneObj.checked = timezoneValue;
            timezoneObj.dataBind();
        }
        this.showDetails(eventObj);
        if (eventObj[this.fields.recurrenceRule] && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
        }
        else if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule('');
        }
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        if (eventObj[this.fields.recurrenceRule]) {
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
            }
            this.repeatRule = eventObj[this.fields.recurrenceRule];
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule]) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            }
            else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        }
        var isDisable = (this.parent.readonly || eventObj[this.fields.isReadonly]);
        if (!this.parent.isAdaptive) {
            var saveButton = this.element.querySelector('.' + EVENT_WINDOW_SAVE_BUTTON_CLASS);
            var deleteButton = this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS);
            this.disableButton(saveButton, isDisable);
            this.disableButton(deleteButton, isDisable);
        }
        else {
            var saveIcon = this.element.querySelector('.' + EVENT_WINDOW_SAVE_ICON_CLASS);
            if (saveIcon) {
                if (isDisable) {
                    addClass([saveIcon], ICON_DISABLE_CLASS);
                }
                else {
                    removeClass([saveIcon], ICON_DISABLE_CLASS);
                }
            }
        }
        this.dialogObject.show();
    };
    EventWindow.prototype.disableButton = function (element, value) {
        if (element) {
            element.ej2_instances[0].disabled = value;
        }
    };
    EventWindow.prototype.renderRecurrenceEditor = function () {
        return new RecurrenceEditor({
            cssClass: this.parent.cssClass,
            dateFormat: this.parent.dateFormat,
            enableRtl: this.parent.enableRtl,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            locale: this.parent.locale
        });
    };
    EventWindow.prototype.updateRepeatLabel = function (repeatRule) {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        var data = repeatRule ?
            (this.l10n.getConstant('repeats') + ' ' + this.recurrenceEditor.getRuleSummary(repeatRule)) : this.l10n.getConstant('repeat');
        this.repeatStatus.setProperties({ label: data });
    };
    EventWindow.prototype.dialogClose = function () {
        this.parent.activeEventData = { event: undefined, element: undefined };
        this.parent.currentAction = null;
        this.dialogObject.hide();
        this.fieldValidator.destroyToolTip();
        this.resetFormFields();
        if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.resetFields();
        }
    };
    EventWindow.prototype.timezoneChangeStyle = function (value) {
        var _this = this;
        var timezoneDiv = this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        if (value) {
            addClass([timezoneDiv], ENABLE_CLASS);
            var startTimezoneObj = this.getInstance(EVENT_WINDOW_START_TZ_CLASS);
            var endTimezoneObj = this.getInstance(EVENT_WINDOW_END_TZ_CLASS);
            var timezone = startTimezoneObj.dataSource;
            if (!startTimezoneObj.value || !this.parent.timezone) {
                var found = timezone.some(function (tz) { return tz.Value === _this.localTimezoneName; });
                if (!found) {
                    timezone.push({ Value: this.localTimezoneName, Text: this.localTimezoneName });
                    startTimezoneObj.dataSource = timezone;
                    endTimezoneObj.dataSource = timezone;
                    startTimezoneObj.dataBind();
                    endTimezoneObj.dataBind();
                }
            }
            startTimezoneObj.value = startTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            endTimezoneObj.value = endTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            startTimezoneObj.dataBind();
            endTimezoneObj.dataBind();
        }
        else {
            removeClass([timezoneDiv], ENABLE_CLASS);
        }
    };
    EventWindow.prototype.resetFormFields = function () {
        var formelement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        for (var index = 0, len = formelement.length; index < len; index++) {
            var columnName = formelement[index].name;
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                this.setDefaultValueToElement(formelement[index]);
            }
        }
    };
    EventWindow.prototype.eventSave = function (alert) {
        this.parent.uiStateValues.isBlock = false;
        var alertType;
        var formElement = this.element.querySelector('.' + FORM_CLASS);
        if (formElement && formElement.classList.contains('e-formvalidator') &&
            !formElement.ej2_instances[0].validate()) {
            return;
        }
        var eventObj = extend({}, this.getObjectFromFormData(EVENT_WINDOW_DIALOG_CLASS));
        if (!eventObj.Timezone) {
            eventObj[this.fields.startTimezone] = null;
            eventObj[this.fields.endTimezone] = null;
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            delete eventObj.Timezone;
            delete eventObj.Repeat;
            if (!eventObj[this.fields.startTime] || !eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('invalidDateError');
                return;
            }
            if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('startEndError');
                return;
            }
        }
        if (this.recurrenceEditor && this.recurrenceEditor.value && this.recurrenceEditor.value !== '') {
            alertType = this.recurrenceValidation(eventObj[this.fields.startTime], eventObj[this.fields.endTime], alert);
            if (!isNullOrUndefined(alertType)) {
                this.parent.quickPopup.openRecurrenceValidationAlert(alertType);
                return;
            }
        }
        var eventId = this.getEventIdFromForm();
        this.setDefaultValueToObject(eventObj);
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.startTime] = resetTime(new Date(eventObj[this.fields.startTime].getTime()));
            eventObj[this.fields.endTime] = addDays(resetTime(new Date(eventObj[this.fields.endTime].getTime())), 1);
        }
        var ruleData = this.recurrenceEditor ? this.recurrenceEditor.getRecurrenceRule() : null;
        eventObj[this.fields.recurrenceRule] = ruleData ? ruleData : undefined;
        var isResourceEventExpand = (this.parent.activeViewOptions.group.resources.length > 0 || this.parent.resources.length > 0)
            && !this.parent.activeViewOptions.group.allowGroupEdit;
        if (!isNullOrUndefined(eventId)) {
            var eveId = this.parent.eventBase.getEventIDType() === 'string' ? eventId : parseInt(eventId, 10);
            var editedData = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
                where(this.fields.id, 'equal', eveId))[0];
            eventObj = extend({}, editedData, eventObj);
            if (eventObj[this.fields.isReadonly]) {
                return;
            }
            var currentAction = void 0;
            if (!isNullOrUndefined(editedData[this.fields.recurrenceRule])) {
                currentAction = this.parent.currentAction;
                if (this.parent.currentAction === 'EditOccurrence') {
                    if (!eventObj[this.fields.recurrenceID]) {
                        eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                        eventObj.Guid = this.parent.activeEventData.event.Guid;
                    }
                    else {
                        eveId = eventObj[this.fields.recurrenceID];
                        currentAction = null;
                    }
                    if (this.editOccurrenceValidation(eveId, eventObj)) {
                        this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                        return;
                    }
                }
                if (this.parent.currentAction === 'EditSeries' || eventObj[this.fields.id] !== editedData[this.fields.id]) {
                    eventObj[this.fields.recurrenceID] = editedData[this.fields.id];
                }
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, 'Save', currentAction);
            }
            else {
                this.parent.saveEvent(eventObj, currentAction);
            }
        }
        else {
            this.parent.currentAction = 'Add';
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, this.parent.currentAction);
            }
            else {
                eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                this.parent.addEvent(eventObj);
            }
        }
        if (this.parent.uiStateValues.isBlock) {
            return;
        }
        this.dialogObject.hide();
    };
    EventWindow.prototype.getObjectFromFormData = function (className) {
        var formElement = this.getFormElements(className);
        var eventObj = {};
        for (var _i = 0, formElement_1 = formElement; _i < formElement_1.length; _i++) {
            var currentElement = formElement_1[_i];
            var columnName = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                eventObj[columnName] = this.getValueFromElement(currentElement);
            }
        }
        return eventObj;
    };
    EventWindow.prototype.setDefaultValueToObject = function (eventObj) {
        if (!isNullOrUndefined(eventObj[this.fields.subject])) {
            eventObj[this.fields.subject] = eventObj[this.fields.subject] || this.parent.eventSettings.fields.subject.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.location])) {
            eventObj[this.fields.location] = eventObj[this.fields.location] || this.parent.eventSettings.fields.location.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.description])) {
            eventObj[this.fields.description] = eventObj[this.fields.description] || this.parent.eventSettings.fields.description.default;
        }
    };
    EventWindow.prototype.recurrenceValidation = function (startDate, endDate, alert) {
        var alertMessage;
        var recEditor = this.recurrenceEditor;
        var interval = this.getInstance('e-repeat-interval.e-numerictextbox').value;
        if (alert !== this.l10n.getConstant('ok')) {
            if (this.parent.currentAction === 'EditSeries' &&
                !isNullOrUndefined(this.eventData[this.parent.eventFields.recurrenceException])) {
                alertMessage = 'seriesChangeAlert';
            }
            if (this.getInstance('e-end-on-left .e-ddl .e-dropdownlist').value === 'until' &&
                this.getInstance('e-end-on-date .e-datepicker').value < startDate) {
                alertMessage = 'wrongPattern';
            }
            if (isNullOrUndefined(alertMessage)) {
                switch (recEditor.value.split(';')[0].split('=')[1]) {
                    case 'DAILY':
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= (interval * 24))) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'WEEKLY':
                        var types = recEditor.value.split(';')[1].split('=')[1].split(',');
                        var obj = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
                        var temp = [];
                        var tempDiff = [];
                        for (var index = 0; index < types.length * (interval + 1); index++) {
                            temp[index] = (types.length > index) ? obj[types[index]] : temp[index - types.length] + (7 * interval);
                        }
                        var tempvalue = temp.sort(function (a, b) { return a - b; });
                        for (var index = 1; index < tempvalue.length; index++) {
                            tempDiff.push(tempvalue[index] - tempvalue[index - 1]);
                        }
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= Math.min.apply(Math, tempDiff) * 24)
                            || isNullOrUndefined(interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'MONTHLY':
                        if (this.getInstance('e-month-expander-checkbox-wrapper .e-radio').checked
                            && [29, 30, 31].indexOf(parseInt(recEditor.value.split(';')[1].split('=')[1], 10)) !== -1) {
                            alertMessage = 'dateValidation';
                        }
                        else if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'YEARLY':
                        if (endDate.getTime() >= new Date(+startDate).setFullYear(startDate.getFullYear() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                }
            }
        }
        else {
            if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                alertMessage = 'createError';
            }
            if (isNullOrUndefined(alertMessage)) {
                this.parent.quickPopup.quickDialog.hide();
            }
        }
        return alertMessage;
    };
    EventWindow.prototype.getRecurrenceIndex = function (recColl, event) {
        var recIndex;
        for (var index = 0; index < recColl.length; index++) {
            if (event[this.fields.startTime].valueOf() === recColl[index][this.fields.startTime].valueOf()) {
                recIndex = index;
                break;
            }
        }
        return recIndex;
    };
    EventWindow.prototype.trimAllDay = function (data) {
        if (data[this.fields.isAllDay]) {
            var temp = addDays(new Date(+data[this.fields.endTime]), -1).getTime();
            data[this.fields.endTime] = (+data[this.fields.startTime] > temp) ? data[this.fields.endTime] : new Date(temp);
        }
    };
    EventWindow.prototype.editOccurrenceValidation = function (eventId, currentData, editData) {
        if (editData === void 0) {
            editData = this.eventData;
        }
        var recurColl = this.parent.getOccurrencesByID(eventId);
        var excludedDatas = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
            where(this.fields.recurrenceID, 'equal', eventId));
        excludedDatas.map(function (data) { return recurColl.push(extend({}, data)); });
        currentData = extend({}, currentData);
        this.trimAllDay(currentData);
        for (var _i = 0, recurColl_1 = recurColl; _i < recurColl_1.length; _i++) {
            var data = recurColl_1[_i];
            this.trimAllDay(data);
        }
        this.parent.eventBase.sortByTime(recurColl);
        var index = this.getRecurrenceIndex(recurColl, editData);
        if (isNullOrUndefined(index)) {
            return false;
        }
        if (index === 0) {
            if (!isNullOrUndefined(recurColl[index + 1])) {
                return (!(new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)));
            }
            return false;
        }
        else {
            if (index === recurColl.length - 1) {
                if (!(new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                    new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0))) {
                    return true;
                }
            }
            else if (!((new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0)) &&
                (new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)))) {
                return true;
            }
        }
        return false;
    };
    EventWindow.prototype.resourceSaveEvent = function (eventObj, action, currentAction) {
        var _this = this;
        var lastResouceData = this.parent.resourceBase.resourceCollection.slice(-1)[0];
        var resourceData = eventObj[lastResouceData.field];
        resourceData = (resourceData instanceof Array) ? resourceData : [resourceData];
        var lastlevel = this.parent.resourceBase.lastResourceLevel;
        var eventList = [];
        var _loop_1 = function (i) {
            var events = extend({}, eventObj, null, true);
            events[this_1.fields.id] = this_1.parent.eventBase.getEventMaxID();
            var temp = [];
            var addValues = function () {
                if (action === 'Save' && i === resourceData.length - 1) {
                    if (temp.length > 0) {
                        temp[0][_this.fields.id] = eventObj[_this.fields.id];
                        for (var k = 1; k < temp.length; k++) {
                            temp[k][_this.fields.id] = _this.parent.eventBase.getEventMaxID(i);
                            eventList.push(temp[k]);
                            _this.parent.saveEvent(temp[0], currentAction);
                        }
                    }
                    else {
                        events[_this.fields.id] = eventObj[_this.fields.id];
                        _this.parent.saveEvent(events, currentAction);
                    }
                }
                else {
                    if (temp.length > 0) {
                        for (var j = 0; j < temp.length; j++) {
                            temp[j][_this.fields.id] = _this.parent.eventBase.getEventMaxID(j);
                            eventList.push(temp[j]);
                        }
                    }
                    else {
                        events[_this.fields.id] = _this.parent.eventBase.getEventMaxID(i);
                        eventList.push(events);
                    }
                }
            };
            if (this_1.parent.activeViewOptions.group.byGroupID && (!isNullOrUndefined(lastlevel))) {
                var lastResource = lastResouceData.dataSource;
                var index = findIndexInData(lastResource, lastResouceData.idField, resourceData[i]);
                var groupId_1 = lastResource[index][lastResouceData.groupIDField];
                var filter = lastlevel.filter(function (obj) { return obj.resourceData[lastResouceData.idField] === resourceData[i]; }).
                    filter(function (obj) { return obj.resourceData[lastResouceData.groupIDField] === groupId_1; })[0];
                var groupOrder = filter.groupOrder;
                for (var index_1 = 0; index_1 < this_1.parent.resourceBase.resourceCollection.length; index_1++) {
                    var field = this_1.parent.resourceBase.resourceCollection[index_1].field;
                    events[field] = (groupOrder[index_1] instanceof Array) ? groupOrder[index_1][0] : groupOrder[index_1];
                }
                addValues();
            }
            else {
                for (var index = 0; index < this_1.parent.resourceBase.resourceCollection.length - 1; index++) {
                    var field = this_1.parent.resourceBase.resourceCollection[index].field;
                    if (events[field] instanceof Array && events[field].length > 1) {
                        for (var k = 0; k < events[field].length; k++) {
                            var event_1 = extend({}, events, null, true);
                            event_1[field] = eventObj[field][k];
                            event_1[lastResouceData.field] = resourceData[i];
                            temp.push(event_1);
                        }
                    }
                    else {
                        if (temp.length === 0) {
                            events[field] = (eventObj[field] instanceof Array) ?
                                eventObj[field][0] : eventObj[field];
                            events[lastResouceData.field] = resourceData[i];
                        }
                        else {
                            for (var l = 0; l < temp.length; l++) {
                                temp[l][field] = (eventObj[field] instanceof Array) ?
                                    eventObj[field][0] : eventObj[field];
                            }
                        }
                    }
                }
                events[lastResouceData.field] = resourceData[i];
                addValues();
            }
        };
        var this_1 = this;
        for (var i = 0; i < resourceData.length; i++) {
            _loop_1(i);
        }
        if (eventList.length > 0) {
            for (var _i = 0, eventList_1 = eventList; _i < eventList_1.length; _i++) {
                var event_2 = eventList_1[_i];
                event_2[this.fields.recurrenceException] = null;
                event_2[this.fields.recurrenceID] = null;
            }
            this.parent.addEvent(eventList);
        }
    };
    EventWindow.prototype.getEventIdFromForm = function () {
        return this.element.querySelector('.' + FORM_CLASS).getAttribute('data-id');
    };
    EventWindow.prototype.getFormElements = function (className) {
        if (className === EVENT_WINDOW_DIALOG_CLASS) {
            return [].slice.call(this.element.querySelectorAll('.' + EVENT_FIELD$1));
        }
        return [].slice.call(this.parent.element.querySelectorAll('.' + className + ' .' + EVENT_FIELD$1));
    };
    EventWindow.prototype.getValueFromElement = function (element) {
        var value;
        if (element.classList.contains('e-datepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-datetimepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-dropdownlist')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-multiselect')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-checkbox')) {
            value = element.ej2_instances[0].checked;
        }
        else {
            if (element.type === 'checkbox') {
                value = element.checked;
            }
            else {
                value = element.value;
            }
        }
        return value;
    };
    EventWindow.prototype.setValueToElement = function (element, value) {
        if (element.classList.contains('e-datepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            var instance = element.ej2_instances[0];
            instance.value = [];
            instance.value = ((value instanceof Array) ? value : [value]);
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            var instance = element.ej2_instances[0];
            instance.checked = value;
            instance.dataBind();
        }
        else {
            if (element.type !== 'checkbox') {
                element.value = value || '';
            }
            else {
                element.checked = value;
            }
        }
    };
    EventWindow.prototype.setDefaultValueToElement = function (element) {
        if (element.classList.contains('e-datepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            var instance = element.ej2_instances[0];
            instance.value = null;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            var instance = element.ej2_instances[0];
            instance.value = [];
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            var instance = element.ej2_instances[0];
            instance.checked = false;
            instance.dataBind();
        }
        else {
            if (element.type === 'checkbox') {
                element.checked = false;
            }
            else {
                element.value = '';
            }
        }
    };
    EventWindow.prototype.getInstance = function (className) {
        return this.element.querySelector('.' + className).ej2_instances[0];
    };
    EventWindow.prototype.eventDelete = function () {
        switch (this.parent.currentAction) {
            case 'EditOccurrence':
                var fields = this.parent.eventFields;
                if (!isNullOrUndefined(this.parent.activeEventData.event[fields.recurrenceRule])) {
                    this.parent.currentAction = 'DeleteOccurrence';
                }
                else {
                    this.parent.currentAction = 'Delete';
                }
                break;
            case 'EditSeries':
                this.parent.currentAction = 'DeleteSeries';
                break;
        }
        this.dialogObject.hide();
        this.parent.quickPopup.openDeleteAlert();
    };
    EventWindow.prototype.destroyComponents = function () {
        var formelement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        for (var _i = 0, formelement_2 = formelement; _i < formelement_2.length; _i++) {
            var element = formelement_2[_i];
            var instance = void 0;
            if (element.classList.contains('e-datetimepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-datepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-checkbox')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-dropdownlist')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-multiselect')) {
                instance = element.ej2_instances[0];
            }
            if (instance) {
                instance.destroy();
            }
        }
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
    };
    /**
     * To destroy the event window.
     * @return {void}
     * @private
     */
    EventWindow.prototype.destroy = function () {
        if (this.recurrenceEditor) {
            this.recurrenceEditor.destroy();
        }
        this.destroyComponents();
        this.fieldValidator.destroy();
        if (this.repeatDialogObject) {
            this.repeatDialogObject.destroy();
            remove(this.repeatDialogObject.element);
        }
        if (this.dialogObject) {
            this.dialogObject.destroy();
            this.dialogObject = null;
        }
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
    };
    return EventWindow;
}());

/**
 * Virtual Scroll
 */
var VirtualScroll = /** @__PURE__ @class */ (function () {
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
        this.parent.on(virtualScroll, this.virtualScrolling, this);
    };
    VirtualScroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(virtualScroll, this.virtualScrolling);
    };
    VirtualScroll.prototype.getRenderedCount = function () {
        this.setItemSize();
        return Math.ceil(this.parent.element.clientHeight / this.itemSize) + this.bufferCount;
    };
    VirtualScroll.prototype.renderVirtualTrack = function (contentWrap) {
        var wrap = createElement('div', { className: VIRTUAL_TRACK_CLASS });
        wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
        contentWrap.appendChild(wrap);
    };
    VirtualScroll.prototype.updateVirtualTrackHeight = function (wrap) {
        var resourceCount = this.parent.resourceBase.renderedResources.length;
        if (resourceCount !== this.getRenderedCount()) {
            wrap.style.height = this.parent.element.querySelector('.e-content-wrap').clientHeight + 'px';
            var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
            var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            var eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
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
        this.itemSize = getElementHeightFromClass(this.parent.activeView.element, WORK_CELLS_CLASS) || this.itemSize;
    };
    VirtualScroll.prototype.virtualScrolling = function () {
        this.parent.quickPopup.quickPopupHide();
        this.parent.quickPopup.morePopup.hide();
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
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
            this.parent.notify(dataReady, {});
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

/**
 * Schedule DOM rendering
 */
var Render = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for render
     */
    function Render(parent) {
        this.parent = parent;
    }
    Render.prototype.render = function (viewName, isDataRefresh) {
        if (isDataRefresh === void 0) { isDataRefresh = true; }
        this.initializeLayout(viewName);
        if (isDataRefresh) {
            this.refreshDataManager();
        }
    };
    Render.prototype.initializeLayout = function (viewName) {
        if (this.parent.activeView) {
            this.parent.activeView.removeEventListener();
            this.parent.activeView.destroy();
        }
        switch (viewName) {
            case 'Day':
                this.parent.activeView = this.parent.dayModule;
                break;
            case 'Week':
                this.parent.activeView = this.parent.weekModule;
                break;
            case 'WorkWeek':
                this.parent.activeView = this.parent.workWeekModule;
                break;
            case 'Month':
                this.parent.activeView = this.parent.monthModule;
                break;
            case 'Agenda':
                this.parent.activeView = this.parent.agendaModule;
                break;
            case 'MonthAgenda':
                this.parent.activeView = this.parent.monthAgendaModule;
                break;
            case 'TimelineDay':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-day-view';
                break;
            case 'TimelineWorkWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-work-week-view';
                break;
            case 'TimelineWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-week-view';
                break;
            case 'TimelineMonth':
                this.parent.activeView = this.parent.timelineMonthModule;
                break;
        }
        if (isNullOrUndefined(this.parent.activeView)) {
            var firstView = this.parent.viewCollections[0].option;
            if (firstView) {
                this.parent.setProperties({ currentView: firstView }, true);
                if (this.parent.headerModule) {
                    this.parent.headerModule.updateActiveView();
                    this.parent.headerModule.setCalendarView();
                }
                return this.initializeLayout(firstView);
            }
            throw Error('Inject required modules');
        }
        this.updateLabelText(viewName);
        this.parent.activeView.addEventListener();
        this.parent.activeView.getRenderDates();
        this.parent.uiStateValues.isGroupAdaptive = this.parent.isAdaptive && this.parent.activeViewOptions.group.resources.length > 0 &&
            this.parent.activeViewOptions.group.enableCompactView;
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.destroy();
            this.parent.virtualScrollModule = null;
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1 && this.parent.activeViewOptions.allowVirtualScrolling
            && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.virtualScrollModule = new VirtualScroll(this.parent);
            this.parent.uiStateValues.top = 0;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
            this.parent.headerModule.updateHeaderItems('remove');
        }
        this.parent.activeView.renderLayout(CURRENT_PANEL_CLASS);
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.destroy();
            this.parent.eventTooltip = null;
        }
        if (this.parent.eventSettings.enableTooltip || (this.parent.activeViewOptions.group.resources.length > 0
            && this.parent.activeViewOptions.group.headerTooltipTemplate)) {
            this.parent.eventTooltip = new EventTooltip(this.parent);
        }
    };
    Render.prototype.updateLabelText = function (view) {
        var content = this.parent.activeView.getLabelText(view);
        this.parent.element.setAttribute('role', 'main');
        this.parent.element.setAttribute('aria-label', content);
    };
    Render.prototype.refreshDataManager = function () {
        var _this = this;
        var start = this.parent.activeView.startDate();
        var end = this.parent.activeView.endDate();
        var dataManager = this.parent.dataModule.getData(this.parent.dataModule.generateQuery(start, end));
        dataManager.then(function (e) { return _this.dataManagerSuccess(e); }).catch(function (e) { return _this.dataManagerFailure(e); });
    };
    Render.prototype.dataManagerSuccess = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(dataBinding, e);
        var resultData = extend([], e.result, null, true);
        this.parent.eventsData = resultData.filter(function (data) { return !data[_this.parent.eventFields.isBlock]; });
        this.parent.blockData = resultData.filter(function (data) { return data[_this.parent.eventFields.isBlock]; });
        var processed = this.parent.eventBase.processData(resultData);
        this.parent.notify(dataReady, { processedData: processed });
        if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
            this.parent.dragAndDropModule.navigationWrapper();
        }
        this.parent.trigger(dataBound);
        this.parent.hideSpinner();
    };
    Render.prototype.dataManagerFailure = function (e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e });
        this.parent.hideSpinner();
    };
    return Render;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the configuration of working hours related options of scheduler.
 */
var WorkHours = /** @__PURE__ @class */ (function (_super) {
    __extends$2(WorkHours, _super);
    function WorkHours() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(true)
    ], WorkHours.prototype, "highlight", void 0);
    __decorate$2([
        Property('09:00')
    ], WorkHours.prototype, "start", void 0);
    __decorate$2([
        Property('18:00')
    ], WorkHours.prototype, "end", void 0);
    return WorkHours;
}(ChildProperty));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the configuration of options related to timescale on scheduler.
 */
var TimeScale = /** @__PURE__ @class */ (function (_super) {
    __extends$3(TimeScale, _super);
    function TimeScale() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property(true)
    ], TimeScale.prototype, "enable", void 0);
    __decorate$3([
        Property(60)
    ], TimeScale.prototype, "interval", void 0);
    __decorate$3([
        Property(2)
    ], TimeScale.prototype, "slotCount", void 0);
    __decorate$3([
        Property()
    ], TimeScale.prototype, "minorSlotTemplate", void 0);
    __decorate$3([
        Property()
    ], TimeScale.prototype, "majorSlotTemplate", void 0);
    return TimeScale;
}(ChildProperty));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that defines the template options available to customize the quick popup of scheduler.
 */
var QuickInfoTemplates = /** @__PURE__ @class */ (function (_super) {
    __extends$4(QuickInfoTemplates, _super);
    function QuickInfoTemplates() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        Property()
    ], QuickInfoTemplates.prototype, "header", void 0);
    __decorate$4([
        Property()
    ], QuickInfoTemplates.prototype, "content", void 0);
    __decorate$4([
        Property()
    ], QuickInfoTemplates.prototype, "footer", void 0);
    return QuickInfoTemplates;
}(ChildProperty));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the header rows related configurations on timeline views.
 */
var HeaderRows = /** @__PURE__ @class */ (function (_super) {
    __extends$5(HeaderRows, _super);
    function HeaderRows() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property()
    ], HeaderRows.prototype, "option", void 0);
    __decorate$5([
        Property()
    ], HeaderRows.prototype, "template", void 0);
    return HeaderRows;
}(ChildProperty));

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configuration that applies on each appointment field options of scheduler.
 */
var FieldOptions = /** @__PURE__ @class */ (function (_super) {
    __extends$8(FieldOptions, _super);
    function FieldOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$8([
        Property()
    ], FieldOptions.prototype, "name", void 0);
    __decorate$8([
        Property()
    ], FieldOptions.prototype, "default", void 0);
    __decorate$8([
        Property()
    ], FieldOptions.prototype, "title", void 0);
    __decorate$8([
        Property({})
    ], FieldOptions.prototype, "validation", void 0);
    return FieldOptions;
}(ChildProperty));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A Class that holds the collection of event fields that requires to be mapped with the dataSource
 * fields along with its available configuration settings. Each field in it accepts both string and Object
 *  data type. When each of the field is assigned with simple `string` value, it is assumed that the dataSource field
 *  name is mapped with it. If the `object` type is defined on each fields, then the validation related settings and mapping of
 *  those fields with dataSource can be given altogether within it.
 */
var Field = /** @__PURE__ @class */ (function (_super) {
    __extends$7(Field, _super);
    function Field() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        Property('Id')
    ], Field.prototype, "id", void 0);
    __decorate$7([
        Property('IsBlock')
    ], Field.prototype, "isBlock", void 0);
    __decorate$7([
        Complex({ name: 'Subject', default: 'Add title' }, FieldOptions)
    ], Field.prototype, "subject", void 0);
    __decorate$7([
        Complex({ name: 'StartTime' }, FieldOptions)
    ], Field.prototype, "startTime", void 0);
    __decorate$7([
        Complex({ name: 'EndTime' }, FieldOptions)
    ], Field.prototype, "endTime", void 0);
    __decorate$7([
        Complex({ name: 'StartTimezone' }, FieldOptions)
    ], Field.prototype, "startTimezone", void 0);
    __decorate$7([
        Complex({ name: 'EndTimezone' }, FieldOptions)
    ], Field.prototype, "endTimezone", void 0);
    __decorate$7([
        Complex({ name: 'Location' }, FieldOptions)
    ], Field.prototype, "location", void 0);
    __decorate$7([
        Complex({ name: 'Description' }, FieldOptions)
    ], Field.prototype, "description", void 0);
    __decorate$7([
        Complex({ name: 'IsAllDay' }, FieldOptions)
    ], Field.prototype, "isAllDay", void 0);
    __decorate$7([
        Complex({ name: 'RecurrenceID' }, FieldOptions)
    ], Field.prototype, "recurrenceID", void 0);
    __decorate$7([
        Complex({ name: 'RecurrenceRule' }, FieldOptions)
    ], Field.prototype, "recurrenceRule", void 0);
    __decorate$7([
        Complex({ name: 'RecurrenceException' }, FieldOptions)
    ], Field.prototype, "recurrenceException", void 0);
    __decorate$7([
        Property('IsReadonly')
    ], Field.prototype, "isReadonly", void 0);
    return Field;
}(ChildProperty));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of event related options and dataSource binding to Schedule.
 */
var EventSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(EventSettings, _super);
    function EventSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property()
    ], EventSettings.prototype, "template", void 0);
    __decorate$6([
        Property([])
    ], EventSettings.prototype, "dataSource", void 0);
    __decorate$6([
        Property()
    ], EventSettings.prototype, "query", void 0);
    __decorate$6([
        Complex({}, Field)
    ], EventSettings.prototype, "fields", void 0);
    __decorate$6([
        Property(false)
    ], EventSettings.prototype, "enableTooltip", void 0);
    __decorate$6([
        Property()
    ], EventSettings.prototype, "tooltipTemplate", void 0);
    __decorate$6([
        Property()
    ], EventSettings.prototype, "resourceColorField", void 0);
    return EventSettings;
}(ChildProperty));

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that holds the resource grouping related configurations on Schedule.
 */
var Group = /** @__PURE__ @class */ (function (_super) {
    __extends$9(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$9([
        Property(false)
    ], Group.prototype, "byDate", void 0);
    __decorate$9([
        Property(true)
    ], Group.prototype, "byGroupID", void 0);
    __decorate$9([
        Property(false)
    ], Group.prototype, "allowGroupEdit", void 0);
    __decorate$9([
        Property([])
    ], Group.prototype, "resources", void 0);
    __decorate$9([
        Property(true)
    ], Group.prototype, "enableCompactView", void 0);
    __decorate$9([
        Property()
    ], Group.prototype, "headerTooltipTemplate", void 0);
    return Group;
}(ChildProperty));

var __extends$10 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$10 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the resource related configurations and its data binding options.
 */
var Resources = /** @__PURE__ @class */ (function (_super) {
    __extends$10(Resources, _super);
    function Resources() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$10([
        Property()
    ], Resources.prototype, "field", void 0);
    __decorate$10([
        Property()
    ], Resources.prototype, "title", void 0);
    __decorate$10([
        Property()
    ], Resources.prototype, "name", void 0);
    __decorate$10([
        Property(false)
    ], Resources.prototype, "allowMultiple", void 0);
    __decorate$10([
        Property([])
    ], Resources.prototype, "dataSource", void 0);
    __decorate$10([
        Property()
    ], Resources.prototype, "query", void 0);
    __decorate$10([
        Property('Id')
    ], Resources.prototype, "idField", void 0);
    __decorate$10([
        Property('Text')
    ], Resources.prototype, "textField", void 0);
    __decorate$10([
        Property('Expanded')
    ], Resources.prototype, "expandedField", void 0);
    __decorate$10([
        Property('GroupID')
    ], Resources.prototype, "groupIDField", void 0);
    __decorate$10([
        Property('Color')
    ], Resources.prototype, "colorField", void 0);
    __decorate$10([
        Property('StartHour')
    ], Resources.prototype, "startHourField", void 0);
    __decorate$10([
        Property('EndHour')
    ], Resources.prototype, "endHourField", void 0);
    __decorate$10([
        Property('WorkDays')
    ], Resources.prototype, "workDaysField", void 0);
    __decorate$10([
        Property('CssClass')
    ], Resources.prototype, "cssClassField", void 0);
    return Resources;
}(ChildProperty));

var ResourceBase = /** @__PURE__ @class */ (function () {
    function ResourceBase(parent) {
        this.resourceCollection = [];
        this.leftPixel = 25;
        this.parent = parent;
    }
    ResourceBase.prototype.renderResourceHeaderIndent = function (tr) {
        var resColTd = createElement('td', { className: RESOURCE_LEFT_TD_CLASS });
        var resColDiv = createElement('div', {
            className: RESOURCE_TEXT_CLASS
        });
        resColTd.appendChild(resColDiv);
        var args = { elementType: 'emptyCells', element: resColTd };
        this.parent.trigger(renderCell, args);
        tr.appendChild(resColTd);
    };
    ResourceBase.prototype.hideResourceRows = function (tBody) {
        if (this.resourceCollection.length <= 1 || this.parent.virtualScrollModule) {
            return;
        }
        var trCount = this.lastResourceLevel.length;
        for (var i = 0; i < trCount; i++) {
            var resData = this.lastResourceLevel[i].resourceData;
            var res = this.lastResourceLevel[i].resource;
            if (resData.ClassName === RESOURCE_PARENT_CLASS && !resData[res.expandedField] &&
                !isNullOrUndefined(resData[res.expandedField])) {
                var trCollection = [].slice.call(tBody.children);
                var slicedCollection = trCollection.slice(i + 1, i + (parseInt(resData.Count, 0) + 1));
                addClass(slicedCollection, HIDDEN_CLASS);
            }
        }
    };
    ResourceBase.prototype.createResourceColumn = function () {
        var resColl = this.resourceCollection;
        var resDiv = createElement('div', { className: RESOURCE_COLUMN_WRAP_CLASS });
        var tbl = this.parent.activeView.createTableLayout(RESOURCE_COLUMN_TABLE_CLASS);
        var tBody = tbl.querySelector('tbody');
        var resData = this.generateTreeData(true);
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
        if (this.parent.virtualScrollModule) {
            var resourceCount = this.parent.virtualScrollModule.getRenderedCount();
            this.setExpandedResources();
            resData = this.expandedResources.slice(0, resourceCount);
            this.renderedResources = resData;
        }
        append(this.getContentRows(resData), tBody);
        this.hideResourceRows(tBody);
        tbl.appendChild(tBody);
        resDiv.appendChild(tbl);
        return resDiv;
    };
    ResourceBase.prototype.setExpandedResources = function () {
        var resources = [];
        for (var i = 0; i < this.lastResourceLevel.length; i++) {
            var resource = this.lastResourceLevel[i].resourceData;
            var count = resource.Count;
            resources.push(this.lastResourceLevel[i]);
            if (!isNullOrUndefined(resource.Expand) && !resource.Expand && count > 0) {
                i = i + count;
            }
        }
        this.expandedResources = resources;
    };
    ResourceBase.prototype.getContentRows = function (resData) {
        var resRows = [];
        var left;
        var rIndex;
        var resColl = this.resourceCollection;
        var tr = createElement('tr');
        var td = createElement('td');
        for (var i = 0; i < resData.length; i++) {
            var ntd = td.cloneNode();
            rIndex = findIndexInData(resColl, 'name', resData[i].resource.name);
            if (rIndex === resColl.length - 1) {
                extend(resData[i].resourceData, { ClassName: RESOURCE_CHILD_CLASS });
                this.renderedResources[i].className = [RESOURCE_CHILD_CLASS];
            }
            else {
                extend(resData[i].resourceData, { ClassName: RESOURCE_PARENT_CLASS });
                this.renderedResources[i].className = [RESOURCE_PARENT_CLASS];
            }
            left = (rIndex * this.leftPixel) + 'px';
            if (resData[i].resourceData.ClassName === RESOURCE_PARENT_CLASS) {
                var iconClass = void 0;
                if (resData[i].resourceData[resColl[rIndex].expandedField] ||
                    isNullOrUndefined(resData[i].resourceData[resColl[rIndex].expandedField])) {
                    iconClass = RESOURCE_COLLAPSE_CLASS;
                }
                else {
                    iconClass = RESOURCE_EXPAND_CLASS;
                }
                var iconDiv = createElement('div');
                addClass([iconDiv], [RESOURCE_TREE_ICON_CLASS, iconClass]);
                this.setMargin(iconDiv, left);
                ntd.appendChild(iconDiv);
                if (this.resourceCollection.length > 1) {
                    EventHandler.add(iconDiv, 'click', this.onTreeIconClick, this);
                }
            }
            this.parent.activeView.setResourceHeaderContent(ntd, resData[i], RESOURCE_TEXT_CLASS);
            ntd.setAttribute('data-group-index', resData[i].groupIndex.toString());
            if (!this.parent.activeViewOptions.resourceHeaderTemplate) {
                this.setMargin(ntd.querySelector('.' + RESOURCE_TEXT_CLASS), left);
            }
            var classCollection = [RESOURCE_CELLS_CLASS, resData[i].resourceData.ClassName];
            addClass([ntd], classCollection);
            var args = { elementType: 'resourceHeader', element: ntd, groupIndex: resData[i].groupIndex };
            this.parent.trigger(renderCell, args);
            var ntr = tr.cloneNode();
            ntr.appendChild(ntd);
            resRows.push(ntr);
        }
        return resRows;
    };
    ResourceBase.prototype.setMargin = function (element, value) {
        if (!this.parent.enableRtl) {
            element.style.marginLeft = value;
        }
        else {
            element.style.marginRight = value;
        }
    };
    ResourceBase.prototype.countCalculation = function (parentCollection, wholeCollection) {
        var collection;
        for (var y = 0; y < parentCollection.length; y++) {
            var data = parentCollection[parentCollection.length - (y + 1)]
                .dataSource;
            for (var x = 0; x < data.length; x++) {
                var totalCount = 0;
                if (this.parent.activeViewOptions.group.byGroupID) {
                    collection = new DataManager(wholeCollection[wholeCollection.length - 1].dataSource)
                        .executeLocal(new Query().where(wholeCollection[wholeCollection.length - 1].groupIDField, 'equal', data[x][parentCollection[parentCollection.length - (y + 1)].idField]));
                }
                else {
                    collection = wholeCollection[wholeCollection.length - 1].dataSource;
                }
                for (var z = 0; z < collection.length; z++) {
                    totalCount = totalCount + parseInt(collection[z].Count, 0);
                }
                totalCount = totalCount + parseInt(data[x].Count, 0);
                extend(data[x], { Count: totalCount });
            }
            wholeCollection = wholeCollection.slice(0, -1);
        }
    };
    ResourceBase.prototype.onTreeIconClick = function (e) {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        var target = e.target;
        var hide;
        var trElement = closest(target, '.' + RESOURCE_PARENT_CLASS)
            .parentElement;
        var index = parseInt(trElement.children[0].getAttribute('data-group-index'), 10);
        var args = {
            cancel: false, event: e, groupIndex: index,
            requestType: !target.classList.contains(RESOURCE_COLLAPSE_CLASS) ? 'resourceExpand' : 'resourceCollapse',
        };
        this.parent.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        if (target.classList.contains(RESOURCE_COLLAPSE_CLASS)) {
            classList(target, [RESOURCE_EXPAND_CLASS], [RESOURCE_COLLAPSE_CLASS]);
            hide = true;
        }
        else {
            classList(target, [RESOURCE_COLLAPSE_CLASS], [RESOURCE_EXPAND_CLASS]);
            hide = false;
        }
        var eventElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        for (var i = 0; i < eventElements.length; i++) {
            remove(eventElements[i]);
        }
        if (this.parent.virtualScrollModule) {
            this.updateVirtualContent(index, hide);
        }
        else {
            this.updateContent(index, hide);
        }
        var data = { cssProperties: this.parent.getCssProperties(), module: 'scroll' };
        this.parent.notify(scrollUiUpdate, data);
        args = {
            cancel: false, event: e, groupIndex: index,
            requestType: target.classList.contains(RESOURCE_COLLAPSE_CLASS) ? 'resourceExpanded' : 'resourceCollapsed',
        };
        this.parent.notify(dataReady, {});
        this.parent.trigger(actionComplete, args);
    };
    ResourceBase.prototype.updateContent = function (index, hide) {
        var rowCollection = [];
        var workCellCollection = [];
        var headerRowCollection = [];
        var pNode;
        var clickedRes = this.lastResourceLevel[index].resourceData;
        var resRows = [].slice.call(this.parent.element.querySelectorAll('.' + RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'tr'));
        var contentRows = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_WRAP_CLASS + ' ' + 'tbody tr'));
        var eventRows = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_WRAP_CLASS + ' .' + APPOINTMENT_CONTAINER_CLASS));
        for (var j = 0; j < clickedRes.Count; j++) {
            rowCollection.push(resRows[index + j + 1]);
            workCellCollection.push(contentRows[index + j + 1]);
            headerRowCollection.push(eventRows[index + j + 1]);
        }
        var clonedCollection = this.lastResourceLevel;
        for (var i = 0; i < rowCollection.length; i++) {
            var expanded = true;
            pNode = rowCollection[i].children[0].classList.contains(RESOURCE_PARENT_CLASS);
            clonedCollection[index].resourceData[clonedCollection[index].resource.expandedField] = !hide;
            if (hide) {
                if (pNode) {
                    var trElem = rowCollection[i].querySelector('.' + RESOURCE_TREE_ICON_CLASS);
                    classList(trElem, [RESOURCE_EXPAND_CLASS], [RESOURCE_COLLAPSE_CLASS]);
                }
                if (!rowCollection[i].classList.contains(HIDDEN_CLASS)) {
                    addClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], HIDDEN_CLASS);
                }
            }
            else {
                if (pNode) {
                    var rowIndex = rowCollection[i].rowIndex;
                    if (!clonedCollection[rowIndex].resourceData[clonedCollection[rowIndex].resource.expandedField]
                        && !isNullOrUndefined(clonedCollection[rowIndex].resourceData[clonedCollection[rowIndex].resource.expandedField])) {
                        rowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        workCellCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        headerRowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        expanded = false;
                    }
                    if (expanded) {
                        var trElem = rowCollection[i].querySelector('.' + RESOURCE_TREE_ICON_CLASS);
                        classList(trElem, [RESOURCE_COLLAPSE_CLASS], [RESOURCE_EXPAND_CLASS]);
                    }
                }
                if (rowCollection[i].classList.contains(HIDDEN_CLASS)) {
                    removeClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], HIDDEN_CLASS);
                }
            }
        }
    };
    ResourceBase.prototype.updateVirtualContent = function (index, expand) {
        this.lastResourceLevel[index].resourceData[this.lastResourceLevel[index].resource.expandedField] = !expand;
        this.setExpandedResources();
        var resourceCount = this.parent.virtualScrollModule.getRenderedCount();
        var startIndex = this.expandedResources.indexOf(this.renderedResources[0]);
        this.renderedResources = this.expandedResources.slice(startIndex, startIndex + resourceCount);
        if (this.renderedResources.length < resourceCount) {
            var sIndex = this.expandedResources.length - resourceCount;
            sIndex = (sIndex > 0) ? sIndex : 0;
            this.renderedResources = this.expandedResources.slice(sIndex, this.expandedResources.length);
        }
        var virtualTrack = this.parent.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        this.parent.virtualScrollModule.updateVirtualTrackHeight(virtualTrack);
        var resTable = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'table');
        var contentTable = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' ' + 'table');
        var eventTable = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
        this.parent.virtualScrollModule.updateContent(resTable, contentTable, eventTable, this.renderedResources);
    };
    ResourceBase.prototype.renderResourceHeader = function () {
        var resourceWrapper = createElement('div', { className: RESOURCE_TOOLBAR_CONTAINER });
        resourceWrapper.innerHTML = '<div class="' + RESOURCE_HEADER_TOOLBAR + '"><div class="' + RESOURCE_MENU + '">' +
            '<div class="e-icons ' + RESOURCE_MENU_ICON + '"></div></div><div class="' + RESOURCE_LEVEL_TITLE + '"></div></div>';
        if (this.parent.currentView === 'MonthAgenda') {
            var target = this.parent.activeView.getPanel().querySelector('.' + CONTENT_WRAP_CLASS);
            target.insertBefore(resourceWrapper, target.children[1]);
        }
        else {
            this.parent.element.insertBefore(resourceWrapper, this.parent.element.children[2]);
        }
        this.renderResourceHeaderText();
        EventHandler.add(resourceWrapper.querySelector('.' + RESOURCE_MENU_ICON), 'click', this.menuClick, this);
    };
    ResourceBase.prototype.renderResourceTree = function () {
        this.popupOverlay = createElement('div', { className: RESOURCE_TREE_POPUP_OVERLAY });
        var treeWrapper = createElement('div', { className: RESOURCE_TREE_POPUP + ' e-popup-close' });
        if (this.parent.currentView === 'MonthAgenda') {
            var target = this.parent.activeView.getPanel().querySelector('.' + WRAPPER_CONTAINER_CLASS);
            target.insertBefore(treeWrapper, target.children[0]);
            target.appendChild(this.popupOverlay);
        }
        else {
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(treeWrapper);
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.popupOverlay);
        }
        var resourceTree = createElement('div', { className: RESOURCE_TREE });
        treeWrapper.appendChild(resourceTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            fields: {
                dataSource: this.generateTreeData(),
                id: 'resourceId',
                text: 'resourceName',
                child: 'resourceChild'
            },
            nodeTemplate: this.parent.resourceHeaderTemplate,
            nodeClicked: this.resourceClick.bind(this)
        });
        this.treeViewObj.appendTo(resourceTree);
        this.treeViewObj.expandAll();
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + (this.parent.currentView === 'MonthAgenda' ?
                WRAPPER_CONTAINER_CLASS : TABLE_CONTAINER_CLASS))
        });
        this.parent.on(documentClick, this.documentClick, this);
    };
    ResourceBase.prototype.generateTreeData = function (isTimeLine) {
        var _this = this;
        var treeCollection = [];
        var resTreeColl = [];
        var groupIndex = 0;
        this.resourceTreeLevel.forEach(function (resTree, index) {
            var treeHandler = function (treeLevel, index, levelId) {
                var resource = _this.resourceCollection[index];
                var treeArgs;
                var resObj;
                if (!isTimeLine) {
                    treeArgs = {
                        resourceId: levelId,
                        resourceName: treeLevel.resourceData[resource.textField]
                    };
                }
                else {
                    resObj = {
                        type: 'resourceHeader', resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData, groupIndex: groupIndex,
                        groupOrder: treeLevel.groupOrder
                    };
                    resTreeColl.push(resObj);
                    groupIndex++;
                }
                if (treeLevel.child.length > 0 && !isTimeLine) {
                    treeArgs.resourceChild = [];
                }
                var count = 1;
                for (var _i = 0, _a = treeLevel.child; _i < _a.length; _i++) {
                    var tree = _a[_i];
                    if (!isTimeLine) {
                        treeArgs.resourceChild.push(treeHandler(tree, index + 1, levelId + '-' + count));
                    }
                    else {
                        treeHandler(tree, index + 1, levelId + '-' + count);
                    }
                    count += 1;
                }
                if (isTimeLine) {
                    extend(resObj.resourceData, { Count: count - 1 });
                }
                return treeArgs;
            };
            if (!isTimeLine) {
                treeCollection.push(treeHandler(resTree, 0, (index + 1).toString()));
            }
            else {
                treeHandler(resTree, 0, (index + 1).toString());
            }
        });
        if (isTimeLine) {
            this.lastResourceLevel = resTreeColl;
            return resTreeColl;
        }
        else {
            return treeCollection;
        }
    };
    ResourceBase.prototype.renderResourceHeaderText = function () {
        var _this = this;
        var resource = this.lastResourceLevel[this.parent.uiStateValues.groupIndex];
        var headerCollection = [];
        resource.groupOrder.forEach(function (level, index) {
            var resourceLevel = _this.resourceCollection[index];
            var resourceText = resourceLevel.dataSource.filter(function (resData) {
                return resData[resourceLevel.idField] === level;
            });
            var resourceName = createElement('div', {
                className: RESOURCE_NAME,
                innerHTML: resourceText[0][resourceLevel.textField]
            });
            headerCollection.push(resourceName);
            var levelIcon = createElement('div', { className: 'e-icons e-icon-next' });
            headerCollection.push(levelIcon);
        });
        headerCollection.pop();
        var target = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        var headerWrapper = target.querySelector('.' + RESOURCE_LEVEL_TITLE);
        headerWrapper.innerHTML = '';
        headerCollection.forEach(function (element) { return headerWrapper.appendChild(element); });
        if (this.lastResourceLevel.length === 1) {
            addClass([this.parent.element.querySelector('.' + RESOURCE_MENU)], DISABLE_CLASS);
        }
    };
    ResourceBase.prototype.menuClick = function (event) {
        if (this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        else {
            var treeNodes = this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)');
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.uiStateValues.groupIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    };
    ResourceBase.prototype.resourceClick = function (event) {
        if (!event.node.classList.contains('e-has-child')) {
            this.treePopup.hide();
            var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            this.parent.uiStateValues.groupIndex = treeNodes.indexOf(event.node);
            this.parent.renderModule.render(this.parent.currentView, false);
            var processed = this.parent.eventBase.processData(this.parent.eventsData);
            this.parent.notify(dataReady, { processedData: processed });
        }
        event.event.preventDefault();
    };
    ResourceBase.prototype.documentClick = function (args) {
        if (closest(args.event.target, '.' + RESOURCE_TREE_POPUP)) {
            return;
        }
        var treeWrapper = this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP);
        if (treeWrapper && treeWrapper.classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
    };
    ResourceBase.prototype.bindResourcesData = function (isSetModel) {
        var _this = this;
        this.parent.showSpinner();
        var promises = [];
        for (var i = 0; i < this.parent.resources.length; i++) {
            var dataModule = new Data(this.parent.resources[i].dataSource, this.parent.resources[i].query);
            promises.push(dataModule.getData(dataModule.generateQuery()));
        }
        Promise.all(promises).then(function (e) { return _this.dataManagerSuccess(e, isSetModel); })
            .catch(function (e) { return _this.dataManagerFailure(e); });
    };
    ResourceBase.prototype.dataManagerSuccess = function (e, isSetModel) {
        if (this.parent.isDestroyed) {
            return;
        }
        for (var i = 0, length_1 = e.length; i < length_1; i++) {
            this.parent.resources[i].dataSource = e[i].result;
        }
        this.parent.setProperties({ resources: this.parent.resources }, true);
        this.parent.uiStateValues.groupIndex = 0;
        this.parent.renderElements(isSetModel);
        if (isSetModel) {
            this.parent.eventWindow.refresh();
        }
    };
    ResourceBase.prototype.setResourceCollection = function () {
        var requiredResources = [];
        this.resourceCollection = [];
        this.colorIndex = null;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (var _i = 0, _a = this.parent.activeViewOptions.group.resources; _i < _a.length; _i++) {
                var resource = _a[_i];
                var index_1 = findIndexInData(this.parent.resources, 'name', resource);
                if (index_1 >= 0) {
                    requiredResources.push(this.parent.resources[index_1]);
                }
            }
        }
        else if (this.parent.resources.length > 0) {
            requiredResources = this.parent.resources;
        }
        var index = 0;
        for (var _b = 0, requiredResources_1 = requiredResources; _b < requiredResources_1.length; _b++) {
            var resource = requiredResources_1[_b];
            var resources = {
                field: resource.field,
                title: resource.title,
                name: resource.name,
                allowMultiple: resource.allowMultiple,
                dataSource: resource.dataSource,
                idField: resource.idField,
                textField: resource.textField,
                groupIDField: resource.groupIDField,
                colorField: resource.colorField,
                startHourField: resource.startHourField,
                endHourField: resource.endHourField,
                workDaysField: resource.workDaysField,
                expandedField: resource.expandedField,
                cssClassField: resource.cssClassField
            };
            if (resource.name === this.parent.eventSettings.resourceColorField) {
                this.colorIndex = index;
            }
            index++;
            this.resourceCollection.push(resources);
        }
        if (isNullOrUndefined(this.colorIndex)) {
            this.colorIndex = this.resourceCollection.length - 1;
        }
    };
    ResourceBase.prototype.generateResourceLevels = function (innerDates, isTimeLine) {
        var _this = this;
        var resources = this.resourceCollection;
        var resTreeGroup = [];
        var lastColumnDates = [];
        var group = function (resources, index, prevResource, prevResourceData, prevOrder) {
            var resTree = [];
            var resource = resources[0];
            if (resource) {
                var data = void 0;
                if (prevResourceData && _this.parent.activeViewOptions.group.byGroupID) {
                    var id = prevResourceData[prevResource.idField];
                    data = new DataManager(resource.dataSource).executeLocal(new Query().where(resource.groupIDField, 'equal', id));
                }
                else {
                    data = resource.dataSource;
                }
                for (var i = 0; i < data.length; i++) {
                    var groupOrder = [];
                    if (prevOrder && prevOrder.length > 0) {
                        groupOrder = groupOrder.concat(prevOrder);
                    }
                    groupOrder.push(data[i][resource.idField]);
                    var items = group(resources.slice(1), index + 1, resource, data[i], groupOrder);
                    // Here validate child item empty top level resource only
                    if (index === 0 && items.length === 0 && _this.resourceCollection.length > 1) {
                        continue;
                    }
                    var dateCol = [];
                    var renderDates = _this.parent.activeView.renderDates;
                    var resWorkDays = void 0;
                    if (!_this.parent.activeViewOptions.group.byDate && index + 1 === _this.resourceCollection.length) {
                        var workDays = data[i][resource.workDaysField];
                        var resStartHour = data[i][resource.startHourField];
                        var resEndHour = data[i][resource.endHourField];
                        if (workDays && workDays.length > 0) {
                            renderDates = _this.parent.activeView.getRenderDates(workDays);
                            resWorkDays = workDays;
                            dateCol = _this.parent.activeView.getDateSlots(renderDates, workDays);
                        }
                        else {
                            resWorkDays = _this.parent.activeViewOptions.workDays;
                            dateCol = innerDates;
                        }
                        var dateSlots = _this.generateCustomHours(dateCol, resStartHour, resEndHour, groupOrder);
                        lastColumnDates = lastColumnDates.concat(dateSlots);
                    }
                    var resCssClass = data[i][resource.cssClassField];
                    var slotData = {
                        type: 'resourceHeader', className: ['e-resource-cells'],
                        resourceLevelIndex: index, groupOrder: groupOrder,
                        resource: resource, resourceData: data[i],
                        colSpan: _this.parent.activeViewOptions.group.byDate ? 1 : dateCol.length,
                        renderDates: renderDates, workDays: resWorkDays, cssClass: resCssClass,
                        child: items
                    };
                    resTree.push(slotData);
                }
                if (!resTreeGroup[index]) {
                    resTreeGroup[index] = [];
                }
                resTreeGroup[index].push(resTree);
                return resTree;
            }
            return [];
        };
        this.resourceTreeLevel = group(resources, 0);
        return (isTimeLine) ? [] : this.generateHeaderLevels(resTreeGroup, lastColumnDates, innerDates);
    };
    ResourceBase.prototype.generateCustomHours = function (renderDates, startHour, endHour, groupOrder) {
        var dateSlots = extend([], renderDates, null, true);
        for (var _i = 0, dateSlots_1 = dateSlots; _i < dateSlots_1.length; _i++) {
            var dateSlot = dateSlots_1[_i];
            if (startHour) {
                dateSlot.startHour =
                    this.parent.globalize.parseDate(startHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
            }
            if (endHour) {
                dateSlot.endHour = this.parent.globalize.parseDate(endHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
            }
            if (groupOrder) {
                dateSlot.groupOrder = groupOrder;
            }
        }
        return dateSlots;
    };
    ResourceBase.prototype.generateHeaderLevels = function (resTreeGroup, lastColumnDates, headerDates) {
        var headerLevels = [];
        for (var i = resTreeGroup.length - 1; i >= 0; i--) {
            var temp = 0;
            for (var _i = 0, _a = resTreeGroup[i]; _i < _a.length; _i++) {
                var currentLevelChilds = _a[_i];
                for (var _b = 0, currentLevelChilds_1 = currentLevelChilds; _b < currentLevelChilds_1.length; _b++) {
                    var currentLevelChild = currentLevelChilds_1[_b];
                    if (resTreeGroup[i + 1]) {
                        var nextLevelChilds = resTreeGroup[i + 1][temp];
                        var colSpan = 0;
                        for (var _c = 0, nextLevelChilds_1 = nextLevelChilds; _c < nextLevelChilds_1.length; _c++) {
                            var nextLevelChild = nextLevelChilds_1[_c];
                            if (!this.parent.activeViewOptions.group.byGroupID || (this.parent.activeViewOptions.group.byGroupID &&
                                nextLevelChild.resourceData[nextLevelChild.resource.groupIDField] ===
                                    currentLevelChild.resourceData[currentLevelChild.resource.idField])) {
                                colSpan += nextLevelChild.colSpan;
                            }
                        }
                        currentLevelChild.colSpan = colSpan;
                    }
                    currentLevelChild.groupIndex = temp;
                    temp++;
                    headerLevels[currentLevelChild.resourceLevelIndex] = headerLevels[currentLevelChild.resourceLevelIndex] || [];
                    headerLevels[currentLevelChild.resourceLevelIndex].push(currentLevelChild);
                }
            }
        }
        this.lastResourceLevel = headerLevels.slice(-1)[0] || [];
        if (!this.parent.activeViewOptions.group.byDate) {
            var index = 0;
            for (var _d = 0, _e = this.lastResourceLevel; _d < _e.length; _d++) {
                var lastLevelResource = _e[_d];
                for (var i = 0; i < lastLevelResource.colSpan; i++) {
                    lastColumnDates[index].groupIndex = lastLevelResource.groupIndex;
                    index++;
                }
            }
            headerLevels.push(lastColumnDates);
            return headerLevels;
        }
        var dateHeaderLevels = [];
        var levels = extend([], headerLevels, null, true);
        var dateColSpan = 0;
        for (var _f = 0, _g = levels[0]; _f < _g.length; _f++) {
            var firstRowTd = _g[_f];
            dateColSpan += firstRowTd.colSpan;
        }
        var datesColumn = [];
        for (var _h = 0, headerDates_1 = headerDates; _h < headerDates_1.length; _h++) {
            var headerDate = headerDates_1[_h];
            headerDate.colSpan = dateColSpan;
            datesColumn.push(headerDate);
            var resGroup = extend([], levels, null, true);
            for (var k = 0, length_2 = resGroup.length; k < length_2; k++) {
                if (k === resGroup.length - 1) {
                    for (var _j = 0, _k = resGroup[k]; _j < _k.length; _j++) {
                        var resTd = _k[_j];
                        resTd.date = headerDate.date;
                        resTd.workDays = headerDate.workDays;
                        resTd.startHour = headerDate.startHour;
                        resTd.endHour = headerDate.endHour;
                    }
                }
                if (!dateHeaderLevels[k]) {
                    dateHeaderLevels[k] = [];
                }
                dateHeaderLevels[k] = dateHeaderLevels[k].concat(resGroup[k]);
            }
        }
        dateHeaderLevels.unshift(datesColumn);
        return dateHeaderLevels;
    };
    ResourceBase.prototype.setResourceValues = function (eventObj, isCrud, groupIndex) {
        var _this = this;
        var setValues = function (index, field, value) {
            if (_this.resourceCollection[index].allowMultiple && (!isCrud || isCrud && _this.parent.activeViewOptions.group.allowGroupEdit)) {
                eventObj[field] = [value];
            }
            else {
                eventObj[field] = value;
            }
        };
        if (groupIndex === void 0) {
            groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                this.parent.activeCellsData.groupIndex;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(groupIndex)) {
            var groupOrder = this.lastResourceLevel[groupIndex].groupOrder;
            for (var index = 0; index < this.resourceCollection.length; index++) {
                setValues(index, this.resourceCollection[index].field, groupOrder[index]);
            }
        }
        else if (this.parent.resources.length > 0) {
            for (var index = 0; index < this.resourceCollection.length; index++) {
                var data = this.resourceCollection[index].dataSource[0];
                if (data) {
                    setValues(index, this.resourceCollection[index].field, data[this.resourceCollection[index].idField]);
                }
            }
        }
    };
    ResourceBase.prototype.getResourceColor = function (eventObj, groupOrder) {
        this.colorIndex = (this.parent.activeView.isTimelineView() && !isNullOrUndefined(groupOrder)) ?
            groupOrder.length - 1 : this.colorIndex;
        var resource = this.resourceCollection[this.colorIndex];
        if (isNullOrUndefined(groupOrder) && this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        var id = isNullOrUndefined(groupOrder) ? eventObj[resource.field] : groupOrder[this.colorIndex];
        var data = this.filterData(resource.dataSource, resource.idField, 'equal', id);
        if (data.length > 0) {
            return data[0][resource.colorField];
        }
        return undefined;
    };
    ResourceBase.prototype.getCssClass = function (eventObj) {
        var resource = this.resourceCollection.slice(-1)[0];
        if (this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        var data = this.filterData(resource.dataSource, resource.idField, 'equal', eventObj[resource.field]);
        if (data.length > 0) {
            return data[0][resource.cssClassField];
        }
        return undefined;
    };
    ResourceBase.prototype.filterData = function (dataSource, field, operator, value) {
        return new DataManager(dataSource).executeLocal(new Query().where(field, operator, value));
    };
    ResourceBase.prototype.dataManagerFailure = function (e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e });
        this.parent.hideSpinner();
    };
    ResourceBase.prototype.getResourceData = function (eventObj, index, groupEditIndex) {
        if (this.parent.activeViewOptions.group.allowGroupEdit) {
            var resourceObj = {};
            for (var _i = 0, groupEditIndex_1 = groupEditIndex; _i < groupEditIndex_1.length; _i++) {
                var groupIndex = groupEditIndex_1[_i];
                var resourceLevel = this.lastResourceLevel[groupIndex].groupOrder;
                for (var level = 0, length_3 = resourceLevel.length; level < length_3; level++) {
                    var fieldName = this.resourceCollection[level].field;
                    if (isNullOrUndefined(resourceObj[fieldName])) {
                        resourceObj[fieldName] = [];
                    }
                    resourceObj[fieldName].push(resourceLevel[level]);
                }
            }
            eventObj = extend(eventObj, resourceObj);
        }
        else {
            for (var level = 0, length_4 = this.resourceCollection.length; level < length_4; level++) {
                eventObj[this.resourceCollection[level].field] = this.lastResourceLevel[index].groupOrder[level];
            }
        }
    };
    ResourceBase.prototype.addResource = function (resources, name, index) {
        for (var i = 0, length_5 = this.parent.resources.length; i < length_5; i++) {
            var resource = this.parent.resources[i];
            if (resource.name === name) {
                resource.dataSource.splice(index, 0, resources);
                break;
            }
        }
        this.bindResourcesData(true);
    };
    ResourceBase.prototype.removeResource = function (resourceId, name) {
        var _this = this;
        var _loop_1 = function (i, length_6) {
            var resource = this_1.parent.resources[i];
            if (resource.name === name) {
                resource.dataSource.forEach(function (data, index) {
                    if (data[resource.idField] === resourceId) {
                        _this.parent.resources[i].dataSource.splice(index, 1);
                    }
                });
                return "break";
            }
        };
        var this_1 = this;
        for (var i = 0, length_6 = this.parent.resources.length; i < length_6; i++) {
            var state_1 = _loop_1(i, length_6);
            if (state_1 === "break")
                break;
        }
        this.bindResourcesData(true);
    };
    ResourceBase.prototype.destroy = function () {
        this.parent.off(documentClick, this.documentClick);
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
            remove(this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP));
            remove(this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP_OVERLAY));
        }
        var resToolBarEle = this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER);
        if (resToolBarEle) {
            remove(resToolBarEle);
        }
    };
    return ResourceBase;
}());

var Gregorian = /** @__PURE__ @class */ (function () {
    function Gregorian() {
    }
    Gregorian.prototype.firstDateOfMonth = function (date) {
        return new Date(date.getFullYear(), date.getMonth());
    };
    Gregorian.prototype.lastDateOfMonth = function (dt) {
        return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    };
    Gregorian.prototype.isMonthStart = function (date) {
        return (date.getDate() === 1);
    };
    return Gregorian;
}());
var Islamic = /** @__PURE__ @class */ (function () {
    function Islamic() {
    }
    Islamic.prototype.firstDateOfMonth = function (date) {
        var hDate = HijriParser.getHijriDate(date);
        var gDate = HijriParser.toGregorian(hDate.year, hDate.month, 1);
        return gDate;
    };
    Islamic.prototype.lastDateOfMonth = function (dt) {
        var hDate = HijriParser.getHijriDate(dt);
        var gDate = HijriParser.toGregorian(hDate.year, hDate.month, this.getDaysInMonth(hDate.month, hDate.year));
        var finalGDate = new Date(gDate.getTime());
        new Date(finalGDate.setDate(finalGDate.getDate() + 1));
        var finalHDate = HijriParser.getHijriDate(finalGDate);
        if (hDate.month === finalHDate.month) {
            return finalGDate;
        }
        finalHDate = HijriParser.getHijriDate(gDate);
        if (hDate.month === finalHDate.month) {
            return gDate;
        }
        return new Date(gDate.setDate(gDate.getDate() - 1));
    };
    Islamic.prototype.isMonthStart = function (date) {
        var hijriDate = HijriParser.getHijriDate(date);
        return (hijriDate.date === 1);
    };
    Islamic.prototype.isLeapYear = function (year) {
        return (14 + 11 * year) % 30 < 11;
    };
    Islamic.prototype.getDaysInMonth = function (month, year) {
        var length = 0;
        length = 29 + ((month + 1) % 2);
        if (month === 11 && this.isLeapYear(year)) {
            length++;
        }
        return length;
    };
    return Islamic;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Schedule component that displays a list of events scheduled against specific date and timings,
 * thus helping us to plan and manage it properly.
 * ```html
 * <div id="schedule"></div>
 * ```
 * ```typescript
 * <script>
 *   var scheduleObj = new Schedule();
 *   scheduleObj.appendTo("#schedule");
 * </script>
 * ```
 */
var Schedule = /** @__PURE__ @class */ (function (_super) {
    __extends(Schedule, _super);
    /**
     * Constructor for creating the Schedule widget
     * @hidden
     */
    function Schedule(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    Schedule.prototype.render = function () {
        var addClasses = [];
        var removeClasses = [];
        addClasses.push(ROOT);
        if (this.enableRtl) {
            addClasses.push(RTL);
        }
        else {
            removeClasses.push(RTL);
        }
        if (this.isAdaptive) {
            addClasses.push(DEVICE_CLASS);
        }
        else {
            removeClasses.push(DEVICE_CLASS);
        }
        if (this.cssClass) {
            addClasses.push(this.cssClass);
        }
        classList(this.element, addClasses, removeClasses);
        this.validateDate();
        this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
        this.editorTemplateFn = this.templateParser(this.editorTemplate);
        this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
        this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
        this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
        createSpinner({ target: this.element });
        this.scrollModule = new Scroll(this);
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        this.renderModule = new Render(this);
        this.eventBase = new EventBase(this);
        this.initializeDataModule();
        this.element.appendChild(this.createElement('div', { className: TABLE_CONTAINER_CLASS }));
        this.activeViewOptions = this.getActiveViewOptions();
        this.initializeResources();
    };
    Schedule.prototype.initializeResources = function (isSetModel) {
        if (isSetModel === void 0) { isSetModel = false; }
        if (this.resources.length > 0) {
            this.resourceBase = new ResourceBase(this);
            this.resourceBase.bindResourcesData(isSetModel);
        }
        else {
            this.resourceBase = null;
            this.renderElements(isSetModel);
            if (isSetModel) {
                this.eventWindow.refresh();
            }
        }
    };
    Schedule.prototype.renderElements = function (isLayoutOnly) {
        if (isLayoutOnly) {
            this.initializeView(this.currentView);
            return;
        }
        this.destroyHeaderModule();
        if (this.showHeaderBar) {
            this.headerModule = new HeaderRenderer(this);
        }
        if (!this.element.querySelector('.' + TABLE_CONTAINER_CLASS)) {
            this.element.appendChild(this.createElement('div', { className: TABLE_CONTAINER_CLASS }));
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.scheduleTouchModule = new ScheduleTouch(this);
        }
        this.initializeView(this.currentView);
        this.destroyPopups();
        this.initializePopups();
        this.unwireEvents();
        this.wireEvents();
    };
    Schedule.prototype.validateDate = function () {
        // persist the selected date value
        this.setProperties({ selectedDate: new Date('' + this.selectedDate) }, true);
    };
    Schedule.prototype.getViewIndex = function (viewName) {
        for (var item = 0; item < this.viewCollections.length; item++) {
            var checkIndex = this.viewCollections[item].option;
            if (checkIndex === viewName) {
                return item;
            }
        }
        return -1;
    };
    Schedule.prototype.setViewOptions = function (isModuleLoad) {
        if (isModuleLoad === void 0) { isModuleLoad = false; }
        this.viewOptions = {};
        this.viewCollections = [];
        var viewName;
        var selectedView;
        var count = 0;
        this.viewIndex = -1;
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var view = _a[_i];
            var isOptions = (typeof view === 'string') ? false : true;
            if (typeof view === 'string') {
                viewName = view;
                if (this.currentView === viewName) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            }
            else {
                viewName = view.option;
                if (view.isSelected) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            }
            var obj = extend({ option: viewName }, isOptions ? view : {});
            var fieldViewName = viewName.charAt(0).toLowerCase() + viewName.slice(1);
            this.viewCollections.push(obj);
            if (isNullOrUndefined(this.viewOptions[fieldViewName])) {
                this.viewOptions[fieldViewName] = [obj];
            }
            else {
                this.viewOptions[fieldViewName].push(obj);
            }
            count++;
        }
        if (!isModuleLoad && selectedView) {
            this.setProperties({ currentView: selectedView }, true);
        }
        if (this.viewIndex === -1) {
            var currentIndex = this.getViewIndex(this.currentView);
            this.viewIndex = (currentIndex === -1) ? 0 : currentIndex;
        }
    };
    Schedule.prototype.getActiveViewOptions = function () {
        var timeScale = {
            enable: this.timeScale.enable,
            interval: this.timeScale.interval,
            slotCount: this.timeScale.slotCount,
            majorSlotTemplate: this.timeScale.majorSlotTemplate,
            minorSlotTemplate: this.timeScale.minorSlotTemplate
        };
        var group = {
            byDate: this.group.byDate,
            byGroupID: this.group.byGroupID,
            allowGroupEdit: this.group.allowGroupEdit,
            resources: this.group.resources,
            headerTooltipTemplate: this.group.headerTooltipTemplate,
            enableCompactView: this.group.enableCompactView
        };
        var workDays = this.viewCollections[this.viewIndex].workDays ? [] : this.workDays;
        var scheduleOptions = {
            dateFormat: this.dateFormat,
            endHour: this.endHour,
            isSelected: false,
            option: null,
            readonly: this.readonly,
            startHour: this.startHour,
            allowVirtualScrolling: false,
            cellTemplate: this.cellTemplate,
            eventTemplate: this.eventSettings.template,
            dateHeaderTemplate: this.dateHeaderTemplate,
            resourceHeaderTemplate: this.resourceHeaderTemplate,
            workDays: workDays,
            showWeekend: this.showWeekend,
            showWeekNumber: this.showWeekNumber,
            displayName: null,
            interval: 1,
            timeScale: timeScale,
            group: group,
            headerRows: this.headerRows
        };
        return extend(scheduleOptions, this.viewCollections[this.viewIndex], undefined, true);
    };
    Schedule.prototype.initializeDataModule = function () {
        this.eventFields = {
            id: this.eventSettings.fields.id,
            isBlock: this.eventSettings.fields.isBlock,
            subject: this.eventSettings.fields.subject.name,
            startTime: this.eventSettings.fields.startTime.name,
            endTime: this.eventSettings.fields.endTime.name,
            startTimezone: this.eventSettings.fields.startTimezone.name,
            endTimezone: this.eventSettings.fields.endTimezone.name,
            location: this.eventSettings.fields.location.name,
            description: this.eventSettings.fields.description.name,
            isAllDay: this.eventSettings.fields.isAllDay.name,
            recurrenceID: this.eventSettings.fields.recurrenceID.name,
            recurrenceRule: this.eventSettings.fields.recurrenceRule.name,
            recurrenceException: this.eventSettings.fields.recurrenceException.name,
            isReadonly: this.eventSettings.fields.isReadonly
        };
        this.editorTitles = {
            subject: this.eventSettings.fields.subject.title || this.localeObj.getConstant('title'),
            startTime: this.eventSettings.fields.startTime.title || this.localeObj.getConstant('start'),
            endTime: this.eventSettings.fields.endTime.title || this.localeObj.getConstant('end'),
            isAllDay: this.eventSettings.fields.isAllDay.title || this.localeObj.getConstant('allDay'),
            startTimezone: this.eventSettings.fields.startTimezone.title || this.localeObj.getConstant('startTimezone'),
            endTimezone: this.eventSettings.fields.endTimezone.title || this.localeObj.getConstant('endTimezone'),
            location: this.eventSettings.fields.location.title || this.localeObj.getConstant('location'),
            description: this.eventSettings.fields.description.title || this.localeObj.getConstant('description'),
            recurrenceRule: this.eventSettings.fields.recurrenceRule.title || this.localeObj.getConstant('repeat')
        };
        this.dataModule = new Data(this.eventSettings.dataSource, this.eventSettings.query);
        this.crudModule = new Crud(this);
    };
    Schedule.prototype.initializeView = function (viewName) {
        this.showSpinner();
        this.activeViewOptions = this.getActiveViewOptions();
        if (this.resourceBase) {
            this.resourceBase.setResourceCollection();
        }
        this.initializeTemplates();
        this.renderModule.render(viewName);
    };
    Schedule.prototype.initializeTemplates = function () {
        this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
        this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
        this.majorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.majorSlotTemplate);
        this.minorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.minorSlotTemplate);
        this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
        this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
        this.headerTooltipTemplateFn = this.templateParser(this.activeViewOptions.group.headerTooltipTemplate);
    };
    Schedule.prototype.initializePopups = function () {
        this.eventWindow = new EventWindow(this);
        this.quickPopup = new QuickPopups(this);
    };
    Schedule.prototype.getDayNames = function (type) {
        var culShortNames = [];
        var cldrObj;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('days.stand-alone.' + type, getDefaultDateObject()));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.format.' + type, cldrData));
        }
        for (var _i = 0, _a = Object.keys(cldrObj); _i < _a.length; _i++) {
            var obj = _a[_i];
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    };
    Schedule.prototype.setCldrTimeFormat = function () {
        if (this.locale === 'en' || this.locale === 'en-US') {
            this.timeFormat = (getValue('timeFormats.short', getDefaultDateObject()));
        }
        else {
            this.timeFormat = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.timeFormats.short', cldrData));
        }
    };
    Schedule.prototype.getCalendarMode = function () {
        return this.calendarMode.toLowerCase();
    };
    Schedule.prototype.getTimeString = function (date) {
        return this.globalize.formatDate(date, { format: this.timeFormat, type: 'time', calendar: this.getCalendarMode() });
    };
    Schedule.prototype.setcalendarMode = function () {
        if (this.calendarMode === 'Islamic') {
            this.calendarUtil = new Islamic();
        }
        else {
            this.calendarUtil = new Gregorian();
        }
    };
    Schedule.prototype.changeView = function (view, event, muteOnChange, index) {
        if (isNullOrUndefined(index)) {
            index = this.getViewIndex(view);
        }
        if (!muteOnChange && index === this.viewIndex || index < 0) {
            return;
        }
        this.viewIndex = index;
        var args = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        var navArgs = { action: 'view', cancel: false, previousView: this.currentView, currentView: view };
        this.trigger(navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ currentView: view }, true);
        if (this.headerModule) {
            this.headerModule.updateActiveView();
            this.headerModule.setCalendarView();
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(actionComplete, args);
    };
    Schedule.prototype.changeDate = function (selectedDate, event) {
        var args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        var navArgs = { action: 'date', cancel: false, previousDate: this.selectedDate, currentDate: selectedDate };
        this.trigger(navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ selectedDate: selectedDate }, true);
        if (this.headerModule) {
            this.headerModule.setCalendarDate(selectedDate);
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(actionComplete, args);
    };
    Schedule.prototype.isSelectedDate = function (date) {
        return date.setHours(0, 0, 0, 0) === new Date('' + this.selectedDate).setHours(0, 0, 0, 0);
    };
    Schedule.prototype.getNavigateView = function () {
        if (this.activeView.isTimelineView()) {
            return this.currentView === 'TimelineMonth' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    };
    Schedule.prototype.animateLayout = function () {
        new Animation({ duration: 600, name: 'FadeIn', timingFunction: 'easeIn' }).animate(this.activeView.element);
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Schedule.prototype.requiredModules = function () {
        var modules = [];
        this.setViewOptions(true);
        for (var _i = 0, _a = Object.keys(this.viewOptions); _i < _a.length; _i++) {
            var view = _a[_i];
            view = (view === 'timelineDay' || view === 'timelineWeek' || view === 'timelineWorkWeek') ? 'timelineViews' : view;
            modules.push({
                member: view,
                args: [this]
            });
        }
        if (this.allowDragAndDrop) {
            modules.push({
                member: 'dragAndDrop',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * Initializes the values of private members.
     * @private
     */
    Schedule.prototype.preRender = function () {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.uiStateValues = {
            expand: false,
            isInitial: true,
            left: 0,
            top: 0,
            isGroupAdaptive: false,
            groupIndex: 0,
            action: false,
            isBlock: false
        };
        this.activeCellsData = { startTime: new Date(), endTime: new Date(), isAllDay: false };
        this.activeEventData = { event: undefined, element: undefined };
        this.defaultLocale = {
            day: 'Day',
            week: 'Week',
            workWeek: 'Work Week',
            month: 'Month',
            agenda: 'Agenda',
            weekAgenda: 'Week Agenda',
            workWeekAgenda: 'Work Week Agenda',
            monthAgenda: 'Month Agenda',
            today: 'Today',
            noEvents: 'No events',
            emptyContainer: 'There are no events scheduled on this day.',
            allDay: 'All day',
            start: 'Start',
            end: 'End',
            more: 'more',
            close: 'Close',
            cancel: 'Cancel',
            noTitle: '(No Title)',
            delete: 'Delete',
            deleteEvent: 'Delete Event',
            deleteMultipleEvent: 'Delete Multiple Events',
            selectedItems: 'Items selected',
            deleteSeries: 'Delete Series',
            edit: 'Edit',
            editSeries: 'Edit Series',
            editEvent: 'Edit Event',
            createEvent: 'Create',
            subject: 'Subject',
            addTitle: 'Add title',
            moreDetails: 'More Details',
            save: 'Save',
            editContent: 'Do you want to edit only this event or entire series?',
            deleteRecurrenceContent: 'Do you want to delete only this event or entire series?',
            deleteContent: 'Are you sure you want to delete this event?',
            deleteMultipleContent: 'Are you sure you want to delete the selected events?',
            newEvent: 'New Event',
            title: 'Title',
            location: 'Location',
            description: 'Description',
            timezone: 'Timezone',
            startTimezone: 'Start Timezone',
            endTimezone: 'End Timezone',
            repeat: 'Repeat',
            saveButton: 'Save',
            cancelButton: 'Cancel',
            deleteButton: 'Delete',
            recurrence: 'Recurrence',
            wrongPattern: 'The recurrence pattern is not valid.',
            seriesChangeAlert: 'The changes made to specific instances of this series will be cancelled ' +
                'and those events will match the series again.',
            createError: 'The duration of the event must be shorter than how frequently it occurs. ' +
                'Shorten the duration, or change the recurrence pattern in the recurrence event editor.',
            recurrenceDateValidation: 'Some months have fewer than the selected date. For these months, ' +
                'the occurrence will fall on the last date of the month.',
            sameDayAlert: 'Two occurrences of the same event cannot occur on the same day.',
            editRecurrence: 'Edit Recurrence',
            repeats: 'Repeats',
            alert: 'Alert',
            startEndError: 'The selected end date occurs before the start date.',
            invalidDateError: 'The entered date value is invalid.',
            blockAlert: 'Events cannot be scheduled within the blocked time range.',
            ok: 'Ok',
            occurrence: 'Occurrence',
            series: 'Series',
            previous: 'Previous',
            next: 'Next',
            timelineDay: 'Timeline Day',
            timelineWeek: 'Timeline Week',
            timelineWorkWeek: 'Timeline Work Week',
            timelineMonth: 'Timeline Month'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.setCldrTimeFormat();
        this.setcalendarMode();
        this.eventsData = [];
        this.eventsProcessed = [];
        this.blockData = [];
        this.blockProcessed = [];
        this.currentAction = null;
        this.selectedElements = [];
        this.setViewOptions();
    };
    /**
     * Binding events to the Schedule element.
     * @hidden
     */
    Schedule.prototype.wireEvents = function () {
        var resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.add(window, resize, this.onScheduleResize, this);
        EventHandler.add(document, Browser.touchStartEvent, this.onDocumentClick, this);
        if (this.allowKeyboardInteraction) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        }
    };
    Schedule.prototype.removeSelectedClass = function () {
        var selectedCells = this.getSelectedElements();
        for (var _i = 0, selectedCells_1 = selectedCells; _i < selectedCells_1.length; _i++) {
            var cell = selectedCells_1[_i];
            cell.setAttribute('aria-selected', 'false');
            cell.removeAttribute('tabindex');
        }
        removeClass(selectedCells, SELECTED_CELL_CLASS);
    };
    Schedule.prototype.addSelectedClass = function (cells, focusCell) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.setAttribute('aria-selected', 'true');
        }
        addClass(cells, SELECTED_CELL_CLASS);
        focusCell.setAttribute('tabindex', '0');
        focusCell.focus();
    };
    Schedule.prototype.selectCell = function (element) {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    };
    Schedule.prototype.getSelectedElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + SELECTED_CELL_CLASS));
    };
    Schedule.prototype.getAllDayRow = function () {
        return this.element.querySelector('.' + ALLDAY_ROW_CLASS);
    };
    Schedule.prototype.getContentTable = function () {
        return this.element.querySelector('.' + CONTENT_TABLE_CLASS + ' tbody');
    };
    Schedule.prototype.getTableRows = function () {
        return [].slice.call(this.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr:not(.' + HIDDEN_CLASS + ')'));
    };
    Schedule.prototype.getWorkCellElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
    };
    Schedule.prototype.getIndexOfDate = function (collection, date) {
        return collection.map(Number).indexOf(+date);
    };
    Schedule.prototype.isAllDayCell = function (td) {
        if (this.currentView === 'Month' || this.currentView === 'TimelineMonth' || td.classList.contains(ALLDAY_CELLS_CLASS)
            || td.classList.contains(HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.activeViewOptions.headerRows.length > 0 && this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    };
    Schedule.prototype.getDateFromElement = function (td) {
        if (!isNullOrUndefined(td.getAttribute('data-date'))) {
            var dateInMS = parseInt(td.getAttribute('data-date'), 10);
            return new Date(dateInMS);
        }
        return undefined;
    };
    Schedule.prototype.getCellTemplate = function () {
        return this.cellTemplateFn;
    };
    Schedule.prototype.getDateHeaderTemplate = function () {
        return this.dateHeaderTemplateFn;
    };
    Schedule.prototype.getMajorSlotTemplate = function () {
        return this.majorSlotTemplateFn;
    };
    Schedule.prototype.getMinorSlotTemplate = function () {
        return this.minorSlotTemplateFn;
    };
    Schedule.prototype.getAppointmentTemplate = function () {
        return this.appointmentTemplateFn;
    };
    Schedule.prototype.getEventTooltipTemplate = function () {
        return this.eventTooltipTemplateFn;
    };
    Schedule.prototype.getHeaderTooltipTemplate = function () {
        return this.headerTooltipTemplateFn;
    };
    Schedule.prototype.getEditorTemplate = function () {
        return this.editorTemplateFn;
    };
    Schedule.prototype.getQuickInfoTemplatesHeader = function () {
        return this.quickInfoTemplatesHeaderFn;
    };
    Schedule.prototype.getQuickInfoTemplatesContent = function () {
        return this.quickInfoTemplatesContentFn;
    };
    Schedule.prototype.getQuickInfoTemplatesFooter = function () {
        return this.quickInfoTemplatesFooterFn;
    };
    Schedule.prototype.getResourceHeaderTemplate = function () {
        return this.resourceHeaderTemplateFn;
    };
    Schedule.prototype.getCssProperties = function () {
        var cssProps = {
            border: this.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.enableRtl ? 'paddingLeft' : 'paddingRight'
        };
        return cssProps;
    };
    Schedule.prototype.removeNewEventElement = function () {
        var eventClone = this.element.querySelector('.' + NEW_EVENT_CLASS);
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    };
    Schedule.prototype.onDocumentClick = function (args) {
        this.notify(documentClick, { event: args });
    };
    Schedule.prototype.onScheduleResize = function () {
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        if (this.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.activeView.isTimelineView()) {
            this.notify(dataReady, {});
        }
    };
    Schedule.prototype.templateParser = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    };
    Schedule.prototype.boundaryValidation = function (pageY, pageX) {
        var autoScrollDistance = 30;
        var scrollEdges = { left: false, right: false, top: false, bottom: false };
        var viewBoundaries = this.element.querySelector('.' + CONTENT_WRAP_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            scrollEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            scrollEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            scrollEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            scrollEdges.right = true;
        }
        return scrollEdges;
    };
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    Schedule.prototype.unwireEvents = function () {
        var resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.remove(window, resize, this.onScheduleResize);
        EventHandler.remove(document, Browser.touchStartEvent, this.onDocumentClick);
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
    };
    /**
     * Core method to return the component name.
     * @private
     */
    Schedule.prototype.getModuleName = function () {
        return 'schedule';
    };
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    Schedule.prototype.getPersistData = function () {
        return this.addOnPersist(['currentView', 'selectedDate']);
    };
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    Schedule.prototype.onPropertyChanged = function (newProp, oldProp) {
        var state = { isRefresh: false, isResource: false, isDate: false, isView: false, isLayout: false, isDataManager: false };
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'views':
                    this.setViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateItems();
                    }
                    state.isView = true;
                    break;
                case 'currentView':
                    state.isView = true;
                    break;
                case 'selectedDate':
                    state.isDate = true;
                    break;
                case 'dateFormat':
                    this.activeViewOptions = this.getActiveViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    break;
                case 'showHeaderBar':
                    this.destroyHeaderModule();
                    if (newProp.showHeaderBar) {
                        this.headerModule = new HeaderRenderer(this);
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    this.notify(scrollUiUpdate, { cssProperties: this.getCssProperties() });
                    if (this.activeView.isTimelineView()) {
                        this.notify(dataReady, {});
                    }
                    break;
                case 'showWeekend':
                case 'workDays':
                case 'startHour':
                case 'endHour':
                case 'workHours':
                case 'readonly':
                case 'headerRows':
                case 'showWeekNumber':
                    state.isLayout = true;
                    break;
                case 'locale':
                case 'calendarMode':
                    this.setCldrTimeFormat();
                    this.setcalendarMode();
                    state.isRefresh = true;
                    break;
                case 'firstDayOfWeek':
                    if (this.headerModule) {
                        this.headerModule.setDayOfWeek(newProp.firstDayOfWeek);
                    }
                    if (this.eventWindow) {
                        this.eventWindow.refreshRecurrenceEditor();
                    }
                    state.isLayout = true;
                    break;
                case 'showTimeIndicator':
                    if (this.activeViewOptions.timeScale.enable && this.activeView) {
                        this.activeView.highlightCurrentTime();
                    }
                    break;
                case 'cellTemplate':
                    this.activeViewOptions.cellTemplate = newProp.cellTemplate;
                    this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
                    state.isLayout = true;
                    break;
                case 'dateHeaderTemplate':
                    this.activeViewOptions.dateHeaderTemplate = newProp.dateHeaderTemplate;
                    this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
                    state.isLayout = true;
                    break;
                case 'timezone':
                    this.eventBase.timezonePropertyChange(oldProp.timezone);
                    break;
                case 'enableRtl':
                    state.isRefresh = true;
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp, oldProp, state);
                    break;
            }
        }
        this.propertyChangeAction(state);
    };
    Schedule.prototype.propertyChangeAction = function (state) {
        if (state.isRefresh) {
            this.refresh();
        }
        else if (state.isResource) {
            this.initializeResources(true);
        }
        else if (state.isView) {
            this.changeView(this.currentView, null, true);
        }
        else if (state.isDate) {
            this.changeDate(this.selectedDate);
        }
        else if (state.isLayout) {
            this.initializeView(this.currentView);
        }
        else if (state.isDataManager && this.renderModule) {
            this.renderModule.refreshDataManager();
        }
    };
    Schedule.prototype.extendedPropertyChange = function (prop, newProp, oldProp, state) {
        switch (prop) {
            case 'width':
            case 'height':
                this.notify(uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass);
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass);
                }
                break;
            case 'hideEmptyAgendaDays':
            case 'agendaDaysCount':
                this.activeViewOptions = this.getActiveViewOptions();
                state.isView = true;
                break;
            case 'eventSettings':
                this.onEventSettingsPropertyChanged(newProp.eventSettings, oldProp.eventSettings, state);
                break;
            case 'allowKeyboardInteraction':
                if (this.keyboardInteractionModule) {
                    this.keyboardInteractionModule.destroy();
                    this.keyboardInteractionModule = null;
                }
                if (newProp.allowKeyboardInteraction) {
                    this.keyboardInteractionModule = new KeyboardInteraction(this);
                }
                break;
            case 'editorTemplate':
                if (!isNullOrUndefined(this.editorTemplate)) {
                    this.editorTemplateFn = this.templateParser(this.editorTemplate);
                }
                if (this.eventWindow) {
                    this.eventWindow.setDialogContent();
                }
                break;
            case 'quickInfoTemplates':
                if (this.quickInfoTemplates.header) {
                    this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
                }
                if (this.quickInfoTemplates.content) {
                    this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
                }
                if (this.quickInfoTemplates.footer) {
                    this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
                }
                break;
            case 'group':
                this.onGroupSettingsPropertyChanged(newProp.group, oldProp.group, state);
                break;
            case 'resources':
                state.isResource = true;
                break;
            case 'timeScale':
                this.activeViewOptions.timeScale.interval = newProp.timeScale.interval || this.activeViewOptions.timeScale.interval;
                this.activeViewOptions.timeScale.slotCount = newProp.timeScale.slotCount || this.activeViewOptions.timeScale.slotCount;
                if (this.eventWindow) {
                    this.eventWindow.refreshDateTimePicker();
                }
                state.isLayout = true;
                break;
            case 'allowDragAndDrop':
            case 'allowResizing':
                this.notify(dataReady, {
                    processedData: this.eventBase.processData(this.eventsData)
                });
                break;
            case 'eventDragArea':
                this.notify(dataReady, {});
                break;
        }
    };
    Schedule.prototype.onGroupSettingsPropertyChanged = function (newProp, oldProp, state) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            if (prop === 'headerTooltipTemplate') {
                this.headerTooltipTemplateFn = this.templateParser(newProp[prop]);
            }
            else {
                state.isLayout = true;
                if (this.eventWindow) {
                    this.eventWindow.refresh();
                }
            }
        }
    };
    Schedule.prototype.onEventSettingsPropertyChanged = function (newProp, oldProp, state) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'dataSource':
                case 'query':
                case 'fields':
                    this.initializeDataModule();
                    state.isDataManager = true;
                    break;
                case 'template':
                    this.activeViewOptions.eventTemplate = newProp.template;
                    this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
                    state.isDataManager = true;
                    break;
                case 'enableTooltip':
                    if (this.eventTooltip) {
                        this.eventTooltip.destroy();
                        this.eventTooltip = null;
                    }
                    if (newProp.enableTooltip) {
                        this.eventTooltip = new EventTooltip(this);
                    }
                    break;
                case 'tooltipTemplate':
                    this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
                    break;
                case 'resourceColorField':
                    if (this.resourceBase) {
                        this.resourceBase.setResourceCollection();
                    }
                    state.isDataManager = true;
                    break;
            }
        }
    };
    Schedule.prototype.destroyHeaderModule = function () {
        if (this.headerModule) {
            this.headerModule.destroy();
            this.headerModule = null;
        }
    };
    Schedule.prototype.destroyPopups = function () {
        if (this.quickPopup) {
            this.quickPopup.destroy();
            this.quickPopup = null;
        }
        if (this.eventWindow) {
            this.eventWindow.destroy();
            this.eventWindow = null;
        }
    };
    /**
     * Allows to show the spinner on schedule at the required scenarios.
     */
    Schedule.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * When the spinner is shown manually using `showSpinner` method, it can be hidden using this `hideSpinner` method.
     */
    Schedule.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * Sets different working hours on the required working days by accepting the required start and end time as well as the date collection
     *  as its parameters.
     * @method setWorkHours
     * @param {date} dates Collection of dates on which the given start and end hour range needs to be applied.
     * @param {string} start Defines the work start hour.
     * @param {string} end Defines the work end hour.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {void}
     */
    Schedule.prototype.setWorkHours = function (dates, start, end, groupIndex) {
        var startHour = this.globalize.parseDate(start, { skeleton: 'Hm', calendar: this.getCalendarMode() });
        var endHour = this.globalize.parseDate(end, { skeleton: 'Hm', calendar: this.getCalendarMode() });
        var tableEle = this.getContentTable();
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour) || !tableEle) {
            return;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        var viewStartHour = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        if (endHour > this.activeView.getEndHour()) {
            endHour = this.activeView.getEndHour();
        }
        var msMajorInterval = this.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        var startIndex = Math.round((getDateInMs(startHour) - getDateInMs(viewStartHour)) / msInterval);
        var endIndex = Math.ceil((getDateInMs(endHour) - getDateInMs(viewStartHour)) / msInterval);
        var cells = [];
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var date = dates_1[_i];
            resetTime(date);
            var renderDates = this.activeView.renderDates;
            if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
                renderDates = this.resourceBase.lastResourceLevel[groupIndex].renderDates;
            }
            var colIndex = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                for (var i = startIndex; i < endIndex; i++) {
                    if (this.activeView.isTimelineView()) {
                        var rowIndex = (!isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[rowIndex].cells[i]);
                    }
                    else {
                        if (!isNullOrUndefined(groupIndex)) {
                            var tds = [].slice.call(tableEle.rows[i].querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        }
                        else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        addClass(cells, WORK_HOURS_CLASS);
    };
    /**
     * Retrieves the start and end time information of the specific cell element.
     * @method getCellDetails
     * @param  {Element} td The cell element whose start and end time details are to be retrieved.
     * @returns {CellClickEventArgs} Object An object holding the startTime, endTime and all-day information along with the target HTML
     *  element will be returned.
     */
    Schedule.prototype.getCellDetails = function (tdCol) {
        var td = (tdCol instanceof Array) ? tdCol : [tdCol];
        var firstTd = td[0];
        var lastTd = td.slice(-1)[0];
        var startTime = this.getDateFromElement(firstTd);
        var endTime = this.getDateFromElement(lastTd);
        if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) {
            return undefined;
        }
        var endDateFromColSpan = this.activeView.isTimelineView() && !isNullOrUndefined(lastTd.getAttribute('colSpan'));
        var duration = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(HEADER_CELLS_CLASS)) {
            endTime = addDays(new Date(startTime.getTime()), duration);
        }
        else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        var data = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: tdCol
        };
        var groupIndex = firstTd.getAttribute('data-group-index');
        if (!isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    };
    /**
     * Retrieves the resource details based on the provided resource index.
     * @param {number} index index of the resources at the last level.
     * @returns {ResourceDetails} Object An object holding the details of resource and resourceData.
     */
    Schedule.prototype.getResourcesByIndex = function (index) {
        if (this.resourceBase && this.resourceBase.lastResourceLevel) {
            if (index < 0 || index >= this.resourceBase.lastResourceLevel.length) {
                return undefined;
            }
            var data = this.resourceBase.lastResourceLevel[index];
            var groupData = {};
            this.resourceBase.setResourceValues(groupData, false, index);
            return { resource: data.resource, resourceData: data.resourceData, groupData: groupData };
        }
        return undefined;
    };
    /**
     * Scrolls the Schedule content area to the specified time.
     * @method scrollTo
     * @param {string} hour Accepts the time value in the skeleton format of 'Hm'.
     * @returns {void}
     */
    Schedule.prototype.scrollTo = function (hour) {
        if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour);
        }
    };
    /**
     * Adds the newly created event into the Schedule dataSource.
     * @method addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    Schedule.prototype.addEvent = function (data) {
        this.crudModule.addEvent(data);
    };
    /**
     * Updates the changes made in the event object by passing it as an parameter into the dataSource.
     * @method saveEvent
     * @param {[key: string]: Object} data Single or collection of event objects to be saved into Schedule.
     * @param {CurrentAction} currentAction Denotes the action that takes place either for editing occurrence or series.
     *  The valid current action names are `EditOccurrence` or `EditSeries`.
     * @returns {void}
     */
    Schedule.prototype.saveEvent = function (data, currentAction) {
        this.crudModule.saveEvent(data, currentAction);
    };
    /**
     * Deletes the events based on the provided ID or event collection in the argument list.
     * @method deleteEvent
     * @param {{[key: string]: Object}} id Single event objects to be removed from the Schedule.
     * @param {{[key: string]: Object }[]} id Collection of event objects to be removed from the Schedule.
     * @param {string | number} id Accepts the ID of the event object which needs to be removed from the Schedule.
     * @param {CurrentAction} currentAction Denotes the delete action that takes place either on occurrence or series events.
     *  The valid current action names are `Delete`, `DeleteOccurrence` or `DeleteSeries`.
     * @returns {void}
     */
    Schedule.prototype.deleteEvent = function (id, currentAction) {
        this.crudModule.deleteEvent(id, currentAction);
    };
    /**
     * Retrieves the entire collection of events bound to the Schedule.
     * @method getEvents
     * @returns {Object[]} Returns the collection of event objects from the Schedule.
     */
    Schedule.prototype.getEvents = function () {
        return this.eventsData;
    };
    /**
     * Retrieves the occurrences of a single recurrence event based on the provided parent ID.
     * @method getOccurrencesByID
     * @param {number} eventID ID of the parent recurrence data from which the occurrences are fetched.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    Schedule.prototype.getOccurrencesByID = function (eventID) {
        return this.eventBase.getOccurrencesByID(eventID);
    };
    /**
     * Retrieves all the occurrences that lies between the specific start and end time range.
     * @method getOccurrencesByRange
     * @param {Date} startTime Denotes the start time range.
     * @param {Date} endTime Denotes the end time range.
     * @returns {Object[]} Returns the collection of occurrence event objects that lies between the provided start and end time.
     */
    Schedule.prototype.getOccurrencesByRange = function (startTime, endTime) {
        return this.eventBase.getOccurrencesByRange(startTime, endTime);
    };
    /**
     * Retrieves the dates that lies on active view of Schedule.
     * @method getCurrentViewDates
     * @returns {Date[]} Returns the collection of dates.
     */
    Schedule.prototype.getCurrentViewDates = function () {
        return this.activeView ? this.activeView.renderDates : [];
    };
    /**
     * Retrieves the events that lies on the current date range of the active view of Schedule.
     * @method getCurrentViewEvents
     * @returns {Object[]} Returns the collection of events.
     */
    Schedule.prototype.getCurrentViewEvents = function () {
        return this.eventsProcessed;
    };
    /**
     * Refreshes the event dataSource. This method may be useful when the events alone in the schedule needs to be re-rendered.
     * @method refreshEvents
     * @returns {void}
     */
    Schedule.prototype.refreshEvents = function () {
        this.renderModule.refreshDataManager();
    };
    /**
     * To retrieve the appointment object from element.
     * @method getEventDetails
     * @param {Element} element Denotes the event UI element on the Schedule.
     * @returns {Object} Returns the event details.
     */
    Schedule.prototype.getEventDetails = function (element) {
        var guid = element.getAttribute('data-guid');
        if (guid) {
            return this.eventBase.getEventByGuid(guid);
        }
        return {};
    };
    /**
     * To check whether the given time range slots are available for event creation or already occupied by other events.
     * @method isSlotAvailable
     * @param {Date} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    Schedule.prototype.isSlotAvailable = function (startTime, endTime, groupIndex) {
        var _this = this;
        var eventCollection = this.eventBase.filterEvents(startTime, endTime);
        if (this.currentAction !== 'Add' && this.activeEventData.event) {
            eventCollection = eventCollection.filter(function (event) { return event.Guid !==
                _this.activeEventData.event.Guid; });
        }
        if (!isNullOrUndefined(groupIndex) && this.resourceBase && this.resourceBase.lastResourceLevel.length > 0) {
            eventCollection = this.eventBase.filterEventsByResource(this.resourceBase.lastResourceLevel[groupIndex], eventCollection);
        }
        return (eventCollection.length > 0) ? false : true;
    };
    /**
     * To manually open the event editor on specific time or on certain events.
     * @method openEditor
     * @param {Object} data It can be either cell data or event data.
     * @param {CurrentAction} action Defines the action for which the editor needs to be opened such as either for new event creation or
     *  for editing of existing events. The applicable action names that can be used here are `Add`, `Save`, `EditOccurrence`
     *  and `EditSeries`.
     * @param {boolean} isEventData It allows to decide whether the editor needs to be opened with the clicked cell details or with the
     *  passed event details.
     * @param {number} repeatType It opens the editor with the recurrence options based on the provided repeat type.
     * @returns {void}
     */
    Schedule.prototype.openEditor = function (data, action, isEventData, repeatType) {
        this.currentAction = action;
        if (action !== 'Add') {
            this.activeEventData.event = data;
        }
        this.eventWindow.openEditor(data, action, isEventData, repeatType);
    };
    /**
     * This method has been added to adjust the size of the outer event wrapper class that holds the collection of events,
     *  while trying to set manual height and width to the Schedule cells.
     * @method adjustEventWrapper
     * @returns {void}
     */
    Schedule.prototype.adjustEventWrapper = function () {
        this.activeView.adjustEventWrapper();
    };
    /**
     * Adds the resources to the specified index.
     * @param resources
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     */
    Schedule.prototype.addResource = function (resources, name, index) {
        this.resourceBase.addResource(resources, name, index);
    };
    /**
     * Removes the specified resource.
     * @param resourceId Specifies the resource id to be removed.
     * @param name Specifies the resource name from which the id should be referred.
     */
    Schedule.prototype.removeResource = function (resourceId, name) {
        this.resourceBase.removeResource(resourceId, name);
    };
    /**
     * Destroys the Schedule component.
     * @method destroy
     * @return {void}
     */
    Schedule.prototype.destroy = function () {
        if (this.eventTooltip) {
            this.eventTooltip.destroy();
            this.eventTooltip = null;
        }
        this.destroyPopups();
        this.unwireEvents();
        this.destroyHeaderModule();
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
        if (this.activeView) {
            this.activeView.removeEventListener();
            this.activeView.destroy();
            this.activeView = null;
        }
        if (this.scheduleTouchModule) {
            this.scheduleTouchModule.destroy();
            this.scheduleTouchModule = null;
        }
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        var removeClasses = [ROOT];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
    };
    __decorate([
        Property('auto')
    ], Schedule.prototype, "width", void 0);
    __decorate([
        Property('auto')
    ], Schedule.prototype, "height", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "showHeaderBar", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "showTimeIndicator", void 0);
    __decorate([
        Property('Week')
    ], Schedule.prototype, "currentView", void 0);
    __decorate([
        Property(['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'])
    ], Schedule.prototype, "views", void 0);
    __decorate([
        Property(new Date())
    ], Schedule.prototype, "selectedDate", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "dateFormat", void 0);
    __decorate([
        Property('Gregorian')
    ], Schedule.prototype, "calendarMode", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "showWeekend", void 0);
    __decorate([
        Property(0)
    ], Schedule.prototype, "firstDayOfWeek", void 0);
    __decorate([
        Property([1, 2, 3, 4, 5])
    ], Schedule.prototype, "workDays", void 0);
    __decorate([
        Property('00:00')
    ], Schedule.prototype, "startHour", void 0);
    __decorate([
        Property('24:00')
    ], Schedule.prototype, "endHour", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "allowResizing", void 0);
    __decorate([
        Complex({}, WorkHours)
    ], Schedule.prototype, "workHours", void 0);
    __decorate([
        Complex({}, TimeScale)
    ], Schedule.prototype, "timeScale", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "allowKeyboardInteraction", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "allowDragAndDrop", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "dateHeaderTemplate", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "cellTemplate", void 0);
    __decorate([
        Property(false)
    ], Schedule.prototype, "readonly", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "showQuickInfo", void 0);
    __decorate([
        Property(false)
    ], Schedule.prototype, "showWeekNumber", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "editorTemplate", void 0);
    __decorate([
        Complex({}, QuickInfoTemplates)
    ], Schedule.prototype, "quickInfoTemplates", void 0);
    __decorate([
        Property(7)
    ], Schedule.prototype, "agendaDaysCount", void 0);
    __decorate([
        Property(true)
    ], Schedule.prototype, "hideEmptyAgendaDays", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "timezone", void 0);
    __decorate([
        Complex({}, EventSettings)
    ], Schedule.prototype, "eventSettings", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "resourceHeaderTemplate", void 0);
    __decorate([
        Complex({}, Group)
    ], Schedule.prototype, "group", void 0);
    __decorate([
        Collection([], Resources)
    ], Schedule.prototype, "resources", void 0);
    __decorate([
        Collection([], HeaderRows)
    ], Schedule.prototype, "headerRows", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], Schedule.prototype, "enableRtl", void 0);
    __decorate([
        Property()
    ], Schedule.prototype, "eventDragArea", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "created", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "cellClick", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "cellDoubleClick", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "navigating", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "renderCell", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "eventClick", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "eventRendered", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "dataBinding", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "popupOpen", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "drag", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "dragStop", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "resizeStart", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "resizing", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "resizeStop", void 0);
    __decorate([
        Event()
    ], Schedule.prototype, "dataBound", void 0);
    Schedule = __decorate([
        NotifyPropertyChanges
    ], Schedule);
    return Schedule;
}(Component));

/**
 * Base class for the common drag and resize related actions
 */
var ActionBase = /** @__PURE__ @class */ (function () {
    function ActionBase(parent) {
        this.parent = parent;
        this.actionObj = {
            X: 0, Y: 0, groupIndex: 0, cellWidth: 0, cellHeight: 0, slotInterval: 0, interval: 0, actionIndex: 0,
            cloneElement: [], originalElement: [], action: null, isAllDay: null, excludeSelectors: null,
            index: 0, navigationInterval: null, scrollInterval: null
        };
        this.scrollArgs = { element: null, width: 0, height: 0 };
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }
    ActionBase.prototype.getChangedData = function () {
        var eventObj = extend({}, this.actionObj.event, null, true);
        eventObj[this.parent.eventFields.startTime] = this.actionObj.start;
        eventObj[this.parent.eventFields.endTime] = this.actionObj.end;
        if (!isNullOrUndefined(this.actionObj.isAllDay)) {
            eventObj[this.parent.eventFields.isAllDay] = this.actionObj.isAllDay;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var originalElement = this.getOriginalElement(this.actionObj.element);
            var indexCol = originalElement.map(function (element) { return parseInt(element.getAttribute('data-group-index'), 10); });
            if (indexCol.indexOf(this.actionObj.groupIndex) === -1) {
                var cloneIndex_1 = parseInt(this.actionObj.clone.getAttribute('data-group-index'), 10);
                indexCol = indexCol.filter(function (index) { return index !== cloneIndex_1; });
                indexCol.push(this.actionObj.groupIndex);
                this.parent.resourceBase.getResourceData(eventObj, this.actionObj.groupIndex, indexCol);
            }
        }
        return eventObj;
    };
    ActionBase.prototype.saveChangedData = function (eventArgs) {
        this.parent.activeEventData.event = this.actionObj.event;
        this.parent.currentAction = 'Save';
        var eventObj = eventArgs.data;
        var isSameResource = (this.parent.activeViewOptions.group.resources.length > 0) ?
            parseInt(this.actionObj.element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        if (+eventObj[this.parent.eventFields.startTime] === +this.actionObj.event[this.parent.eventFields.startTime] &&
            +eventObj[this.parent.eventFields.endTime] === +this.actionObj.event[this.parent.eventFields.endTime] && isSameResource) {
            return;
        }
        var currentAction;
        if (eventObj[this.parent.eventFields.recurrenceRule]) {
            var eveId = eventObj[this.parent.eventFields.recurrenceID] || eventObj[this.parent.eventFields.id];
            if (eventObj[this.parent.eventFields.id] === eventObj[this.parent.eventFields.recurrenceID]) {
                eventObj[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
                currentAction = 'EditOccurrence';
            }
            if (this.parent.eventWindow.editOccurrenceValidation(eveId, eventObj, this.actionObj.event)) {
                this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                return;
            }
        }
        if (eventObj[this.parent.eventFields.startTimezone] || eventObj[this.parent.eventFields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(eventObj);
        }
        this.parent.crudModule.saveEvent(eventObj, currentAction);
    };
    ActionBase.prototype.calculateIntervalTime = function (date) {
        var intervalTime = new Date(+date);
        intervalTime.setMinutes(Math.floor(intervalTime.getMinutes() / this.actionObj.interval) * this.actionObj.interval);
        return intervalTime;
    };
    ActionBase.prototype.getContentAreaDimension = function () {
        var viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var trElement = [].slice.call(viewElement.querySelector('tr').children);
        if (!this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.isAdaptive) {
            trElement = this.getResourceElements(trElement);
        }
        var leftOffset = trElement[0].getBoundingClientRect();
        var rightOffset = trElement.slice(-1)[0].getBoundingClientRect();
        var viewDimension = {
            bottom: viewElement.scrollHeight - 5,
            left: this.parent.enableRtl ? rightOffset.left : leftOffset.left,
            right: this.parent.enableRtl ? leftOffset.right : rightOffset.right,
            top: 0
        };
        return viewDimension;
    };
    ActionBase.prototype.getPageCoordinates = function (e) {
        var eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    };
    ActionBase.prototype.getIndex = function (index) {
        var contentElements = [].slice.call(this.parent.getContentTable().querySelector('tr').children);
        var indexes = { minIndex: 0, maxIndex: contentElements.length - 1 };
        if (this.actionObj.action === 'resize' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeView.isTimelineView()) {
            var groupElements = this.getResourceElements(contentElements);
            indexes.minIndex = groupElements[0].cellIndex;
            indexes.maxIndex = groupElements.slice(-1)[0].cellIndex;
        }
        if (index < indexes.minIndex) {
            index = indexes.minIndex;
        }
        if (index > indexes.maxIndex) {
            index = indexes.maxIndex;
        }
        return index;
    };
    ActionBase.prototype.updateTimePosition = function (date) {
        for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
            var cloneElement = _a[_i];
            var timeElement = cloneElement.querySelector('.' + APPOINTMENT_TIME);
            if (timeElement) {
                timeElement.innerHTML = this.parent.getTimeString(this.actionObj.start) + ' - ' +
                    this.parent.getTimeString(this.actionObj.end);
            }
        }
        if (!this.parent.activeViewOptions.timeScale.enable || !this.parent.isAdaptive || this.parent.currentView === 'Month' ||
            this.parent.currentView === 'TimelineMonth') {
            return;
        }
        var timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (!timeIndicator) {
            timeIndicator = createElement('div', { className: CLONE_TIME_INDICATOR_CLASS });
            var wrapperClass = this.parent.activeView.isTimelineView() ? DATE_HEADER_WRAP_CLASS : TIME_CELLS_WRAP_CLASS;
            this.parent.element.querySelector('.' + wrapperClass).appendChild(timeIndicator);
        }
        timeIndicator.innerHTML = this.parent.getTimeString(date);
        var offsetValue = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (this.parent.enableRtl) {
                var rightValue = parseInt(this.actionObj.clone.style.right, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    rightValue + this.actionObj.clone.offsetWidth : rightValue;
                timeIndicator.style.right = formatUnit(offsetValue);
            }
            else {
                var leftValue = parseInt(this.actionObj.clone.style.left, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    leftValue : leftValue + this.actionObj.clone.offsetWidth;
                timeIndicator.style.left = formatUnit(offsetValue);
            }
        }
        else {
            offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.top ? this.actionObj.clone.offsetTop :
                this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight;
            timeIndicator.style.top = formatUnit(offsetValue);
        }
    };
    ActionBase.prototype.getResourceElements = function (table) {
        var _this = this;
        return table.filter(function (element) {
            return parseInt(element.getAttribute('data-group-index'), 10) === _this.actionObj.groupIndex;
        });
    };
    ActionBase.prototype.getOriginalElement = function (element) {
        var originalElement;
        var guid = element.getAttribute('data-guid');
        if (this.parent.activeView.isTimelineView()) {
            originalElement = [].slice.call(this.parent.element.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        else {
            var tr = closest(element, 'tr');
            originalElement = [].slice.call(tr.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        return originalElement;
    };
    ActionBase.prototype.createCloneElement = function (element) {
        var cloneElement = compile(element.outerHTML)({})[0];
        var cloneClassLists = [CLONE_ELEMENT_CLASS];
        cloneClassLists.push((this.actionObj.action === 'drag') ? DRAG_CLONE_CLASS : RESIZE_CLONE_CLASS);
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineMonth') {
            cloneClassLists.push(MONTH_CLONE_ELEMENT_CLASS);
        }
        addClass([cloneElement], cloneClassLists);
        addClass([element], EVENT_ACTION_CLASS);
        element.parentElement.appendChild(cloneElement);
        cloneElement.style.width = formatUnit(cloneElement.offsetWidth - 2);
        if (this.parent.eventDragArea && this.actionObj.action === 'drag') {
            document.querySelector(this.parent.eventDragArea).appendChild(cloneElement);
        }
        setStyleAttribute(cloneElement, { border: '0px' });
        return cloneElement;
    };
    ActionBase.prototype.removeCloneElement = function () {
        this.actionObj.originalElement.forEach(function (element) { return removeClass([element], EVENT_ACTION_CLASS); });
        this.actionObj.originalElement = [];
        this.actionObj.cloneElement.forEach(function (element) { return remove(element); });
        this.actionObj.cloneElement = [];
        var timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (timeIndicator) {
            remove(timeIndicator);
        }
    };
    ActionBase.prototype.getCursorElement = function (e) {
        var pages = this.getPageCoordinates(e);
        return document.elementFromPoint(pages.clientX, pages.clientY);
    };
    ActionBase.prototype.autoScroll = function () {
        var parent = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var yIsScrollable = parent.offsetHeight <= parent.scrollHeight;
        var xIsScrollable = parent.offsetWidth <= parent.scrollWidth;
        var yInBounds = yIsScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
        var xInBounds = xIsScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
        if (yInBounds && (this.scrollEdges.top || this.scrollEdges.bottom)) {
            parent.scrollTop += this.scrollEdges.top ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollHeight !== parent.offsetHeight + parent.scrollTop && parent.scrollTop > 0) {
                    this.actionObj.Y += this.scrollEdges.top ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
        if (xInBounds && (this.scrollEdges.left || this.scrollEdges.right)) {
            parent.scrollLeft += this.scrollEdges.left ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollWidth !== parent.offsetWidth + parent.scrollLeft && parent.scrollLeft > 0) {
                    this.actionObj.X += this.scrollEdges.left ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
    };
    ActionBase.prototype.autoScrollValidation = function (e) {
        if (!this.actionObj.scroll.enable) {
            return false;
        }
        var res = this.parent.boundaryValidation(this.actionObj.pageY, this.actionObj.pageX);
        this.scrollEdges = res;
        return res.bottom || res.top || res.left || res.right;
    };
    ActionBase.prototype.actionClass = function (type) {
        if (type === 'addClass') {
            addClass([this.parent.element], EVENT_ACTION_CLASS);
        }
        else {
            removeClass([this.parent.element], EVENT_ACTION_CLASS);
        }
    };
    ActionBase.prototype.updateScrollPosition = function (e) {
        var _this = this;
        if (this.actionObj.scroll.enable && isNullOrUndefined(this.actionObj.scrollInterval)) {
            this.actionObj.scrollInterval = window.setInterval(function () {
                if (_this.autoScrollValidation(e) && !_this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                    _this.autoScroll();
                    if (_this.actionObj.action === 'drag') {
                        _this.parent.dragAndDropModule.updateDraggingDateTime(e);
                    }
                    else {
                        _this.parent.resizeModule.updateResizingDirection(e);
                    }
                }
            }, this.actionObj.scroll.timeDelay);
        }
    };
    /**
     * To destroy the action base module.
     * @return {void}
     * @private
     */
    ActionBase.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.actionObj = {};
        this.scrollArgs = {};
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    };
    return ActionBase;
}());

var __extends$11 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Schedule events resize actions
 */
var Resize = /** @__PURE__ @class */ (function (_super) {
    __extends$11(Resize, _super);
    function Resize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Resize.prototype.wireResizeEvent = function (element) {
        var _this = this;
        var resizeElement = [].slice.call(element.querySelectorAll('.' + EVENT_RESIZE_CLASS));
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
        var resizeTarget = closest(e.target, '.' + EVENT_RESIZE_CLASS);
        this.actionObj.element = closest(resizeTarget, '.' + APPOINTMENT_CLASS);
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
        this.parent.trigger(resizeStart, resizeArgs);
        if (resizeArgs.cancel) {
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.resizeEdges = {
            left: resizeTarget.classList.contains(LEFT_RESIZE_HANDLER),
            right: resizeTarget.classList.contains(RIGHT_RESIZE_HANDLER),
            top: resizeTarget.classList.contains(TOP_RESIZE_HANDLER),
            bottom: resizeTarget.classList.contains(BOTTOM_RESIZE_HANDLER)
        };
        this.actionObj.groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : 0;
        var workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
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
        var viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
        EventHandler.add(document, Browser.touchMoveEvent, this.resizing, this);
        EventHandler.add(document, Browser.touchEndEvent, this.resizeStop, this);
    };
    Resize.prototype.resizing = function (e) {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.element.querySelectorAll('.' + RESIZE_CLONE_CLASS).length === 0) {
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
        this.parent.trigger(resizing, resizeArgs);
    };
    Resize.prototype.updateResizingDirection = function (e) {
        var resizeValidation = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                var leftStyles = this.getLeftRightStyles(e, true);
                for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
                    var cloneElement = _a[_i];
                    setStyleAttribute(cloneElement, leftStyles);
                    addClass([cloneElement], LEFT_RESIZE_HANDLER);
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
                    addClass([cloneElement], RIGHT_RESIZE_HANDLER);
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
                    addClass([cloneElement], TOP_RESIZE_HANDLER);
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
                    addClass([cloneElement], BOTTOM_RESIZE_HANDLER);
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
        this.parent.trigger(resizeStop, resizeArgs);
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
        var resizeTime = resetTime(new Date(parseInt(this.actionObj.clone.offsetParent.getAttribute('data-date'), 10)));
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
                resizeTime.getMinutes() === 0) ? addDays(resizeTime, 1) : resizeTime;
            this.actionObj.end = this.parent.activeViewOptions.timeScale.enable && this.parent.currentView !== 'Month' ?
                this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    };
    Resize.prototype.getTopBottomStyles = function (e, isTop) {
        var viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
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

var __extends$12 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Schedule events drag actions
 */
var DragAndDrop = /** @__PURE__ @class */ (function (_super) {
    __extends$12(DragAndDrop, _super);
    function DragAndDrop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragAndDrop.prototype.wireDragEvent = function (element, isAllDay) {
        var dragAreaTarget = CURRENT_PANEL_CLASS;
        new Draggable(element, {
            abort: '.' + EVENT_RESIZE_CLASS,
            clone: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: (this.parent.eventDragArea) ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.eventDragArea) ?
                document.querySelector(this.parent.eventDragArea) :
                this.parent.element.querySelector('.' + dragAreaTarget),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element;
        this.actionObj.action = 'drag';
        this.actionObj.clone = this.createCloneElement(this.actionObj.element);
        if (!this.parent.eventDragArea && this.parent.currentView !== 'Month' &&
            this.parent.timeScale.enable && !this.parent.activeView.isTimelineView() &&
            !this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
        }
        this.actionObj.clone.style.top = formatUnit(this.actionObj.element.offsetTop);
        this.actionObj.cloneElement = [this.actionObj.clone];
        this.actionObj.originalElement = [this.actionObj.element];
        return this.actionObj.clone;
    };
    DragAndDrop.prototype.dragPosition = function (e) {
        if (this.parent.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        var slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        var cellWidth = this.parent.activeView.isTimelineView() ? (this.actionObj.cellWidth / slotInterval) *
            this.actionObj.interval : this.actionObj.cellWidth;
        var cellHeight = (this.actionObj.cellHeight / slotInterval) * this.actionObj.interval;
        var leftOffset = this.parent.enableRtl ? parseInt(e.left, 10) : Math.abs(parseInt(e.left, 10));
        var leftValue = formatUnit(0);
        if (this.parent.currentView === 'Month') {
            leftValue = e.left;
        }
        if (this.parent.activeView.isTimelineView()) {
            leftValue = formatUnit(Math.floor(leftOffset / cellWidth) * cellWidth);
        }
        var topValue;
        if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable ||
            (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)))) {
            topValue = formatUnit(this.actionObj.clone.offsetTop);
        }
        else if (this.parent.currentView === 'Month') {
            topValue = formatUnit(0);
        }
        else if (this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop);
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth)
            });
        }
        else {
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                !this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                setStyleAttribute(this.actionObj.clone, {
                    height: formatUnit(this.actionObj.cellHeight),
                    width: formatUnit(this.actionObj.cellWidth),
                    pointerEvents: 'none'
                });
            }
            topValue = formatUnit(Math.ceil(parseInt(e.top, 10) / cellHeight) * cellHeight);
            var scrollHeight = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            var cloneBottom = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
        }
        return { left: leftValue, top: topValue };
    };
    DragAndDrop.prototype.setDragActionDefaultValues = function () {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        var workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var eventGuid = this.actionObj.element.getAttribute('data-guid');
        this.actionObj.event = this.parent.eventBase.getEventByGuid(eventGuid);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var dragArgs = {
            cancel: false,
            data: eventObj,
            event: e,
            excludeSelectors: null,
            element: this.actionObj.element,
            interval: this.actionObj.interval,
            navigation: { enable: false, timeDelay: 2000 },
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(dragStart, dragArgs);
        if (dragArgs.cancel) {
            this.removeCloneElement();
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.actionObj.start = eventObj[this.parent.eventFields.startTime];
        this.actionObj.end = eventObj[this.parent.eventFields.endTime];
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = dragArgs.interval;
        this.actionObj.navigation = dragArgs.navigation;
        this.actionObj.scroll = dragArgs.scroll;
        this.actionObj.excludeSelectors = dragArgs.excludeSelectors;
    };
    DragAndDrop.prototype.drag = function (e) {
        this.parent.quickPopup.quickPopupHide(true);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventArgs = this.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
        if (this.parent.eventDragArea) {
            var targetElement = eventArgs.target;
            this.actionObj.clone.style.top = formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = formatUnit(targetElement.offsetLeft);
            var currentTarget = closest(targetElement, '.' + ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            }
            else {
                if (!(this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek'
                    || this.parent.currentView === 'Day')) {
                    this.actionObj.clone.style.height = formatUnit(this.actionObj.element.offsetHeight);
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        var dragArgs = { data: eventObj, event: e, element: this.actionObj.element };
        this.parent.trigger(drag, dragArgs);
    };
    DragAndDrop.prototype.dragStop = function (e) {
        this.removeCloneElement();
        clearInterval(this.actionObj.navigationInterval);
        this.actionObj.navigationInterval = null;
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        this.actionObj.action = null;
        if (this.isAllowDrop(e)) {
            return;
        }
        var dragArgs = { cancel: false, data: this.getChangedData(), event: e, element: this.actionObj.element };
        this.parent.trigger(dragStop, dragArgs);
        if (dragArgs.cancel) {
            return;
        }
        this.saveChangedData(dragArgs);
    };
    DragAndDrop.prototype.updateNavigatingPosition = function (e) {
        var _this = this;
        if (this.actionObj.navigation.enable) {
            var currentDate_1 = new Date();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(function () {
                    if (currentDate_1) {
                        var crtDate = new Date();
                        var end = crtDate.getSeconds();
                        var start = currentDate_1.getSeconds() + (_this.actionObj.navigation.timeDelay / 1000);
                        start = (start >= 60) ? start - 60 : start;
                        if (start === end) {
                            currentDate_1 = new Date();
                            _this.viewNavigation(e);
                            _this.updateDraggingDateTime(e);
                        }
                    }
                }, this.actionObj.navigation.timeDelay);
            }
        }
    };
    DragAndDrop.prototype.updateDraggingDateTime = function (e) {
        if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
            this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        }
        else if (this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'TimelineMonth') {
                this.calculateTimelineDate(e);
            }
            else {
                this.calculateTimelineTime(e);
            }
        }
        else {
            if (this.parent.currentView === 'Month') {
                this.calculateVerticalDate(e);
            }
            else {
                this.calculateVerticalTime(e);
            }
        }
    };
    DragAndDrop.prototype.navigationWrapper = function () {
        if (!this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'Month' || !this.parent.timeScale.enable) {
                var outerWrapperCls = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS);
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                var targetWrapper = outerWrapperCls.item(this.actionObj.index).querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls.item(this.actionObj.index).appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            }
            else {
                var wrapperClass = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    var elementHeight_1 = this.getAllDayEventHeight();
                    var event_1 = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event_1[0].offsetHeight < elementHeight_1) {
                        event_1.forEach(function (element) { return element.style.height = ((elementHeight_1 + 2) / 12) + 'em'; });
                    }
                    this.actionObj.clone.style.height = formatUnit(elementHeight_1);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 0);
            }
        }
        else {
            var outWrapper = void 0;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            }
            else {
                outWrapper = this.parent.element.querySelector('.' + APPOINTMENT_CONTAINER_CLASS);
            }
            var tarWrapper = outWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!tarWrapper) {
                tarWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                outWrapper.appendChild(tarWrapper);
            }
            tarWrapper.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.viewNavigation = function (e) {
        var navigationType;
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'next' : 'previous';
            }
            else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'previous' : 'next';
            }
            if (navigationType) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate(navigationType));
            }
        }
    };
    DragAndDrop.prototype.morePopupEventDragging = function (e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'td')))) {
            return;
        }
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var td = closest(e.target, 'td');
        var dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
        var dragEnd = new Date(dragStart$$1.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = formatUnit(td.offsetParent.offsetTop);
        this.actionObj.clone.style.left = formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = formatUnit(td.offsetWidth);
        var eventContainer = td;
        var eventWrapper;
        if (this.parent.activeView.isTimelineView()) {
            var rowIndex = closest(td, 'tr').rowIndex;
            eventContainer = this.parent.element.querySelectorAll('.e-appointment-container').item(rowIndex);
        }
        eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
    };
    DragAndDrop.prototype.calculateVerticalTime = function (e) {
        if (isNullOrUndefined(this.actionObj.target) ||
            (this.actionObj.target && isNullOrUndefined(closest(this.actionObj.target, 'tr'))) ||
            (!(closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS)) &&
                !(closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventStart = eventObj[this.parent.eventFields.startTime];
        var eventEnd = eventObj[this.parent.eventFields.endTime];
        var eventDuration = eventEnd.getTime() - eventStart.getTime();
        var offsetTop = Math.floor(parseInt(this.actionObj.clone.style.top, 0) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop :
                dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight;
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = formatUnit(offsetTop);
        }
        var rowIndex = offsetTop / this.actionObj.cellHeight;
        var heightPerMinute = this.actionObj.cellHeight / this.actionObj.slotInterval;
        var diffInMinutes = parseInt(this.actionObj.clone.style.top, 0) - offsetTop;
        var isAllDayDrag = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS);
        var tr;
        if (isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS);
        }
        else {
            var trCollections = this.parent.getContentTable().querySelectorAll('tr');
            tr = trCollections.item(rowIndex);
        }
        var index;
        if (closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS) ||
            closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)) {
            index = closest(this.actionObj.target, 'td').cellIndex;
        }
        var colIndex = isNullOrUndefined(index) ? closest(this.actionObj.clone, 'td').cellIndex : index;
        this.actionObj.index = colIndex;
        var td = tr.childNodes.item(colIndex);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        var dragStart$$1;
        var dragEnd;
        if (this.parent.activeViewOptions.timeScale.enable && !isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            var spanHours = -(((this.actionObj.slotInterval / this.actionObj.cellHeight) * diffInMinutes) * (1000 * 60));
            if (this.actionObj.clone.querySelector('.' + EVENT_ICON_UP_CLASS)) {
                var startTime = new Date(eventStart.getTime());
                spanHours = addDays(resetTime(new Date(startTime.getTime())), 1).getTime() - startTime.getTime();
            }
            dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart$$1.setMinutes(dragStart$$1.getMinutes() + (diffInMinutes * heightPerMinute));
            dragStart$$1.setMilliseconds(-spanHours);
            dragStart$$1 = this.calculateIntervalTime(dragStart$$1);
            dragStart$$1.setMilliseconds(spanHours);
            dragEnd = new Date(dragStart$$1.getTime());
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            }
            else {
                dragEnd.setMilliseconds(eventDuration);
            }
        }
        else {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart$$1.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart$$1.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = addDays(resetTime(dragEnd), 1);
            }
        }
        this.actionObj.start = new Date(+dragStart$$1);
        this.actionObj.end = new Date(+dragEnd);
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.swapDragging = function (e) {
        var colIndex = closest(this.actionObj.target, 'td').cellIndex;
        if (closest(this.actionObj.target, '.' + DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            var eventHeight_1 = this.getAllDayEventHeight();
            var allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight_1) {
                allDayElement.forEach(function (element) { return element.style.height = ((eventHeight_1 + 2) / 12) + 'em'; });
            }
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(this.actionObj.cellWidth),
                height: formatUnit(eventHeight_1),
                top: formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop)
            });
        }
        if (closest(this.actionObj.target, '.' + WORK_CELLS_CLASS) &&
            !closest(this.actionObj.clone, '.' + DAY_WRAPPER_CLASS)) {
            removeClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            var height = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            setStyleAttribute(this.actionObj.clone, {
                left: formatUnit(0),
                height: formatUnit(height),
                width: formatUnit(this.actionObj.cellWidth)
            });
        }
    };
    DragAndDrop.prototype.calculateVerticalDate = function (e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'tr')))) {
            return;
        }
        this.actionObj.clone.style.top = formatUnit(0);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var td = closest(this.actionObj.target, 'td');
        var tr = td.parentElement;
        var colIndex = (tr.rowIndex * tr.childNodes.length) + td.cellIndex;
        this.actionObj.index = colIndex;
        // let cellIndex: number = td.cellIndex;
        // let daysCount: number = Math.floor(this.actionObj.element.offsetWidth / this.actionObj.cellWidth);
        // let maxIndex: number = (tr.lastChild as HTMLTableCellElement).cellIndex;
        // if (cellIndex + daysCount > maxIndex) {
        //     this.actionObj.clone.style.width = formatUnit((this.actionObj.cellWidth - 2) * ((maxIndex + 1) - cellIndex));
        // } else {
        //     this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
        // }
        var outerWrapper = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        var targetWrapper = outerWrapper.item(colIndex).querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!targetWrapper) {
            targetWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            outerWrapper.item(colIndex).appendChild(targetWrapper);
        }
        if (!targetWrapper.querySelector('.' + CLONE_ELEMENT_CLASS)) {
            this.appendCloneElement(targetWrapper);
        }
        var timeString = outerWrapper.item(colIndex).getAttribute('data-date') ||
            eventObj[this.parent.eventFields.startTime].getTime().toString();
        var dragStart$$1 = new Date(parseInt(timeString, 10));
        var dragEnd = new Date(dragStart$$1.getTime());
        if (this.parent.enableRtl) {
            var endTimeDiff = eventObj[this.parent.eventFields.endTime].getTime() -
                (resetTime(new Date(+eventObj[this.parent.eventFields.endTime]))).getTime();
            dragEnd = new Date(dragStart$$1.getTime() + endTimeDiff);
            dragStart$$1 = new Date(dragEnd.getTime() - eventDuration);
        }
        else {
            var startTimeDiff = eventObj[this.parent.eventFields.startTime].getTime() -
                (resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
            dragStart$$1 = new Date(dragStart$$1.getTime() + startTimeDiff);
            dragEnd = new Date(dragStart$$1.getTime() + eventDuration);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateTimelineTime = function (e) {
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var offsetLeft = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        var rightOffset;
        var diffInMinutes = this.actionObj.clone.offsetLeft - offsetLeft;
        var viewEle = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            this.actionObj.clone.style.right = formatUnit(rightOffset);
            diffInMinutes = rightOffset - offsetLeft;
        }
        if (this.scrollEdges.left || this.scrollEdges.right) {
            if (this.parent.enableRtl) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
                this.actionObj.clone.style.left = formatUnit(rightOffset);
            }
            else {
                offsetLeft = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
                this.actionObj.clone.style.left = formatUnit(offsetLeft);
            }
        }
        var widthPerMinute = this.actionObj.slotInterval / this.actionObj.cellWidth;
        var colIndex = this.getIndex(Math.floor(offsetLeft / this.actionObj.cellWidth));
        var tr = this.parent.getContentTable().querySelector('tr');
        var eventStart = new Date(parseInt(tr.childNodes.item(colIndex).getAttribute('data-date'), 10));
        eventStart.setMinutes(eventStart.getMinutes() + Math.round((widthPerMinute * diffInMinutes)));
        eventStart = this.calculateIntervalTime(eventStart);
        if (!this.parent.activeViewOptions.timeScale.enable) {
            var eventSrt = eventObj[this.parent.eventFields.startTime];
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        var eventEnd = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateTimelineDate = function (e) {
        var cloneIndex = 0;
        var rightOffset;
        var leftOffset;
        var viewEle = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        if (this.parent.enableRtl) {
            cloneIndex = (Math.floor(parseInt(this.actionObj.clone.style.right, 10))) / this.actionObj.cellWidth;
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            if (this.scrollEdges.left || this.scrollEdges.right) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft - this.actionObj.clone.offsetWidth;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
            }
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        }
        else {
            cloneIndex = Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth);
            leftOffset = parseInt(this.actionObj.clone.style.left, 10);
            if (this.scrollEdges.left || this.scrollEdges.right) {
                leftOffset = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
            }
            this.actionObj.clone.style.left = formatUnit(leftOffset);
        }
        cloneIndex = this.getIndex(cloneIndex);
        var tr = this.parent.getContentTable().querySelector('tr');
        var dragDate = new Date(parseInt(tr.childNodes.item(cloneIndex).getAttribute('data-date'), 10));
        var dragStart$$1 = new Date(dragDate.getTime());
        var srtDateDiff = eventObj[this.parent.eventFields.startTime].getTime() -
            (resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
        dragStart$$1 = new Date(dragStart$$1.getTime() + srtDateDiff);
        var dragEnd = new Date(dragStart$$1.getTime() + eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateResourceGroupingPosition = function (e) {
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var trCollection = this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)');
        var translateY = getTranslateY(dragArea.querySelector('table'));
        translateY = (isNullOrUndefined(translateY)) ? 0 : translateY;
        var rowIndex = Math.floor(Math.floor((this.actionObj.Y + (dragArea.scrollTop - translateY)) -
            dragArea.getBoundingClientRect().top) / this.actionObj.cellHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        var eventContainer = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        var eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
        var td = closest(e.target, 'td');
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        this.actionObj.clone.style.top = formatUnit(trCollection.item(rowIndex).offsetTop);
    };
    DragAndDrop.prototype.appendCloneElement = function (element) {
        if (this.parent.eventDragArea) {
            document.querySelector(this.parent.eventDragArea).appendChild(this.actionObj.clone);
        }
        else {
            element.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.getEventWrapper = function (index) {
        var eventWrapper;
        var isAllDayDrag = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS);
        if (this.parent.activeViewOptions.timeScale.enable) {
            var wrapperClass = isAllDayDrag ? '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index);
        }
        else {
            var targetWrapper = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS).item(index);
            eventWrapper = targetWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!eventWrapper) {
                eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    };
    DragAndDrop.prototype.getAllDayEventHeight = function () {
        var eventWrapper = createElement('div', { className: APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        var eventHeight = eventWrapper.offsetHeight;
        remove(eventWrapper);
        return eventHeight;
    };
    DragAndDrop.prototype.isAllowDrop = function (e) {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        var dropSelectors = this.actionObj.excludeSelectors.split(',');
        var isAllowDrop = false;
        for (var _i = 0, dropSelectors_1 = dropSelectors; _i < dropSelectors_1.length; _i++) {
            var selector = dropSelectors_1[_i];
            if (e.target.classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    };
    /**
     * Get module name.
     */
    DragAndDrop.prototype.getModuleName = function () {
        return 'dragAndDrop';
    };
    return DragAndDrop;
}(ActionBase));

/**
 * view base
 */
var ViewBase = /** @__PURE__ @class */ (function () {
    /**
     * Constructor
     */
    function ViewBase(parent) {
        var _this = this;
        this.customHelper = {
            getDayName: function (dt) {
                return _this.parent.getDayNames('abbreviated')[dt.getDay()];
            },
            getDate: function (dt) {
                return _this.parent.globalize.formatDate(dt, { format: 'd', calendar: _this.parent.getCalendarMode() });
            },
            getTime: function (dt) {
                if (_this.parent.isAdaptive) {
                    return _this.parent.globalize.formatDate(dt, { skeleton: 'h', calendar: _this.parent.getCalendarMode() });
                }
                return _this.parent.getTimeString(dt);
            },
            getTimelineDate: function (dt) {
                return _this.parent.globalize.formatDate(dt, { skeleton: 'MMMd', calendar: _this.parent.getCalendarMode() }) + ', ' + _this.parent.getDayNames('wide')[dt.getDay()];
            }
        };
        this.parent = parent;
    }
    ViewBase.prototype.isTimelineView = function () {
        return this.parent.currentView.indexOf('Timeline') !== -1;
    };
    ViewBase.prototype.getContentRows = function () {
        return [];
    };
    ViewBase.prototype.createEventTable = function (trCount) {
        var eventTable = createElement('div', { className: EVENT_TABLE_CLASS });
        append(this.getEventRows(trCount), eventTable);
        return eventTable;
    };
    ViewBase.prototype.getEventRows = function (trCount) {
        var eventRows = [];
        var eventContainer;
        for (var row = 0; row < trCount; row++) {
            eventContainer = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
            if (this.parent.resourceBase && !this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.renderedResources) {
                eventContainer.setAttribute('data-group-index', this.parent.resourceBase.renderedResources[row].groupIndex.toString());
            }
            eventRows.push(eventContainer);
        }
        return eventRows;
    };
    ViewBase.prototype.collapseRows = function (wrap) {
        if (!this.isTimelineView()) {
            return;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('tbody'));
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('.' + EVENT_TABLE_CLASS));
        }
    };
    ViewBase.prototype.createTableLayout = function (className) {
        var clsName = className || '';
        var table = createElement('table', { className: SCHEDULE_TABLE_CLASS + ' ' + clsName });
        var tbody = createElement('tbody');
        table.appendChild(tbody);
        return table;
    };
    ViewBase.prototype.createColGroup = function (table, lastRow) {
        var length = lastRow.length;
        if (lastRow[0] && lastRow[0].colSpan) {
            length = lastRow.map(function (value) { return value.colSpan; }).reduce(function (prev, next) { return prev + next; });
        }
        var colGroupEle = createElement('colgroup');
        for (var i = 0; i < length; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        prepend([colGroupEle], table);
    };
    ViewBase.prototype.getScrollXIndent = function (content) {
        return content.offsetHeight - content.clientHeight > 0 ? getScrollBarWidth() : 0;
    };
    ViewBase.prototype.scrollTopPanel = function (target) {
        this.getDatesHeaderElement().firstChild.scrollLeft = target.scrollLeft;
    };
    ViewBase.prototype.scrollHeaderLabels = function (target) {
        var _this = this;
        var headerTable = this.element.querySelector('.e-date-header-wrap table');
        var colWidth = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        var applyLeft = function (headerCells, isRtl) {
            var currentCell;
            var tdLeft = 0;
            var colSpan = 0;
            var hiddenLeft = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (var i = 0; i < headerCells.length; i++) {
                colSpan += parseInt(headerCells[i].getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = headerCells[i];
                    break;
                }
                tdLeft += headerCells[i].offsetWidth;
            }
            currentCell.children[0].style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
        };
        var className = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (var i = 0; i < className.length; i++) {
            var headerCells = [].slice.call(this.element.querySelectorAll(className[i]));
            if (headerCells.length > 0) {
                headerCells.forEach(function (element) {
                    element.children[0].style[_this.parent.enableRtl ? 'right' : 'left'] = '';
                });
                applyLeft(headerCells, this.parent.enableRtl);
            }
        }
    };
    ViewBase.prototype.addAttributes = function (td, element) {
        if (td.template) {
            append(td.template, element);
        }
        if (td.colSpan) {
            element.setAttribute('colspan', td.colSpan.toString());
        }
        if (td.className) {
            addClass([element], td.className);
        }
    };
    ViewBase.prototype.getHeaderBarHeight = function () {
        var headerBarHeight = 2;
        if (this.parent.headerModule) {
            headerBarHeight += getOuterHeight(this.parent.headerModule.getHeaderElement());
        }
        if (this.parent.uiStateValues.isGroupAdaptive) {
            var resHeader = this.parent.element.querySelector('.' + RESOURCE_HEADER_TOOLBAR);
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    };
    ViewBase.prototype.renderPanel = function (type) {
        if (type === PREVIOUS_PANEL_CLASS) {
            prepend([this.element], this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS));
        }
        else {
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.element);
        }
    };
    ViewBase.prototype.setPanel = function (panel) {
        this.element = panel;
    };
    ViewBase.prototype.getPanel = function () {
        return this.element;
    };
    ViewBase.prototype.getDatesHeaderElement = function () {
        return this.element.querySelector('.' + DATE_HEADER_CONTAINER_CLASS);
    };
    ViewBase.prototype.adjustEventWrapper = function () {
        // Here adjust the events wrapper width based in work cells
    };
    ViewBase.prototype.getDateSlots = function (renderDates, workDays) {
        // Here getDateSlots only need in vertical and month views
        return [];
    };
    ViewBase.prototype.generateColumnLevels = function () {
        // Here generateColumnLevels only need in vertical and month views
        return [];
    };
    ViewBase.prototype.getColumnLevels = function () {
        return this.colLevels;
    };
    ViewBase.prototype.highlightCurrentTime = function () {
        // Here showTimeIndicator functionalities
    };
    ViewBase.prototype.startDate = function () {
        return this.renderDates[0];
    };
    ViewBase.prototype.endDate = function () {
        return addDays(this.renderDates[this.renderDates.length - 1], 1);
    };
    ViewBase.prototype.getStartHour = function () {
        var startHour = this.parent.globalize.parseDate(this.parent.activeViewOptions.startHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        if (isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    };
    ViewBase.prototype.getEndHour = function () {
        var endHour = this.parent.globalize.parseDate(this.parent.activeViewOptions.endHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        if (isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    };
    ViewBase.prototype.isCurrentDate = function (date) {
        return date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    };
    ViewBase.prototype.isCurrentMonth = function (date) {
        return date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth();
    };
    ViewBase.prototype.isWorkDay = function (date, workDays) {
        if (workDays === void 0) { workDays = this.parent.activeViewOptions.workDays; }
        if (workDays.indexOf(date.getDay()) >= 0) {
            return true;
        }
        return false;
    };
    ViewBase.prototype.isWorkHour = function (date, startHour, endHour, workDays) {
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour)) {
            return false;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        if (getDateInMs(date) < getDateInMs(startHour) || getDateInMs(date) >= getDateInMs(endHour) || !this.isWorkDay(date, workDays)) {
            return false;
        }
        return true;
    };
    ViewBase.prototype.getRenderDates = function (workDays) {
        var renderDates = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.currentView === 'Week' || this.parent.currentView === 'TimelineWeek') {
            var selectedDate = resetTime(this.parent.selectedDate);
            var start = getWeekFirstDate(selectedDate, this.parent.firstDayOfWeek);
            for (var i = 0, length_1 = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_1; i++) {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                }
                else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = addDays(start, 1);
            }
        }
        else if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek') {
            var start = getWeekFirstDate(resetTime(this.parent.selectedDate), this.parent.firstDayOfWeek);
            for (var i = 0, length_2 = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_2; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = addDays(start, 1);
            }
        }
        else {
            for (var i = 0, length_3 = this.parent.activeViewOptions.interval; i < length_3; i++) {
                renderDates.push(addDays(resetTime(this.parent.selectedDate), i));
            }
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    };
    ViewBase.prototype.getNextPreviousDate = function (type) {
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            var daysCount = (type === 'next') ? this.parent.activeViewOptions.interval : -(this.parent.activeViewOptions.interval);
            if (this.parent.activeViewOptions.showWeekend) {
                return addDays(this.parent.selectedDate, daysCount);
            }
            else {
                var date = addDays(this.parent.selectedDate, daysCount);
                while (!this.isWorkDay(date)) {
                    date = addDays(date, daysCount);
                }
                return date;
            }
        }
        if (type === 'next') {
            return addDays(this.parent.selectedDate, WEEK_LENGTH * this.parent.activeViewOptions.interval);
        }
        else {
            return addDays(this.parent.selectedDate, -WEEK_LENGTH * this.parent.activeViewOptions.interval);
        }
    };
    ViewBase.prototype.getLabelText = function (view) {
        return this.parent.localeObj.getConstant(view) + ' of ' + this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'long', calendar: this.parent.getCalendarMode() });
    };
    ViewBase.prototype.getDateRangeText = function () {
        if (this.parent.isAdaptive) {
            return this.parent.globalize.
                formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
        }
        return this.formatDateRange(this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
    };
    ViewBase.prototype.formatDateRange = function (startDate, endDate) {
        var globalize = this.parent.globalize;
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (!endDate) {
                return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() });
            }
            return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() }) + ' - ' +
                globalize.
                    formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() });
        }
        var formattedStr;
        var longDateFormat;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            longDateFormat = getValue('dateFormats.long', getDefaultDateObject());
        }
        else {
            longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.' + this.parent.getCalendarMode() + '.dateFormats.long', cldrData);
        }
        if (!endDate) {
            return globalize.formatDate(startDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() });
        }
        var dateFormat = longDateFormat.trim().toLocaleLowerCase();
        if (dateFormat.substr(0, 1) === 'd') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMMM yyyy', calendar: this.parent.getCalendarMode() });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd MMM', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() });
                }
            }
            else {
                formattedStr = globalize.formatDate(startDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() });
            }
        }
        else if (dateFormat.substr(0, 1) === 'm') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMMM dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd, yyyy', calendar: this.parent.getCalendarMode() });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMM dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() });
                }
            }
            else {
                formattedStr = globalize.
                    formatDate(startDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() });
            }
        }
        else {
            formattedStr = globalize.formatDate(startDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() }) + ' - ' +
                globalize.formatDate(endDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() });
        }
        return formattedStr;
    };
    ViewBase.prototype.getMobileDateElement = function (date, className) {
        var wrap = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(date, { format: 'd', calendar: this.parent.getCalendarMode() }) + '</div>' + '<div class="e-m-day">' +
                this.parent.globalize.formatDate(date, { format: 'E', calendar: this.parent.getCalendarMode() }) + '</div>'
        });
        return wrap;
    };
    ViewBase.prototype.setResourceHeaderContent = function (tdElement, tdData, className) {
        if (className === void 0) { className = 'e-text-ellipsis'; }
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            var data = {
                resource: tdData.resource,
                resourceData: tdData.resourceData
            };
            append(this.parent.getResourceHeaderTemplate()(data), tdElement);
        }
        else {
            tdElement.appendChild(createElement('div', {
                className: className, innerHTML: tdData.resourceData[tdData.resource.textField]
            }));
        }
    };
    ViewBase.prototype.renderResourceMobileLayout = function () {
        if (this.parent.resourceBase.lastResourceLevel && this.parent.resourceBase.lastResourceLevel.length <= 0) {
            return;
        }
        this.parent.resourceBase.renderResourceHeader();
        this.parent.resourceBase.renderResourceTree();
    };
    return ViewBase;
}());

/**
 * Work cell interactions
 */
var WorkCellInteraction = /** @__PURE__ @class */ (function () {
    function WorkCellInteraction(parent) {
        this.parent = parent;
    }
    WorkCellInteraction.prototype.cellMouseDown = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.notify(cellMouseDown, { event: e });
    };
    WorkCellInteraction.prototype.cellClick = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        var queryStr = '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + HEADER_CELLS_CLASS;
        var target = closest(e.target, queryStr);
        if (isNullOrUndefined(target)) {
            return;
        }
        if (!isNullOrUndefined(closest(e.target, '.' + NEW_EVENT_CLASS))) {
            this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
            return;
        }
        var navigateEle = closest(e.target, '.' + NAVIGATE_CLASS);
        var navigateView = this.parent.getNavigateView();
        var sameView = this.parent.currentView === navigateView;
        if (isNullOrUndefined(navigateEle) || sameView ||
            isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly) {
                this.parent.quickPopup.quickPopupHide();
                return;
            }
            var isWorkCell = target.classList.contains(WORK_CELLS_CLASS) ||
                target.classList.contains(ALLDAY_CELLS_CLASS);
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            var args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(cellClick, args);
            if (args.cancel) {
                return;
            }
            if (isWorkCell) {
                this.parent.selectCell(target);
            }
            this.parent.notify(cellClick, args);
        }
        else {
            var date = this.parent.getDateFromElement(target);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView());
            }
        }
    };
    WorkCellInteraction.prototype.cellDblClick = function (e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        var args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellDoubleClick' });
        this.parent.trigger(cellDoubleClick, args);
        if (args.cancel) {
            return;
        }
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    };
    WorkCellInteraction.prototype.isPreventAction = function (e) {
        if (closest(e.target, '.' + NAVIGATE_CLASS)) {
            return false;
        }
        if (closest(e.target, '.' + APPOINTMENT_WRAPPER_CLASS) &&
            !closest(e.target, '.' + MORE_INDICATOR_CLASS)) {
            return true;
        }
        var target = closest(e.target, '.' + APPOINTMENT_CLASS + ',.' + RESOURCE_GROUP_CELLS_CLASS);
        if (!isNullOrUndefined(target)) {
            return true;
        }
        target = closest(e.target, '.' + HEADER_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    };
    return WorkCellInteraction;
}());

var __extends$15 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Vertical view appointment rendering
 */
var VerticalEvent = /** @__PURE__ @class */ (function (_super) {
    __extends$15(VerticalEvent, _super);
    /**
     * Constructor for vertical view
     */
    function VerticalEvent(parent) {
        var _this = _super.call(this, parent) || this;
        _this.dateRender = [];
        _this.renderedEvents = [];
        _this.renderedAllDayEvents = [];
        _this.overlapEvents = [];
        _this.moreEvents = [];
        _this.overlapList = [];
        _this.allDayEvents = [];
        _this.slotCount = _this.parent.activeViewOptions.timeScale.slotCount;
        _this.interval = _this.parent.activeViewOptions.timeScale.interval;
        _this.allDayLevel = 0;
        _this.startHour = _this.parent.activeView.getStartHour();
        _this.endHour = _this.parent.activeView.getEndHour();
        _this.element = _this.parent.activeView.getPanel();
        _this.fields = _this.parent.eventFields;
        _this.animation = new Animation({ progress: _this.animationUiUpdate.bind(_this) });
        _this.addEventListener();
        return _this;
    }
    VerticalEvent.prototype.renderAppointments = function () {
        var wrapperElements = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS +
            ',.' + APPOINTMENT_CLASS + ',.' + ROW_COUNT_WRAPPER_CLASS));
        wrapperElements.forEach(function (element) { return remove(element); });
        if (!this.element.querySelector('.' + WORK_CELLS_CLASS)) {
            return;
        }
        this.allDayElement = [].slice.call(this.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS));
        this.setAllDayRowHeight(0);
        if (this.parent.eventsProcessed.length === 0 && this.parent.blockProcessed.length === 0) {
            return;
        }
        var expandCollapse = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
        EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        this.renderedEvents = [];
        this.renderedAllDayEvents = [];
        this.initializeValues();
        this.processBlockEvents();
        this.renderEvents('normalEvents');
        if (this.allDayEvents.length > 0) {
            this.allDayEvents = this.allDayEvents.filter(function (item, index, arr) {
                return index === arr.map(function (item) { return item.Guid; }).indexOf(item.Guid);
            });
            removeClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
            this.slots.push(this.parent.activeView.renderDates.map(function (date) { return +date; }));
            this.renderEvents('allDayEvents');
        }
        this.parent.notify(contentReady, {});
        addClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
    };
    VerticalEvent.prototype.initializeValues = function () {
        var _this = this;
        this.resources = (this.parent.activeViewOptions.group.resources.length > 0) ? this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel : [];
        this.cellHeight = this.element.querySelector('.' + WORK_CELLS_CLASS).offsetHeight;
        this.dateRender[0] = this.parent.activeView.renderDates;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.resources.forEach(function (resource, index) { return _this.dateRender[index] = resource.renderDates; });
        }
    };
    VerticalEvent.prototype.isValidEvent = function (eventObj, start, end, schedule) {
        var isHourRange = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        var isSameRange = schedule.startHour.getTime() <= start.getTime() &&
            eventObj[this.fields.startTime].getTime() >= schedule.startHour.getTime() &&
            eventObj[this.fields.endTime].getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    };
    VerticalEvent.prototype.getHeight = function (start, end) {
        var appHeight = (end.getTime() - start.getTime()) / (60 * 1000) * (this.cellHeight * this.slotCount) / this.interval;
        appHeight = (appHeight < this.cellHeight) ? this.cellHeight : appHeight;
        return appHeight;
    };
    VerticalEvent.prototype.appendEvent = function (eventObj, appointmentElement, index, appLeft) {
        var appointmentWrap = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_WRAPPER_CLASS));
        if (this.parent.enableRtl) {
            setStyleAttribute(appointmentElement, { 'right': appLeft });
        }
        else {
            setStyleAttribute(appointmentElement, { 'left': appLeft });
        }
        var eventType = appointmentElement.classList.contains(BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        var args = { data: eventObj, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(eventRendered, args);
        if (args.cancel) {
            return;
        }
        appointmentWrap[index].appendChild(appointmentElement);
    };
    VerticalEvent.prototype.processBlockEvents = function () {
        var resources = this.getResourceList();
        var dateCount = 0;
        for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
            var resource = resources_1[_i];
            var renderDates = this.dateRender[resource];
            for (var day = 0, length_1 = renderDates.length; day < length_1; day++) {
                var startDate = new Date(renderDates[day].getTime());
                var endDate = addDays(renderDates[day], 1);
                var filterEvents = this.filterEvents(startDate, endDate, this.parent.blockProcessed, this.resources[resource]);
                for (var _a = 0, filterEvents_1 = filterEvents; _a < filterEvents_1.length; _a++) {
                    var event_1 = filterEvents_1[_a];
                    if (this.parent.resourceBase) {
                        this.setValues(event_1, resource);
                    }
                    this.renderBlockEvents(event_1, day, resource, dateCount);
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    };
    VerticalEvent.prototype.renderBlockEvents = function (eventObj, dayIndex, resource, dayCount) {
        var spannedData = this.isSpannedEvent(eventObj, dayIndex, resource);
        var eStart = spannedData[this.fields.startTime];
        var eEnd = spannedData[this.fields.endTime];
        var currentDate = resetTime(new Date(this.dateRender[resource][dayIndex].getTime()));
        var schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        if (eStart <= eEnd && this.isValidEvent(eventObj, eStart, eEnd, schedule)) {
            var blockTop = void 0;
            var blockHeight = void 0;
            if (spannedData[this.fields.isAllDay]) {
                var contentWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
                blockHeight = formatUnit(contentWrap.offsetHeight);
                blockTop = formatUnit(0);
            }
            else {
                blockHeight = formatUnit(this.getHeight(eStart, eEnd));
                blockTop = formatUnit(this.getTopValue(eStart, dayIndex, resource));
            }
            var appointmentElement = this.createBlockAppointmentElement(eventObj, resource);
            setStyleAttribute(appointmentElement, { 'width': '100%', 'height': blockHeight, 'top': blockTop });
            var index = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
            this.appendEvent(eventObj, appointmentElement, index, '0px');
        }
    };
    VerticalEvent.prototype.renderEvents = function (eventType) {
        removeClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
        var eventCollection = (eventType === 'allDayEvents') ? this.sortByDateTime(this.allDayEvents) : undefined;
        var resources = this.getResourceList();
        var dateCount = 0;
        for (var _i = 0, resources_2 = resources; _i < resources_2.length; _i++) {
            var resource = resources_2[_i];
            var renderDates = this.dateRender[resource];
            for (var day = 0, length_2 = renderDates.length; day < length_2; day++) {
                this.renderedEvents = [];
                var startDate = new Date(renderDates[day].getTime());
                var endDate = addDays(renderDates[day], 1);
                var filterEvents = this.filterEvents(startDate, endDate, eventCollection, this.resources[resource]);
                for (var _a = 0, filterEvents_2 = filterEvents; _a < filterEvents_2.length; _a++) {
                    var event_2 = filterEvents_2[_a];
                    if (this.parent.resourceBase) {
                        this.setValues(event_2, resource);
                    }
                    if (eventType === 'allDayEvents') {
                        this.renderAllDayEvents(event_2, day, resource, dateCount);
                    }
                    else {
                        if (this.isAllDayAppointment(event_2)) {
                            this.allDayEvents.push(extend({}, event_2, null, true));
                        }
                        else {
                            this.renderNormalEvents(event_2, day, resource, dateCount);
                        }
                    }
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    };
    VerticalEvent.prototype.setValues = function (event, resourceIndex) {
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.cssClass = this.resources[resourceIndex].cssClass;
            this.groupOrder = this.resources[resourceIndex].groupOrder;
        }
        else {
            this.cssClass = this.parent.resourceBase.getCssClass(event);
        }
    };
    VerticalEvent.prototype.getResourceList = function () {
        var resources = Array.apply(null, {
            length: (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) ?
                this.resources.length : 1
        }).map(function (value, index) { return index; });
        return resources;
    };
    VerticalEvent.prototype.createAppointmentElement = function (record, isAllDay, data, resource) {
        var fieldMapping = this.parent.eventFields;
        var recordSubject = (record[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default);
        var appointmentWrapper = createElement('div', {
            className: APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[fieldMapping.id],
                'data-guid': record.Guid,
                'role': 'button',
                'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record),
                'aria-selected': 'false',
                'aria-grabbed': 'true',
                'aria-label': recordSubject
            }
        });
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        var appointmentDetails = createElement('div', { className: APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var resourceIndex = this.parent.isAdaptive ? this.parent.uiStateValues.groupIndex : resource;
            appointmentWrapper.setAttribute('data-group-index', resourceIndex.toString());
        }
        var templateElement;
        var eventData = data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            var appointmentSubject = createElement('div', { className: SUBJECT_CLASS, innerHTML: recordSubject });
            if (isAllDay) {
                if (record[fieldMapping.isAllDay]) {
                    templateElement = [appointmentSubject];
                }
                else {
                    templateElement = [];
                    var appointmentStartTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.startTime])
                    });
                    var appointmentEndTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.endTime]),
                    });
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            }
            else {
                var timeStr = this.parent.getTimeString(record[fieldMapping.startTime]) + ' - ' +
                    this.parent.getTimeString(record[fieldMapping.endTime]);
                var appointmentTime = createElement('div', {
                    className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                    innerHTML: timeStr,
                });
                var appointmentLocation = createElement('div', {
                    className: LOCATION_CLASS,
                    innerHTML: (record[fieldMapping.location] || this.parent.eventSettings.fields.location.default || '')
                });
                templateElement = [appointmentSubject, appointmentTime, appointmentLocation];
            }
        }
        append(templateElement, appointmentDetails);
        if (!this.parent.isAdaptive &&
            (!isNullOrUndefined(record[fieldMapping.recurrenceRule]) || !isNullOrUndefined(record[fieldMapping.recurrenceID]))) {
            var iconClass = (record[fieldMapping.id] === record[fieldMapping.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            var recurrenceIcon = createElement('div', { className: ICON + ' ' + iconClass });
            isAllDay ? appointmentDetails.appendChild(recurrenceIcon) : appointmentWrapper.appendChild(recurrenceIcon);
        }
        this.renderSpannedIcon(isAllDay ? appointmentDetails : appointmentWrapper, eventData);
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        this.applyResourceColor(appointmentWrapper, record, 'backgroundColor', this.groupOrder);
        this.renderResizeHandler(appointmentWrapper, eventData, record[this.fields.isReadonly]);
        return appointmentWrapper;
    };
    VerticalEvent.prototype.createMoreIndicator = function (allDayRow, count, currentDay) {
        var index = currentDay + count;
        var countWrapper = allDayRow[index];
        if (countWrapper.childElementCount <= 0) {
            var innerCountWrap = createElement('div', {
                className: ROW_COUNT_WRAPPER_CLASS,
                id: ROW_COUNT_WRAPPER_CLASS + '-' + index.toString()
            });
            var moreIndicatorElement = createElement('div', {
                className: MORE_INDICATOR_CLASS,
                attrs: { 'tabindex': '0', 'data-index': index.toString(), 'data-count': '1' },
                innerHTML: '+1&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'))
            });
            innerCountWrap.appendChild(moreIndicatorElement);
            countWrapper.appendChild(innerCountWrap);
            EventHandler.add(moreIndicatorElement, 'click', this.rowExpandCollapse, this);
        }
        else {
            var countCell = countWrapper.querySelector('.' + MORE_INDICATOR_CLASS);
            var moreCount = parseInt(countCell.getAttribute('data-count'), 10) + 1;
            countCell.setAttribute('data-count', moreCount.toString());
            countCell.innerHTML = '+' + moreCount + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'));
        }
    };
    VerticalEvent.prototype.renderSpannedIcon = function (element, spanEvent) {
        var iconElement = createElement('div', { className: EVENT_INDICATOR_CLASS + ' ' + ICON });
        if (spanEvent.isLeft) {
            var iconLeft = iconElement.cloneNode();
            addClass([iconLeft], EVENT_ICON_LEFT_CLASS);
            prepend([iconLeft], element);
        }
        if (spanEvent.isRight) {
            var iconRight = iconElement.cloneNode();
            addClass([iconRight], EVENT_ICON_RIGHT_CLASS);
            append([iconRight], element);
        }
        if (spanEvent.isTop) {
            var iconTop = iconElement.cloneNode();
            addClass([iconTop], EVENT_ICON_UP_CLASS);
            prepend([iconTop], element);
        }
        if (spanEvent.isBottom) {
            var iconBottom = iconElement.cloneNode();
            addClass([iconBottom], EVENT_ICON_DOWN_CLASS);
            append([iconBottom], element);
        }
    };
    VerticalEvent.prototype.isSpannedEvent = function (record, day, resource) {
        var currentDate = resetTime(this.dateRender[resource][day]);
        var fieldMapping = this.parent.eventFields;
        var startEndHours = getStartEndHours(currentDate, this.startHour, this.endHour);
        var event = extend({}, record, null, true);
        event.isSpanned = { isBottom: false, isTop: false };
        if (record[fieldMapping.startTime].getTime() < startEndHours.startHour.getTime()) {
            event[fieldMapping.startTime] = startEndHours.startHour;
            event.isSpanned.isTop = true;
        }
        if (record[fieldMapping.endTime].getTime() > startEndHours.endHour.getTime()) {
            event[fieldMapping.endTime] = startEndHours.endHour;
            event.isSpanned.isBottom = true;
        }
        return event;
    };
    VerticalEvent.prototype.renderAllDayEvents = function (eventObj, dayIndex, resource, dayCount) {
        var _this = this;
        var currentDates = this.dateRender[resource];
        if (this.parent.activeViewOptions.group.byDate) {
            this.slots[0] = [this.dateRender[resource][dayIndex].getTime()];
            currentDates = [this.dateRender[resource][dayIndex]];
        }
        var record = this.splitEvent(eventObj, currentDates)[0];
        var allDayRowCell = this.element.querySelector('.' + ALLDAY_CELLS_CLASS + ':first-child');
        var cellTop = allDayRowCell.offsetTop;
        var eStart = new Date(record[this.parent.eventFields.startTime].getTime());
        var eEnd = new Date(record[this.parent.eventFields.endTime].getTime());
        var appWidth = 0;
        var topValue = 1;
        var isDateRange = currentDates[0].getTime() <= eStart.getTime() &&
            addDays(currentDates.slice(-1)[0], 1).getTime() >= eStart.getTime();
        if (eStart <= eEnd && isDateRange) {
            var isAlreadyRendered = [];
            if (this.renderedAllDayEvents[resource]) {
                isAlreadyRendered = this.renderedAllDayEvents[resource].filter(function (event) {
                    return event.Guid === eventObj.Guid;
                });
                if (this.parent.activeViewOptions.group.byDate) {
                    isAlreadyRendered = isAlreadyRendered.filter(function (event) {
                        return event[_this.parent.eventFields.startTime] >= currentDates[dayIndex] &&
                            event[_this.parent.eventFields.endTime] <= addDays(new Date(+currentDates[dayIndex]), 1);
                    });
                }
            }
            if (isAlreadyRendered.length === 0) {
                var allDayDifference = record.data.count;
                var allDayIndex = this.getOverlapIndex(record, dayIndex, true, resource);
                record.Index = allDayIndex;
                this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
                var widthAdjustment = record.data.isRight ? 0 :
                    this.parent.currentView === 'Day' ? 4 : 7;
                if (allDayDifference >= 0) {
                    appWidth = (allDayDifference * 100) - widthAdjustment;
                }
                if (isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                    this.renderedAllDayEvents[resource] = [];
                }
                this.renderedAllDayEvents[resource].push(extend({}, record, null, true));
                var allDayRow = [].slice.call(this.element.querySelector('.' + ALLDAY_ROW_CLASS).children);
                var wIndex = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
                var eventWrapper = this.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS +
                    ':nth-child(' + (wIndex + 1) + ')');
                var appointmentElement = this.createAppointmentElement(eventObj, true, record.data, resource);
                addClass([appointmentElement], ALLDAY_APPOINTMENT_CLASS);
                var args = { data: eventObj, element: appointmentElement, cancel: false };
                this.parent.trigger(eventRendered, args);
                if (args.cancel) {
                    return;
                }
                eventWrapper.appendChild(appointmentElement);
                var appHeight = appointmentElement.offsetHeight;
                topValue += (allDayIndex === 0 ? cellTop : (cellTop + (allDayIndex * appHeight))) + 1;
                setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': topValue + 'px' });
                if (allDayIndex > 1) {
                    this.moreEvents.push(appointmentElement);
                    for (var count = 0, length_3 = allDayDifference; count < length_3; count++) {
                        this.createMoreIndicator(allDayRow, count, wIndex);
                    }
                }
                allDayRowCell.setAttribute('data-count', this.allDayLevel.toString());
                var allDayRowHeight = ((!this.parent.uiStateValues.expand && this.allDayLevel > 2) ?
                    (3 * appHeight) : ((this.allDayLevel + 1) * appHeight)) + 4;
                this.setAllDayRowHeight(allDayRowHeight);
                this.addOrRemoveClass();
                this.wireAppointmentEvents(appointmentElement, true, eventObj);
            }
        }
    };
    VerticalEvent.prototype.renderNormalEvents = function (eventObj, dayIndex, resource, dayCount) {
        var record = this.isSpannedEvent(eventObj, dayIndex, resource);
        var eStart = record[this.fields.startTime];
        var eEnd = record[this.fields.endTime];
        var appWidth = '0%';
        var appLeft = '0%';
        var topValue = 0;
        var currentDate = resetTime(new Date(this.dateRender[resource][dayIndex].getTime()));
        var schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        var isValidEvent = this.isValidEvent(eventObj, eStart, eEnd, schedule);
        if (eStart <= eEnd && isValidEvent) {
            var appHeight = this.getHeight(eStart, eEnd);
            if (eStart.getTime() > schedule.startHour.getTime()) {
                topValue = this.getTopValue(eStart, dayIndex, resource);
            }
            var appIndex = this.getOverlapIndex(record, dayIndex, false, resource);
            record.Index = appIndex;
            this.overlapList.push(record);
            if (this.overlapList.length > 1) {
                if (isNullOrUndefined(this.overlapEvents[appIndex])) {
                    this.overlapEvents[appIndex] = [];
                }
                this.overlapEvents[appIndex].push(record);
            }
            else {
                this.overlapEvents = [];
                this.overlapEvents.push([record]);
            }
            var width = this.parent.currentView === 'Day' ? 97 : 94;
            appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
            var argsData = {
                index: appIndex, left: appLeft, width: appWidth,
                day: dayIndex, dayIndex: dayCount, record: record, resource: resource
            };
            var tempData = this.adjustOverlapElements(argsData);
            appWidth = (tempData.appWidth);
            if (isNullOrUndefined(this.renderedEvents[resource])) {
                this.renderedEvents[resource] = [];
            }
            this.renderedEvents[resource].push(extend({}, record, null, true));
            var appointmentElement = this.createAppointmentElement(eventObj, false, record.isSpanned, resource);
            setStyleAttribute(appointmentElement, { 'width': tempData.appWidth, 'height': appHeight + 'px', 'top': topValue + 'px' });
            var iconHeight = appointmentElement.querySelectorAll('.' + EVENT_INDICATOR_CLASS).length * 15;
            var maxHeight = appHeight - 40 - iconHeight;
            var subjectElement = appointmentElement.querySelector('.' + SUBJECT_CLASS);
            if (!this.parent.isAdaptive && subjectElement) {
                subjectElement.style.maxHeight = formatUnit(maxHeight);
            }
            var index = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
            this.appendEvent(eventObj, appointmentElement, index, tempData.appLeft);
            this.wireAppointmentEvents(appointmentElement, false, eventObj);
        }
    };
    VerticalEvent.prototype.getTopValue = function (date, day, resource) {
        var startEndHours = getStartEndHours(resetTime(this.dateRender[resource][day]), this.startHour, this.endHour);
        var startHour = startEndHours.startHour;
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.cellHeight * this.slotCount) / this.interval;
    };
    VerticalEvent.prototype.getOverlapIndex = function (record, day, isAllDay, resource) {
        var _this = this;
        var fieldMapping = this.parent.eventFields;
        var predicate;
        var eventsList = [];
        var appIndex = -1;
        this.overlapEvents = [];
        if (isAllDay) {
            if (!isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                var date_1 = resetTime(new Date(this.dateRender[resource][day].getTime()));
                eventsList = this.renderedAllDayEvents[resource].filter(function (app) {
                    return resetTime(app[fieldMapping.startTime]).getTime() <= date_1.getTime() &&
                        resetTime(app[fieldMapping.endTime]).getTime() >= date_1.getTime();
                });
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    eventsList = this.filterEventsByResource(this.resources[resource], eventsList);
                }
            }
        }
        else {
            var appointmentList_1 = !isNullOrUndefined(this.renderedEvents[resource]) ? this.renderedEvents[resource] : [];
            var appointment_1 = [];
            predicate = new Predicate(fieldMapping.endTime, 'greaterthan', record[fieldMapping.startTime]).
                and(new Predicate(fieldMapping.startTime, 'lessthan', record[fieldMapping.endTime]));
            this.overlapList = new DataManager({ json: appointmentList_1 }).executeLocal(new Query().where(predicate));
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                this.overlapList = this.filterEventsByResource(this.resources[resource], this.overlapList);
            }
            this.overlapList.forEach(function (obj) {
                predicate = new Predicate(fieldMapping.endTime, 'greaterthanorequal', obj[fieldMapping.startTime]).
                    and(new Predicate(fieldMapping.startTime, 'lessthanorequal', obj[fieldMapping.endTime]));
                var filterList = new DataManager({ json: appointmentList_1 }).executeLocal(new Query().where(predicate));
                if (_this.parent.activeViewOptions.group.resources.length > 0) {
                    filterList = _this.filterEventsByResource(_this.resources[resource], filterList);
                }
                var collection = _this.overlapList.filter(function (val) { return filterList.indexOf(val) === -1; });
                return appointment_1.concat(collection);
            });
            this.overlapList = this.overlapList.concat(appointment_1);
            eventsList = this.overlapList;
            for (var _i = 0, eventsList_1 = eventsList; _i < eventsList_1.length; _i++) {
                var event_3 = eventsList_1[_i];
                var record_1 = event_3;
                var index = record_1.Index;
                (isNullOrUndefined(this.overlapEvents[index])) ? this.overlapEvents[index] = [event_3] :
                    this.overlapEvents[index].push(event_3);
            }
        }
        if (eventsList.length > 0) {
            var appLevel = eventsList.map(function (obj) { return obj.Index; });
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    };
    VerticalEvent.prototype.adjustOverlapElements = function (args) {
        var data = { appWidth: args.width, appLeft: args.left };
        for (var i = 0, length1 = this.overlapEvents.length; i < length1; i++) {
            if (!isNullOrUndefined(this.overlapEvents[i])) {
                for (var j = 0, length2 = this.overlapEvents[i].length; j < length2; j++) {
                    var dayCount = this.parent.activeViewOptions.group.byDate ? (this.resources.length * args.day) + args.resource :
                        args.dayIndex;
                    var element = this.element.querySelector('#e-appointment-wrapper-' + dayCount);
                    if (element.childElementCount > 0) {
                        var eleGuid = this.overlapEvents[i][j].Guid;
                        if (element.querySelectorAll('div[data-guid="' + eleGuid + '"]').length > 0 && eleGuid !== args.record.Guid) {
                            var apps = element.querySelector('div[data-guid="' + eleGuid + '"]');
                            if (parseFloat(args.width) <= parseFloat(apps.style.width)) {
                                (this.parent.enableRtl) ? apps.style.right = ((parseFloat(args.width) + 1) * i) + '%' :
                                    apps.style.left = ((parseFloat(args.width) + 1) * i) + '%';
                                apps.style.width = ((parseFloat(args.width))) + '%';
                                data.appWidth = apps.style.width;
                            }
                        }
                        else {
                            var appWidth = args.width;
                            if (isNullOrUndefined(this.overlapEvents[i - 1])) {
                                var width = this.parent.currentView === 'Day' ? 97 : 94;
                                appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
                            }
                            data.appWidth = appWidth;
                            data.appLeft = ((parseInt(appWidth, 0) + 1) * args.index) + '%';
                        }
                    }
                }
            }
        }
        return data;
    };
    VerticalEvent.prototype.setAllDayRowHeight = function (height) {
        for (var _i = 0, _a = this.allDayElement; _i < _a.length; _i++) {
            var element = _a[_i];
            element.style.height = (height / 12) + 'em';
        }
        this.animation.animate(this.allDayElement[0]);
    };
    VerticalEvent.prototype.addOrRemoveClass = function () {
        var _this = this;
        this.moreEvents.filter(function (element) {
            if (!_this.parent.uiStateValues.expand && _this.allDayLevel > 2) {
                addClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '-1');
            }
            else {
                removeClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '0');
            }
        });
        var moreEventCount = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        if (this.parent.uiStateValues.expand) {
            removeClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
            addClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
        }
        else {
            removeClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
            addClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
        }
        (this.allDayLevel > 2) ? removeClass([moreEventCount], DISABLE_CLASS) : addClass([moreEventCount], DISABLE_CLASS);
        var countCell = [].slice.call(this.element.querySelectorAll('.' + ROW_COUNT_WRAPPER_CLASS));
        countCell.filter(function (element) {
            (!_this.parent.uiStateValues.expand && _this.allDayLevel > 2) ? removeClass([element], DISABLE_CLASS) :
                addClass([element], DISABLE_CLASS);
        });
    };
    VerticalEvent.prototype.getEventHeight = function () {
        var eventElement = createElement('div', { className: APPOINTMENT_CLASS, styles: 'visibility:hidden' });
        var eventWrapper = this.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS + ':first-child');
        eventWrapper.appendChild(eventElement);
        var height = eventElement.offsetHeight;
        remove(eventElement);
        return height;
    };
    VerticalEvent.prototype.rowExpandCollapse = function () {
        var target = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        this.parent.uiStateValues.expand = target.classList.contains(APPOINTMENT_ROW_EXPAND_CLASS);
        var rowHeight;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', 'Collapse-all-day-section');
            target.setAttribute('aria-label', 'Collapse section');
            rowHeight = ((this.allDayLevel + 1) * this.getEventHeight()) + 4;
        }
        else {
            target.setAttribute('title', 'Expand-all-day-section');
            target.setAttribute('aria-label', 'Expand section');
            rowHeight = (3 * this.getEventHeight()) + 4;
        }
        this.setAllDayRowHeight(rowHeight);
        this.addOrRemoveClass();
        this.animation.animate(target);
    };
    VerticalEvent.prototype.animationUiUpdate = function () {
        this.parent.notify(contentReady, {});
    };
    return VerticalEvent;
}(EventBase));

var __extends$16 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EVENT_GAP = 0;
/**
 * Month view events render
 */
var MonthEvent = /** @__PURE__ @class */ (function (_super) {
    __extends$16(MonthEvent, _super);
    /**
     * Constructor for month events
     */
    function MonthEvent(parent) {
        var _this = _super.call(this, parent) || this;
        _this.renderedEvents = [];
        _this.moreIndicatorHeight = 19;
        _this.renderType = 'day';
        _this.element = _this.parent.activeView.getPanel();
        _this.fields = _this.parent.eventFields;
        _this.addEventListener();
        return _this;
    }
    MonthEvent.prototype.renderAppointments = function () {
        var appointmentWrapper = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_WRAPPER_CLASS));
        for (var _i = 0, appointmentWrapper_1 = appointmentWrapper; _i < appointmentWrapper_1.length; _i++) {
            var wrap = appointmentWrapper_1[_i];
            remove(wrap);
        }
        if (!this.element.querySelector('.' + WORK_CELLS_CLASS)) {
            return;
        }
        this.eventHeight = getElementHeightFromClass(this.element, APPOINTMENT_CLASS);
        if (this.parent.currentView === 'Month') {
            this.monthHeaderHeight = getOuterHeight(this.element.querySelector('.' + DATE_HEADER_CLASS));
        }
        else {
            this.monthHeaderHeight = 0;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.renderResourceEvents();
        }
        else {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays);
        }
    };
    MonthEvent.prototype.renderEventsHandler = function (dateRender, workDays, resData) {
        this.renderedEvents = [];
        var eventsList;
        var blockList;
        var resIndex = 0;
        if (resData) {
            resIndex = resData.groupIndex;
            this.cssClass = resData.cssClass;
            this.groupOrder = resData.groupOrder;
            eventsList = this.parent.eventBase.filterEventsByResource(resData, this.parent.eventsProcessed);
            blockList = this.parent.eventBase.filterEventsByResource(resData, this.parent.blockProcessed);
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        }
        else {
            eventsList = this.parent.eventsProcessed;
            blockList = this.parent.blockProcessed;
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
        }
        this.sortByDateTime(eventsList);
        this.sortByDateTime(blockList);
        this.cellWidth = this.workCells.slice(-1)[0].offsetWidth;
        this.cellHeight = this.workCells.slice(-1)[0].offsetHeight;
        this.dateRender = dateRender;
        this.getSlotDates(workDays);
        this.processBlockEvents(blockList, resIndex, resData);
        for (var _i = 0, eventsList_1 = eventsList; _i < eventsList_1.length; _i++) {
            var event_1 = eventsList_1[_i];
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event_1);
            }
            var splittedEvents = this.splitEvent(event_1, this.dateRender);
            for (var _a = 0, splittedEvents_1 = splittedEvents; _a < splittedEvents_1.length; _a++) {
                var event_2 = splittedEvents_1[_a];
                this.updateIndicatorIcon(event_2);
                this.renderEvents(event_2, resIndex);
            }
        }
        this.cssClass = null;
        this.groupOrder = null;
    };
    MonthEvent.prototype.processBlockEvents = function (blockEvents, resIndex, resData) {
        for (var _i = 0, blockEvents_1 = blockEvents; _i < blockEvents_1.length; _i++) {
            var event_3 = blockEvents_1[_i];
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event_3);
            }
            var blockSpannedList = [];
            if (this.renderType === 'day' && !event_3[this.fields.isAllDay]) {
                var temp = extend({}, event_3, null, true);
                var isSameDate = this.isSameDate(temp[this.fields.startTime], temp[this.fields.endTime]);
                temp.isBlockIcon = isSameDate;
                if (!isSameDate && getDateInMs(temp[this.fields.startTime]) > 0) {
                    var e = extend({}, event_3, null, true);
                    e[this.fields.endTime] = addDays(resetTime(new Date(event_3[this.fields.startTime] + '')), 1);
                    e.isBlockIcon = true;
                    temp[this.fields.startTime] = e[this.fields.endTime];
                    blockSpannedList.push(e);
                }
                isSameDate = this.isSameDate(temp[this.fields.startTime], temp[this.fields.endTime]);
                if (!isSameDate && getDateInMs(temp[this.fields.endTime]) > 0) {
                    var e = extend({}, event_3, null, true);
                    e[this.fields.startTime] = resetTime(new Date(event_3[this.fields.endTime] + ''));
                    e.isBlockIcon = true;
                    blockSpannedList.push(e);
                    temp[this.fields.endTime] = e[this.fields.startTime];
                }
                blockSpannedList.push(temp);
            }
            else {
                blockSpannedList.push(event_3);
            }
            for (var _a = 0, blockSpannedList_1 = blockSpannedList; _a < blockSpannedList_1.length; _a++) {
                var blockEvent = blockSpannedList_1[_a];
                var splittedEvents = this.splitEvent(blockEvent, this.dateRender);
                for (var _b = 0, splittedEvents_2 = splittedEvents; _b < splittedEvents_2.length; _b++) {
                    var event_4 = splittedEvents_2[_b];
                    this.renderBlockEvents(event_4, resIndex, !!blockEvent.isBlockIcon);
                }
            }
        }
    };
    MonthEvent.prototype.isSameDate = function (start, end) {
        return new Date(+start).setHours(0, 0, 0, 0) === new Date(+end).setHours(0, 0, 0, 0);
    };
    MonthEvent.prototype.renderBlockEvents = function (event, resIndex, isIcon) {
        var eventData = event.data;
        var startTime = this.getStartTime(event, eventData);
        var endTime = this.getEndTime(event, eventData);
        var day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        if (day < 0 || startTime > endTime) {
            return;
        }
        var cellTd = this.getCellTd(day);
        var position = this.getPosition(startTime, endTime, event[this.fields.isAllDay], day);
        if (!isIcon) {
            var diffInDays = eventData.count;
            var appWidth = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay], diffInDays);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth;
            var appLeft = (this.parent.enableRtl) ? 0 : position;
            var appRight = (this.parent.enableRtl) ? position : 0;
            var appHeight = this.cellHeight - this.monthHeaderHeight;
            var appTop = this.getRowTop(resIndex);
            var blockElement = this.createBlockAppointmentElement(event, resIndex);
            setStyleAttribute(blockElement, {
                'width': appWidth + 'px', 'height': appHeight + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
            });
            this.renderEventElement(event, blockElement, cellTd);
        }
        else {
            this.renderBlockIndicator(cellTd, position, resIndex);
        }
    };
    MonthEvent.prototype.renderBlockIndicator = function (cellTd, position, resIndex) {
        var blockIndicator = createElement('div', { className: 'e-icons ' + BLOCK_INDICATOR_CLASS });
        if (isNullOrUndefined(cellTd.querySelector('.' + BLOCK_INDICATOR_CLASS))) {
            cellTd.appendChild(blockIndicator);
        }
    };
    MonthEvent.prototype.getStartTime = function (event, eventData) {
        return event[this.fields.startTime];
    };
    MonthEvent.prototype.getEndTime = function (event, eventData) {
        return event[this.fields.endTime];
    };
    MonthEvent.prototype.getCellTd = function (day) {
        return this.workCells[day];
    };
    MonthEvent.prototype.getEventWidth = function (startDate, endDate, isAllDay, count) {
        return count * this.cellWidth - 1;
    };
    MonthEvent.prototype.getPosition = function (startTime, endTime, isAllDay, day) {
        return 0;
    };
    MonthEvent.prototype.getRowTop = function (resIndex) {
        return 0;
    };
    MonthEvent.prototype.updateIndicatorIcon = function (event) {
        if (this.parent.currentView.indexOf('Timeline') === -1 || this.parent.currentView === 'TimelineMonth'
            || event[this.fields.isAllDay]) {
            return;
        }
        var cloneData = event.data;
        var startHour = getStartEndHours(event[this.fields.startTime], this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        var endHour = getStartEndHours(event[this.fields.endTime], this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        cloneData.isLeft = cloneData.isLeft || cloneData[this.fields.startTime].getTime() < startHour.startHour.getTime();
        cloneData.isRight = cloneData.isRight || cloneData[this.fields.endTime].getTime() > endHour.endHour.getTime();
    };
    MonthEvent.prototype.renderResourceEvents = function () {
        var resources = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel;
        for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
            var slotData = resources_1[_i];
            this.renderEventsHandler(slotData.renderDates, slotData.workDays, slotData);
        }
    };
    MonthEvent.prototype.getSlotDates = function (workDays) {
        this.slots = [];
        var dates = this.dateRender.map(function (date) { return +date; });
        var noOfDays = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : workDays.length;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays));
        }
    };
    MonthEvent.prototype.createAppointmentElement = function (record, resIndex) {
        var eventSubject = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default);
        var appointmentWrapper = createElement('div', {
            className: APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid, 'role': 'button', 'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record), 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': eventSubject
            }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        var appointmentDetails = createElement('div', { className: APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        var templateElement;
        var eventData = record.data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            var eventLocation = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '');
            var appointmentSubject = createElement('div', {
                className: SUBJECT_CLASS,
                innerHTML: (eventSubject + (eventLocation ? ';&nbsp' + eventLocation : ''))
            });
            var appointmentStartTime = createElement('div', {
                className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.startTime])
            });
            var appointmentEndTime = createElement('div', {
                className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.endTime])
            });
            if (this.parent.currentView === 'Month') {
                if (record[this.fields.isAllDay]) {
                    templateElement = [appointmentSubject];
                    addClass([appointmentSubject], 'e-text-center');
                }
                else if (eventData.count <= 1 && !eventData.isLeft && !eventData.isRight) {
                    templateElement = [appointmentStartTime, appointmentSubject];
                }
                else {
                    templateElement = [];
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            }
            else {
                var innerElement = void 0;
                if (record[this.fields.isAllDay]) {
                    var allDayString = createElement('div', {
                        className: APPOINTMENT_TIME, innerHTML: this.parent.localeObj.getConstant('allDay')
                    });
                    innerElement = [appointmentSubject, allDayString];
                }
                else {
                    var timeString = this.parent.getTimeString(eventData[this.fields.startTime])
                        + ' - ' + this.parent.getTimeString(eventData[this.fields.endTime]);
                    var appTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''), innerHTML: timeString,
                    });
                    var appLocation = createElement('div', { className: LOCATION_CLASS, innerHTML: eventLocation });
                    innerElement = [appointmentSubject, appTime, appLocation];
                }
                var wrap = createElement('div', { className: 'e-inner-wrap' });
                append(innerElement, wrap);
                templateElement = [wrap];
            }
        }
        append(templateElement, appointmentDetails);
        this.appendEventIcons(record, appointmentDetails);
        this.renderResizeHandler(appointmentWrapper, record.data, record[this.fields.isReadonly]);
        return appointmentWrapper;
    };
    MonthEvent.prototype.appendEventIcons = function (record, appointmentDetails) {
        var eventData = record.data;
        if (!isNullOrUndefined(record[this.fields.recurrenceRule]) || !isNullOrUndefined(record[this.fields.recurrenceID])) {
            var iconClass = (record[this.fields.id] === record[this.fields.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appointmentDetails.appendChild(createElement('div', {
                className: ICON + ' ' + iconClass + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : '')
            }));
        }
        if (eventData.isLeft) {
            var iconLeft = createElement('div', {
                className: EVENT_INDICATOR_CLASS + ' ' + ICON + ' ' + EVENT_ICON_LEFT_CLASS
            });
            prepend([iconLeft], appointmentDetails);
        }
        if (eventData.isRight) {
            var iconRight = createElement('div', {
                className: EVENT_INDICATOR_CLASS + ' ' + ICON + ' ' + EVENT_ICON_RIGHT_CLASS
            });
            append([iconRight], appointmentDetails);
        }
    };
    MonthEvent.prototype.renderEvents = function (event, resIndex) {
        var startTime = event[this.fields.startTime];
        var endTime = event[this.fields.endTime];
        var day = this.parent.getIndexOfDate(this.dateRender, resetTime(startTime));
        if (day < 0) {
            return;
        }
        var overlapCount = this.getIndex(startTime);
        event.Index = overlapCount;
        var appHeight = this.eventHeight;
        this.renderedEvents.push(extend({}, event, null, true));
        var diffInDays = event.data.count;
        if (startTime.getTime() <= endTime.getTime()) {
            var appWidth = (diffInDays * this.cellWidth) - 3;
            var cellTd = this.workCells[day];
            var appTop = (overlapCount * (appHeight + EVENT_GAP));
            if (this.cellHeight > this.monthHeaderHeight + ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight) {
                var appointmentElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement, false, event);
                setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'top': appTop + 'px' });
                this.renderEventElement(event, appointmentElement, cellTd);
            }
            else {
                for (var i = 0; i < diffInDays; i++) {
                    var cellTd_1 = this.workCells[day + i];
                    if (cellTd_1 && isNullOrUndefined(cellTd_1.querySelector('.' + MORE_INDICATOR_CLASS))) {
                        var startDate = new Date(this.dateRender[day + i].getTime());
                        var endDate = addDays(this.dateRender[day + i], 1);
                        var groupIndex = cellTd_1.getAttribute('data-group-index');
                        var filterEvents = this.getFilteredEvents(startDate, endDate, groupIndex);
                        var appArea = this.cellHeight - this.monthHeaderHeight - this.moreIndicatorHeight;
                        var renderedAppCount = Math.floor(appArea / (appHeight + EVENT_GAP));
                        var count = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
                        var moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
                        if (!isNullOrUndefined(groupIndex)) {
                            moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                        }
                        moreIndicatorElement.style.top = appArea + 'px';
                        moreIndicatorElement.style.width = cellTd_1.offsetWidth - 2 + 'px';
                        this.renderElement(cellTd_1, moreIndicatorElement);
                        EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                    }
                }
            }
        }
    };
    MonthEvent.prototype.getFilteredEvents = function (startDate, endDate, groupIndex) {
        var filteredEvents;
        if (isNullOrUndefined(groupIndex)) {
            filteredEvents = this.filterEvents(startDate, endDate);
        }
        else {
            var data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            filteredEvents = this.filterEvents(startDate, endDate, undefined, data);
        }
        return filteredEvents;
    };
    MonthEvent.prototype.getOverlapEvents = function (date, appointments) {
        var appointmentsList = [];
        for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
            var app = appointments_1[_i];
            if ((resetTime(app[this.fields.startTime]).getTime() <= resetTime(date).getTime()) &&
                (resetTime(app[this.fields.endTime]).getTime() >= resetTime(date).getTime())) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    };
    MonthEvent.prototype.getIndex = function (date) {
        var appIndex = -1;
        var appointments = this.renderedEvents;
        if (appointments.length > 0) {
            var appointmentsList = this.getOverlapEvents(date, appointments);
            var appLevel = appointmentsList.map(function (obj) { return obj.Index; });
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    };
    MonthEvent.prototype.moreIndicatorClick = function (event) {
        var target = closest(event.target, '.' + MORE_INDICATOR_CLASS);
        var startDate = new Date(parseInt(target.getAttribute('data-start-date'), 10));
        if (!isNullOrUndefined(startDate) && this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: startDate }, true);
            this.parent.changeView(this.parent.getNavigateView());
        }
        else {
            var endDate = new Date(parseInt(target.getAttribute('data-end-date'), 10));
            var groupIndex = target.getAttribute('data-group-index');
            var filteredEvents = this.getFilteredEvents(startDate, endDate, groupIndex);
            var moreEventArgs = { date: startDate, event: filteredEvents, element: event.target };
            this.parent.quickPopup.moreEventClick(moreEventArgs, endDate, groupIndex);
        }
    };
    MonthEvent.prototype.renderEventElement = function (event, appointmentElement, cellTd) {
        var eventType = appointmentElement.classList.contains(BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        var args = { data: event, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(eventRendered, args);
        if (args.cancel) {
            this.renderedEvents.pop();
            return;
        }
        this.renderElement(cellTd, appointmentElement);
    };
    MonthEvent.prototype.renderElement = function (cellTd, element) {
        if (cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        }
        else {
            var wrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    };
    MonthEvent.prototype.getMoreIndicatorElement = function (count, startDate, endDate) {
        var moreIndicatorElement = createElement('div', {
            className: MORE_INDICATOR_CLASS,
            innerHTML: '+' + count + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more')),
            attrs: {
                'tabindex': '0',
                'data-start-date': startDate.getTime().toString(),
                'data-end-date': endDate.getTime().toString()
            }
        });
        return moreIndicatorElement;
    };
    return MonthEvent;
}(EventBase));

var __extends$14 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MAJOR_SLOT_TEMPLATE = '<span>${getTime(date)}</span>';
var MINOR_SLOT_TEMPLATE = '&nbsp;';
/**
 * vertical view
 */
var VerticalView = /** @__PURE__ @class */ (function (_super) {
    __extends$14(VerticalView, _super);
    /**
     * Constructor for vertical view
     */
    function VerticalView(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-day-view';
        _this.isInverseTableSelect = true;
        _this.baseCssClass = 'e-vertical-view';
        _this.dateHeaderTemplate = '<div class="e-header-day">${getDayName(date)}</div>' +
            '<div class="e-header-date e-navigate" role="link">${getDate(date)}</div>';
        _this.workCellAction = new WorkCellInteraction(parent);
        return _this;
    }
    VerticalView.prototype.addEventListener = function () {
        this.parent.on(scrollUiUpdate, this.scrollUiUpdate, this);
        this.parent.on(dataReady, this.renderEvents, this);
    };
    VerticalView.prototype.removeEventListener = function () {
        this.parent.off(scrollUiUpdate, this.scrollUiUpdate);
        this.parent.off(dataReady, this.renderEvents);
    };
    VerticalView.prototype.renderEvents = function () {
        if (this.parent.activeViewOptions.timeScale.enable) {
            var appointment = new VerticalEvent(this.parent);
            appointment.renderAppointments();
        }
        else {
            var appointment = new MonthEvent(this.parent);
            appointment.renderAppointments();
        }
    };
    VerticalView.prototype.onContentScroll = function (e) {
        this.parent.removeNewEventElement();
        var target = e.target;
        this.parent.notify(virtualScroll, e);
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.quickPopupHide();
        }
    };
    VerticalView.prototype.onApaptiveMove = function (e) {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    };
    VerticalView.prototype.onApaptiveScroll = function (e) {
        this.parent.removeNewEventElement();
        this.parent.uiStateValues.top = e.target.scrollTop;
    };
    VerticalView.prototype.scrollLeftPanel = function (target) {
        var leftPanel = this.getLeftPanelElement();
        if (!isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    };
    VerticalView.prototype.scrollUiUpdate = function (args) {
        var headerBarHeight = this.getHeaderBarHeight();
        var timecells = this.getLeftPanelElement();
        var content = this.getScrollableElement();
        var header = this.getDatesHeaderElement();
        var scrollerHeight = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setContentHeight(content, timecells, scrollerHeight);
        var scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        if (this.parent.uiStateValues.isInitial || this.isTimelineView()) {
            this.scrollToWorkHour();
            this.parent.uiStateValues.isInitial = this.isTimelineView();
        }
        else {
            content.scrollTop = this.parent.uiStateValues.top;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
    };
    VerticalView.prototype.setContentHeight = function (element, leftPanelElement, height) {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            element.style.height = formatUnit(height);
        }
        else {
            if (!isNullOrUndefined(leftPanelElement)) {
                leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(element));
            }
            element.style.height = formatUnit(height);
        }
    };
    VerticalView.prototype.scrollToWorkHour = function () {
        if (this.parent.workHours.highlight) {
            var firstWorkHourCell = this.element.querySelector('.' + WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getScrollableElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    };
    VerticalView.prototype.scrollToHour = function (hour) {
        var date = this.parent.globalize.parseDate(hour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollTop = this.getTopFromDateTime(date);
    };
    VerticalView.prototype.generateColumnLevels = function () {
        var level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        var columnLevels = [];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            columnLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                var resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                var resStartHour = resourceLevel.resourceData[resourceLevel.resource.startHourField];
                var resEndHour = resourceLevel.resourceData[resourceLevel.resource.endHourField];
                var dateSlots = this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays, resStartHour, resEndHour);
                columnLevels = [dateSlots];
            }
        }
        else {
            columnLevels.push(level);
        }
        this.colLevels = columnLevels;
        return columnLevels;
    };
    VerticalView.prototype.getDateSlots = function (renderDates, workDays, workStartHour, workEndHour) {
        if (workStartHour === void 0) { workStartHour = this.parent.workHours.start; }
        if (workEndHour === void 0) { workEndHour = this.parent.workHours.end; }
        var dateCol = [];
        var start = this.parent.globalize.parseDate(workStartHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        var end = this.parent.globalize.parseDate(workEndHour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        for (var _i = 0, renderDates_1 = renderDates; _i < renderDates_1.length; _i++) {
            var col = renderDates_1[_i];
            var classList$$1 = [HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateCol.push({
                date: col, type: 'dateHeader', className: classList$$1, colSpan: 1,
                workDays: workDays, startHour: new Date(+start), endHour: new Date(+end)
            });
        }
        return dateCol;
    };
    VerticalView.prototype.isWorkHourRange = function (date) {
        return (this.getStartHour().getTime() <= date.getTime()) && (this.getEndHour().getTime() >= date.getTime());
    };
    VerticalView.prototype.highlightCurrentTime = function () {
        var _this = this;
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return;
        }
        if (this.parent.showTimeIndicator && this.isWorkHourRange(new Date())) {
            var currentDateIndex = this.getCurrentTimeIndicatorIndex();
            if (currentDateIndex.length > 0) {
                this.changeCurrentTimePosition();
                if (isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                    this.currentTimeIndicatorTimer = window.setInterval(function () { _this.changeCurrentTimePosition(); }, MS_PER_MINUTE);
                }
            }
            else {
                this.clearCurrentTimeIndicatorTimer();
            }
        }
        else {
            this.clearCurrentTimeIndicatorTimer();
        }
    };
    VerticalView.prototype.getCurrentTimeIndicatorIndex = function () {
        var currentDateIndex = [];
        if (!isNullOrUndefined(this.parent.resourceBase) && (this.parent.activeViewOptions.group.resources.length > 0) &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            var count = 0;
            for (var _i = 0, _a = this.parent.resourceBase.lastResourceLevel; _i < _a.length; _i++) {
                var resource = _a[_i];
                var index = this.parent.getIndexOfDate(resource.renderDates, resetTime(new Date()));
                if (index >= 0) {
                    var resIndex = this.parent.activeViewOptions.group.byDate ?
                        (this.parent.resourceBase.lastResourceLevel.length * index) + count : count + index;
                    currentDateIndex.push(resIndex);
                }
                count += this.parent.activeViewOptions.group.byDate ? 1 : resource.renderDates.length;
            }
        }
        else {
            var renderDates = (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) ?
                this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex].renderDates : this.renderDates;
            var index = this.parent.getIndexOfDate(renderDates, resetTime(new Date()));
            if (index >= 0) {
                currentDateIndex.push(index);
            }
        }
        return currentDateIndex;
    };
    VerticalView.prototype.clearCurrentTimeIndicatorTimer = function () {
        if (!isNullOrUndefined(this.currentTimeIndicatorTimer)) {
            window.clearInterval(this.currentTimeIndicatorTimer);
            this.currentTimeIndicatorTimer = null;
            this.removeCurrentTimeIndicatorElements();
        }
    };
    VerticalView.prototype.removeCurrentTimeIndicatorElements = function () {
        var queryString = '.' + PREVIOUS_TIMELINE_CLASS + ',.' + CURRENT_TIMELINE_CLASS + ',.' + CURRENT_TIME_CLASS;
        var timeIndicator = [].slice.call(this.element.querySelectorAll(queryString));
        timeIndicator.forEach(function (indicator) { return remove(indicator); });
    };
    VerticalView.prototype.changeCurrentTimePosition = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        var currentDateIndex = this.getCurrentTimeIndicatorIndex();
        var firstRow = this.parent.getContentTable().rows[0];
        var top = this.getTopFromDateTime(new Date());
        var topInPx = formatUnit(top);
        var rowIndex = Math.floor(top / firstRow.cells[0].offsetHeight);
        if (isNullOrUndefined(rowIndex) || isNaN(rowIndex)) {
            return;
        }
        var curTimeWrap = this.element.querySelectorAll('.' + TIMELINE_WRAPPER_CLASS);
        for (var i = 0, length_1 = currentDateIndex[0]; i < length_1; i++) {
            curTimeWrap[i].appendChild(createElement('div', { className: PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (var _i = 0, currentDateIndex_1 = currentDateIndex; _i < currentDateIndex_1.length; _i++) {
            var day = currentDateIndex_1[_i];
            curTimeWrap[day].appendChild(createElement('div', { className: CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        var currentTimeEle = createElement('div', {
            innerHTML: this.parent.getTimeString(new Date()),
            className: CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        var timeCellsWrap = this.getLeftPanelElement();
        removeClass(timeCellsWrap.querySelectorAll('.' + HIDE_CHILDS_CLASS), HIDE_CHILDS_CLASS);
        addClass([timeCellsWrap.querySelectorAll('tr')[rowIndex].lastChild], HIDE_CHILDS_CLASS);
        prepend([currentTimeEle], timeCellsWrap);
        currentTimeEle.style.top = formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
    };
    VerticalView.prototype.getTopFromDateTime = function (date) {
        var startHour = this.getStartHour();
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.getWorkCellHeight() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    };
    VerticalView.prototype.getWorkCellHeight = function () {
        return this.element.querySelector('.' + WORK_CELLS_CLASS).offsetHeight;
    };
    VerticalView.prototype.getTdContent = function (date, type, groupIndex) {
        var cntEle;
        switch (type) {
            case 'dateHeader':
                if (this.parent.activeViewOptions.dateHeaderTemplate) {
                    var args = { date: date, type: type };
                    cntEle = this.parent.getDateHeaderTemplate()(args);
                }
                else {
                    cntEle = compile(this.dateHeaderTemplate, this.customHelper)({ date: date });
                }
                break;
            case 'majorSlot':
                if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
                    var args = { date: date, type: type };
                    cntEle = this.parent.getMajorSlotTemplate()(args);
                }
                else {
                    cntEle = compile(MAJOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'minorSlot':
                if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
                    var args = { date: date, type: type };
                    cntEle = this.parent.getMinorSlotTemplate()(args);
                }
                else {
                    cntEle = compile(MINOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'alldayCells':
                if (this.parent.activeViewOptions.cellTemplate) {
                    var args = { date: date, type: type, groupIndex: groupIndex };
                    cntEle = this.parent.getCellTemplate()(args);
                }
                break;
        }
        return cntEle;
    };
    VerticalView.prototype.renderLayout = function (type) {
        this.setPanel(createElement('div', { className: TABLE_WRAP_CLASS }));
        var clsList = [this.baseCssClass, this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            addClass([this.element], [TIMESCALE_DISABLE, this.viewClass]);
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            clsList.push(VIRTUAL_SCROLL_CLASS);
        }
        this.renderPanel(type);
        addClass([this.element], clsList);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    };
    VerticalView.prototype.renderHeader = function () {
        var tr = createElement('tr');
        var dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        if (this.parent.activeViewOptions.timeScale.enable) {
            var indentTd = createElement('td', { className: LEFT_INDENT_CLASS });
            indentTd.appendChild(this.renderLeftIndent());
            tr.appendChild(indentTd);
        }
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    };
    VerticalView.prototype.renderContent = function () {
        var tr = createElement('tr');
        var workTd = createElement('td');
        if (this.parent.isAdaptive) {
            workTd.setAttribute('colspan', (this.parent.activeViewOptions.timeScale.enable ? '2' : '1'));
            var scrollContainer = createElement('div', { className: SCROLL_CONTAINER_CLASS });
            if (this.parent.activeViewOptions.timeScale.enable) {
                scrollContainer.appendChild(this.renderTimeCells());
            }
            scrollContainer.appendChild(this.renderContentArea());
            workTd.appendChild(scrollContainer);
            EventHandler.add(scrollContainer, 'scroll', this.onApaptiveScroll, this);
            EventHandler.add(scrollContainer, Browser.touchMoveEvent, this.onApaptiveMove, this);
            tr.appendChild(workTd);
        }
        else {
            workTd.appendChild(this.renderContentArea());
            if (this.parent.activeViewOptions.timeScale.enable) {
                var timesTd = createElement('td');
                timesTd.appendChild(this.renderTimeCells());
                tr.appendChild(timesTd);
            }
            tr.appendChild(workTd);
        }
        this.element.querySelector('tbody').appendChild(tr);
    };
    VerticalView.prototype.renderLeftIndent = function () {
        var wrap = createElement('div', { className: LEFT_INDENT_WRAP_CLASS });
        var tbl = this.createTableLayout();
        var trEle = createElement('tr');
        var rowCount = this.colLevels.length;
        for (var i = 0; i < rowCount; i++) {
            var ntr_1 = trEle.cloneNode();
            var data_1 = { className: [(this.colLevels[i][0] && this.colLevels[i][0].className[0])], type: 'emptyCells' };
            if (this.parent.activeViewOptions.showWeekNumber && data_1.className.indexOf(HEADER_CELLS_CLASS) !== -1) {
                data_1.className.push(WEEK_NUMBER_CLASS);
                var weekNo = getWeekNumber(this.renderDates.slice(-1)[0]);
                data_1.template = [createElement('span', {
                        innerHTML: '' + weekNo,
                        attrs: { title: this.parent.localeObj.getConstant('week') + ' ' + weekNo }
                    })];
            }
            ntr_1.appendChild(this.createTd(data_1));
            tbl.querySelector('tbody').appendChild(ntr_1);
        }
        var ntr = trEle.cloneNode();
        var appointmentExpandCollapse = createElement('div', {
            attrs: { 'tabindex': '0', title: 'Expand-all-day-section', 'aria-disabled': 'false', 'aria-label': 'Expand section' },
            className: ALLDAY_APPOINTMENT_SECTION_CLASS + ' ' + APPOINTMENT_ROW_EXPAND_CLASS + ' ' +
                ICON + ' ' + DISABLE_CLASS,
        });
        var data = { className: [ALLDAY_CELLS_CLASS], type: 'emptyCells' };
        var nth = this.createTd(data);
        nth.appendChild(appointmentExpandCollapse);
        ntr.appendChild(nth);
        tbl.querySelector('tbody').appendChild(ntr);
        wrap.appendChild(tbl);
        return wrap;
    };
    VerticalView.prototype.renderDatesHeader = function () {
        var container = createElement('div', { className: DATE_HEADER_CONTAINER_CLASS });
        var wrap = createElement('div', { className: DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        var tbl = this.createTableLayout();
        var trEle = createElement('tr');
        var rowCount = this.colLevels.length;
        var lastLevel = this.colLevels[rowCount - 1];
        this.createColGroup(tbl, lastLevel);
        for (var i = 0; i < rowCount; i++) {
            var ntr = trEle.cloneNode();
            addClass([ntr], HEADER_ROW_CLASS);
            var level = this.colLevels[i];
            for (var j = 0; j < level.length; j++) {
                ntr.appendChild(this.createTd(level[j]));
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        this.createAllDayRow(tbl, lastLevel);
        wrap.appendChild(tbl);
        return container;
    };
    VerticalView.prototype.createAllDayRow = function (table, tdData) {
        var ntr = createElement('tr');
        addClass([ntr], ALLDAY_ROW_CLASS);
        for (var j = 0; j < tdData.length; j++) {
            var td = extend({}, tdData[j]);
            td.className = [ALLDAY_CELLS_CLASS];
            td.type = 'alldayCells';
            var ntd = this.createTd(td);
            ntd.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                ntd.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireCellEvents(ntd);
            ntr.appendChild(ntd);
        }
        table.querySelector('tbody').appendChild(ntr);
        var thead = createElement('thead');
        thead.appendChild(this.createEventWrapper('allDay'));
        prepend([thead], table);
    };
    VerticalView.prototype.createTd = function (td) {
        var tdEle = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.date && td.type) {
            var ele = this.getTdContent(td.date, td.type, td.groupIndex);
            if (ele && ele.length) {
                append([].slice.call(ele), tdEle);
            }
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader' && td.className.indexOf(HEADER_CELLS_CLASS) >= 0) {
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                tdEle.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireMouseEvents(tdEle);
        }
        var args = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(renderCell, args);
        return tdEle;
    };
    VerticalView.prototype.wireCellEvents = function (element) {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        this.wireMouseEvents(element);
    };
    VerticalView.prototype.wireMouseEvents = function (element) {
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
        }
    };
    VerticalView.prototype.renderTimeCells = function () {
        var _this = this;
        var wrap = createElement('div', { className: TIME_CELLS_WRAP_CLASS });
        var tbl = this.createTableLayout();
        var trEle = createElement('tr');
        var handler = function (r) {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.last ? [TIME_CELLS_CLASS] : [];
            var ntr = trEle.cloneNode();
            var data = { date: r.date, type: r.type, className: r.className };
            ntr.appendChild(_this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        wrap.appendChild(tbl);
        return wrap;
    };
    VerticalView.prototype.renderContentArea = function () {
        var wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        var tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        this.createColGroup(tbl, this.colLevels.slice(-1)[0]);
        this.renderContentTable(tbl);
        wrap.appendChild(tbl);
        this.wireCellEvents(tbl.querySelector('tbody'));
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        EventHandler.add(wrap, Browser.touchMoveEvent, this.onApaptiveMove, this);
        return wrap;
    };
    VerticalView.prototype.renderContentTable = function (table) {
        var _this = this;
        var tr = createElement('tr', { attrs: { role: 'row' } });
        var td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        var tbody = table.querySelector('tbody');
        var handler = function (r) {
            var ntr = tr.cloneNode();
            for (var _i = 0, _a = _this.colLevels[_this.colLevels.length - 1]; _i < _a.length; _i++) {
                var tdData = _a[_i];
                var ntd = _this.createContentTd(tdData, r, td);
                ntr.appendChild(ntd);
            }
            tbody.appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        this.renderContentTableHeader(table);
    };
    VerticalView.prototype.createContentTd = function (tdData, r, td) {
        var ntd = td.cloneNode();
        if (tdData.colSpan) {
            ntd.setAttribute('colspan', tdData.colSpan.toString());
        }
        var clsName = this.getContentTdClass(r);
        var cellDate = resetTime(new Date('' + tdData.date));
        setTime(cellDate, getDateInMs(r.date));
        var type = 'workCells';
        if (tdData.className.indexOf(RESOURCE_PARENT_CLASS) !== -1) {
            clsName.push(RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && ((this.parent.activeViewOptions.timeScale.enable &&
            this.isWorkHour(cellDate, tdData.startHour, tdData.endHour, tdData.workDays)) ||
            (!this.parent.activeViewOptions.timeScale.enable && this.isWorkDay(cellDate, tdData.workDays)))) {
            clsName.push(WORK_HOURS_CLASS);
        }
        addClass([ntd], clsName);
        if (this.parent.activeViewOptions.cellTemplate) {
            var args_1 = { date: cellDate, type: type, groupIndex: tdData.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args_1)), ntd);
        }
        ntd.setAttribute('data-date', cellDate.getTime().toString());
        if (!isNullOrUndefined(tdData.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            var groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                tdData.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        var args = { elementType: type, element: ntd, date: cellDate, groupIndex: tdData.groupIndex };
        this.parent.trigger(renderCell, args);
        return ntd;
    };
    VerticalView.prototype.getContentTdClass = function (r) {
        return r.last ? [WORK_CELLS_CLASS] : [WORK_CELLS_CLASS, ALTERNATE_CELLS_CLASS];
    };
    VerticalView.prototype.renderContentTableHeader = function (table) {
        var thead = createElement('thead');
        thead.appendChild(this.createEventWrapper());
        if (this.parent.activeViewOptions.timeScale.enable) {
            thead.appendChild(this.createEventWrapper('timeIndicator'));
        }
        prepend([thead], table);
    };
    VerticalView.prototype.createEventWrapper = function (type) {
        if (type === void 0) { type = ''; }
        var tr = createElement('tr');
        this.colLevels.slice(-1)[0].forEach(function (col, day) {
            var appointmentWrap = createElement('td', {
                className: (type === 'allDay') ? ALLDAY_APPOINTMENT_WRAPPER_CLASS : (type === 'timeIndicator') ?
                    TIMELINE_WRAPPER_CLASS : DAY_WRAPPER_CLASS, attrs: { 'data-date': col.date.getTime().toString() }
            });
            if (!isNullOrUndefined(col.groupIndex)) {
                appointmentWrap.setAttribute('data-group-index', col.groupIndex.toString());
            }
            if (type === '') {
                var innerWrapper = createElement('div', {
                    id: APPOINTMENT_WRAPPER_CLASS + '-' + day.toString(),
                    className: APPOINTMENT_WRAPPER_CLASS
                });
                appointmentWrap.appendChild(innerWrapper);
            }
            tr.appendChild(appointmentWrap);
        });
        return tr;
    };
    VerticalView.prototype.getScrollableElement = function () {
        if (this.parent.isAdaptive && this.parent.currentView.indexOf('Timeline') === -1) {
            return this.element.querySelector('.' + SCROLL_CONTAINER_CLASS);
        }
        else {
            return this.getContentAreaElement();
        }
    };
    VerticalView.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + TIME_CELLS_WRAP_CLASS);
    };
    VerticalView.prototype.getContentAreaElement = function () {
        return this.element.querySelector('.' + CONTENT_WRAP_CLASS);
    };
    VerticalView.prototype.getEndDateFromStartDate = function (start) {
        var msMajorInterval = this.parent.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        var end = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    };
    VerticalView.prototype.getTimeSlotRows = function (handler) {
        var rows = [];
        var startHour = this.getStartHour();
        var endHour = this.getEndHour();
        var msMajorInterval = this.parent.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        var length = Math.round(MS_PER_DAY / msInterval);
        var msStartHour = startHour.getTime();
        var msEndHour = endHour.getTime();
        if (msStartHour !== msEndHour) {
            length = Math.round((msEndHour - msStartHour) / msInterval);
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            length = 1;
        }
        var dt = new Date(msStartHour);
        var start = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        var end = this.parent.globalize.parseDate(this.parent.workHours.end, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        for (var i = 0; i < length; i++) {
            var majorTickDivider = i % (msMajorInterval / msInterval);
            var row = {
                date: new Date('' + dt),
                startHour: start,
                endHour: end,
                first: (majorTickDivider === 0),
                middle: (majorTickDivider < this.parent.activeViewOptions.timeScale.slotCount - 1),
                last: (majorTickDivider === this.parent.activeViewOptions.timeScale.slotCount - 1),
                type: ''
            };
            if (handler) {
                handler(row);
            }
            rows.push(row);
            dt.setMilliseconds(msInterval);
        }
        return rows;
    };
    /**
     * Get module name.
     */
    VerticalView.prototype.getModuleName = function () {
        return 'verticalView';
    };
    /**
     * To destroy the vertical view.
     * @return {void}
     * @private
     */
    VerticalView.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            var contentScrollableEle = this.getContentAreaElement();
            if (contentScrollableEle) {
                EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
            }
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
        }
    };
    return VerticalView;
}(ViewBase));

var __extends$13 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * day view
 */
var Day = /** @__PURE__ @class */ (function (_super) {
    __extends$13(Day, _super);
    /**
     * Constructor for day view
     */
    function Day(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-day-view';
        return _this;
    }
    /**
     * Get module name.
     */
    Day.prototype.getModuleName = function () {
        return 'day';
    };
    return Day;
}(VerticalView));

var __extends$17 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * week view
 */
var Week = /** @__PURE__ @class */ (function (_super) {
    __extends$17(Week, _super);
    /**
     * Constructor for week view
     */
    function Week(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-week-view';
        return _this;
    }
    /**
     * Get module name.
     */
    Week.prototype.getModuleName = function () {
        return 'week';
    };
    return Week;
}(VerticalView));

var __extends$18 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * work week view
 */
var WorkWeek = /** @__PURE__ @class */ (function (_super) {
    __extends$18(WorkWeek, _super);
    /**
     * Constructor for work week view
     */
    function WorkWeek(par) {
        var _this = _super.call(this, par) || this;
        _this.viewClass = 'e-work-week-view';
        return _this;
    }
    /**
     * Get module name.
     */
    WorkWeek.prototype.getModuleName = function () {
        return 'workWeek';
    };
    return WorkWeek;
}(VerticalView));

var __extends$19 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * month view
 */
var Month = /** @__PURE__ @class */ (function (_super) {
    __extends$19(Month, _super);
    /**
     * Constructor for month view
     */
    function Month(parent) {
        var _this = _super.call(this, parent) || this;
        _this.dayNameFormat = 'wide';
        _this.viewClass = 'e-month-view';
        _this.isInverseTableSelect = false;
        _this.monthDates = {};
        _this.workCellAction = new WorkCellInteraction(parent);
        return _this;
    }
    Month.prototype.addEventListener = function () {
        this.parent.on(scrollUiUpdate, this.onScrollUIUpdate, this);
        this.parent.on(dataReady, this.onDataReady, this);
        this.parent.on(cellClick, this.onCellClick, this);
    };
    Month.prototype.removeEventListener = function () {
        this.parent.off(scrollUiUpdate, this.onScrollUIUpdate);
        this.parent.off(dataReady, this.onDataReady);
        this.parent.off(cellClick, this.onCellClick);
    };
    Month.prototype.onDataReady = function (args) {
        var monthEvent = new MonthEvent(this.parent);
        monthEvent.renderAppointments();
    };
    Month.prototype.onCellClick = function (event) {
        // Here cell click
    };
    Month.prototype.onContentScroll = function (e) {
        this.parent.removeNewEventElement();
        this.parent.notify(virtualScroll, e);
        this.scrollTopPanel(e.target);
        this.scrollLeftPanel(e.target);
    };
    Month.prototype.scrollLeftPanel = function (target) {
        var leftPanel = this.getLeftPanelElement();
        if (leftPanel) {
            leftPanel.scrollTop = target.scrollTop;
        }
    };
    Month.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + WEEK_NUMBER_WRAPPER_CLASS);
    };
    Month.prototype.onScrollUIUpdate = function (args) {
        var headerHeight = this.getHeaderBarHeight();
        var header = this.getDatesHeaderElement();
        var content = this.getContentAreaElement();
        var height = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        var leftPanel = this.getLeftPanelElement();
        this.setContentHeight(content, leftPanel, height);
        var scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
    };
    Month.prototype.setContentHeight = function (content, leftPanelElement, height) {
        content.style.height = 'auto';
        if (this.parent.currentView === 'Month') {
            content.style.height = formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.currentView === 'MonthAgenda') {
                height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
    };
    Month.prototype.generateColumnLevels = function () {
        var colLevels = [];
        var level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.currentView === 'MonthAgenda') {
                colLevels = [level];
            }
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                var resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays)];
            }
        }
        else {
            colLevels.push(level);
        }
        this.colLevels = colLevels;
        return colLevels;
    };
    Month.prototype.getDateSlots = function (renderDates, workDays) {
        var count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : workDays.length;
        var dateSlots = [];
        for (var col = 0; col < count; col++) {
            var classList$$1 = [HEADER_CELLS_CLASS];
            var currentDateIndex = renderDates.slice(0, count).map(function (date) { return date.getDay(); });
            if (this.isCurrentMonth(this.parent.selectedDate) && currentDateIndex.indexOf(new Date().getDay()) === col) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: renderDates[col], type: 'monthDay', className: classList$$1, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    };
    Month.prototype.getDayNameFormat = function () {
        if (this.parent.isAdaptive || this.parent.activeViewOptions.group.resources.length > 0) {
            return 'abbreviated';
        }
        return 'wide';
    };
    Month.prototype.renderLayout = function (type) {
        this.dayNameFormat = this.getDayNameFormat();
        this.setPanel(createElement('div', { className: TABLE_WRAP_CLASS }));
        var clsList = [this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            clsList.push(VIRTUAL_SCROLL_CLASS);
        }
        addClass([this.element], clsList);
        this.renderPanel(type);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        var target = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        if (this.parent.uiStateValues.isGroupAdaptive && !target.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    };
    Month.prototype.wireCellEvents = function (element) {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
        }
    };
    Month.prototype.renderHeader = function () {
        var tr = createElement('tr');
        this.renderLeftIndent(tr);
        var dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    };
    Month.prototype.renderLeftIndent = function (tr) {
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('td', { className: 'e-left-indent' }));
        }
    };
    Month.prototype.renderContent = function () {
        var tr = createElement('tr');
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(this.renderWeekNumberContent());
        }
        var workTd = createElement('td');
        var wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        var contentArea = this.renderContentArea();
        if (this.parent.currentView === 'Month') {
            wrap.appendChild(contentArea);
        }
        else {
            var monthAgendaWrapper = createElement('div', { className: TABLE_CONTAINER_CLASS });
            monthAgendaWrapper.appendChild(contentArea);
            wrap.appendChild(monthAgendaWrapper);
        }
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        this.element.querySelector('tbody').appendChild(tr);
        this.renderAppointmentContainer();
    };
    Month.prototype.renderWeekNumberContent = function () {
        var dateCol = this.renderDates.map(function (date) { return new Date(+date); });
        var td = createElement('td');
        var contentWrapper = createElement('div', { className: WEEK_NUMBER_WRAPPER_CLASS });
        td.appendChild(contentWrapper);
        var contentWrapTable = this.createTableLayout();
        contentWrapper.appendChild(contentWrapTable);
        var noOfDays = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH :
            this.parent.activeViewOptions.workDays.length;
        for (var i = 0, length_1 = (this.renderDates.length / noOfDays); i < length_1; i++) {
            var dates = dateCol.splice(0, noOfDays);
            var weekNumber = getWeekNumber(dates.slice(-1)[0]).toString();
            contentWrapTable.querySelector('tbody').appendChild(this.createWeekNumberElement(weekNumber));
        }
        return td;
    };
    Month.prototype.renderAppointmentContainer = function () {
        //Here needs to render mobile view appointment details on selected date
    };
    Month.prototype.renderDatesHeader = function () {
        var container = createElement('div', { className: DATE_HEADER_CONTAINER_CLASS });
        var wrap = createElement('div', { className: DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        var table = this.createTableLayout();
        this.createColGroup(table, this.colLevels[this.colLevels.length - 1]);
        var trEle = createElement('tr');
        for (var i = 0; i < this.colLevels.length; i++) {
            var level = this.colLevels[i];
            var ntr = trEle.cloneNode();
            for (var j = 0; j < level.length; j++) {
                var td = level[j];
                ntr.appendChild(this.createHeaderCell(td));
            }
            table.querySelector('tbody').appendChild(ntr);
        }
        wrap.appendChild(table);
        return container;
    };
    Month.prototype.createHeaderCell = function (td) {
        var tdEle = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.type === 'monthDay') {
            var ele = createElement('span', { innerHTML: this.parent.getDayNames(this.dayNameFormat)[td.date.getDay()] });
            tdEle.appendChild(ele);
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader') {
            addClass([tdEle], DATE_HEADER_CLASS);
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (this.parent.activeViewOptions.dateHeaderTemplate) {
                var cellArgs = { date: td.date, type: td.type };
                var ele = this.parent.getDateHeaderTemplate()(cellArgs);
                if (ele && ele.length) {
                    append([].slice.call(ele), tdEle);
                }
            }
            else {
                var ele = createElement('span', { className: NAVIGATE_CLASS });
                var title = this.parent.globalize.formatDate(td.date, { skeleton: 'full', calendar: this.parent.getCalendarMode() });
                ele.setAttribute('title', title);
                ele.innerHTML =
                    (this.parent.calendarUtil.isMonthStart(td.date) && !this.isCurrentDate(td.date) && !this.parent.isAdaptive) ?
                        this.parent.globalize.formatDate(td.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                        this.parent.globalize.formatDate(td.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
                tdEle.appendChild(ele);
            }
            this.wireCellEvents(tdEle);
        }
        var args = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(renderCell, args);
        return tdEle;
    };
    Month.prototype.getContentSlots = function () {
        if (!(this.colLevels[this.colLevels.length - 1] && this.colLevels[this.colLevels.length - 1][0])) {
            return [];
        }
        var slotDatas = [];
        var prepareSlots = function (rowIndex, renderDate, resData, classList$$1) {
            var data = {
                date: new Date(+renderDate), groupIndex: resData.groupIndex, workDays: resData.workDays,
                type: 'monthCells', className: classList$$1 || [WORK_CELLS_CLASS]
            };
            if (!slotDatas[rowIndex]) {
                slotDatas[rowIndex] = [];
            }
            slotDatas[rowIndex].push(data);
        };
        var includeResource = this.parent.currentView !== 'MonthAgenda' &&
            this.parent.activeViewOptions.group.resources.length > 0;
        if (includeResource && !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeViewOptions.group.byDate) {
            for (var _i = 0, _a = this.colLevels[this.colLevels.length - 2]; _i < _a.length; _i++) {
                var res = _a[_i];
                var dates = res.renderDates.map(function (date) { return new Date(+date); });
                var count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : res.workDays.length;
                for (var i = 0; i < (res.renderDates.length / count); i++) {
                    var colDates = dates.splice(0, count);
                    for (var _b = 0, colDates_1 = colDates; _b < colDates_1.length; _b++) {
                        var colDate = colDates_1[_b];
                        prepareSlots(i, colDate, res);
                    }
                }
            }
        }
        else {
            var dates = this.renderDates.map(function (date) { return new Date(+date); });
            var count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH :
                this.parent.activeViewOptions.workDays.length;
            for (var i = 0; i < (this.renderDates.length / count); i++) {
                var colDates = dates.splice(0, count);
                for (var _c = 0, colDates_2 = colDates; _c < colDates_2.length; _c++) {
                    var colDate = colDates_2[_c];
                    if (includeResource) {
                        var lastRow = this.colLevels[(this.colLevels.length - 1)];
                        var resourcesTd = lastRow.slice(0, lastRow.length / count);
                        for (var resIndex = 0; resIndex < resourcesTd.length; resIndex++) {
                            var clsList = void 0;
                            if (resIndex !== 0) {
                                clsList = [WORK_CELLS_CLASS, DISABLE_DATE];
                            }
                            prepareSlots(i, colDate, resourcesTd[resIndex], clsList);
                        }
                    }
                    else {
                        prepareSlots(i, colDate, this.colLevels[this.colLevels.length - 1][0]);
                    }
                }
            }
        }
        return slotDatas;
    };
    Month.prototype.updateClassList = function (data) {
        if (this.isOtherMonth(data.date)) {
            data.className.push(OTHERMONTH_CLASS);
        }
        if (this.parent.currentView === 'MonthAgenda' && this.parent.isSelectedDate(data.date)) {
            data.className.push(SELECTED_CELL_CLASS);
        }
    };
    Month.prototype.isOtherMonth = function (date) {
        return date.getTime() < this.monthDates.start.getTime() || date.getTime() > this.monthDates.end.getTime();
    };
    Month.prototype.renderContentArea = function () {
        var tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        if (this.parent.currentView === 'TimelineMonth') {
            this.createColGroup(tbl, this.colLevels[this.colLevels.length - 1]);
        }
        var monthDate = new Date(this.parent.selectedDate.getTime());
        this.monthDates = {
            start: this.parent.calendarUtil.firstDateOfMonth(monthDate),
            end: this.parent.calendarUtil.lastDateOfMonth(addMonths(monthDate, this.parent.activeViewOptions.interval - 1))
        };
        var tBody = tbl.querySelector('tbody');
        append(this.getContentRows(), tBody);
        this.wireCellEvents(tBody);
        return tbl;
    };
    Month.prototype.getContentRows = function () {
        var trows = [];
        var tr = createElement('tr', { attrs: { role: 'row' } });
        var td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        var slotDatas = this.getContentSlots();
        for (var row = 0; row < slotDatas.length; row++) {
            var ntr = tr.cloneNode();
            for (var col = 0; col < slotDatas[row].length; col++) {
                var ntd = this.createContentTd(slotDatas[row][col], td);
                ntr.appendChild(ntd);
            }
            trows.push(ntr);
        }
        return trows;
    };
    Month.prototype.createContentTd = function (data, td) {
        var ntd = td.cloneNode();
        if (data.colSpan) {
            ntd.setAttribute('colspan', data.colSpan.toString());
        }
        this.updateClassList(data);
        var type = data.type;
        if (data.className.indexOf(RESOURCE_PARENT_CLASS) !== -1) {
            data.className.push(RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && this.isWorkDay(data.date, data.workDays)) {
            data.className.push(WORKDAY_CLASS);
        }
        if (this.isCurrentDate(data.date)) {
            data.className.push(CURRENTDATE_CLASS);
        }
        addClass([ntd], data.className);
        ntd.setAttribute('data-date', data.date.getTime().toString());
        if (!isNullOrUndefined(data.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            var groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                data.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        this.renderDateHeaderElement(data, ntd);
        if (this.parent.activeViewOptions.cellTemplate) {
            var args_1 = { date: data.date, type: type, groupIndex: data.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args_1)), ntd);
        }
        var args = { elementType: type, element: ntd, date: data.date, groupIndex: data.groupIndex };
        this.parent.trigger(renderCell, args);
        return ntd;
    };
    Month.prototype.getContentAreaElement = function () {
        return this.element.querySelector('.' + CONTENT_WRAP_CLASS);
    };
    Month.prototype.renderDateHeaderElement = function (data, ntd) {
        if (this.parent.currentView === 'TimelineMonth') {
            return;
        }
        var dateHeader = createElement('div', { className: DATE_HEADER_CLASS });
        dateHeader.innerHTML =
            (this.parent.calendarUtil.isMonthStart(data.date) && !this.isCurrentDate(data.date) && !this.parent.isAdaptive) ?
                this.parent.globalize.formatDate(data.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                this.parent.globalize.formatDate(data.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
        ntd.appendChild(dateHeader);
        if (this.getModuleName() === 'month') {
            addClass([dateHeader], NAVIGATE_CLASS);
        }
    };
    Month.prototype.getMonthStart = function (currentDate) {
        var monthStart = getWeekFirstDate(this.parent.calendarUtil.firstDateOfMonth(currentDate), this.parent.firstDayOfWeek);
        var start = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
        return start;
    };
    Month.prototype.getMonthEnd = function (currentDate) {
        var endDate = addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
        var lastWeekOfMonth = getWeekFirstDate(this.parent.calendarUtil.lastDateOfMonth(endDate), this.parent.firstDayOfWeek);
        var monthEnd = addDays(lastWeekOfMonth, WEEK_LENGTH - 1);
        return monthEnd;
    };
    Month.prototype.getRenderDates = function (workDays) {
        var renderDates = [];
        var currentDate = resetTime(this.parent.selectedDate);
        var start = this.getMonthStart(currentDate);
        var monthEnd = this.getMonthEnd(currentDate);
        do {
            if (this.parent.activeViewOptions.showWeekend) {
                renderDates.push(start);
            }
            else {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
            }
            start = addDays(start, 1);
        } while (start.getTime() <= monthEnd.getTime());
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    };
    Month.prototype.getNextPreviousDate = function (type) {
        if (type === 'next') {
            return addMonths(this.parent.selectedDate, this.parent.activeViewOptions.interval);
        }
        else {
            return addMonths(this.parent.selectedDate, -(this.parent.activeViewOptions.interval));
        }
    };
    Month.prototype.getEndDateFromStartDate = function (start) {
        return addDays(new Date(start.getTime()), 1);
    };
    Month.prototype.getDateRangeText = function () {
        if (this.parent.isAdaptive || isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (this.parent.activeViewOptions.interval > 1) {
                var endDate = addMonths(lastDateOfMonth(this.parent.selectedDate), this.parent.activeViewOptions.interval - 1);
                if (this.parent.selectedDate.getFullYear() === endDate.getFullYear()) {
                    var monthNames = (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' - ' +
                        (this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() })) +
                        endDate.getFullYear();
                    return monthNames;
                }
                return (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' ' +
                    this.parent.selectedDate.getFullYear() + ' - ' + (this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() })) +
                    endDate.getFullYear();
            }
            return this.parent.globalize.
                formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
        }
        return this.formatDateRange(this.parent.selectedDate);
    };
    Month.prototype.getLabelText = function (view) {
        return this.parent.localeObj.getConstant(view) + ' of ' +
            this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
    };
    Month.prototype.createWeekNumberElement = function (text) {
        var tr = createElement('tr');
        var td = createElement('td', {
            className: WEEK_NUMBER_CLASS,
            attrs: { 'title': (text ? this.parent.localeObj.getConstant('week') + ' ' + text : '') },
            innerHTML: (text || '')
        });
        tr.appendChild(td);
        var args = { elementType: 'weekNumberCell', element: td };
        this.parent.trigger(renderCell, args);
        return tr;
    };
    Month.prototype.unwireEvents = function () {
        // No scroller events for month view
    };
    /**
     * Get module name.
     */
    Month.prototype.getModuleName = function () {
        return 'month';
    };
    /**
     * To destroy the month.
     * @return {void}
     * @private
     */
    Month.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.unwireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
        }
    };
    return Month;
}(ViewBase));

var AgendaBase = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for AgendaBase
     */
    function AgendaBase(parent) {
        this.parent = parent;
        this.viewBase = new ViewBase(parent);
    }
    AgendaBase.prototype.createAgendaContentElement = function (type, listData, aTd, groupOrder, groupIndex) {
        var listElement;
        if (type === 'noEvents') {
            var noEvents = [{ 'subject': this.parent.localeObj.getConstant('noEvents') }];
            listElement = ListBase.createList(this.parent.createElement, noEvents, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass,
                template: '<div class=' + AGENDA_NO_EVENT_CLASS + '>${subject}</div>'
            });
        }
        else {
            listElement = ListBase.createList(this.parent.createElement, listData, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass
            });
            for (var li = 0, length_1 = listData.length; li < length_1; li++) {
                var appWrapper = createElement('div', {
                    className: APPOINTMENT_CLASS, attrs: {
                        'data-id': 'Appointment_' + listData[li][this.parent.eventFields.id],
                        'data-guid': listData[li].Guid,
                        'role': 'button',
                        'tabindex': '0',
                        'aria-readonly': this.parent.eventBase.getReadonlyAttribute(listData[li]),
                        'aria-selected': 'false',
                        'aria-grabbed': 'true',
                        'aria-label': (listData[li][this.parent.eventFields.subject]
                            || this.parent.eventSettings.fields.subject.default)
                    }
                });
                if (!isNullOrUndefined(groupIndex)) {
                    appWrapper.setAttribute('data-group-index', groupIndex.toString());
                }
                this.parent.eventBase.applyResourceColor(appWrapper, listData[li], 'borderColor', groupOrder);
                var templateEle = void 0;
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    templateEle = this.parent.getAppointmentTemplate()(listData[li]);
                }
                else {
                    templateEle = this.createAppointment(listData[li]);
                }
                append([].slice.call(templateEle), appWrapper);
                listElement.children[li].innerHTML = appWrapper.outerHTML;
                var args = { data: listData[li], element: listElement.children[li], cancel: false };
                this.parent.trigger(eventRendered, args);
                if (args.cancel) {
                    remove(listElement.children[li]);
                }
            }
        }
        aTd.appendChild(listElement);
        if ((this.parent.currentView === 'MonthAgenda' && this.parent.activeViewOptions.group.resources.length > 0)
            || this.parent.currentView === 'Agenda') {
            addClass([aTd], AGENDA_DAY_BORDER_CLASS);
        }
        return aTd;
    };
    AgendaBase.prototype.createAppointment = function (event) {
        var fieldMapping = this.parent.eventFields;
        var eventSubject = (event[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default);
        var eventLocation = (event[fieldMapping.location] || this.parent.eventSettings.fields.location.default);
        var appSubjectWrap = createElement('div', { className: SUBJECT_WRAP });
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            eventSubject += ',';
        }
        appSubjectWrap.appendChild(createElement('div', { className: SUBJECT_CLASS, innerHTML: eventSubject }));
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            appSubjectWrap.appendChild(createElement('div', { className: LOCATION_CLASS, innerHTML: eventLocation }));
        }
        if (!isNullOrUndefined(event[fieldMapping.recurrenceRule])) {
            var iconClass = (event[fieldMapping.id] === event[fieldMapping.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appSubjectWrap.appendChild(createElement('div', { className: ICON + ' ' + iconClass }));
        }
        var strDate = event[fieldMapping.startTime];
        var endDate = event[fieldMapping.endTime];
        var isAllDay = event[fieldMapping.isAllDay];
        var allDayStr = this.parent.localeObj.getConstant('allDay');
        var timeStr = this.parent.getTimeString(strDate) + ' - ' + this.parent.getTimeString(endDate);
        if (!isNullOrUndefined(event.data)) {
            var eventString = (endDate.getTime() - strDate.getTime()) / MS_PER_DAY >= 1 ? allDayStr : timeStr;
            allDayStr = eventString + ' (' + this.parent.localeObj.getConstant('day') + ' '
                + event.data.index + '/' + event.data.count + ')';
        }
        var displayStr = (!isNullOrUndefined(event.data) || isAllDay) ? allDayStr : timeStr;
        var appDateTime = createElement('div', { className: DATE_TIME_CLASS, innerHTML: displayStr });
        return [appSubjectWrap, appDateTime];
    };
    AgendaBase.prototype.processAgendaEvents = function (events) {
        var eventsProcessed = [];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            var splited = this.parent.eventBase.splitEventByDay(event_1);
            eventsProcessed = eventsProcessed.concat(splited.length > 1 ? splited : event_1);
        }
        return eventsProcessed;
    };
    AgendaBase.prototype.wireEventActions = function () {
        var eventElement = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        for (var _i = 0, eventElement_1 = eventElement; _i < eventElement_1.length; _i++) {
            var element = eventElement_1[_i];
            this.parent.eventBase.wireAppointmentEvents(element);
        }
        var dateHeaderElement = [].slice.call(this.parent.element.querySelectorAll('.e-m-date'));
        for (var _a = 0, dateHeaderElement_1 = dateHeaderElement; _a < dateHeaderElement_1.length; _a++) {
            var element = dateHeaderElement_1[_a];
            EventHandler.add(element, 'click', this.parent.agendaModule.dayNavigationClick, this);
        }
    };
    AgendaBase.prototype.calculateResourceTableElement = function (tBody, noOfDays, agendaDate) {
        if (isNullOrUndefined(this.parent.resourceBase.lastResourceLevel)) {
            var level = this.viewBase.getDateSlots(this.viewBase.renderDates, this.parent.activeViewOptions.workDays);
            this.parent.resourceBase.generateResourceLevels(level);
        }
        var agendaLastDate = addDays(new Date(agendaDate.getTime()), noOfDays);
        var days = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
        var resColl = this.parent.resourceBase.resourceCollection;
        var resData = this.parent.resourceBase.lastResourceLevel;
        var initialDate = agendaDate;
        for (var i = 0; i < days; i++) {
            var lastLevelInfo = [];
            var tempLastLevelInfo = [];
            var tempIndex = 0;
            var eventObj = void 0;
            var dateObj = void 0;
            var firstDate = addDays(initialDate, i);
            var finalDate = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda')
                ? addDays(firstDate, 1) : agendaLastDate;
            var agendaCollection = this.parent.eventBase.filterEvents(firstDate, finalDate);
            if (agendaCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                for (var res = 0; res < resData.length; res++) {
                    noOfDays = (!this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
                    var data = [];
                    agendaDate = firstDate;
                    var resDataCollection = this.parent.eventBase.filterEvents(agendaDate, agendaLastDate, agendaCollection, resData[res]);
                    if (resDataCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                        for (var r = 0; r < noOfDays; r++) {
                            var resDayCollection = this.parent.eventBase.filterEvents(agendaDate, addDays(agendaDate, 1), resDataCollection, undefined);
                            if (resDayCollection.length > 0 || !this.parent.hideEmptyAgendaDays ||
                                this.parent.currentView === 'MonthAgenda') {
                                data.push(resDayCollection[0]);
                                eventObj = {
                                    rowSpan: 1, type: 'eventColumn', resource: resColl[resColl.length - 1],
                                    groupIndex: resData[res].groupIndex, groupOrder: resData[res].groupOrder,
                                    resourceData: resData[res].resourceData, eventData: resDayCollection, date: agendaDate
                                };
                                dateObj = {
                                    rowSpan: 1, type: 'dateColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder, resourceData: resData[res].resourceData,
                                    date: agendaDate
                                };
                                if (!lastLevelInfo[tempIndex]) {
                                    lastLevelInfo[tempIndex] = [];
                                }
                                lastLevelInfo[tempIndex].push(eventObj);
                                lastLevelInfo[tempIndex].push(dateObj);
                                tempIndex++;
                            }
                            agendaDate = addDays(agendaDate, 1);
                            if (agendaDate.getTime() >= agendaLastDate.getTime() || this.parent.activeViewOptions.group.byDate
                                || this.parent.currentView === 'MonthAgenda') {
                                lastLevelInfo[lastLevelInfo.length - 1][1].cssClass = AGENDA_DAY_BORDER_CLASS;
                                var tempObj = {
                                    rowSpan: data.length, type: 'resourceColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder.slice(0, -1), resourceData: resData[res].resourceData,
                                    groupIndex: (lastLevelInfo.length - data.length), className: [RESOURCE_NAME],
                                    date: agendaDate
                                };
                                lastLevelInfo[lastLevelInfo.length - data.length].push(tempObj);
                                tempLastLevelInfo.push(extend({}, tempObj, null, true));
                                break;
                            }
                        }
                    }
                }
                var topResources = resColl.slice(0, -1);
                var tempGroupedData = [];
                var totalRowSpan = 0;
                for (var y = 0; y < topResources.length; y++) {
                    var data = topResources[topResources.length - (y + 1)]
                        .dataSource;
                    for (var x = 0; x < data.length; x++) {
                        var z = 0;
                        for (var u = 0; u < tempLastLevelInfo.length; u++) {
                            if (tempLastLevelInfo[u].groupOrder[topResources.length - (y + 1)] === data[x][topResources[topResources.length - (y + 1)].idField]) {
                                totalRowSpan = totalRowSpan + tempLastLevelInfo[u].rowSpan;
                                tempGroupedData.push(extend({}, tempLastLevelInfo[u], null, true));
                            }
                            if (++z === tempLastLevelInfo.length && tempGroupedData.length > 0) {
                                tempGroupedData[0].rowSpan = totalRowSpan;
                                tempGroupedData[0].type = 'parentColumnLevel_' + (y + 1);
                                tempGroupedData[0].resource = topResources[topResources.length - (y + 1)];
                                tempGroupedData[0].resourceData = data[x];
                                tempGroupedData[0].date = agendaDate;
                                lastLevelInfo[tempGroupedData[0].groupIndex].push(tempGroupedData[0]);
                                tempGroupedData = [];
                                totalRowSpan = 0;
                            }
                        }
                    }
                }
                this.createResourceTableRow(lastLevelInfo, tBody);
            }
        }
        var totalCollection = this.parent.eventBase.filterEvents(initialDate, agendaLastDate);
        if (totalCollection.length === 0 && !this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            this.renderEmptyContent(tBody, initialDate);
        }
    };
    AgendaBase.prototype.createResourceTableRow = function (tContent, tBody) {
        var tr = createElement('tr', { attrs: { role: 'row' } });
        var ntr;
        var td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        var tempData;
        var rowSpan = 0;
        var level;
        if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
            var tContentCollection = [];
            var parentCollection = this.parent.resourceBase.resourceCollection.slice(0, -1);
            for (var w = 0; w < tContent.length; w++) {
                tContentCollection = tContentCollection.concat(tContent[w]);
            }
            level = (parentCollection.length > 0) ? 'parentColumnLevel_' + parentCollection.length : 'resourceColumn';
            var rowSpanCollection = new DataManager({ json: tContentCollection }).executeLocal(new Query()
                .where('type', 'equal', level));
            for (var x = 0; x < rowSpanCollection.length; x++) {
                rowSpan = rowSpan + rowSpanCollection[x].rowSpan;
            }
        }
        for (var row = 0; row < tContent.length; row++) {
            ntr = tr.cloneNode();
            for (var col = tContent[row].length - 1; col >= 0; col--) {
                var data = tContent[row][col];
                var ntd = td.cloneNode();
                if (data.type === 'dateColumn') {
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        tempData = tContent[row][col];
                        continue;
                    }
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    ntd.appendChild(this.createDateHeaderElement(data.date));
                    var className = [AGENDA_CELLS_CLASS, AGENDA_DATE_CLASS];
                    if (data.cssClass) {
                        className.push(data.cssClass);
                    }
                    addClass([ntd], className);
                    ntr.appendChild(ntd);
                }
                else if (data.type === 'eventColumn') {
                    var elementType = (data.eventData.length === 0) ? 'noEvents' : 'data';
                    ntd = this.createAgendaContentElement(elementType, data.eventData, ntd, data.groupOrder, data.groupIndex);
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        addClass([ntd], [AGENDA_CELLS_CLASS, AGENDA_DAY_PADDING_CLASS]);
                    }
                    ntr.appendChild(ntd);
                }
                else {
                    ntd.setAttribute('rowspan', data.rowSpan.toString());
                    addClass([ntd], AGENDA_RESOURCE_CLASS);
                    this.viewBase.setResourceHeaderContent(ntd, data, data.className[0]);
                    ntr.appendChild(ntd);
                }
            }
            if (this.parent.activeViewOptions.group.byDate && row === 0 && this.parent.currentView !== 'MonthAgenda') {
                var ntd = td.cloneNode();
                ntd.setAttribute('data-date', tempData.date.getTime().toString());
                ntd.setAttribute('rowspan', rowSpan.toString());
                ntd.appendChild(this.createDateHeaderElement(tempData.date));
                addClass([ntd], [AGENDA_CELLS_CLASS, AGENDA_DATE_CLASS, DATE_BORDER_CLASS]);
                var daysCount = getDaysCount(this.parent.selectedDate.getTime(), tempData.date.getTime());
                ntr.setAttribute('aria-rowindex', daysCount.toString());
                if (this.parent.element.querySelector(".e-agenda-view tr[aria-rowindex=\"" + daysCount + "\"]")) {
                    break;
                }
                ntr.insertBefore(ntd, ntr.childNodes[0]);
            }
            tBody.appendChild(ntr);
        }
    };
    AgendaBase.prototype.createDateHeaderElement = function (date) {
        var dateHeader;
        if (this.parent.activeViewOptions.dateHeaderTemplate) {
            dateHeader = createElement('div', { className: AGENDA_HEADER_CLASS });
            var templateArgs = { date: date, type: 'dateHeader' };
            var template = this.parent.getDateHeaderTemplate()(templateArgs);
            append([].slice.call(template), dateHeader);
        }
        else {
            dateHeader = this.viewBase.getMobileDateElement(date, AGENDA_HEADER_CLASS);
        }
        return dateHeader;
    };
    AgendaBase.prototype.renderEmptyContent = function (tBody, agendaDate) {
        var eTr = this.createTableRowElement(agendaDate, 'noEvents');
        var eTd = eTr.children[0];
        var noEvents = createElement('div', {
            className: AGENDA_EMPTY_EVENT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noEvents')
        });
        eTd.appendChild(noEvents);
        tBody.appendChild(eTr);
    };
    AgendaBase.prototype.createTableRowElement = function (date, type) {
        var daysCount = getDaysCount(this.parent.selectedDate.getTime(), date.getTime());
        var tr = createElement('tr', { attrs: { 'role': 'row', 'aria-rowindex': daysCount.toString() } });
        var td = createElement('td', {
            attrs: {
                'class': (type === 'monthHeader') ? AGENDA_MONTH_HEADER_CLASS : AGENDA_CELLS_CLASS,
                'role': 'gridcell',
                'aria-selected': 'false',
                'aria-colindex': daysCount.toString(),
                'data-date': date.getTime().toString()
            }
        });
        var dTd = td.cloneNode();
        var aTd = td.cloneNode();
        tr.appendChild(dTd);
        if (type !== 'noEvents') {
            tr.appendChild(aTd);
        }
        return tr;
    };
    return AgendaBase;
}());

var __extends$20 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * agenda view
 */
var Agenda = /** @__PURE__ @class */ (function (_super) {
    __extends$20(Agenda, _super);
    /**
     * Constructor for agenda view
     */
    function Agenda(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-agenda-view';
        _this.isInverseTableSelect = false;
        _this.agendaDates = {};
        _this.virtualScrollTop = 1;
        _this.minDate = new Date(1900, 0, 1);
        _this.maxDate = new Date(2099, 11, 31);
        _this.agendaBase = new AgendaBase(parent);
        return _this;
    }
    /**
     * Get module name.
     */
    Agenda.prototype.getModuleName = function () {
        return 'agenda';
    };
    Agenda.prototype.renderLayout = function () {
        this.agendaDates = {};
        this.element = createElement('div', { className: TABLE_WRAP_CLASS });
        addClass([this.element], this.viewClass);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.element);
        var eTr = createElement('tr');
        this.element.querySelector('tbody').appendChild(eTr);
        var workTd = createElement('td');
        eTr.appendChild(workTd);
        var wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        workTd.appendChild(wrap);
        var tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        wrap.appendChild(tbl);
        var tBody = tbl.querySelector('tbody');
        var agendaDate = resetTime(this.parent.selectedDate);
        this.agendaBase.renderEmptyContent(tBody, agendaDate);
        this.wireEvents();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.parent.resourceBase.generateResourceLevels([{ renderDates: this.parent.activeView.renderDates }]);
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    };
    Agenda.prototype.eventLoad = function (args) {
        this.dataSource = extend([], this.parent.eventsData, null, true);
        for (var _i = 0, _a = this.parent.eventsData; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            delete event_1.generatedDates;
        }
        var eventCollection = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            var resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            this.dataSource = this.parent.eventBase.filterEventsByResource(resource, this.dataSource);
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        var agendaDate = resetTime(this.parent.selectedDate);
        var tBody = this.parent.getContentTable();
        tBody.innerHTML = '';
        this.renderContent(tBody, agendaDate);
        this.agendaBase.wireEventActions();
        var contentArea = closest(tBody, '.' + CONTENT_WRAP_CLASS);
        contentArea.scrollTop = 1;
    };
    Agenda.prototype.refreshEvent = function (refreshDate) {
        var processedData = [];
        for (var _i = 0, _a = this.dataSource; _i < _a.length; _i++) {
            var eventData = _a[_i];
            var fields = this.parent.eventFields;
            var data = eventData;
            if (isNullOrUndefined(data[fields.recurrenceID]) && !isNullOrUndefined(data[fields.recurrenceRule]) &&
                !isNullOrUndefined(data.generatedDates) && refreshDate >= data.generatedDates.end) {
                processedData = processedData.concat(this.parent.eventBase.generateOccurrence(data, refreshDate));
            }
        }
        this.parent.eventsProcessed = this.parent.eventsProcessed.concat(this.agendaBase.processAgendaEvents(processedData));
    };
    Agenda.prototype.renderContent = function (tBody, agendaDate) {
        var fieldMapping = this.parent.eventFields;
        var firstDate = new Date(agendaDate.getTime());
        var lastDate = this.getEndDateFromStartDate(firstDate);
        var isObject = this.appointmentFiltering(firstDate, lastDate);
        if (isObject.length === 0) {
            lastDate = firstDate;
            firstDate = new Date(this.minDate.getTime());
            isObject = this.appointmentFiltering(firstDate, lastDate);
            if (isObject.length === 0) {
                firstDate = lastDate;
                lastDate = new Date(this.maxDate.getTime());
                isObject = this.appointmentFiltering(firstDate, lastDate);
            }
        }
        if (isObject.length > 0) {
            var appoint = isObject;
            agendaDate = appoint[0][fieldMapping.startTime];
            agendaDate = new Date(new Date(agendaDate.getTime()).setHours(0, 0, 0, 0));
            this.updateHeaderText(appoint[0][fieldMapping.startTime]);
        }
        var endDate;
        if (!this.parent.hideEmptyAgendaDays || (this.parent.agendaDaysCount > 0 && isObject.length > 0)) {
            var noOfDays = (!this.parent.hideEmptyAgendaDays || !this.parent.activeViewOptions.allowVirtualScrolling ||
                this.parent.agendaDaysCount < isObject.length) ? this.parent.agendaDaysCount : isObject.length;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                var date = agendaDate;
                if (!this.parent.activeViewOptions.group.byDate) {
                    this.parent.activeViewOptions.allowVirtualScrolling = false;
                    date = firstDate;
                    if (this.parent.headerModule) {
                        this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
                        this.parent.headerModule.updateHeaderItems('remove');
                    }
                }
                this.agendaBase.calculateResourceTableElement(tBody, this.parent.agendaDaysCount, date);
            }
            else {
                for (var day = 0; day < noOfDays; day++) {
                    var filterData = [];
                    filterData = this.appointmentFiltering(agendaDate);
                    var nTr = this.agendaBase.createTableRowElement(agendaDate, 'data');
                    if (this.element.querySelector('tr[aria-rowindex="' + parseInt(nTr.getAttribute('aria-rowindex'), 10)
                        + '"]')) {
                        continue;
                    }
                    // if (this.isMonthFirstDate(agendaDate)) {
                    //     tBody.appendChild(this.renderMonthHeader(this.createTableRowElement(agendaDate, 'monthHeader')));
                    // }
                    var dTd = nTr.children[0];
                    var aTd = nTr.children[1];
                    if (filterData.length > 0 || (!this.parent.hideEmptyAgendaDays && filterData.length === 0)) {
                        var elementType = (!this.parent.hideEmptyAgendaDays && filterData.length === 0) ? 'noEvents' : 'data';
                        dTd.appendChild(this.agendaBase.createDateHeaderElement(agendaDate));
                        nTr.appendChild(dTd);
                        var cTd = this.agendaBase.createAgendaContentElement(elementType, filterData, aTd);
                        nTr.appendChild(cTd);
                        if (cTd.querySelectorAll('li').length > 0) {
                            tBody.appendChild(nTr);
                        }
                    }
                    else if (this.parent.activeViewOptions.allowVirtualScrolling) {
                        day--;
                    }
                    if (this.isCurrentDate(new Date(agendaDate.getTime()))) {
                        addClass(dTd.childNodes, AGENDA_CURRENT_DAY_CLASS);
                    }
                    agendaDate = addDays(agendaDate, 1);
                    if (agendaDate.getTime() > lastDate.getTime()) {
                        break;
                    }
                }
            }
            endDate = new Date(agendaDate.getTime() - MS_PER_DAY);
        }
        else {
            this.agendaBase.renderEmptyContent(tBody, agendaDate);
            endDate = addDays(agendaDate, this.parent.agendaDaysCount - 1);
        }
        this.agendaDates = { start: firstDate, end: endDate };
    };
    // private renderMonthHeader(mTr: Element): Element {
    //     mTr.removeAttribute('aria-rowindex');
    //     for (let td of [].slice.call(mTr.childNodes)) {
    //         td.removeAttribute('aria-colindex');
    //     }
    //     let headerDate: Date = new Date(parseInt(mTr.children[0].getAttribute('data-date'), 10));
    //     let div: Element = createElement('div', {
    //         className: cls.DATE_HEADER_CLASS,
    //         innerHTML: headerDate.toLocaleString(this.parent.locale, { month: 'long' }) + '&nbsp' + headerDate.getFullYear()
    //     });
    //     mTr.lastElementChild.appendChild(div);
    //     return mTr;
    // }
    Agenda.prototype.agendaScrolling = function (event) {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            this.virtualScrolling(event);
        }
    };
    Agenda.prototype.virtualScrolling = function (event) {
        var target = event.target;
        var scrollTop = target.scrollTop;
        var scrollHeight = target.scrollHeight;
        var offsetHeight = target.clientHeight;
        var totalHeight = scrollTop + offsetHeight;
        var direction = (this.virtualScrollTop < scrollTop) ? 'next' : 'previous';
        var tBody = target.querySelector('tbody');
        var emptyTBody = createElement('tbody');
        var topElement = this.getElementFromScrollerPosition(event, direction);
        var scrollDate = new Date(parseInt(topElement.getAttribute('data-date'), 0));
        var filterDate;
        var filterData;
        if (scrollTop === 0) {
            filterDate = this.getPreviousNextDate(addDays(scrollDate, -1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start);
                tBody.innerHTML = emptyTBody.innerHTML + tBody.innerHTML;
                this.agendaBase.wireEventActions();
                for (var s = 0, element = tBody.children; s < element.length; s++) {
                    if (element[s].getAttribute('aria-rowindex') === topElement.getAttribute('aria-colindex')) {
                        var scrollToValue = element[s].offsetTop -
                            this.element.querySelector('.e-agenda-item').offsetHeight;
                        target.scrollTop = scrollToValue;
                        break;
                    }
                }
                this.updateHeaderText(scrollDate);
            }
        }
        else if (totalHeight === scrollHeight) {
            filterDate = this.getPreviousNextDate(addDays(scrollDate, 1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start);
                tBody.innerHTML += emptyTBody.innerHTML;
                this.agendaBase.wireEventActions();
                this.updateHeaderText(scrollDate);
            }
        }
        else {
            this.updateHeaderText(scrollDate);
        }
        this.virtualScrollTop = scrollTop;
        var selectedElements = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            selectedElements[selectedElements.length - 1].focus();
        }
    };
    Agenda.prototype.getElementFromScrollerPosition = function (event, direction) {
        var filterElement;
        var target = event.target;
        var scrollTop = target.scrollTop;
        var scrollHeight = target.scrollHeight;
        var offsetHeight = target.clientHeight;
        var totalHeight = scrollTop + offsetHeight;
        var liCollection = [].slice.call(target.querySelectorAll('.e-agenda-item'));
        var li;
        var liDetails;
        if (liCollection.length > 0) {
            if (scrollTop === 0) {
                li = liCollection[0];
                filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
            }
            else if (totalHeight === scrollHeight) {
                li = liCollection[liCollection.length - 1];
                filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
            }
            else {
                for (var a = 0, length_1 = liCollection.length; a < length_1; a++) {
                    li = liCollection[a];
                    liDetails = li.getBoundingClientRect();
                    if (liDetails.top >= 0) {
                        filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
                        break;
                    }
                }
            }
        }
        return filterElement;
    };
    Agenda.prototype.updateHeaderText = function (date) {
        if (this.parent.showHeaderBar) {
            this.parent.headerModule.updateDateRange(this.getDateRangeText(date));
        }
    };
    Agenda.prototype.getPreviousNextDate = function (date, type) {
        var currentDate = new Date(date.getTime());
        var firstDate = this.getStartDateFromEndDate(date);
        var lastDate = this.getEndDateFromStartDate(date);
        var daysCount = 0;
        do {
            var filterData = this.appointmentFiltering(currentDate);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                daysCount++;
            }
            currentDate = addDays(currentDate, (type === 'next') ? 1 : -1);
            if (currentDate < firstDate || currentDate > lastDate) {
                break;
            }
        } while (daysCount !== this.parent.agendaDaysCount);
        var endDate = addDays(currentDate, (type === 'next') ? -1 : 1);
        return (type === 'next') ? { start: date, end: addDays(endDate, 1) } : { start: endDate, end: addDays(date, 1) };
    };
    Agenda.prototype.appointmentFiltering = function (startDate, endDate) {
        var dateStart;
        var dateEnd;
        if (!isNullOrUndefined(startDate) && isNullOrUndefined(endDate)) {
            dateStart = resetTime(new Date(startDate.getTime()));
            dateEnd = setTime(new Date(dateStart.getTime()), MS_PER_DAY);
        }
        else {
            dateStart = new Date(startDate.getTime());
            dateEnd = new Date(endDate.getTime());
        }
        var filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        if (filterData.length === 0) {
            this.refreshEvent(startDate);
            filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        }
        return filterData;
    };
    Agenda.prototype.getStartDateFromEndDate = function (endDate) {
        var filterDate;
        var fieldMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            var firstDate = Math.min.apply(Math, this.parent.eventsProcessed.map(function (a) {
                var date = a[fieldMapping.startTime];
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(firstDate) : this.minDate;
        }
        else {
            filterDate = this.parent.hideEmptyAgendaDays ? addMonths(endDate, -1) : this.minDate;
        }
        return resetTime(filterDate);
    };
    Agenda.prototype.getEndDateFromStartDate = function (startDate) {
        var filterDate;
        var fieldMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            var lastDate = Math.max.apply(Math, this.parent.eventsProcessed.map(function (a) {
                var date = a[fieldMapping.endTime];
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(lastDate) : this.maxDate;
        }
        else {
            filterDate = this.parent.hideEmptyAgendaDays ? addMonths(startDate, 1) : this.maxDate;
        }
        return resetTime(addDays(filterDate, 1));
    };
    Agenda.prototype.getNextPreviousDate = function (type) {
        var noOfDays = (type === 'next') ? 1 : -1;
        return addDays(this.parent.selectedDate, noOfDays);
    };
    Agenda.prototype.startDate = function () {
        return resetTime(this.parent.selectedDate);
    };
    Agenda.prototype.endDate = function () {
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            return this.getEndDateFromStartDate(this.startDate());
        }
        else {
            return addDays(this.startDate(), this.parent.agendaDaysCount);
        }
    };
    Agenda.prototype.getDateRangeText = function (date) {
        var formatDate = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
        if (this.parent.activeViewOptions.allowVirtualScrolling || this.parent.isAdaptive) {
            var currentDate = isNullOrUndefined(date) ? this.parent.selectedDate : date;
            return this.parent.globalize.formatDate(currentDate, { format: formatDate, calendar: this.parent.getCalendarMode() });
        }
        else {
            var startDate = this.parent.selectedDate;
            var endDate = addDays(startDate, this.parent.agendaDaysCount - 1);
            return this.formatDateRange(startDate, endDate);
        }
    };
    Agenda.prototype.dayNavigationClick = function (e) {
        var date = this.parent.getDateFromElement(closest(e.currentTarget, '.' + AGENDA_CELLS_CLASS));
        if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: date }, true);
            this.parent.changeView('Day');
        }
    };
    // private isMonthFirstDate(date: Date): boolean {
    //     return date.getDate() === 1;
    // }
    Agenda.prototype.wireEvents = function () {
        EventHandler.add(this.element.querySelector('.' + CONTENT_WRAP_CLASS), scroll, this.agendaScrolling, this);
    };
    Agenda.prototype.unWireEvents = function () {
        EventHandler.remove(this.element.querySelector('.' + CONTENT_WRAP_CLASS), scroll, this.agendaScrolling);
        var dateHeaderElement = [].slice.call(this.element.querySelectorAll('.e-m-date'));
        for (var _i = 0, dateHeaderElement_1 = dateHeaderElement; _i < dateHeaderElement_1.length; _i++) {
            var element = dateHeaderElement_1[_i];
            EventHandler.remove(element, 'click', this.dayNavigationClick);
        }
    };
    Agenda.prototype.addEventListener = function () {
        this.parent.on(scrollUiUpdate, this.onAgendaScrollUiUpdate, this);
        this.parent.on(dataReady, this.eventLoad, this);
    };
    Agenda.prototype.removeEventListener = function () {
        this.parent.off(scrollUiUpdate, this.onAgendaScrollUiUpdate);
        this.parent.off(dataReady, this.eventLoad);
    };
    Agenda.prototype.onAgendaScrollUiUpdate = function () {
        var headerHeight = this.getHeaderBarHeight();
        if (this.parent.headerModule) {
            if (this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('add');
            }
            else {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
        var contentArea = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentArea.style.height = formatUnit(this.parent.element.offsetHeight - headerHeight);
    };
    /**
     * To destroy the agenda.
     * @return {void}
     * @private
     */
    Agenda.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.unWireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.headerModule && this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
    };
    return Agenda;
}(ViewBase));

var __extends$21 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * month agenda view
 */
var MonthAgenda = /** @__PURE__ @class */ (function (_super) {
    __extends$21(MonthAgenda, _super);
    /**
     * Constructor
     */
    function MonthAgenda(parent) {
        var _this = _super.call(this, parent) || this;
        _this.dayNameFormat = 'narrow';
        _this.viewClass = 'e-month-agenda-view';
        _this.agendaDates = {};
        _this.agendaBase = new AgendaBase(parent);
        return _this;
    }
    MonthAgenda.prototype.renderAppointmentContainer = function () {
        var contentArea = this.getContentAreaElement();
        var wrapperContainer = createElement('div', { className: WRAPPER_CONTAINER_CLASS });
        contentArea.appendChild(wrapperContainer);
        var appWrap = createElement('div', { className: APPOINTMENT_WRAP_CLASS });
        wrapperContainer.appendChild(appWrap);
        this.appendAppContainer(appWrap);
        this.setEventWrapperHeight();
    };
    MonthAgenda.prototype.getDayNameFormat = function () {
        if (this.parent.isAdaptive) {
            return 'narrow';
        }
        return 'abbreviated';
    };
    MonthAgenda.prototype.setEventWrapperHeight = function () {
        var headerHeight = (this.parent.headerModule ? this.parent.headerModule.getHeaderElement().offsetHeight : 0) + 2;
        var resourceWrapper = this.parent.element.querySelector('.' + RESOURCE_HEADER_TOOLBAR);
        if (resourceWrapper) {
            headerHeight += resourceWrapper.offsetHeight;
        }
        var contentArea = this.getContentAreaElement().firstChild;
        var dateHeader = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        var availableHeight = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight - contentArea.offsetHeight;
        var wrapperContainer = this.element.querySelector('.' + WRAPPER_CONTAINER_CLASS);
        var eventWrapper = this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS);
        wrapperContainer.style.height = eventWrapper.style.height = formatUnit(availableHeight);
    };
    MonthAgenda.prototype.onDataReady = function (args) {
        this.setEventWrapperHeight();
        this.clearElements();
        var eventCollection = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            var resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        var count = 0;
        for (var _i = 0, _a = this.renderDates; _i < _a.length; _i++) {
            var date = _a[_i];
            var filterData = this.appointmentFiltering(date);
            var workCell = this.element.querySelectorAll('.' + WORK_CELLS_CLASS)[count];
            if (filterData.length > 0) {
                if (!workCell.querySelector('.' + APPOINTMENT_INDICATOR_CLASS)) {
                    workCell.appendChild(createElement('div', { className: APPOINTMENT_INDICATOR_CLASS }));
                }
                if (date.getTime() === resetTime(new Date(this.parent.selectedDate.getTime())).getTime()) {
                    this.onEventRender(filterData, date);
                }
            }
            count++;
        }
    };
    MonthAgenda.prototype.onCellClick = function (event) {
        this.parent.quickPopup.quickPopupHide();
        var filterData = this.appointmentFiltering(event.startTime);
        this.onEventRender(filterData, event.startTime);
        this.parent.setProperties({ selectedDate: new Date('' + event.startTime) }, true);
    };
    MonthAgenda.prototype.onEventRender = function (events, date) {
        var appWrap = this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS);
        appWrap.innerHTML = '';
        if (this.parent.activeViewOptions.group.resources.length === 0 || this.parent.uiStateValues.isGroupAdaptive) {
            if (events.length > 0) {
                var appContainer = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
                appWrap.appendChild(this.agendaBase.
                    createAgendaContentElement('data', events, appContainer));
            }
            else {
                this.appendAppContainer(appWrap);
            }
        }
        else {
            if (events.length > 0) {
                var table = this.createTableLayout();
                var tBody = table.querySelector('tbody');
                this.agendaBase.calculateResourceTableElement(tBody, 1, date);
                table.appendChild(tBody);
                appWrap.appendChild(table);
            }
            else {
                this.appendAppContainer(appWrap);
            }
        }
        this.agendaBase.wireEventActions();
    };
    MonthAgenda.prototype.appointmentFiltering = function (date) {
        var dateStart = resetTime(new Date(date.getTime()));
        var dateEnd = setTime(new Date(dateStart.getTime()), MS_PER_DAY);
        return this.parent.eventBase.filterEvents(dateStart, dateEnd);
    };
    MonthAgenda.prototype.clearElements = function () {
        var appointmentIndicators = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_INDICATOR_CLASS));
        for (var _i = 0, appointmentIndicators_1 = appointmentIndicators; _i < appointmentIndicators_1.length; _i++) {
            var appointmentIndicator = appointmentIndicators_1[_i];
            remove(appointmentIndicator);
        }
        this.appendAppContainer(this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS));
    };
    MonthAgenda.prototype.appendAppContainer = function (appWrap) {
        var app = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
        addClass([app], AGENDA_NO_EVENT_CLASS);
        app.innerHTML = this.parent.localeObj.getConstant('noEvents');
        appWrap.innerHTML = '';
        appWrap.appendChild(app);
    };
    /**
     * Get module name.
     */
    MonthAgenda.prototype.getModuleName = function () {
        return 'monthAgenda';
    };
    return MonthAgenda;
}(Month));

var __extends$23 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EVENT_GAP$1 = 2;
var BLOCK_INDICATOR_WIDTH = 22;
var BLOCK_INDICATOR_HEIGHT = 18;
/**
 * Timeline view events render
 */
var TimelineEvent = /** @__PURE__ @class */ (function (_super) {
    __extends$23(TimelineEvent, _super);
    /**
     * Constructor for timeline views
     */
    function TimelineEvent(parent, type) {
        var _this = _super.call(this, parent) || this;
        _this.startHour = _this.parent.activeView.getStartHour();
        _this.endHour = _this.parent.activeView.getEndHour();
        _this.slotCount = _this.parent.activeViewOptions.timeScale.slotCount;
        _this.interval = _this.parent.activeViewOptions.timeScale.interval;
        _this.day = 0;
        _this.rowIndex = 0;
        _this.renderType = type;
        _this.appContainers = [].slice.call(_this.element.querySelectorAll('.' + APPOINTMENT_CONTAINER_CLASS));
        _this.dayLength = _this.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        _this.content = _this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        return _this;
    }
    TimelineEvent.prototype.getSlotDates = function () {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map(function (date) { return +date; }));
        if (this.parent.headerRows.length > 0 &&
            this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        }
        else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    };
    TimelineEvent.prototype.getOverlapEvents = function (date, appointments) {
        var appointmentsList = [];
        if (this.renderType === 'day') {
            for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
                var app = appointments_1[_i];
                if ((resetTime(app[this.fields.startTime]).getTime() <= resetTime(new Date(date.getTime())).getTime()) &&
                    (resetTime(app[this.fields.endTime]).getTime() >= resetTime(new Date(date.getTime())).getTime())) {
                    appointmentsList.push(app);
                }
            }
        }
        else {
            for (var _a = 0, appointments_2 = appointments; _a < appointments_2.length; _a++) {
                var app = appointments_2[_a];
                var eventData = app.data;
                if (eventData[this.fields.startTime].getTime() <= date.getTime() &&
                    eventData[this.fields.endTime].getTime() > date.getTime()) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    };
    TimelineEvent.prototype.renderResourceEvents = function () {
        var resources = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        for (var i = 0; i < resources.length; i++) {
            this.rowIndex = i;
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[i]);
        }
    };
    TimelineEvent.prototype.renderEvents = function (event, resIndex) {
        var eventData = event.data;
        var startTime = this.getStartTime(event, eventData);
        var endTime = this.getEndTime(event, eventData);
        this.day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        var cellTd = this.getCellTd();
        var overlapCount = this.getIndex(startTime);
        event.Index = overlapCount;
        var appHeight = this.eventHeight;
        var diffInDays = eventData.count;
        if (startTime <= endTime) {
            var appWidth = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay], diffInDays);
            appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
            var appLeft = 0;
            var appRight = 0;
            var position = this.getPosition(startTime, endTime, event[this.fields.isAllDay], this.day);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true));
            var top_1 = this.getRowTop(resIndex);
            var appTop = (top_1 + EVENT_GAP$1) + (overlapCount * (appHeight + EVENT_GAP$1));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            if (this.cellHeight > ((overlapCount + 1) * (appHeight + EVENT_GAP$1)) + this.moreIndicatorHeight) {
                var appointmentElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                setStyleAttribute(appointmentElement, {
                    'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                });
                this.wireAppointmentEvents(appointmentElement, false, event);
                this.renderEventElement(event, appointmentElement, cellTd);
            }
            else {
                for (var i = 0; i < diffInDays; i++) {
                    var moreIndicator = cellTd.querySelector('.' + MORE_INDICATOR_CLASS);
                    var appPos = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    if ((cellTd && isNullOrUndefined(moreIndicator)) ||
                        (!this.isAlreadyAvail(appPos, cellTd))) {
                        var interval = this.interval / this.slotCount;
                        var startDate = new Date(this.dateRender[this.day + i].getTime());
                        var endDate = addDays(this.dateRender[this.day + i], 1);
                        var slotStartTime = (new Date(startTime.setMinutes(Math.floor(startTime.getMinutes() / interval) * interval)));
                        var slotEndTime = new Date(slotStartTime.getTime() + (60000 * interval));
                        var groupIndex = void 0;
                        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                            groupIndex = resIndex.toString();
                        }
                        var filterEvents = this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex);
                        var appArea = this.cellHeight - this.moreIndicatorHeight;
                        var renderedAppCount = Math.floor(appArea / (appHeight + EVENT_GAP$1));
                        var count = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
                        var moreIndicatorElement = void 0;
                        if (this.renderType === 'day') {
                            moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
                        }
                        else {
                            moreIndicatorElement = this.getMoreIndicatorElement(count, slotStartTime, slotEndTime);
                        }
                        if (!isNullOrUndefined(groupIndex)) {
                            moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                        }
                        moreIndicatorElement.style.top = top_1 + appArea + 'px';
                        moreIndicatorElement.style.width = this.cellWidth + 'px';
                        moreIndicatorElement.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
                        moreIndicatorElement.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
                        this.renderElement(cellTd, moreIndicatorElement);
                        EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                    }
                }
            }
        }
    };
    TimelineEvent.prototype.getStartTime = function (event, eventData) {
        var startTime = event[this.fields.startTime];
        var schedule = getStartEndHours(startTime, this.startHour, this.endHour);
        if (schedule.startHour.getTime() >= eventData[this.fields.startTime]) {
            startTime = schedule.startHour;
        }
        else if (schedule.endHour.getTime() <= eventData[this.fields.startTime]) {
            startTime = this.getNextDay(schedule.startHour, eventData);
        }
        else {
            startTime = eventData[this.fields.startTime];
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.startTime] = schedule.startHour;
        }
        return startTime;
    };
    TimelineEvent.prototype.getNextDay = function (startTime, eventData) {
        var startDate;
        for (var i = 1; i <= this.dateRender.length; i++) {
            startDate = addDays(startTime, i);
            if (this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime()))) !== -1) {
                eventData.count = eventData.count - 1;
                return startDate;
            }
        }
        return startDate;
    };
    TimelineEvent.prototype.getEndTime = function (event, eventData) {
        var endTime = event[this.fields.endTime];
        var schedule = getStartEndHours(endTime, this.startHour, this.endHour);
        if (schedule.endHour.getTime() <= eventData[this.fields.endTime]) {
            endTime = schedule.endHour;
        }
        else {
            endTime = eventData[this.fields.endTime];
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.endTime] = schedule.endHour;
        }
        return endTime;
    };
    TimelineEvent.prototype.getEventWidth = function (startDate, endDate, isAllDay, count) {
        if (this.renderType === 'day' || isAllDay) {
            return (count * this.slotsPerDay) * this.cellWidth;
        }
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        }
        else {
            return this.getSpannedEventsWidth(startDate, endDate, count);
        }
    };
    TimelineEvent.prototype.getSameDayEventsWidth = function (startDate, endDate) {
        return (((endDate.getTime() - startDate.getTime())) / (60 * 1000) * (this.cellWidth * this.slotCount) / this.interval);
    };
    TimelineEvent.prototype.getSpannedEventsWidth = function (startDate, endDate, diffInDays) {
        var width = (diffInDays * this.slotsPerDay) * this.cellWidth;
        var startWidth;
        var endWidth;
        var start = getStartEndHours(resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        startWidth = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        }
        else {
            var end = getStartEndHours(resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            endWidth = this.getSameDayEventsWidth(endDate, end.endHour);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        var spannedWidth = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : endWidth - startWidth;
    };
    TimelineEvent.prototype.isSameDay = function (startTime, endTime) {
        var startDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        var endDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endTime.getTime())));
        return (startDay === endDay);
    };
    TimelineEvent.prototype.getAppointmentLeft = function (schedule, startTime, day) {
        var slotTd = (this.isSameDay(startTime, schedule.startHour)) ?
            ((startTime.getTime() - schedule.startHour.getTime()) / ((60 * 1000) * this.interval)) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        }
        else {
            var daySlot = (((schedule.endHour.getTime() - schedule.startHour.getTime()) / (60 * 1000)) / this.interval) * this.slotCount;
            return (daySlot * day) + slotTd;
        }
    };
    TimelineEvent.prototype.getPosition = function (startTime, endTime, isAllDay, day) {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        var currentDate = resetTime(new Date(this.dateRender[day].getTime()));
        var schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        var cellIndex;
        if (schedule.endHour.getTime() <= endTime.getTime() && schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        }
        else if (schedule.endHour.getTime() <= endTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        else if (schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        }
        else {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        return cellIndex * this.cellWidth;
    };
    TimelineEvent.prototype.getFilterEvents = function (startDate, endDate, startTime, endTime, gIndex) {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex);
        }
        else {
            return this.getFilteredEvents(startTime, endTime, gIndex);
        }
    };
    TimelineEvent.prototype.isAlreadyAvail = function (appPos, cellTd) {
        var moreIndicator = [].slice.call(cellTd.querySelectorAll('.' + MORE_INDICATOR_CLASS));
        for (var i = 0; i < moreIndicator.length; i++) {
            var indicatorPos = void 0;
            if (moreIndicator) {
                indicatorPos = (this.parent.enableRtl) ? moreIndicator[i].style.right : moreIndicator[i].style.left;
            }
            if (parseInt(indicatorPos, 10) === Math.floor(appPos)) {
                return true;
            }
        }
        return false;
    };
    TimelineEvent.prototype.getRowTop = function (resIndex) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            var td = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' ' + 'tbody td[data-group-index="'
                + resIndex.toString() + '"]');
            return td.offsetTop;
        }
        return 0;
    };
    TimelineEvent.prototype.getCellTd = function () {
        var wrapIndex = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.appContainers[wrapIndex];
    };
    TimelineEvent.prototype.renderBlockIndicator = function (cellTd, position, resIndex) {
        // No need to render block icon for Year, Month and Week header rows
        if (this.parent.headerRows.length > 0 &&
            (this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour' ||
                this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Date')) {
            return;
        }
        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH;
        if (!this.isAlreadyAvail(position, cellTd)) {
            var blockIndicator = createElement('div', { className: 'e-icons ' + BLOCK_INDICATOR_CLASS });
            if (this.parent.enableRtl) {
                blockIndicator.style.right = position + 'px';
            }
            else {
                blockIndicator.style.left = position + 'px';
            }
            blockIndicator.style.top = this.getRowTop(resIndex) + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
            this.renderElement(cellTd, blockIndicator);
        }
    };
    return TimelineEvent;
}(MonthEvent));

/**
 * timeline header
 */
var TimelineHeaderRow = /** @__PURE__ @class */ (function () {
    function TimelineHeaderRow(parent, renderDates) {
        this.parent = parent;
        this.renderDates = renderDates;
    }
    TimelineHeaderRow.prototype.groupByYear = function (dates) {
        var result = {};
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var d = dates_1[_i];
            var key = d.getFullYear();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    };
    TimelineHeaderRow.prototype.groupByMonth = function (dates) {
        var result = {};
        for (var _i = 0, dates_2 = dates; _i < dates_2.length; _i++) {
            var d = dates_2[_i];
            var key = (d.getFullYear() - 1970) * 12 + d.getMonth();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    };
    TimelineHeaderRow.prototype.groupByWeek = function (dates) {
        var result = {};
        for (var _i = 0, dates_3 = dates; _i < dates_3.length; _i++) {
            var d = dates_3[_i];
            var jsDate = +new Date(1970, 0, 1);
            var key = Math.ceil(((((+d - jsDate)) / MS_PER_DAY) + new Date(jsDate).getDay() + 1) / 7);
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    };
    TimelineHeaderRow.prototype.generateSlots = function (data, colspan, template, tempFn, cls, type) {
        var _this = this;
        var tdDatas = [];
        var customHelper = {
            getYear: function (dt) {
                return _this.parent.globalize.formatDate(dt, { format: 'y', calendar: _this.parent.getCalendarMode() });
            },
            getMonth: function (dt) {
                return _this.parent.globalize.formatDate(dt, { format: 'MMMM', calendar: _this.parent.getCalendarMode() });
            },
            getWeekNumber: function (dt) {
                return getWeekNumber(dt);
            }
        };
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var dates = data[keys[i]];
            var htmlCol = void 0;
            if (!tempFn) {
                htmlCol = compile(template, customHelper)({ date: dates[0] });
            }
            else {
                var args = { date: dates[0], type: type };
                htmlCol = tempFn(args);
            }
            tdDatas.push({
                date: dates[0], type: type, className: [cls], colSpan: dates.length * colspan, template: htmlCol
            });
        }
        return tdDatas;
    };
    TimelineHeaderRow.prototype.generateColumnLevels = function (dateSlots, hourSlots) {
        var levels = [];
        var rows = this.parent.activeViewOptions.headerRows;
        var lastLevelColspan = 1;
        if (rows[rows.length - 1].option === 'Hour' && hourSlots.length > 0) {
            lastLevelColspan = hourSlots.length / dateSlots.length;
        }
        var tdDatas = [];
        var templateFn;
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            switch (row.option) {
                case 'Year':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    var yearTemplate = '<span class="e-header-year">${getYear(date)}</span>';
                    var byYear = this.groupByYear(this.renderDates);
                    tdDatas = this.generateSlots(byYear, lastLevelColspan, yearTemplate, templateFn, 'e-header-year-cell', 'yearHeader');
                    levels.push(tdDatas);
                    break;
                case 'Month':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    var monthTemp = '<span class="e-header-month">${getMonth(date)}</span>';
                    var byMonth = this.groupByMonth(this.renderDates);
                    tdDatas = this.generateSlots(byMonth, lastLevelColspan, monthTemp, templateFn, 'e-header-month-cell', 'monthHeader');
                    levels.push(tdDatas);
                    break;
                case 'Week':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    var weekTemplate = '<span class="e-header-week">${getWeekNumber(date)}</span>';
                    var byWeek = this.groupByWeek(this.renderDates);
                    tdDatas = this.generateSlots(byWeek, lastLevelColspan, weekTemplate, templateFn, 'e-header-week-cell', 'weekHeader');
                    levels.push(tdDatas);
                    break;
                case 'Date':
                    tdDatas = dateSlots;
                    tdDatas = tdDatas.map(function (value) {
                        value.colSpan = lastLevelColspan;
                        return value;
                    });
                    levels.push(tdDatas);
                    break;
                case 'Hour':
                    if (hourSlots.length > 0) {
                        levels.push(hourSlots);
                    }
                    break;
            }
        }
        return levels;
    };
    return TimelineHeaderRow;
}());

var __extends$22 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * timeline view
 */
var TimelineViews = /** @__PURE__ @class */ (function (_super) {
    __extends$22(TimelineViews, _super);
    function TimelineViews(parent) {
        var _this = _super.call(this, parent) || this;
        _this.dateHeaderTemplate = '<span class="e-header-date e-navigate">${getTimelineDate(date)}</span>';
        _this.baseCssClass = 'e-timeline-view';
        return _this;
    }
    TimelineViews.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    };
    TimelineViews.prototype.scrollTopPanel = function (target) {
        _super.prototype.scrollTopPanel.call(this, target);
        this.scrollHeaderLabels(target);
    };
    TimelineViews.prototype.scrollToWorkHour = function () {
        var start = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        var currDateTime = this.isWorkDay(this.parent.selectedDate) && this.parent.workHours.highlight &&
            !isNullOrUndefined(start) ? new Date(+this.parent.selectedDate).setHours(start.getHours(), start.getMinutes())
            : new Date(+this.parent.selectedDate).setHours(0, 0, 0, 0);
        var queryString = '[data-date="' + currDateTime + '"]';
        var firstWorkHourCell = this.element.querySelector(queryString);
        if (firstWorkHourCell) {
            this.getScrollableElement().scrollLeft = firstWorkHourCell.offsetLeft;
        }
    };
    TimelineViews.prototype.scrollToHour = function (hour) {
        var date = this.parent.globalize.parseDate(hour, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollLeft = this.getLeftFromDateTime(null, date);
    };
    TimelineViews.prototype.generateColumnLevels = function () {
        var levels = [];
        var dateSlots = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        levels.push(dateSlots);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(dateSlots, !this.parent.uiStateValues.isGroupAdaptive);
        }
        var hourSlots = [];
        if (this.parent.activeViewOptions.timeScale.enable) {
            hourSlots = this.generateTimeSlots(levels[levels.length - 1]);
            levels.push(hourSlots);
        }
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            var renderGn = new TimelineHeaderRow(this.parent, this.renderDates);
            levels = renderGn.generateColumnLevels(dateSlots, hourSlots);
        }
        return levels;
    };
    TimelineViews.prototype.generateTimeSlots = function (dateSlots) {
        var _this = this;
        var handler = function (r) {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.first ? ['e-time-slots'] : ['e-time-slots', TIME_CELLS_CLASS];
            r.workDays = _this.parent.activeViewOptions.workDays;
            return r;
        };
        var timeSlotData = this.getTimeSlotRows(handler);
        var slots = [];
        for (var _i = 0, dateSlots_1 = dateSlots; _i < dateSlots_1.length; _i++) {
            var data = dateSlots_1[_i];
            data.colSpan = timeSlotData.length;
            var tempTimeSlots = extend([], timeSlotData, null, true);
            for (var _a = 0, tempTimeSlots_1 = tempTimeSlots; _a < tempTimeSlots_1.length; _a++) {
                var slot = tempTimeSlots_1[_a];
                slot.date = new Date(+resetTime(data.date) + getDateInMs(slot.date));
                slots.push(slot);
            }
        }
        return slots;
    };
    TimelineViews.prototype.changeCurrentTimePosition = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        var currentDateIndex = this.getCurrentTimeIndicatorIndex();
        var left = this.getLeftFromDateTime(currentDateIndex, new Date());
        var height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
        var headerWrap = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        var contentWrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentWrap.appendChild(createElement('div', {
            className: CURRENT_TIMELINE_CLASS,
            styles: (this.parent.enableRtl ? 'right' : 'left') + ':' + formatUnit(left) + '; height:' + formatUnit(height)
        }));
        var currentTimeEle = createElement('div', {
            innerHTML: this.parent.getTimeString(new Date()),
            className: CURRENT_TIME_CLASS
        });
        headerWrap.appendChild(currentTimeEle);
        currentTimeEle.style[this.parent.enableRtl ? 'right' : 'left'] = formatUnit(left - (currentTimeEle.offsetWidth / 2));
    };
    TimelineViews.prototype.getLeftFromDateTime = function (currentDateIndex, date) {
        var startHour = this.getStartHour();
        var endHour = this.getEndHour();
        var diffInDates = 0;
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        if (!isNullOrUndefined(currentDateIndex)) {
            var end = (endHour.getHours() === 0) ? 24 : endHour.getHours();
            if (currentDateIndex[0] !== 0) {
                diffInDates = (currentDateIndex[0]) * ((end - startHour.getHours()) * 60) + (endHour.getMinutes() - startHour.getMinutes());
            }
            diffInMinutes = diffInDates + diffInMinutes;
        }
        return (diffInMinutes * this.getWorkCellWidth() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    };
    TimelineViews.prototype.getWorkCellWidth = function () {
        return this.element.querySelector('.e-work-cells').offsetWidth;
    };
    TimelineViews.prototype.renderHeader = function () {
        var tr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        var dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    };
    TimelineViews.prototype.createAllDayRow = function (table, tdData) {
        // For current time indicator wrapper
    };
    TimelineViews.prototype.getCurrentTimeIndicatorIndex = function () {
        var currentDateIndex = [];
        var index = this.parent.getIndexOfDate(this.renderDates, resetTime(new Date()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    };
    TimelineViews.prototype.renderContent = function () {
        var tr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            var resTd = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            tr.appendChild(resTd);
        }
        var workTd = createElement('td');
        var wrap = this.renderContentArea();
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        this.element.querySelector('tbody').appendChild(tr);
    };
    TimelineViews.prototype.getRowCount = function () {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    };
    TimelineViews.prototype.getResourceTdData = function (i, tdData) {
        var resLevel = this.parent.resourceBase.renderedResources[i];
        var resSHr = resLevel.resourceData[resLevel.resource.startHourField] || this.parent.workHours.start;
        var resEHr = resLevel.resourceData[resLevel.resource.endHourField] || this.parent.workHours.end;
        tdData.startHour = this.parent.globalize.parseDate(resSHr, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        tdData.endHour = this.parent.globalize.parseDate(resEHr, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
        tdData.workDays = resLevel.resourceData[resLevel.resource.workDaysField] || this.parent.workDays;
        tdData.className = resLevel.className;
        tdData.groupIndex = resLevel.groupIndex;
        tdData.groupOrder = resLevel.groupOrder;
        return tdData;
    };
    TimelineViews.prototype.renderContentTable = function (table) {
        var tBody = table.querySelector('tbody');
        append(this.getContentRows(), tBody);
    };
    TimelineViews.prototype.getContentRows = function () {
        var rows = [];
        var tr = createElement('tr', { attrs: { role: 'row' } });
        var td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        var trCount = this.getRowCount();
        for (var i = 0; i < trCount; i++) {
            var ntr = tr.cloneNode();
            for (var _i = 0, _a = this.colLevels[this.colLevels.length - 1]; _i < _a.length; _i++) {
                var tdData = _a[_i];
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    tdData = this.getResourceTdData(i, tdData);
                }
                var ntd = this.createContentTd(tdData, tdData, td);
                ntr.appendChild(ntd);
            }
            rows.push(ntr);
        }
        return rows;
    };
    TimelineViews.prototype.getContentTdClass = function (r) {
        return (r.first || !this.parent.activeViewOptions.timeScale.enable) ? [WORK_CELLS_CLASS] :
            [WORK_CELLS_CLASS, ALTERNATE_CELLS_CLASS];
    };
    TimelineViews.prototype.renderEvents = function () {
        if (this.parent.activeViewOptions.timeScale.enable) {
            var appointment = new TimelineEvent(this.parent, 'hour');
            appointment.renderAppointments();
        }
        else {
            var appointment = new TimelineEvent(this.parent, 'day');
            appointment.renderAppointments();
        }
    };
    TimelineViews.prototype.getModuleName = function () {
        return 'timelineViews';
    };
    return TimelineViews;
}(VerticalView));

var __extends$24 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * timeline month view
 */
var TimelineMonth = /** @__PURE__ @class */ (function (_super) {
    __extends$24(TimelineMonth, _super);
    /**
     * Constructor for timeline month view
     */
    function TimelineMonth(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-timeline-month-view';
        _this.isInverseTableSelect = true;
        return _this;
    }
    /**
     * Get module name.
     */
    TimelineMonth.prototype.getModuleName = function () {
        return 'timelineMonth';
    };
    TimelineMonth.prototype.onDataReady = function (args) {
        var appointment = new TimelineEvent(this.parent, 'day');
        appointment.renderAppointments();
    };
    TimelineMonth.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    };
    TimelineMonth.prototype.scrollTopPanel = function (target) {
        _super.prototype.scrollTopPanel.call(this, target);
        this.scrollHeaderLabels(target);
    };
    TimelineMonth.prototype.setContentHeight = function (content, leftPanelElement, height) {
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
        content.style.height = formatUnit(height);
    };
    TimelineMonth.prototype.getDateSlots = function (renderDates, workDays) {
        var dateSlots = [];
        for (var _i = 0, renderDates_1 = renderDates; _i < renderDates_1.length; _i++) {
            var col = renderDates_1[_i];
            var classList$$1 = [HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: col, type: 'dateHeader', className: classList$$1, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    };
    TimelineMonth.prototype.renderLeftIndent = function (tr) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
    };
    TimelineMonth.prototype.renderContent = function () {
        var contentTr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            var resTd = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            contentTr.appendChild(resTd);
        }
        var contentTd = createElement('td');
        this.element.querySelector('tbody').appendChild(contentTr);
        var wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        wrap.appendChild(this.renderContentArea());
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        contentTd.appendChild(wrap);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        contentTr.appendChild(contentTd);
    };
    TimelineMonth.prototype.getRowCount = function () {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    };
    TimelineMonth.prototype.getContentSlots = function () {
        var slotDatas = [];
        for (var row = 0; row < this.getRowCount(); row++) {
            for (var _i = 0, _a = this.colLevels[this.colLevels.length - 1]; _i < _a.length; _i++) {
                var data = _a[_i];
                data.className = [WORK_CELLS_CLASS];
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    var resLevel = this.parent.resourceBase.renderedResources[row];
                    data.workDays = resLevel.resourceData[resLevel.resource.workDaysField] || this.parent.workDays;
                    data.className = data.className.concat(resLevel.className);
                    data.groupIndex = resLevel.groupIndex;
                    data.groupOrder = resLevel.groupOrder;
                }
                var slotData = {
                    date: new Date(+data.date), colSpan: data.colSpan, groupIndex: data.groupIndex, workDays: data.workDays,
                    type: 'monthCells', className: data.className
                };
                if (!slotDatas[row]) {
                    slotDatas[row] = [];
                }
                slotDatas[row].push(slotData);
            }
        }
        return slotDatas;
    };
    TimelineMonth.prototype.updateClassList = function () {
        // No need to update content for timeline month view
    };
    TimelineMonth.prototype.unwireEvents = function () {
        EventHandler.remove(this.getContentAreaElement(), 'scroll', this.onContentScroll);
    };
    TimelineMonth.prototype.getMonthStart = function (currentDate) {
        var monthStart = this.parent.calendarUtil.firstDateOfMonth(resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    };
    TimelineMonth.prototype.getMonthEnd = function (currentDate) {
        var monthStart = this.parent.calendarUtil.firstDateOfMonth(resetTime(currentDate));
        return this.parent.calendarUtil.lastDateOfMonth(addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    };
    TimelineMonth.prototype.generateColumnLevels = function () {
        var colLevels = [];
        var level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        colLevels.push(level);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(level, !this.parent.uiStateValues.isGroupAdaptive);
        }
        var hourSlots = [];
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            var renderGn = new TimelineHeaderRow(this.parent, this.renderDates);
            colLevels = renderGn.generateColumnLevels(level, hourSlots);
        }
        this.colLevels = colLevels;
        return colLevels;
    };
    return TimelineMonth;
}(Month));

/**
 * Schedule component exported items
 */

/**
 * Recurrence-Editor component exported items
 */

/**
 * Export Schedule components
 */

export { Schedule, cellClick, cellDoubleClick, actionBegin, actionComplete, actionFailure, navigating, renderCell, eventClick, eventRendered, dataBinding, dataBound, popupOpen, dragStart, drag, dragStop, resizeStart, resizing, resizeStop, initialLoad, initialEnd, dataReady, contentReady, scroll, virtualScroll, scrollUiUpdate, uiUpdate, documentClick, cellMouseDown, WEEK_LENGTH, MS_PER_DAY, MS_PER_MINUTE, getElementHeightFromClass, getTranslateY, getWeekFirstDate, firstDateOfMonth, lastDateOfMonth, getWeekNumber, setTime, resetTime, getDateInMs, addDays, addMonths, addYears, getStartEndHours, getMaxDays, getDaysCount, getDateFromString, getScrollBarWidth, findIndexInData, getOuterHeight, Resize, DragAndDrop, HeaderRenderer, ViewBase, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Timezone, timezoneData, RecurrenceEditor };
//# sourceMappingURL=ej2-schedule.es5.js.map
