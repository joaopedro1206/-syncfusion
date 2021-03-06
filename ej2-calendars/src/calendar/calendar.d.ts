import { Component, Internationalization, ModuleDeclaration } from '-syncfusion/ej2-base';
import { INotifyPropertyChanged, KeyboardEvents, L10n } from '-syncfusion/ej2-base';
import { KeyboardEventArgs, BaseEventArgs } from '-syncfusion/ej2-base';
import { EmitType } from '-syncfusion/ej2-base';
import { CalendarModel, CalendarBaseModel } from './calendar-model';
import { Islamic } from './index';
/**
 * Specifies the view of the calendar.
 */
export declare type CalendarView = 'Month' | 'Year' | 'Decade';
export declare type CalendarType = 'Islamic' | 'Gregorian';
/**
 *
 * @private
 */
export declare class CalendarBase extends Component<HTMLElement> implements INotifyPropertyChanged {
    protected headerElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected table: HTMLElement;
    protected tableHeadElement: HTMLElement;
    protected tableBodyElement: Element;
    protected nextIcon: HTMLElement;
    protected previousIcon: HTMLElement;
    protected headerTitleElement: HTMLElement;
    protected todayElement: HTMLElement;
    protected footer: HTMLElement;
    protected keyboardModule: KeyboardEvents;
    protected globalize: Internationalization;
    islamicModule: Islamic;
    protected currentDate: Date;
    protected navigatedArgs: NavigatedEventArgs;
    protected renderDayCellArgs: RenderDayCellEventArgs;
    protected effect: string;
    protected previousDate: Date;
    protected previousValues: number;
    protected navigateHandler: Function;
    protected navigatePreviousHandler: Function;
    protected navigateNextHandler: Function;
    protected l10: L10n;
    protected todayDisabled: boolean;
    protected todayDate: Date;
    protected calendarElement: HTMLElement;
    protected keyConfigs: {
        [key: string]: string;
    };
    /**
     * Gets or sets the minimum date that can be selected in the Calendar.
     * @default new Date(1900, 00, 01)
     */
    min: Date;
    /**
     * Gets or sets the maximum date that can be selected in the Calendar.
     * @default new Date(2099, 11, 31)
     */
    max: Date;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * @default 0
     * @aspType int
     * > For more details about firstDayOfWeek refer to
     * [`First day of week`](../calendar/how-to/first-day-of-week#change-the-first-day-of-the-week) documentation.
     */
    firstDayOfWeek: number;
    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.
     * @default Gregorian
     */
    calendarMode: CalendarType;
    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * View<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Month<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the days of the month.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Year<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the months of the year.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Decade<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the years of the decade.<br/></td></tr>
     * </table>
     *
     * > For more details about start refer to
     * [`calendarView`](../calendar/calendar-views#view-restriction)documentation.
     */
    start: CalendarView;
    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * view<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Month<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows up to the days of the month.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Year<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows up to the months of the year.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Decade<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows up to the years of the decade.<br/></td></tr>
     * </table>
     *
     * > For more details about depth refer to
     *  [`calendarView`](../calendar/calendar-views#view-restriction)documentation.
     */
    depth: CalendarView;
    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     * @default false
     * > For more details about weekNumber refer to
     * [`Calendar with week number`](../calendar/how-to/week-number#render-the-calendar-with-week-numbers)documentation.
     */
    weekNumber: boolean;
    /**
     * Specifies whether the today button is to be displayed or not.
     * @default true
     */
    showTodayButton: boolean;
    /**
     * When set to true, enables RTL mode of the component that displays the content in the right-to-left direction.
     * @default false
     */
    enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence: boolean;
    /**
     * Triggers when Calendar is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when Calendar is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers when the Calendar is navigated to another level or within the same level of view.
     * @event
     */
    navigated: EmitType<NavigatedEventArgs>;
    /**
     * Triggers when each day cell of the Calendar is rendered.
     * @event
     */
    renderDayCell: EmitType<RenderDayCellEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: CalendarBaseModel, element?: string | HTMLElement);
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    protected render(): void;
    protected validateDate(value?: Date): void;
    protected minMaxUpdate(value?: Date): void;
    protected createHeader(): void;
    protected createContent(): void;
    protected getCultureValues(): string[];
    protected createContentHeader(): void;
    protected createContentBody(): void;
    protected updateFooter(): void;
    protected createContentFooter(): void;
    protected wireEvents(): void;
    protected todayButtonClick(value?: Date): void;
    protected keyActionHandle(e: KeyboardEventArgs, value?: Date, multiSelection?: boolean): void;
    protected KeyboardNavigate(number: number, currentView: number, e: KeyboardEvent, max: Date, min: Date): void;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(value?: Date): void;
    protected minMaxDate(localDate: Date): Date;
    protected renderMonths(e?: Event, value?: Date): void;
    protected renderDays(currentDate: Date, e?: Event, value?: Date, multiSelection?: boolean, values?: Date[]): HTMLElement[];
    protected updateFocus(otherMonth: boolean, disabled: boolean, localDate: Date, tableElement: HTMLElement, currentDate: Date): void;
    protected renderYears(e?: Event, value?: Date): void;
    protected renderDecades(e?: Event, value?: Date): void;
    protected dayCell(localDate: Date): HTMLElement;
    protected firstDay(date: Date): Date;
    protected lastDay(date: Date, view: number): Date;
    protected checkDateValue(value: Date): Date;
    protected findLastDay(date: Date): Date;
    protected removeTableHeadElement(): void;
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event, value?: Date): void;
    protected clickHandler(e: MouseEvent, value: Date): void;
    protected clickEventEmitter(e: MouseEvent): void;
    protected contentClick(e?: MouseEvent, view?: number, element?: Element, value?: Date): void;
    protected switchView(view: number, e?: Event, multiSelection?: boolean): void;
    /**
     * To get component name
     * @private
     */
    protected getModuleName(): string;
    requiredModules(): ModuleDeclaration[];
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData(): string;
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp: CalendarBaseModel, oldProp: CalendarBaseModel, multiSelection?: boolean, values?: Date[]): void;
    /**
     * values property updated with considered disabled dates of the calendar.
     */
    protected validateValues(multiSelection?: boolean, values?: Date[]): void;
    protected setValueUpdate(): void;
    protected copyValues(values: Date[]): Date[];
    protected titleUpdate(date: Date, view: string): void;
    protected setActiveDescendant(): string;
    protected iconHandler(): void;
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy(): void;
    protected title(e?: Event): void;
    protected getViewNumber(stringVal: string): number;
    protected navigateTitle(e?: Event): void;
    protected previous(): void;
    protected navigatePrevious(e: MouseEvent | KeyboardEvent): void;
    protected next(): void;
    protected navigateNext(eve: MouseEvent | KeyboardEvent): void;
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view: CalendarView, date: Date): void;
    /**
     * Gets the current view of the Calendar.
     * @returns string
     */
    currentView(): string;
    protected getDateVal(date: Date, value: Date): boolean;
    protected getCultureObjects(ld: Object, c: string): Object;
    protected getWeek(d: Date): number;
    protected setStartDate(date: Date, time: number): void;
    protected addMonths(date: Date, i: number): void;
    protected addYears(date: Date, i: number): void;
    protected getIdValue(e: MouseEvent | TouchEvent | KeyboardEvent, element: Element): Date;
    protected selectDate(e: MouseEvent | KeyboardEventArgs, date: Date, node: Element, multiSelection?: boolean, values?: Date[]): void;
    protected checkPresentDate(dates: Date, values: Date[]): boolean;
    protected setAriaActiveDescendant(): void;
    protected previousIconHandler(disabled: boolean): void;
    protected renderDayCellEvent(args: RenderDayCellEventArgs): void;
    protected navigatedEvent(eve: MouseEvent | KeyboardEvent): void;
    protected triggerNavigate(event: MouseEvent | KeyboardEvent): void;
    protected nextIconHandler(disabled: boolean): void;
    protected compare(startDate: Date, endDate: Date, modifier: number): number;
    protected isMinMaxRange(date: Date): boolean;
    protected isMonthYearRange(date: Date): boolean;
    protected compareYear(start: Date, end: Date): number;
    protected compareDecade(start: Date, end: Date): number;
    protected shiftArray(array: string[], i: number): string[];
    protected addDay(date: Date, i: number, e: KeyboardEvent, max: Date, min: Date): void;
    protected findNextTD(date: Date, column: number, max: Date, min: Date): boolean;
    protected getMaxDays(d: Date): number;
    protected setDateDecade(date: Date, year: number): void;
    protected setDateYear(date: Date, value: Date): void;
    protected compareMonth(start: Date, end: Date): number;
}
/**
 * Represents the Calendar component that allows the user to select a date.
 * ```html
 * <div id="calendar"/>
 * ```
 * ```typescript
 * <script>
 *   var calendarObj = new Calendar({ value: new Date() });
 *   calendarObj.appendTo("#calendar");
 * </script>
 * ```
 */
export declare class Calendar extends CalendarBase {
    protected changedArgs: ChangedEventArgs;
    protected changeHandler: Function;
    /**
     * Gets or sets the selected date of the Calendar.
     * @default null
     */
    value: Date;
    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     */
    values: Date[];
    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     */
    isMultiSelection: boolean;
    /**
     * Triggers when the Calendar value is changed.
     * @event
     */
    change: EmitType<ChangedEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: CalendarModel, element?: string | HTMLElement);
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    protected render(): void;
    protected formResetHandler(): void;
    protected validateDate(): void;
    protected minMaxUpdate(): void;
    protected todayButtonClick(): void;
    protected keyActionHandle(e: KeyboardEventArgs): void;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void;
    createContent(): void;
    protected minMaxDate(localDate: Date): Date;
    protected renderMonths(e?: Event): void;
    protected renderDays(currentDate: Date, e?: Event): HTMLElement[];
    protected renderYears(e?: Event): void;
    protected renderDecades(e?: Event): void;
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event): void;
    protected clickHandler(e: MouseEvent): void;
    protected switchView(view: number, e?: Event): void;
    /**
     * To get component name
     * @private
     */
    protected getModuleName(): string;
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData(): string;
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp: CalendarModel, oldProp: CalendarModel): void;
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy(): void;
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view: CalendarView, date: Date): void;
    /**
     * Gets the current view of the Calendar.
     * @returns string
     */
    currentView(): string;
    /**
     * This method is used to add the single or multiple dates to the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates to be added to the values property of the Calendar.
     * @returns void
     */
    addDate(dates: Date | Date[]): void;
    /**
     * This method is used to remove the single or multiple dates from the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates which need to be removed from the values property of the Calendar.
     * @returns void
     */
    removeDate(dates: Date | Date[]): void;
    protected update(): void;
    protected selectDate(e: MouseEvent | KeyboardEventArgs, date: Date, element: Element): void;
    protected changeEvent(e: Event): void;
    protected triggerChange(e: MouseEvent | KeyboardEvent): void;
}
export interface NavigatedEventArgs extends BaseEventArgs {
    /** Defines the current view of the Calendar. */
    view?: string;
    /** Defines the focused date in a view. */
    date?: Date;
    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event;
}
export interface RenderDayCellEventArgs extends BaseEventArgs {
    /** Specifies whether to disable the current date or not. */
    isDisabled?: boolean;
    /** Specifies the day cell element. */
    element?: HTMLElement;
    /** Defines the current date of the Calendar. */
    date?: Date;
    /** Defines whether the current date is out of range (less than min or greater than max) or not. */
    isOutOfRange?: boolean;
}
export interface ChangedEventArgs extends BaseEventArgs {
    /** Defines the selected date of the Calendar. */
    value?: Date;
    /** Defines the multiple selected date of the Calendar. */
    values?: Date[];
    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event;
    /** Defines the element. */
    element?: HTMLElement | HTMLInputElement;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted?: boolean;
}
export interface IslamicObject {
    year: number;
    date: number;
    month: number;
}
