import { Component, EmitType } from '-syncfusion/ej2-base';
import { INotifyPropertyChanged, BaseEventArgs } from '-syncfusion/ej2-base';
import { NumericTextBoxModel } from './numerictextbox-model';
import { FloatLabelType } from '../input/input';
/**
 * Represents the NumericTextBox component that allows the user to enter only numeric values.
 * ```html
 * <input type='text' id="numeric"/>
 * ```
 * ```typescript
 * <script>
 *   var numericObj = new NumericTextBox({ value: 10 });
 *   numericObj.appendTo("#numeric");
 * </script>
 * ```
 */
export declare class NumericTextBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private container;
    private inputWrapper;
    private cloneElement;
    private hiddenInput;
    private spinUp;
    private spinDown;
    private timeOut;
    private prevValue;
    private isValidState;
    private isFocused;
    private isPrevFocused;
    private instance;
    private cultureInfo;
    private inputStyle;
    private inputName;
    private decimalSeparator;
    private angularTagName;
    private intRegExp;
    private l10n;
    private isCalled;
    private prevVal;
    private nextEle;
    private cursorPosChanged;
    private changeEventArgs;
    private isInteract;
    /**
     * Gets or Sets the CSS classes to root element of the NumericTextBox which helps to customize the
     * complete UI styles for the NumericTextBox component.
     * @default null
     */
    cssClass: string;
    /**
     * Sets the value of the NumericTextBox.
     * @default null
     * @aspType object
     */
    value: number;
    /**
     * Specifies a minimum value that is allowed a user can enter.
     * For more information on min, refer to
     * [min](../numerictextbox/getting-started#range-validation/).
     * @default null
     * @aspType object
     */
    min: number;
    /**
     * Specifies a maximum value that is allowed a user can enter.
     * For more information on max, refer to
     * [max](../numerictextbox/getting-started#range-validation/).
     * @default null
     * @aspType object
     */
    max: number;
    /**
     * Specifies the incremental or decremental step size for the NumericTextBox.
     * For more information on step, refer to
     * [step](../numerictextbox/getting-started#range-validation/).
     * @default 1
     */
    step: number;
    /**
     * Specifies the width of the NumericTextBox.
     * @default null
     */
    width: number | string;
    /**
     * Gets or sets the string shown as a hint/placeholder when the NumericTextBox is empty.
     * It acts as a label and floats above the NumericTextBox based on the
     * <b><a href="#floatlabeltype-string" target="_blank">floatLabelType.</a></b>
     * @default null
     */
    placeholder: string;
    /**
     * Specifies whether the up and down spin buttons should be displayed in NumericTextBox.
     * @default true
     */
    showSpinButton: boolean;
    /**
     * Sets a value that enables or disables the readonly state on the NumericTextBox. If it is true,
     * NumericTextBox will not allow your input.
     * @default false
     */
    readonly: boolean;
    /**
     * Sets a value that enables or disables the NumericTextBox control.
     * @default true
     */
    enabled: boolean;
    /**
     * Sets a value that enables or disables the RTL mode on the NumericTextBox. If it is true,
     * NumericTextBox will display the content in the right to left direction.
     * @default false
     */
    enableRtl: boolean;
    /**
     * Specifies whether to show or hide the clear icon.
     * @default false
     */
    showClearButton: boolean;
    /**
     * Enable or disable persisting NumericTextBox state between page reloads. If enabled, the `value` state will be persisted.
     * @default false
     */
    enablePersistence: boolean;
    /**
     * Specifies the number format that indicates the display format for the value of the NumericTextBox.
     * For more information on formats, refer to
     * [formats](../numerictextbox/formats#standard-formats/).
     * @default 'n2'
     */
    format: string;
    /**
     * Specifies the number precision applied to the textbox value when the NumericTextBox is focused.
     * For more information on decimals, refer to
     * [decimals](../numerictextbox/formats#precision-of-numbers/).
     * @default null
     */
    decimals: number;
    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     * @default null
     */
    currency: string;
    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     * @default null
     * @private
     */
    private currencyCode;
    /**
     * Specifies a value that indicates whether the NumericTextBox control allows the value for the specified range.
     * * If it is true, the input value will be restricted between the min and max range.
     * The typed value gets modified to fit the range on focused out state.
     * ```html
     * <input type='text' id="numeric"/>
     * ```
     * ```typescript
     * <script>
     *   var numericObj = new NumericTextBox({ min: 10, max: 20, value: 15 });
     *   numericObj.appendTo("#numeric");
     * </script>
     * ```
     * * Else, it allows any value even out of range value,
     * At that time of wrong value entered, the error class will be added to the component to highlight the error.
     * ```html
     * <input type='text' id="numeric"/>
     * ```
     * ```typescript
     * <script>
     *   var numericObj = new NumericTextBox({ strictMode: false, min: 10, max: 20, value: 15 });
     *   numericObj.appendTo("#numeric");
     * </script>
     * ```
     * @default true
     */
    strictMode: boolean;
    /**
     * Specifies whether the decimals length should be restricted during typing.
     * @default false
     */
    validateDecimalOnType: boolean;
    /**
     * The <b><a href="#placeholder-string" target="_blank">placeholder</a></b> acts as a label
     * and floats above the NumericTextBox based on the below values.
     * Possible values are:
     * * `Never` - Never floats the label in the NumericTextBox when the placeholder is available.
     * * `Always` - The floating label always floats above the NumericTextBox.
     * * `Auto` - The floating label floats above the NumericTextBox after focusing it or when enters the value in it.
     * @default Never
     */
    floatLabelType: FloatLabelType;
    /**
     * Triggers when the NumericTextBox component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when the NumericTextBox component is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers when the value of the NumericTextBox changes.
     * @event
     */
    change: EmitType<ChangeEventArgs>;
    constructor(options?: NumericTextBoxModel, element?: string | HTMLInputElement);
    protected preRender(): void;
    /**
     * To Initialize the control rendering
     * @private
     */
    render(): void;
    private checkAttributes;
    private updatePlaceholder;
    private initCultureFunc;
    private initCultureInfo;
    private createWrapper;
    private spinBtnCreation;
    private validateMinMax;
    private formattedValue;
    private validateStep;
    private action;
    private checkErrorClass;
    private bindClearEvent;
    protected resetHandler(e?: MouseEvent): void;
    private clear;
    private wireEvents;
    private wireSpinBtnEvents;
    private unwireEvents;
    private unwireSpinBtnEvents;
    private changeHandler;
    private raiseChangeEvent;
    private pasteHandler;
    private preventHandler;
    private keyUpHandler;
    private inputHandler;
    private keyDownHandler;
    private performAction;
    private correctRounding;
    private roundValue;
    private updateValue;
    private updateCurrency;
    private changeValue;
    private modifyText;
    private setElementValue;
    private validateState;
    private formatNumber;
    private trimValue;
    private roundNumber;
    private cancelEvent;
    private keyPressHandler;
    private numericRegex;
    private mouseWheel;
    private focusIn;
    private focusOut;
    private mouseDownOnSpinner;
    private touchMoveOnSpinner;
    private mouseUpOnSpinner;
    private getElementData;
    private floatLabelTypeUpdate;
    private mouseUpClick;
    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    increment(step?: number): void;
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    decrement(step?: number): void;
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    getText(): string;
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    onPropertyChanged(newProp: NumericTextBoxModel, oldProp: NumericTextBoxModel): void;
    /**
     * Gets the component name
     * @private
     */
    getModuleName(): string;
}
export interface ChangeEventArgs extends BaseEventArgs {
    /** Returns the entered value of the NumericTextBox. */
    value?: number;
    /** Returns the previously entered value of the NumericTextBox. */
    previousValue?: number;
    /** Returns the event parameters from NumericTextBox. */
    event?: Event;
    /** Returns the original event arguments. */
    isInteraction?: boolean;
}
