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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Property, Event, Animation, Collection } from '-syncfusion/ej2-base';
import { EventHandler, Browser, Internationalization, getDefaultDateObject, cldrData, L10n } from '-syncfusion/ej2-base';
import { getValue, compile, extend, isNullOrUndefined, NotifyPropertyChanges, Complex } from '-syncfusion/ej2-base';
import { removeClass, addClass, classList, remove } from '-syncfusion/ej2-base';
import { createSpinner, hideSpinner, showSpinner } from '-syncfusion/ej2-popups';
import { HeaderRenderer } from '../renderer/header-renderer';
import { Scroll } from '../actions/scroll';
import { ScheduleTouch } from '../actions/touch';
import { KeyboardInteraction } from '../actions/keyboard';
import { Data } from '../actions/data';
import { EventBase } from '../event-renderer/event-base';
import { QuickPopups } from '../popups/quick-popups';
import { EventTooltip } from '../popups/event-tooltip';
import { EventWindow } from '../popups/event-window';
import { Render } from '../renderer/renderer';
import { WorkHours } from '../models/work-hours';
import { TimeScale } from '../models/time-scale';
import { QuickInfoTemplates } from '../models/quick-info-templates';
import { HeaderRows } from '../models/header-rows';
import { Crud } from '../actions/crud';
import { EventSettings } from '../models/event-settings';
import { Group } from '../models/group';
import { Resources } from '../models/resources';
import { ResourceBase } from '../base/resource';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { Gregorian, Islamic } from './calendar-util';
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
var Schedule = /** @class */ (function (_super) {
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
        addClasses.push(cls.ROOT);
        if (this.enableRtl) {
            addClasses.push(cls.RTL);
        }
        else {
            removeClasses.push(cls.RTL);
        }
        if (this.isAdaptive) {
            addClasses.push(cls.DEVICE_CLASS);
        }
        else {
            removeClasses.push(cls.DEVICE_CLASS);
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
        this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
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
        if (!this.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS)) {
            this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
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
        this.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        var navArgs = { action: 'view', cancel: false, previousView: this.currentView, currentView: view };
        this.trigger(events.navigating, navArgs);
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
        this.trigger(events.actionComplete, args);
    };
    Schedule.prototype.changeDate = function (selectedDate, event) {
        var args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        var navArgs = { action: 'date', cancel: false, previousDate: this.selectedDate, currentDate: selectedDate };
        this.trigger(events.navigating, navArgs);
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
        this.trigger(events.actionComplete, args);
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
            day: 'Dia',
            week: 'Semana',
            workWeek: 'Semana de Trabalho',
            month: 'Mês',
            agenda: 'Agenda',
            weekAgenda: 'Week Agenda',
            workWeekAgenda: 'Work Week Agenda',
            monthAgenda: 'Month Agenda',
            today: 'Hoje',
            noEvents: 'Nenhum Evento',
            emptyContainer: 'There are no events scheduled on this day.',
            allDay: 'Dia todo',
            start: 'Inicio',
            end: 'Fim',
            more: 'mais',
            close: 'Fechar',
            cancel: 'Cancelar',
            noTitle: '(Sem Títilo)',
            delete: 'Delete',
            deleteEvent: 'Delete Evento',
            deleteMultipleEvent: 'Delete Multiplos Eventos',
            selectedItems: 'Itens selecionados',
            deleteSeries: 'Delete Series',
            edit: 'Editar',
            editSeries: 'Editar Series',
            editEvent: 'Editar Evento',
            createEvent: 'Criar',
            subject: 'Matéria',
            addTitle: 'Adicionar Título',
            moreDetails: 'Mais Detalhes',
            save: 'Salvar',
            editContent: 'Quer editar apenas este evento ou toda a série?',
            deleteRecurrenceContent: 'Deseja excluir apenas este evento ou toda a série?',
            deleteContent: 'Tem certeza que quer excluir este evento?',
            deleteMultipleContent: 'Tem certeza que quer excluir os eventos selecionados?',
            newEvent: 'Novo Evento',
            title: 'Título',
            location: 'Localização',
            description: 'Descrição',
            timezone: 'Timezone',
            startTimezone: 'Início Timezone',
            endTimezone: 'Fim Timezone',
            repeat: 'Repetir',
            saveButton: 'Salvar',
            cancelButton: 'Cancelar',
            deleteButton: 'Delete',
            recurrence: 'Recorrente',
            wrongPattern: 'O padrão de recorrência não é válido.',
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
            previous: 'Anterior',
            next: 'Próximo',
            timelineDay: 'Timeline do Dia',
            timelineWeek: 'Timeline da Semana',
            timelineWorkWeek: 'Timeline Semana de Trabalho',
            timelineMonth: 'Timeline Mês'
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
        removeClass(selectedCells, cls.SELECTED_CELL_CLASS);
    };
    Schedule.prototype.addSelectedClass = function (cells, focusCell) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.setAttribute('aria-selected', 'true');
        }
        addClass(cells, cls.SELECTED_CELL_CLASS);
        focusCell.setAttribute('tabindex', '0');
        focusCell.focus();
    };
    Schedule.prototype.selectCell = function (element) {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    };
    Schedule.prototype.getSelectedElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_CELL_CLASS));
    };
    Schedule.prototype.getAllDayRow = function () {
        return this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS);
    };
    Schedule.prototype.getContentTable = function () {
        return this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody');
    };
    Schedule.prototype.getTableRows = function () {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')'));
    };
    Schedule.prototype.getWorkCellElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
    };
    Schedule.prototype.getIndexOfDate = function (collection, date) {
        return collection.map(Number).indexOf(+date);
    };
    Schedule.prototype.isAllDayCell = function (td) {
        if (this.currentView === 'Month' || this.currentView === 'TimelineMonth' || td.classList.contains(cls.ALLDAY_CELLS_CLASS)
            || td.classList.contains(cls.HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
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
        var eventClone = this.element.querySelector('.' + cls.NEW_EVENT_CLASS);
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    };
    Schedule.prototype.onDocumentClick = function (args) {
        this.notify(events.documentClick, { event: args });
    };
    Schedule.prototype.onScheduleResize = function () {
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        if (this.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.activeView.isTimelineView()) {
            this.notify(events.dataReady, {});
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
        var viewBoundaries = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).getBoundingClientRect();
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
                    this.notify(events.scrollUiUpdate, { cssProperties: this.getCssProperties() });
                    if (this.activeView.isTimelineView()) {
                        this.notify(events.dataReady, {});
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
                this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
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
                this.notify(events.dataReady, {
                    processedData: this.eventBase.processData(this.eventsData)
                });
                break;
            case 'eventDragArea':
                this.notify(events.dataReady, {});
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
        var msMajorInterval = this.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        var startIndex = Math.round((util.getDateInMs(startHour) - util.getDateInMs(viewStartHour)) / msInterval);
        var endIndex = Math.ceil((util.getDateInMs(endHour) - util.getDateInMs(viewStartHour)) / msInterval);
        var cells = [];
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var date = dates_1[_i];
            util.resetTime(date);
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
                            var tds = [].slice.call(tableEle.rows[i].querySelectorAll('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        }
                        else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        addClass(cells, cls.WORK_HOURS_CLASS);
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
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(cls.HEADER_CELLS_CLASS)) {
            endTime = util.addDays(new Date(startTime.getTime()), duration);
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
        var removeClasses = [cls.ROOT];
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
export { Schedule };
