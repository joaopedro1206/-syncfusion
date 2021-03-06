/// <reference path="../calendar/calendar-model.d.ts" />
import { KeyboardEventArgs, EmitType, L10n } from '-syncfusion/ej2-base';
import { ModuleDeclaration } from '-syncfusion/ej2-base';
import { Popup } from '-syncfusion/ej2-popups';
import { InputObject, IInput, FloatLabelType, BlurEventArgs, FocusEventArgs } from '-syncfusion/ej2-inputs';
import { ChangedEventArgs, CalendarView, Calendar } from '../calendar/calendar';
import { DatePickerModel } from './datepicker-model';
/**
 * Represents the DatePicker component that allows user to select
 * or enter a date value.
 * ```html
 * <input id="datepicker"/>
 * ```
 * ```typescript
 * <script>
 *   let datePickerObject:DatePicker = new DatePicker({ value: new Date() });
 *   datePickerObject.appendTo("#datepicker");
 * </script>
 * ```
 */
export declare class DatePicker extends Calendar implements IInput {
    protected popupObj: Popup;
    protected inputWrapper: InputObject;
    private modal;
    protected inputElement: HTMLInputElement;
    protected popupWrapper: HTMLElement;
    protected changedArgs: ChangedEventArgs;
    protected previousDate: Date;
    private keyboardModules;
    private calendarKeyboardModules;
    protected previousElementValue: string;
    protected ngTag: string;
    protected dateTimeFormat: string;
    private inputEleCopy;
    protected l10n: L10n;
    protected preventArgs: PopupObjectArgs;
    private isDateIconClicked;
    private index;
    private formElement;
    protected keyConfigs: {
        [key: string]: string;
    };
    protected calendarKeyConfigs: {
        [key: string]: string;
    };
    /**
     * Specifies the width of the DatePicker component.
     * @default null
     */
    width: number | string;
    /**
     * Specifies the root CSS class of the DatePicker that allows to
     * customize the appearance by overriding the styles.
     * @default null
     */
    cssClass: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid date  value within a specified range or else it
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range date value with highlighted error class.
     * @default false
     * > For more details refer to
     * [`Strict Mode`](../datepicker/strict-mode/) documentation.
     */
    strictMode: boolean;
    /**
     * Specifies the format of the value that to be displayed in component. By default, the format is based on the culture.
     * @default null
     */
    format: string;
    /**
     * Specifies the component to be disabled or not.
     * @default true
     */
    enabled: boolean;
    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     * @private
     */
    values: Date[];
    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     * @private
     */
    isMultiSelection: boolean;
    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    showClearButton: boolean;
    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit: boolean;
    /**
     * When set to true, enables RTL mode of the component that displays the content in the       right-to-left direction.
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
     * specifies the z-index value of the datePicker popup element.
     * @default 1000
     * @aspType int
     */
    zIndex: number;
    /**
     * Specifies the component in readonly state. When the Component is readonly it does not allow user input.
     * @default false
     */
    readonly: boolean;
    /**
     * Specifies the placeholder text that displayed in textbox.
     * @default null
     */
    placeholder: string;
    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    floatLabelType: FloatLabelType | string;
    /**
     * Triggers when the popup is opened.
     * @event
     */
    open: EmitType<PreventableEventArgs | PopupObjectArgs>;
    /**
     * Triggers when the popup is closed.
     * @event
     */
    close: EmitType<PreventableEventArgs | PopupObjectArgs>;
    /**
     * Triggers when the input loses the focus.
     * @event
     */
    blur: EmitType<BlurEventArgs>;
    /**
     *  Triggers when the input gets focus.
     * @event
     */
    focus: EmitType<FocusEventArgs>;
    /**
     * Triggers when the component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget.
     */
    constructor(options?: DatePickerModel, element?: string | HTMLInputElement);
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    render(): void;
    private setAllowEdit;
    private initialize;
    private createInput;
    protected updateInput(): void;
    protected minMaxUpdates(): void;
    protected bindEvents(): void;
    protected resetFormHandler(): void;
    private inputChangeHandler;
    private bindClearEvent;
    protected resetHandler(e?: MouseEvent): void;
    private clear;
    private dateIconHandler;
    private CalendarKeyActionHandle;
    private inputFocusHandler;
    private inputBlurHandler;
    private documentHandler;
    protected inputKeyActionHandle(e: KeyboardEventArgs): void;
    protected strictModeUpdate(): void;
    private createCalendar;
    private modelHeader;
    protected changeTrigger(event?: MouseEvent | KeyboardEvent): void;
    protected navigatedEvent(): void;
    protected changeEvent(event?: MouseEvent | KeyboardEvent | Event): void;
    requiredModules(): ModuleDeclaration[];
    protected selectCalendar(e?: MouseEvent | KeyboardEvent | Event): void;
    protected isCalendar(): boolean;
    protected setWidth(width: number | string): void;
    /**
     * Shows the Calendar.
     * @returns void
     */
    show(type?: null | string, e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void;
    /**
     * Hide the Calendar.
     * @returns void
     */
    hide(event?: MouseEvent | KeyboardEvent | Event): void;
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn(triggerEvent?: boolean): void;
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut(): void;
    /**
     * Gets the current view of the DatePicker.
     * @returns string
     */
    currentView(): string;
    /**
     * Navigates to specified month or year or decade view of the DatePicker.
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view: CalendarView, date: Date): void;
    /**
     * To destroy the widget.
     * @returns void
     */
    destroy(): void;
    protected ensureInputAttribute(): void;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void;
    protected validationAttribute(target: HTMLElement, inputElement: Element): void;
    private checkHtmlAttributes;
    /**
     * To get component name.
     * @private
     */
    protected getModuleName(): string;
    private disabledDates;
    private setAriaAttributes;
    protected errorClass(): void;
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp: DatePickerModel, oldProp: DatePickerModel): void;
}
export interface PopupObjectArgs {
    /** Prevents the default action */
    preventDefault?: Function;
    /** Defines the DatePicker popup element. */
    popup?: Popup;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;
    /**
     * Specifies the original event arguments.
     */
    event?: MouseEvent | KeyboardEvent | Event;
    /**
     * Specifies the node to which the popup element to be appended.
     */
    appendTo?: HTMLElement;
}
export interface PreventableEventArgs {
    /** Prevents the default action */
    preventDefault?: Function;
}
