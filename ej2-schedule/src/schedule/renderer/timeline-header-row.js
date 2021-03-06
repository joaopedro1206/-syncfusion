import { compile } from '-syncfusion/ej2-base';
import { MS_PER_DAY, getWeekNumber } from '../base/util';
/**
 * timeline header
 */
var TimelineHeaderRow = /** @class */ (function () {
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
export { TimelineHeaderRow };
