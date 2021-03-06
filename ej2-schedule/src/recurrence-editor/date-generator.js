import { isNullOrUndefined, getDefaultDateObject, getValue, cldrData } from '-syncfusion/ej2-base';
import { MS_PER_DAY } from '../schedule/base/util';
/**
 * Date Generator from Recurrence Rule
 */
export function generateSummary(rule, localeObject, locale) {
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
export function generate(startDate, rule, excludeDate, startDayOfWeek, maximumCount, viewDate) {
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
export function extractObjectFromRule(rules) {
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
export function getRecurrenceStringFromDate(date) {
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
