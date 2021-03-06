import { Component, INotifyPropertyChanged } from '-syncfusion/ej2-base';
import { EmitType, L10n } from '-syncfusion/ej2-base';
import { RecurrenceEditorModel } from './recurrence-editor-model';
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
export declare class RecurrenceEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Sets the recurrence pattern on the editor.
     * @default ['none', 'daily', 'weekly', 'monthly', 'yearly']
     */
    frequencies: RepeatType[];
    /**
     * Sets the first day of the week.
     * @default 0
     */
    firstDayOfWeek: number;
    /**
     * Sets the start date on recurrence editor.
     * @default new Date()
     */
    startDate: Date;
    /**
     * Sets the user specific date format on recurrence editor.
     * @default null
     */
    dateFormat: string;
    /**
     * Sets the locale to be applied on recurrence editor.
     * @default true
     */
    locale: string;
    /**
     * Allows styling with custom class names.
     * @default null
     */
    cssClass: string;
    /**
     * Allows recurrence editor to render in RTL mode.
     * @default false
     */
    enableRtl: boolean;
    /**
     * Sets the recurrence rule as its output values.
     * @default null
     */
    value: String;
    /**
     * Sets the minimum date on recurrence editor.
     * @default new Date(1900, 1, 1)
     */
    minDate: Date;
    /**
     * Sets the maximum date on recurrence editor.
     * @default new Date(2099, 12, 31)
     */
    maxDate: Date;
    /**
     * Sets the current repeat type to be set on the recurrence editor.
     * @default 0
     */
    selectedType: Number;
    /**
     * Triggers for value changes on every sub-controls rendered within the recurrence editor.
     * @event
     */
    change: EmitType<RecurrenceEditorChangeEventArgs>;
    /**
     * Constructor for creating the widget
     * @param  {object} options?
     */
    constructor(options?: RecurrenceEditorModel, element?: string | HTMLButtonElement);
    localeObj: L10n;
    private defaultLocale;
    private renderStatus;
    private ruleObject;
    private recurrenceCount;
    private monthDate;
    private repeatInterval;
    private untilDateObj;
    private repeatType;
    private endType;
    private monthWeekPos;
    private monthWeekDays;
    private monthValue;
    private onMonthDay;
    private onWeekDay;
    private dayButtons;
    private monthButtons;
    private startState;
    protected preRender(): void;
    private applyCustomClass;
    private initialize;
    private triggerChangeEvent;
    private resetDayButton;
    private daySelection;
    private rtlClass;
    private updateUntilDate;
    private selectMonthDay;
    private updateForm;
    private updateEndOnForm;
    private freshOnEndForm;
    private showFormElement;
    private renderDropdowns;
    private setDefaultValue;
    private resetFormValues;
    private getPopupWidth;
    private renderDatePickers;
    private dayButtonRender;
    private radioButtonRender;
    private numericTextboxRender;
    private renderComponent;
    private rotateArray;
    private getEndData;
    private getDayPosition;
    private getRepeatData;
    private getMonthPosData;
    private getDayData;
    private getMonthData;
    private setTemplate;
    private getSelectedDaysData;
    private getSelectedMonthData;
    private getIntervalData;
    private getEndOnCount;
    private getYearMonthRuleData;
    private updateWeekButton;
    private updateMonthUI;
    private updateUI;
    private getUntilData;
    private destroyComponents;
    resetFields(): void;
    getRuleSummary(rule?: string): string;
    getRecurrenceDates(startDate: Date, rule: string, excludeDate?: string, maximumCount?: number, viewDate?: Date): number[];
    getRecurrenceRule(): string;
    setRecurrenceRule(rule: string, startDate?: Date): void;
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy(): void;
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName(): string;
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    getPersistData(): string;
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    render(): void;
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: RecurrenceEditorModel, oldProp: RecurrenceEditorModel): void;
}
export interface RecurrenceEditorChangeEventArgs {
    value: string;
}
export declare type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
