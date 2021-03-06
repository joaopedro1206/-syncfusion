/// <reference path="../datepicker/datepicker-model.d.ts" />
import { EmitType } from '-syncfusion/ej2-base';
import { L10n } from '-syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs } from '-syncfusion/ej2-base';
import { ModuleDeclaration } from '-syncfusion/ej2-base';
import { DatePicker, PopupObjectArgs } from '../datepicker/datepicker';
import { DateTimePickerModel } from './datetimepicker-model';
/**
 * Represents the DateTimePicker component that allows user to select
 * or enter a date time value.
 * ```html
 * <input id="dateTimePicker"/>
 * ```
 * ```typescript
 * <script>
 *   let dateTimePickerObject:DateTimePicker = new DateTimePicker({ value: new Date() });
 *   dateTimePickerObject.appendTo("#dateTimePicker");
 * </script>
 * ```
 */
export declare class DateTimePicker extends DatePicker {
    private timeIcon;
    private cloneElement;
    private dateTimeWrapper;
    private rippleFn;
    private listWrapper;
    private liCollections;
    private timeCollections;
    private listTag;
    private selectedElement;
    private containerStyle;
    private popupObject;
    protected timeModal: HTMLElement;
    private isNavigate;
    protected isPreventBlur: Boolean;
    private timeValue;
    protected l10n: L10n;
    private keyboardHandler;
    protected inputEvent: KeyboardEvents;
    private activeIndex;
    private valueWithMinutes;
    private previousDateTime;
    private initValue;
    private isValidState;
    protected timekeyConfigure: {
        [key: string]: string;
    };
    protected preventArgs: PopupObjectArgs;
    /**
     * Specifies the format of the time value that to be displayed in time popup list.
     * @default null
     */
    timeFormat: string;
    /**
     * Specifies the time interval between the two adjacent time values in the time popup list .
     * @default 30
     */
    step: number;
    /**
     * specifies the z-index value of the popup element.
     * @default 1000
     * @aspType int
     */
    zIndex: number;
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
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     * @private
     */
    isMultiSelection: boolean;
    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     * @private
     */
    values: Date[];
    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    showClearButton: boolean;
    /**
     * Specifies the placeholder text that to be is displayed in textbox.
     * @default null
     */
    placeholder: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid
     * date and time value within a specified range or else it
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range value with highlighted error class.
     * @default false
     * > For more details refer to
     * [`Strict Mode`](../datetimepicker/strict-mode/) documentation.
     */
    strictMode: boolean;
    /**
     * Triggers when popup is opened.
     * @event
     */
    open: EmitType<Object>;
    /**
     * Triggers when popup is closed.
     * @event
     */
    close: EmitType<Object>;
    /**
     * Triggers when input loses the focus.
     * @event
     */
    blur: EmitType<Object>;
    /**
     * Triggers when input gets focus.
     * @event
     */
    focus: EmitType<Object>;
    /**
     * Triggers when DateTimePicker is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when DateTimePicker is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DateTimePickerModel, element?: string | HTMLInputElement);
    private focusHandler;
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn(): void;
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut(): void;
    protected blurHandler(e: MouseEvent): void;
    /**
     * To destroy the widget.
     * @returns void
     */
    destroy(): void;
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    render(): void;
    private setValue;
    private validateMinMaxRange;
    private checkValidState;
    private checkErrorState;
    private validateValue;
    private disablePopupButton;
    private getFormattedValue;
    private isDateObject;
    private createInputElement;
    private renderTimeIcon;
    private bindInputEvents;
    private unBindInputEvents;
    private cldrTimeFormat;
    private cldrDateTimeFormat;
    private getCldrFormat;
    private isNullOrEmpty;
    protected getCultureTimeObject(ld: Object, c: string): Object;
    private timeHandler;
    private dateHandler;
    show(type?: string, e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void;
    toggle(e?: KeyboardEventArgs): void;
    private listCreation;
    private popupCreation;
    private openPopup;
    private documentClickHandler;
    private isTimePopupOpen;
    private isDatePopupOpen;
    private renderPopup;
    private setDimension;
    private setPopupWidth;
    protected wireTimeListEvents(): void;
    protected unWireTimeListEvents(): void;
    private onMouseOver;
    private onMouseLeave;
    private setTimeHover;
    protected getPopupHeight(): number;
    protected changeEvent(e: Event): void;
    private updateValue;
    private setTimeScrollPosition;
    private setInputValue;
    private getFullDateTime;
    private combineDateTime;
    private onMouseClick;
    private setSelection;
    private setTimeActiveClass;
    private setTimeActiveDescendant;
    protected addTimeSelection(): void;
    protected removeTimeSelection(): void;
    protected removeTimeHover(className: string): void;
    protected getTimeHoverItem(className: string): Element[];
    protected isValidLI(li: Element | HTMLElement): boolean;
    private calculateStartEnd;
    private startTime;
    private endTime;
    hide(e?: KeyboardEvent | MouseEvent | Event): void;
    private closePopup;
    protected preRender(): void;
    protected getProperty(date: DateTimePickerModel, val: string): void;
    protected checkAttributes(): void;
    requiredModules(): ModuleDeclaration[];
    private getTimeActiveElement;
    protected createDateObj(val: Date | string): Date;
    private getDateObject;
    protected findNextTimeElement(event: KeyboardEventArgs): void;
    protected setTimeValue(date: Date, value: Date): Date;
    protected timeElementValue(value: Date): Date;
    protected timeKeyHandler(event: KeyboardEventArgs): void;
    protected TimeKeyActionHandle(event: KeyboardEventArgs): void;
    protected inputKeyAction(event: KeyboardEventArgs): void;
    onPropertyChanged(newProp: DateTimePickerModel, oldProp: DateTimePickerModel): void;
    /**
     * To get component name.
     * @private
     */
    protected getModuleName(): string;
}
