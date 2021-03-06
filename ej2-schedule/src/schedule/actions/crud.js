import { isNullOrUndefined } from '-syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '-syncfusion/ej2-data';
import { getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';
import * as events from '../base/constant';
import { Timezone } from '../timezone/timezone';
/**
 * Schedule CRUD operations
 */
var Crud = /** @class */ (function () {
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
            this.parent.trigger(events.actionComplete, actionArgs);
            this.parent.renderModule.refreshDataManager();
            return;
        }
        else {
            args.promise.then(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(events.actionComplete, actionArgs);
                if (actionArgs.cancel) {
                    return;
                }
                _this.parent.renderModule.refreshDataManager();
            }).catch(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(events.actionFailure, { error: e });
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
        this.parent.trigger(events.actionBegin, args);
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
            this.parent.trigger(events.actionBegin, args);
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
                    this.parent.trigger(events.actionBegin, args);
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
                    this.parent.trigger(events.actionBegin, args);
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
            this.parent.trigger(events.actionBegin, args);
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
                        this.parent.trigger(events.actionBegin, args);
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
export { Crud };
