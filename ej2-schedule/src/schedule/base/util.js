import { createElement, remove } from '-syncfusion/ej2-base';
/**
 * Schedule common utilities
 */
export var WEEK_LENGTH = 7;
export var MS_PER_DAY = 86400000;
export var MS_PER_MINUTE = 60000;
export function getElementHeightFromClass(container, elementClass) {
    var height = 0;
    var el = createElement('div', { className: elementClass }).cloneNode();
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getOuterHeight(el);
    remove(el);
    return height;
}
export function getTranslateY(element) {
    var style = getComputedStyle(element);
    return window.WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}
export function getWeekFirstDate(date1, firstDayOfWeek) {
    var date = new Date(date1.getTime());
    firstDayOfWeek = (firstDayOfWeek - date.getDay() + 7 * (-1)) % 7;
    return new Date(date.setDate(date.getDate() + firstDayOfWeek));
}
export function firstDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
}
export function lastDateOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
}
export function getWeekNumber(dt) {
    var currentDate = new Date('' + dt).valueOf();
    var date = new Date(dt.getFullYear(), 0, 1).valueOf();
    var a = (currentDate - date);
    return Math.ceil((((a) / MS_PER_DAY) + new Date(date).getDay() + 1) / 7);
}
export function setTime(date, time) {
    var tzOffsetBefore = date.getTimezoneOffset();
    var d = new Date(date.getTime() + time);
    var tzOffsetDiff = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}
export function resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
}
export function getDateInMs(date) {
    return date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
}
export function addDays(date, i) {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + i));
}
export function addMonths(date, i) {
    date = new Date('' + date);
    var day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
export function addYears(date, i) {
    date = new Date('' + date);
    var day = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
export function getStartEndHours(date, startHour, endHour) {
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
export function getMaxDays(d) {
    var date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
}
export function getDaysCount(startDate, endDate) {
    var strTime = resetTime(new Date(startDate));
    var endTime = resetTime(new Date(endDate));
    return (endTime.getTime() - strTime.getTime()) / MS_PER_DAY;
}
export function getDateFromString(date) {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}
/** @hidden */
var scrollWidth = null;
/** @hidden */
export function getScrollBarWidth() {
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
export function findIndexInData(data, property, value) {
    for (var i = 0, length_1 = data.length; i < length_1; i++) {
        if (data[i][property] === value) {
            return i;
        }
    }
    return -1;
}
export function getOuterHeight(element) {
    var style = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}
