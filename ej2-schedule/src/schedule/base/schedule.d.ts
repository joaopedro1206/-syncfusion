import { Component, ModuleDeclaration } from '-syncfusion/ej2-base';
import { EmitType, Internationalization, L10n } from '-syncfusion/ej2-base';
import { INotifyPropertyChanged } from '-syncfusion/ej2-base';
import { ScheduleModel } from './schedule-model';
import { HeaderRenderer } from '../renderer/header-renderer';
import { Scroll } from '../actions/scroll';
import { ScheduleTouch } from '../actions/touch';
import { KeyboardInteraction } from '../actions/keyboard';
import { Data } from '../actions/data';
import { View, CurrentAction, ReturnType, CalendarType } from '../base/type';
import { EventBase } from '../event-renderer/event-base';
import { QuickPopups } from '../popups/quick-popups';
import { EventTooltip } from '../popups/event-tooltip';
import { EventWindow } from '../popups/event-window';
import { Render } from '../renderer/renderer';
import { Day } from '../renderer/day';
import { Week } from '../renderer/week';
import { WorkWeek } from '../renderer/work-week';
import { Month } from '../renderer/month';
import { Agenda } from '../renderer/agenda';
import { MonthAgenda } from '../renderer/month-agenda';
import { TimelineViews } from '../renderer/timeline-view';
import { TimelineMonth } from '../renderer/timeline-month';
import { Crud } from '../actions/crud';
import { Resize } from '../actions/resize';
import { DragAndDrop } from '../actions/drag';
import { VirtualScroll } from '../actions/virtual-scroll';
import { WorkHoursModel, ViewsModel, EventSettingsModel, GroupModel, ResourcesModel, TimeScaleModel } from '../models/models';
import { QuickInfoTemplatesModel, HeaderRowsModel } from '../models/models';
import { IRenderer, ActionEventArgs, NavigatingEventArgs, CellClickEventArgs, RenderCellEventArgs, ScrollCss } from '../base/interface';
import { EventClickArgs, EventRenderedArgs, PopupOpenEventArgs, UIStateArgs, DragEventArgs, ResizeEventArgs } from '../base/interface';
import { EventFieldsMapping, ResourceDetails, ResizeEdges } from '../base/interface';
import { ResourceBase } from '../base/resource';
import { CalendarUtil } from './calendar-util';
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
export declare class Schedule extends Component<HTMLElement> implements INotifyPropertyChanged {
    globalize: Internationalization;
    localeObj: L10n;
    isAdaptive: Boolean;
    dataModule: Data;
    eventTooltip: EventTooltip;
    eventWindow: EventWindow;
    renderModule: Render;
    headerModule: HeaderRenderer;
    scrollModule: Scroll;
    virtualScrollModule: VirtualScroll;
    crudModule: Crud;
    scheduleTouchModule: ScheduleTouch;
    keyboardInteractionModule: KeyboardInteraction;
    activeView: IRenderer;
    activeCellsData: CellClickEventArgs;
    activeEventData: EventClickArgs;
    eventBase: EventBase;
    resourceBase: ResourceBase;
    private cellTemplateFn;
    private dateHeaderTemplateFn;
    private majorSlotTemplateFn;
    private minorSlotTemplateFn;
    private appointmentTemplateFn;
    private eventTooltipTemplateFn;
    private headerTooltipTemplateFn;
    private editorTemplateFn;
    private quickInfoTemplatesHeaderFn;
    private quickInfoTemplatesContentFn;
    private quickInfoTemplatesFooterFn;
    private resourceHeaderTemplateFn;
    private defaultLocale;
    dayModule: Day;
    weekModule: Week;
    workWeekModule: WorkWeek;
    monthAgendaModule: MonthAgenda;
    monthModule: Month;
    agendaModule: Agenda;
    timelineViewsModule: TimelineViews;
    timelineMonthModule: TimelineMonth;
    resizeModule: Resize;
    dragAndDropModule: DragAndDrop;
    viewOptions: {
        [key: string]: ViewsModel[];
    };
    viewCollections: ViewsModel[];
    viewIndex: number;
    activeViewOptions: ViewsModel;
    eventFields: EventFieldsMapping;
    editorTitles: EventFieldsMapping;
    eventsData: Object[];
    eventsProcessed: Object[];
    blockData: Object[];
    blockProcessed: Object[];
    currentAction: CurrentAction;
    quickPopup: QuickPopups;
    selectedElements: Element[];
    uiStateValues: UIStateArgs;
    timeFormat: string;
    calendarUtil: CalendarUtil;
    /**
     * Sets the `width` of the Schedule component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Schedule width gets auto-adjusted and display its content related to the viewable screen size.
     * @default 'auto'
     */
    width: string | number;
    /**
     * Sets the `height` of the Schedule component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Schedule will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Schedule gets auto-adjusted within the given container.
     * @default 'auto'
     */
    height: string | number;
    /**
     * When set to `false`, hides the header bar of the Schedule from UI. By default,
     *  the header bar holds the date and view navigation options, to which the user can add their own custom items onto it.
     * @default true
     */
    showHeaderBar: boolean;
    /**
     * When set to `false`, hides the current time indicator from the Schedule. Otherwise,
     *  it visually depicts the live current system time appropriately on the user interface.
     * @default true
     */
    showTimeIndicator: boolean;
    /**
     * To set the active view on scheduler, the `currentView` property can be used and it usually accepts either of the following available
     *  view options. The view option specified in this property will be initially loaded on the schedule.
     * * Day
     * * Week
     * * WorkWeek
     * * Month
     * * Agenda
     * * MonthAgenda
     * * TimelineDay
     * * TimelineWeek
     * * TimelineWorkWeek
     * * TimelineMonth
     * @default 'Week'
     */
    currentView: View;
    /**
     * This property holds the views collection and its configurations. It accepts either the array of view names or the array of view
     *  objects that holds different configurations for each views. By default,
     *  Schedule displays all the views namely `Day`, `Week`, `Work Week`, `Month` and `Agenda`.
     * Example for array of views:
     * {% codeBlock src="schedule/view-api/index.ts" %}{% endcodeBlock %}
     * Example for array of view objects:
     * {% codeBlock src="schedule/view-api/array.ts" %}{% endcodeBlock %}
     * @default '['Day', 'Week', 'WorkWeek', 'Month', 'Agenda']'
     */
    views: View[] | ViewsModel[];
    /**
     * To mark the active (current) date on the Schedule, `selectedDate` property can be defined.
     *  Usually, it defaults to the current System date.
     * @default 'new Date()'
     */
    selectedDate: Date;
    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it.
     *  It is also possible to manually set specific date format by using the `dateFormat` property.
     * The format of the date range label in the header bar depends on the `dateFormat` value or else based on the
     * locale assigned to the Schedule.
     * @default null
     */
    dateFormat: string;
    /**
     *  It allows the Scheduler to display in other calendar modes.
     * By default, Scheduler is displayed in `Gregorian` calendar mode.
     * To change the mode, you can set either `Gregorian` or `Islamic` as a value to this `calendarMode` property.
     * @default 'Gregorian'
     */
    calendarMode: CalendarType;
    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule. The days which are not defined in the working days
     *  collection are usually treated as weekend days.
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as
     *  the weekend days and will be hidden on all the views.
     * @default true
     */
    showWeekend: boolean;
    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.
     * @default 0
     */
    firstDayOfWeek: number;
    /**
     * It is used to set the working days on Schedule. The only days that are defined in this collection will be rendered on the `workWeek`
     *  view whereas on other views, it will display all the usual days and simply highlights the working days with different shade.
     * @default '[1, 2, 3, 4, 5]'
     * @aspType int[]
     */
    workDays: number[];
    /**
     * It is used to specify the starting hour, from which the Schedule starts to display. It accepts the time string in a short skeleton
     *  format and also, hides the time beyond the specified start time.
     * @default '00:00'
     */
    startHour: string;
    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.
     * @default '24:00'
     */
    endHour: string;
    /**
     * When set to `true`, allows the resizing of appointments. It allows the rescheduling of appointments either by changing the
     *  start or end time by dragging the event resize handlers.
     * @default true
     */
    allowResizing: boolean;
    /**
     * The working hours should be highlighted on Schedule with different color shade and an additional option must be provided to
     *  highlight it or not. This functionality is handled through `workHours` property and the start work hour should be 9 AM by default
     *  and end work hour should point to 6 PM. The start and end working hours needs to be provided as Time value of short skeleton type.
     * @default { highlight: true, start: '09:00', end: '18:00' }
     */
    workHours: WorkHoursModel;
    /**
     * Allows to set different time duration on Schedule along with the customized grid count. It also has template option to
     *  customize the time slots with required time values in its own format.
     * {% codeBlock src="schedule/timescale-api/index.ts" %}{% endcodeBlock %}
     * @default { enable: true, interval: 60, slotCount: 2, majorSlotTemplate: null, minorSlotTemplate: null }
     */
    timeScale: TimeScaleModel;
    /**
     * When set to `true`, allows the keyboard interaction to take place on Schedule.
     * @default true
     */
    allowKeyboardInteraction: boolean;
    /**
     * When set to `true`, allows the appointments to move over the time slots. When an appointment is dragged, both its start
     *  and end time tends to change simultaneously allowing it to reschedule the appointment on some other time.
     * @default true
     */
    allowDragAndDrop: boolean;
    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the date header cells. The field that can be accessed via this template is `date`.
     * {% codeBlock src="schedule/date-header-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    dateHeaderTemplate: string;
    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The fields accessible via template are as follows.
     *  * date
     *  * groupIndex
     *  * type
     * {% codeBlock src="schedule/cell-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/cell-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    cellTemplate: string;
    /**
     * When set to `true`, makes the Schedule to render in a read only mode. No CRUD actions will be allowed at this time.
     * @default false
     */
    readonly: boolean;
    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     *  By default, it is set to `true`.
     * @default true
     */
    showQuickInfo: boolean;
    /**
     * When set to `true`, displays the week number of the current view date range.
     *  By default, it is set to `false`.
     * @default false
     */
    showWeekNumber: boolean;
    /**
     * The template option to render the customized editor window. The form elements defined within this template should be accompanied
     *  with `e-field` class, so as to fetch and process it from internally.
     * {% codeBlock src="schedule/editor-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/editor-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    editorTemplate: string;
    /**
     * The template option to customize the quick window. The three sections of the quick popup whereas the header, content,
     *  and footer can be easily customized with individual template option.
     * {% codeBlock src="schedule/quick-info-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/quick-info-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    quickInfoTemplates: QuickInfoTemplatesModel;
    /**
     * Sets the number of days to be displayed by default in Agenda View and in case of virtual scrolling,
     *  the number of days will be fetched on each scroll-end based on this count.
     * @default 7
     */
    agendaDaysCount: number;
    /**
     * The days which does not has even a single event to display will be hidden from the UI of Agenda View by default.
     *  When this property is set to `false`, the empty dates will also be displayed on the Schedule.
     * @default true
     */
    hideEmptyAgendaDays: boolean;
    /**
     * Schedule will be assigned with specific timezone, so as to display the events in it accordingly. By default,
     *  Schedule dates are processed with System timezone, as no timezone will be assigned specifically to the Schedule at the initial time.
     *  Whenever the Schedule is bound to remote data services, it is always recommended to set specific timezone to Schedule to make the
     *  events on it to display on the same time irrespective of the system timezone. It usually accepts
     *  the valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) timezone names.
     * @default null
     */
    timezone: string;
    /**
     * Complete set of settings related to Schedule events to bind it to local or remote dataSource, map applicable database fields and
     *  other validation to be carried out on the available fields.
     * @default null
     */
    eventSettings: EventSettingsModel;
    /**
     * Template option to customize the resource header bar. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the resource header cells.
     * The following can be accessible via template.
     * * resource - All the resource fields.
     * * resourceData - object collection of current resource.
     * {% codeBlock src="schedule/resource-header-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/resource-header-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    resourceHeaderTemplate: string;
    /**
     * Allows defining the group related settings of multiple resources. When this property is non-empty, it means
     *  that the resources will be grouped on the schedule layout based on the provided resource names.
     * {% codeBlock src="schedule/group-api/index.ts" %}{% endcodeBlock %}
     * @default {}
     */
    group: GroupModel;
    /**
     * Allows defining the collection of resources to be displayed on the Schedule. The resource collection needs to be defined
     *  with unique resource names to identify it along with the respective dataSource and field mapping options.
     * {% codeBlock src="schedule/resources-api/index.ts" %}{% endcodeBlock %}
     * @default []
     */
    resources: ResourcesModel[];
    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     *  on the timeline view of the scheduler.
     * {% codeBlock src="schedule/header-rows-api/index.ts" %}{% endcodeBlock %}
     * @default []
     */
    headerRows: HeaderRowsModel[];
    /**
     * It is used to customize the Schedule which accepts custom CSS class names that defines specific user-defined styles and themes
     *  to be applied on the Schedule element.
     * @default null
     */
    cssClass: string;
    /**
     * When set to `true`, enables the RTL mode on the Schedule, so that the Schedule and its content displays in the direction
     *  from right to left.
     * @default false
     */
    enableRtl: boolean;
    /**
     * It enables the external drag and drop support for appointments on scheduler, to be able to move them out of the scheduler layout.
     *  When the drag area is explicitly set with specific DOM element name,
     *  the appointments can be dragged anywhere within the specified drag area location.
     * @default null
     */
    eventDragArea: string;
    /**
     * Triggers after the scheduler component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when the scheduler component is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers when the scheduler cells are single clicked or on single tap on the same cells in mobile devices.
     * @event
     */
    cellClick: EmitType<CellClickEventArgs>;
    /**
     * Triggers when the scheduler cells are double clicked.
     * @event
     */
    cellDoubleClick: EmitType<CellClickEventArgs>;
    /**
     * Triggers on beginning of every scheduler action.
     * @event
     */
    actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers on successful completion of the scheduler actions.
     * @event
     */
    actionComplete: EmitType<ActionEventArgs>;
    /**
     * Triggers when a scheduler action gets failed or interrupted and an error information will be returned.
     * @event
     */
    actionFailure: EmitType<ActionEventArgs>;
    /**
     * Triggers before the date or view navigation takes place on scheduler.
     * @event
     */
    navigating: EmitType<NavigatingEventArgs>;
    /**
     * Triggers before each element of the schedule rendering on the page.
     * @event
     */
    renderCell: EmitType<RenderCellEventArgs>;
    /**
     * Triggers when the events are single clicked or on single tapping the events on the mobile devices.
     * @event
     */
    eventClick: EmitType<EventClickArgs>;
    /**
     * Triggers before each of the event getting rendered on the scheduler user interface.
     * @event
     */
    eventRendered: EmitType<EventRenderedArgs>;
    /**
     * Triggers before the data binds to the scheduler.
     * @event
     */
    dataBinding: EmitType<ReturnType>;
    /**
     * Triggers before any of the scheduler popups opens on the page.
     * @event
     */
    popupOpen: EmitType<PopupOpenEventArgs>;
    /**
     * Triggers when an appointment is started to drag.
     * @event
     */
    dragStart: EmitType<DragEventArgs>;
    /**
     * Triggers when an appointment is being in a dragged state.
     * @event
     */
    drag: EmitType<DragEventArgs>;
    /**
     * Triggers when the dragging of appointment is stopped.
     * @event
     */
    dragStop: EmitType<DragEventArgs>;
    /**
     * Triggers when an appointment is started to resize.
     * @event
     */
    resizeStart: EmitType<ResizeEventArgs>;
    /**
     * Triggers when an appointment is being in a resizing action.
     * @event
     */
    resizing: EmitType<ResizeEventArgs>;
    /**
     * Triggers when the resizing of appointment is stopped.
     * @event
     */
    resizeStop: EmitType<ResizeEventArgs>;
    /**
     * Triggers once the event data is bound to the scheduler.
     * @event
     */
    dataBound: EmitType<ReturnType>;
    /**
     * Constructor for creating the Schedule widget
     * @hidden
     */
    constructor(options?: ScheduleModel, element?: string | HTMLElement);
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    render(): void;
    private initializeResources;
    renderElements(isLayoutOnly: boolean): void;
    private validateDate;
    private getViewIndex;
    private setViewOptions;
    private getActiveViewOptions;
    private initializeDataModule;
    private initializeView;
    private initializeTemplates;
    private initializePopups;
    getDayNames(type: string): string[];
    private setCldrTimeFormat;
    getCalendarMode(): string;
    getTimeString(date: Date): string;
    private setcalendarMode;
    changeView(view: View, event?: Event, muteOnChange?: boolean, index?: number): void;
    changeDate(selectedDate: Date, event?: Event): void;
    isSelectedDate(date: Date): boolean;
    getNavigateView(): View;
    private animateLayout;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void;
    /**
     * Binding events to the Schedule element.
     * @hidden
     */
    private wireEvents;
    removeSelectedClass(): void;
    addSelectedClass(cells: HTMLTableCellElement[], focusCell: HTMLTableCellElement): void;
    selectCell(element: HTMLElement & HTMLTableCellElement): void;
    getSelectedElements(): Element[];
    getAllDayRow(): Element;
    getContentTable(): HTMLElement;
    getTableRows(): HTMLElement[];
    getWorkCellElements(): Element[];
    getIndexOfDate(collection: Date[], date: Date): number;
    isAllDayCell(td: Element): boolean;
    getDateFromElement(td: Element): Date;
    getCellTemplate(): Function;
    getDateHeaderTemplate(): Function;
    getMajorSlotTemplate(): Function;
    getMinorSlotTemplate(): Function;
    getAppointmentTemplate(): Function;
    getEventTooltipTemplate(): Function;
    getHeaderTooltipTemplate(): Function;
    getEditorTemplate(): Function;
    getQuickInfoTemplatesHeader(): Function;
    getQuickInfoTemplatesContent(): Function;
    getQuickInfoTemplatesFooter(): Function;
    getResourceHeaderTemplate(): Function;
    getCssProperties(): ScrollCss;
    removeNewEventElement(): void;
    private onDocumentClick;
    private onScheduleResize;
    templateParser(template: string): Function;
    boundaryValidation(pageY: number, pageX: number): ResizeEdges;
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    private unwireEvents;
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName(): string;
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string;
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: ScheduleModel, oldProp: ScheduleModel): void;
    private propertyChangeAction;
    private extendedPropertyChange;
    private onGroupSettingsPropertyChanged;
    private onEventSettingsPropertyChanged;
    private destroyHeaderModule;
    private destroyPopups;
    /**
     * Allows to show the spinner on schedule at the required scenarios.
     */
    showSpinner(): void;
    /**
     * When the spinner is shown manually using `showSpinner` method, it can be hidden using this `hideSpinner` method.
     */
    hideSpinner(): void;
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
    setWorkHours(dates: Date[], start: string, end: string, groupIndex?: number): void;
    /**
     * Retrieves the start and end time information of the specific cell element.
     * @method getCellDetails
     * @param  {Element} td The cell element whose start and end time details are to be retrieved.
     * @returns {CellClickEventArgs} Object An object holding the startTime, endTime and all-day information along with the target HTML
     *  element will be returned.
     */
    getCellDetails(tdCol: Element | Element[]): CellClickEventArgs;
    /**
     * Retrieves the resource details based on the provided resource index.
     * @param {number} index index of the resources at the last level.
     * @returns {ResourceDetails} Object An object holding the details of resource and resourceData.
     */
    getResourcesByIndex(index: number): ResourceDetails;
    /**
     * Scrolls the Schedule content area to the specified time.
     * @method scrollTo
     * @param {string} hour Accepts the time value in the skeleton format of 'Hm'.
     * @returns {void}
     */
    scrollTo(hour: string): void;
    /**
     * Adds the newly created event into the Schedule dataSource.
     * @method addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    addEvent(data: Object | Object[]): void;
    /**
     * Updates the changes made in the event object by passing it as an parameter into the dataSource.
     * @method saveEvent
     * @param {[key: string]: Object} data Single or collection of event objects to be saved into Schedule.
     * @param {CurrentAction} currentAction Denotes the action that takes place either for editing occurrence or series.
     *  The valid current action names are `EditOccurrence` or `EditSeries`.
     * @returns {void}
     */
    saveEvent(data: {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[], currentAction?: CurrentAction): void;
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
    deleteEvent(id: string | number | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[], currentAction?: CurrentAction): void;
    /**
     * Retrieves the entire collection of events bound to the Schedule.
     * @method getEvents
     * @returns {Object[]} Returns the collection of event objects from the Schedule.
     */
    getEvents(): Object[];
    /**
     * Retrieves the occurrences of a single recurrence event based on the provided parent ID.
     * @method getOccurrencesByID
     * @param {number} eventID ID of the parent recurrence data from which the occurrences are fetched.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    getOccurrencesByID(eventID: number | string): Object[];
    /**
     * Retrieves all the occurrences that lies between the specific start and end time range.
     * @method getOccurrencesByRange
     * @param {Date} startTime Denotes the start time range.
     * @param {Date} endTime Denotes the end time range.
     * @returns {Object[]} Returns the collection of occurrence event objects that lies between the provided start and end time.
     */
    getOccurrencesByRange(startTime: Date, endTime: Date): Object[];
    /**
     * Retrieves the dates that lies on active view of Schedule.
     * @method getCurrentViewDates
     * @returns {Date[]} Returns the collection of dates.
     */
    getCurrentViewDates(): Object[];
    /**
     * Retrieves the events that lies on the current date range of the active view of Schedule.
     * @method getCurrentViewEvents
     * @returns {Object[]} Returns the collection of events.
     */
    getCurrentViewEvents(): Object[];
    /**
     * Refreshes the event dataSource. This method may be useful when the events alone in the schedule needs to be re-rendered.
     * @method refreshEvents
     * @returns {void}
     */
    refreshEvents(): void;
    /**
     * To retrieve the appointment object from element.
     * @method getEventDetails
     * @param {Element} element Denotes the event UI element on the Schedule.
     * @returns {Object} Returns the event details.
     */
    getEventDetails(element: Element): Object;
    /**
     * To check whether the given time range slots are available for event creation or already occupied by other events.
     * @method isSlotAvailable
     * @param {Date} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    isSlotAvailable(startTime: Date, endTime: Date, groupIndex?: number): boolean;
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
    openEditor(data: Object, action: CurrentAction, isEventData?: boolean, repeatType?: number): void;
    /**
     * This method has been added to adjust the size of the outer event wrapper class that holds the collection of events,
     *  while trying to set manual height and width to the Schedule cells.
     * @method adjustEventWrapper
     * @returns {void}
     */
    adjustEventWrapper(): void;
    /**
     * Adds the resources to the specified index.
     * @param resources
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     */
    addResource(resources: Object, name: string, index: number): void;
    /**
     * Removes the specified resource.
     * @param resourceId Specifies the resource id to be removed.
     * @param name Specifies the resource name from which the id should be referred.
     */
    removeResource(resourceId: string | number, name: string): void;
    /**
     * Destroys the Schedule component.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
