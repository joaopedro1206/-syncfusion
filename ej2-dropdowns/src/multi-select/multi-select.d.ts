/// <reference path="../drop-down-base/drop-down-base-model.d.ts" />
import { DropDownBase, SelectEventArgs, PopupEventArgs, FilteringEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { IInput, FloatLabelType } from '-syncfusion/ej2-inputs';
import { EmitType, KeyboardEventArgs } from '-syncfusion/ej2-base';
import { MultiSelectModel } from '../multi-select';
import { ModuleDeclaration } from '-syncfusion/ej2-base';
import { Query } from '-syncfusion/ej2-data';
export interface RemoveEventArgs extends SelectEventArgs {
}
/**
 * The Multiselect allows the user to pick a more than one value from list of predefined values.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var multiselectObj = new Multiselect();
 *   multiselectObj.appendTo("#list");
 * </script>
 * ```
 */
export declare class MultiSelect extends DropDownBase implements IInput {
    private spinnerElement;
    private selectAllAction;
    private setInitialValue;
    private setDynValue;
    private listCurrentOptions;
    private targetInputElement;
    private selectAllHeight?;
    private searchBoxHeight?;
    private mobFilter?;
    private isFiltered;
    private isFirstClick;
    private focused;
    private initial;
    private backCommand;
    private keyAction;
    /**
     * Sets the CSS classes to root element of this component which helps to customize the
     * complete styles.
     * @default null
     */
    cssClass: string;
    /**
     * Gets or sets the width of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default '100%'
     * @aspType string
     */
    width: string | number;
    /**
     * Gets or sets the height of the popup list. By default it renders based on its list item.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](./getting-started.html#configure-the-popup-list) documentation.
     *
     * @default '300px'
     * @aspType string
     */
    popupHeight: string | number;
    /**
     * Gets or sets the width of the popup list and percentage values has calculated based on input width.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](./getting-started.html#configure-the-popup-list) documentation.
     *
     * @default '100%'
     * @aspType string
     */
    popupWidth: string | number;
    /**
     * Gets or sets the placeholder in the component to display the given information
     * in input when no item selected.
     * @default null
     */
    placeholder: string;
    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     * @default null
     */
    filterBarPlaceholder: string;
    /**
     * Gets or sets the additional attribute to `HtmlAttributes` property in MultiSelect,
     * which helps to add attribute like title, name etc, input should be key value pair.
     *
     * {% codeBlock src="multiselect/html-attributes-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="multiselect/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    htmlAttributes: {
        [key: string]: string;
    };
    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to
     * [`Template`](./templates.html) documentation.
     *
     * We have built-in [`template engine`](./template-engine.html)
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    valueTemplate: string;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](./templates.html) documentation.
     *
     * @default null
     */
    headerTemplate: string;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](./templates.html) documentation.
     *
     * @default null
     */
    footerTemplate: string;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * > For more details about the available template options refer to [`Template`](./templates.html) documentation.
     *
     * We have built-in [`template engine`](./template-engine.html)
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    itemTemplate: string;
    /**
     * To enable the filtering option in this component.
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     *
     * {% codeBlock src="multiselect/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="multiselect/allow-filtering-api/index.html" %}{% endcodeBlock %}
     *
     * @default false
     */
    allowFiltering: boolean;
    /**
     * Allows user to add a
     * [`custom value`](./custom-value.html), the value which is not present in the suggestion list.
     * @default false
     */
    allowCustomValue: boolean;
    /**
     * Enables close icon with the each selected item.
     * @default true
     */
    showClearButton: boolean;
    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     */
    maximumSelectionLength: number;
    /**
     * Gets or sets the `readonly` to input or not. Once enabled, just you can copy or highlight
     * the text however tab key action will perform.
     *
     * @default false
     */
    readonly: boolean;
    /**
     * Selects the list item which maps the data `text` field in the component.
     * @default null
     */
    text: string;
    /**
     * Selects the list item which maps the data `value` field in the component.
     * @default null
     */
    value: number[] | string[] | boolean[];
    /**
     * Hides the selected item from the list item.
     * @default true
     */
    hideSelectedItem: boolean;
    /**
     * Based on the property, when item get select popup visibility state will changed.
     * @default true
     */
    closePopupOnSelect: boolean;
    /**
     * configures visibility mode for component interaction.
     *
     *   - `Box` - selected items will be visualized in chip.
     *
     *   - `Delimiter` - selected items will be visualized in text content.
     *
     *   - `Default` - on `focus in` component will act in `box` mode.
     *    on `blur` component will act in `delimiter` mode.
     *
     *   - `CheckBox` - The 'checkbox' will be visualized in list item.
     *
     * {% codeBlock src="multiselect/visual-mode-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="multiselect/visual-mode-api/index.html" %}{% endcodeBlock %}
     *
     * @default Default
     */
    mode: visualMode;
    /**
     * Sets the delimiter character for 'default' and 'delimiter' visibility modes.
     * @default ,
     */
    delimiterChar: string;
    /**
     * Sets [`case sensitive`](./filtering.html#case-sensitive-filtering)
     * option for filter operation.
     * @default true
     */
    ignoreCase: boolean;
    /**
     * Allows you to either show or hide the DropDown button on the component
     *
     * @default false
     */
    showDropDownIcon: boolean;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     *
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    floatLabelType: FloatLabelType;
    /**
     * Allows you to either show or hide the selectAll option on the component.
     *
     * @default false
     */
    showSelectAll: boolean;
    /**
     * Specifies the selectAllText to be displayed on the component.
     *
     * @default 'select All'
     */
    selectAllText: string;
    /**
     * Specifies the UnSelectAllText to be displayed on the component.
     *
     * @default 'select All'
     */
    unSelectAllText: string;
    /**
     * Reorder the selected items in popup visibility state.
     *
     * @default true
     */
    enableSelectionOrder: boolean;
    /**
     * Whether to automatically open the popup when the control is clicked.
     * @default true
     */
    openOnClick: boolean;
    /**
     * Fires each time when selection changes happened in list items after model and input value get affected.
     * @event
     */
    change: EmitType<MultiSelectChangeEventArgs>;
    /**
     * Fires before the selected item removed from the widget.
     * @event
     */
    removing: EmitType<RemoveEventArgs>;
    /**
     * Fires after the selected item removed from the widget.
     * @event
     */
    removed: EmitType<RemoveEventArgs>;
    /**
     * Fires after select all process completion.
     * @event
     */
    selectedAll: EmitType<ISelectAllEventArgs>;
    /**
     * Fires when popup opens before animation.
     * @event
     */
    beforeOpen: EmitType<Object>;
    /**
     * Fires when popup opens after animation completion.
     * @event
     */
    open: EmitType<PopupEventArgs>;
    /**
     * Fires when popup close after animation completion.
     * @event
     */
    close: EmitType<PopupEventArgs>;
    /**
     * Event triggers when the input get focus-out.
     * @event
     */
    blur: EmitType<Object>;
    /**
     * Event triggers when the input get focused.
     * @event
     */
    focus: EmitType<Object>;
    /**
     * Event triggers when the chip selection.
     * @event
     */
    chipSelection: EmitType<Object>;
    /**
     * Triggers event,when user types a text in search box.
     * > For more details about filtering, refer to [`Filtering`](./filtering.html) documentation.
     *
     * @event
     */
    filtering: EmitType<FilteringEventArgs>;
    /**
     * Fires before set the selected item as chip in the component.
     * > For more details about chip customization refer [`Chip Customization`](./chip-customization.html)
     *
     * @event
     */
    tagging: EmitType<TaggingEventArgs>;
    /**
     * Triggers when the [`customValue`](./custom-value.html) is selected.
     * @event
     */
    customValueSelection: EmitType<CustomValueEventArgs>;
    /**
     * Constructor for creating the DropDownList widget.
     */
    constructor(option?: MultiSelectModel, element?: string | HTMLElement);
    private isValidKey;
    private mainList;
    ulElement: HTMLElement;
    private mainData;
    private mainListCollection;
    private customValueFlag;
    private inputElement;
    private componentWrapper;
    private overAllWrapper;
    private searchWrapper;
    private viewWrapper;
    private chipCollectionWrapper;
    private overAllClear;
    private dropIcon;
    private hiddenElement;
    private delimiterWrapper;
    private popupObj;
    private inputFocus;
    private header;
    private footer;
    private initStatus;
    private popupWrapper;
    private keyCode;
    private beforePopupOpen;
    private remoteCustomValue;
    private filterAction;
    private remoteFilterAction;
    private selectAllEventData;
    private selectAllEventEle;
    private enableRTL;
    requiredModules(): ModuleDeclaration[];
    private updateHTMLAttribute;
    private updateReadonly;
    private updateClearButton;
    private updateCssClass;
    private onPopupShown;
    private loadTemplate;
    private setScrollPosition;
    private focusAtFirstListItem;
    private focusAtLastListItem;
    protected getAriaAttributes(): {
        [key: string]: string;
    };
    private updateListARIA;
    private removelastSelection;
    protected onActionFailure(e: Object): void;
    protected targetElement(): string;
    private getForQuery;
    protected onActionComplete(ulElement: HTMLElement, list: {
        [key: string]: Object;
    }[] | number[] | boolean[] | string[], e?: Object, isUpdated?: boolean): void;
    private updateActionList;
    private refreshSelection;
    private hideGroupItem;
    private checkSelectAll;
    private openClick;
    private KeyUp;
    protected getQuery(query: Query): Query;
    private dataUpdater;
    private tempQuery;
    private tempValues;
    private checkForCustomValue;
    protected getNgDirective(): string;
    private wrapperClick;
    private enable;
    private scrollFocusStatus;
    private keyDownStatus;
    private onBlur;
    private refreshInputHight;
    private validateValues;
    private updateValueState;
    private getPagingCount;
    private pageUpSelection;
    private pageDownSelection;
    getItems(): Element[];
    private focusIn;
    private showDelimWrapper;
    private hideDelimWrapper;
    private expandTextbox;
    private isPopupOpen;
    private refreshPopup;
    private checkTextLength;
    private popupKeyActions;
    private updateAriaAttribute;
    private onKeyDown;
    private arrowDown;
    private arrowUp;
    private spaceKeySelection;
    private checkBackCommand;
    private keyNavigation;
    private selectByKey;
    private escapeAction;
    private scrollBottom;
    private scrollTop;
    private selectListByKey;
    private refreshListItems;
    private removeSelectedChip;
    private moveByTop;
    private moveByList;
    private moveBy;
    private chipClick;
    private removeChipSelection;
    private addChipSelection;
    private onChipRemove;
    private makeTextBoxEmpty;
    private refreshPlaceHolder;
    private removeValue;
    private updateMainList;
    private removeChip;
    private updateChipStatus;
    private addValue;
    private checkMaxSelection;
    private dispatchSelect;
    private addChip;
    private removeChipFocus;
    private onMobileChipInteraction;
    private getChip;
    private calcPopupWidth;
    private mouseIn;
    private mouseOut;
    protected listOption(dataSource: {
        [key: string]: Object;
    }[], fields: FieldSettingsModel): FieldSettingsModel;
    private renderPopup;
    private setHeaderTemplate;
    private setFooterTemplate;
    private ClearAll;
    private windowResize;
    private resetValueHandler;
    protected wireEvent(): void;
    private onInput;
    protected preRender(): void;
    private initializeData;
    private updateData;
    private initialTextUpdate;
    private initialValueUpdate;
    protected isValidLI(li: Element | HTMLElement): boolean;
    protected updateListSelection(li: Element, e: MouseEvent | KeyboardEventArgs, length?: number): void;
    protected removeListSelection(): void;
    private removeHover;
    private removeFocus;
    private addListHover;
    private addListFocus;
    private addListSelection;
    private updateDelimeter;
    private onMouseClick;
    private onMouseOver;
    private onMouseLeave;
    private onListMouseDown;
    private onDocumentClick;
    private wireListEvents;
    private unwireListEvents;
    private hideOverAllClear;
    private showOverAllClear;
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    showSpinner(): void;
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    hideSpinner(): void;
    private updateDelimView;
    private updateRemainTemplate;
    private updateRemainingText;
    private getOverflowVal;
    private unWireEvent;
    private selectAllItem;
    protected setZIndex(): void;
    protected updateDataSource(prop?: MultiSelectModel): void;
    private onLoadSelect;
    protected selectAllItems(state: boolean, event?: MouseEvent): void;
    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string;
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp: MultiSelectModel, oldProp: MultiSelectModel): void;
    private updateVal;
    /**
     * Hides the popup, if the popup in a open state.
     * @returns void
     */
    hidePopup(): void;
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    showPopup(): void;
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    selectAll(state: boolean): void;
    getModuleName(): string;
    /**
     * To Initialize the control rendering
     * @private
     */
    render(): void;
    private checkAutoFocus;
    private setFloatLabelType;
    private dropDownIcon;
    private initialUpdate;
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
export interface CustomValueEventArgs {
    /**
     * Gets the newly added data.
     */
    newData: Object;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
}
export interface TaggingEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected item as JSON Object from the data source.
     */
    itemData: FieldSettingsModel;
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * To set the classes to chip element
     * @param  { string } classes - Specify the classes to chip element.
     * @return {void}.
     */
    setClass: Function;
}
export interface MultiSelectChangeEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the component initial Value.
     */
    oldValue: number[] | string[] | boolean[];
    /**
     * Returns the updated component Values.
     */
    value: number[] | string[] | boolean[];
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement;
}
export declare type visualMode = 'Default' | 'Delimiter' | 'Box' | 'CheckBox';
export interface ISelectAllEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected list items.
     */
    items: HTMLLIElement[];
    /**
     * Returns the selected items as JSON Object from the data source.
     */
    itemData: FieldSettingsModel[];
    /**
     * Specifies the original event arguments.
     */
    event: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Specifies whether it is selectAll or deSelectAll.
     */
    isChecked?: boolean;
}
