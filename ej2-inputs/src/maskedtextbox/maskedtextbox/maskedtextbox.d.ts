import { Component, EmitType, INotifyPropertyChanged, BaseEventArgs } from '-syncfusion/ej2-base';
import { FloatLabelType } from '../../input/input';
import { MaskedTextBoxModel } from './maskedtextbox-model';
/**
 * The MaskedTextBox allows the user to enter the valid input only based on the provided mask.
 * ```html
 * <input id="mask" type="text" />
 * ```
 * ```typescript
 * <script>
 * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999" });
 * maskObj.appendTo('#mask');
 * </script>
 * ```
 */
export declare class MaskedTextBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private cloneElement;
    private promptMask;
    private hiddenMask;
    private escapeMaskValue;
    private regExpCollec;
    private customRegExpCollec;
    private inputObj;
    private undoCollec;
    private redoCollec;
    private changeEventArgs;
    private focusEventArgs;
    private maskKeyPress;
    private angularTagName;
    private prevValue;
    private isFocus;
    private isInitial;
    private isIosInvalid;
    private preEleVal;
    /**
     * Gets or sets the CSS classes to root element of the MaskedTextBox which helps to customize the
     * complete UI styles for the MaskedTextBox component.
     * @default null
     */
    cssClass: string;
    /**
     * Sets the width of the MaskedTextBox.
     * @default null
     */
    width: number | string;
    /**
     * Gets or sets the string shown as a hint/placeholder when the MaskedTextBox is empty.
     * It acts as a label and floats above the MaskedTextBox based on the
     * <b><a href="#floatlabeltype-string" target="_blank">floatLabelType.</a></b>
     * @default null
     */
    placeholder: string;
    /**
     * The <b><a href="#placeholder-string" target="_blank">placeholder</a></b> acts as a label
     * and floats above the MaskedTextBox based on the below values.
     * Possible values are:
     * * Never - The floating label will not be enable when the placeholder is available.
     * * Always - The floating label always floats above the MaskedTextBox.
     * * Auto - The floating label floats above the MaskedTextBox after focusing it or when enters the value in it.
     * @default Never
     */
    floatLabelType: FloatLabelType;
    /**
     * Sets a value that enables or disables the MaskedTextBox component.
     * @default true
     */
    enabled: boolean;
    /**
     * Specifies whether to show or hide the clear icon.
     * @default false
     */
    showClearButton: boolean;
    /**
     * Sets a value that enables or disables the persisting state of the MaskedTextBox after reloading the page.
     * If enabled, the 'value' state will be persisted.
     * @default false
     */
    enablePersistence: boolean;
    /**
     * Sets a value that enables or disables the RTL mode on the MaskedTextBox. If it is true,
     * MaskedTextBox will display the content in the right to left direction.
     * @default false
     */
    enableRtl: boolean;
    /**
     * Sets a value that masks the MaskedTextBox to allow/validate the user input.
     * * Mask allows <b><a href="../maskedtextbox/mask-configuration.html#standard-mask-elements" target="_blank">standard mask elements
     * </a></b>, <b><a href="../maskedtextbox/mask-configuration.html#custom-characters" target="_blank">custom characters</a></b> and
     * <b><a href="../maskedtextbox/mask-configuration.html#regular-expression" target="_blank">regular expression</a></b> as mask elements.
     * For more information on mask, refer to
     * [mask](../maskedtextbox/mask-configuration#standard-mask-elements/).
     * * If the mask value is empty, the MaskedTextBox will behave as an input element with text type.
     * @default null
     */
    mask: string;
    /**
     * Gets or sets a value that will be shown as a prompting symbol for the masked value.
     * The symbol used to show input positions in the MaskedTextBox.
     * For more information on prompt-character, refer to
     * [prompt-character](../maskedtextbox/mask-configuration#prompt-character/).
     * @default _
     */
    promptChar: string;
    /**
     * Gets or sets the value of the MaskedTextBox. It is a raw value of the MaskedTextBox excluding literals
     * and prompt characters. By using `getMaskedValue` property, you can get the value of MaskedTextBox with the masked format.
     * ```html
     * <input id="mask" type="text" />
     * ```
     * ```typescript
     * <script>
     * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999", value: "8674321756" });
     * maskObj.appendTo('#mask');
     * </script>
     * ```
     * @default null
     */
    value: string;
    /**
     * Sets the collection of values to be mapped for non-mask elements(literals)
     * which have been set in the mask of MaskedTextBox.
     * * In the below example, non-mask elements "P" accepts values
     * "P" , "A" , "p" , "a" and "M" accepts values "M", "m" mentioned in the custom characters collection.
     * ```html
     * <input id="mask" type="text" />
     * ```
     * ```typescript
     * <script>
     * var customChar = { P: 'P,A,p,a', M: 'M,m'};
     * var maskObj = new MaskedTextBox({ mask: "99 : 99 PM", customCharacters: customChar });
     * maskObj.appendTo('#mask');
     * </script>
     * ```
     * For more information on customCharacters, refer to
     * [customCharacters](../maskedtextbox/mask-configuration#custom-characters/).
     * @default null
     */
    customCharacters: {
        [x: string]: Object;
    };
    /**
     * Triggers when the MaskedTextBox component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when the MaskedTextBox component is destroyed.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers when the value of the MaskedTextBox changes.
     * @event
     */
    change: EmitType<MaskChangeEventArgs>;
    /**
     * Triggers when the MaskedTextBox while got focus in.
     * @event
     */
    focus: EmitType<MaskFocusEventArgs>;
    constructor(options?: MaskedTextBoxModel, element?: string | HTMLElement | HTMLInputElement);
    /**
     * Gets the component name
     * @private
     */
    protected getModuleName(): string;
    /**
     * Initializes the event handler
     * @private
     */
    protected preRender(): void;
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * Initializes the component rendering.
     * @private
     */
    render(): void;
    private resetMaskedTextBox;
    private setMaskPlaceholder;
    private setCssClass;
    private setWidth;
    private createWrapper;
    /**
     * Calls internally if any of the property value is changed.
     * @hidden
     */
    onPropertyChanged(newProp: MaskedTextBoxModel, oldProp: MaskedTextBoxModel): void;
    private updateValue;
    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     * @return {string}
     */
    getMaskedValue(): string;
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
export interface MaskChangeEventArgs extends BaseEventArgs {
    /** Returns the value of the MaskedTextBox with the masked format. */
    maskedValue?: string;
    /** Returns the raw value of MaskedTextBox by removing the prompt characters and literals(non-mask elements)
     * which have been set in the mask of MaskedTextBox.
     */
    value?: string;
    /** Returns true when the value of MaskedTextBox is changed by user interaction. Otherwise, it returns false */
    isInteraction?: boolean;
    /** Returns the original event arguments. */
    event?: Event;
}
export interface MaskFocusEventArgs extends BaseEventArgs {
    /** Returns selectionStart value as zero by default */
    selectionStart?: number;
    /** Returns selectionEnd value depends on mask length */
    selectionEnd?: number;
}
