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
import { EventHandler, Property, Internationalization, NotifyPropertyChanges } from '-syncfusion/ej2-base';
import { KeyboardEvents, Animation, Browser } from '-syncfusion/ej2-base';
import { cldrData, L10n, Component, getDefaultDateObject, rippleEffect, Event } from '-syncfusion/ej2-base';
import { remove, addClass, removeClass, closest, append, attributes, setStyleAttribute } from '-syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, getValue, getUniqueID } from '-syncfusion/ej2-base';
import { Popup } from '-syncfusion/ej2-popups';
import { Input } from '-syncfusion/ej2-inputs';
import { ListBase, cssClass as ListBaseClasses } from '-syncfusion/ej2-lists';
var WRAPPERCLASS = 'e-time-wrapper';
var POPUP = 'e-popup';
var ERROR = 'e-error';
var POPUPDIMENSION = '240px';
var DAY = new Date().getDate();
var MONTH = new Date().getMonth();
var YEAR = new Date().getFullYear();
var ROOT = 'e-timepicker';
var RTL = 'e-rtl';
var CONTENT = 'e-content';
var SELECTED = 'e-active';
var HOVER = 'e-hover';
var NAVIGATION = 'e-navigation';
var DISABLED = 'e-disabled';
var ICONANIMATION = 'e-icon-anim';
var FOCUS = 'e-input-focus';
var DEVICE = 'e-device';
var LISTCLASS = ListBaseClasses.li;
var HALFPOSITION = 2;
var ANIMATIONDURATION = 50;
export var TimePickerBase;
(function (TimePickerBase) {
    // tslint:disable-next-line
    function createListItems(createdEl, min, max, globalize, timeFormat, step) {
        var formatOptions;
        if (this.calendarMode === 'Gregorian') {
            formatOptions = { format: timeFormat, type: 'time' };
        }
        else {
            formatOptions = { format: timeFormat, type: 'time', calendar: 'islamic' };
        }
        var start;
        var end;
        var interval = step * 60000;
        var listItems = [];
        var timeCollections = [];
        start = +(min.setMilliseconds(0));
        end = +(max.setMilliseconds(0));
        while (end >= start) {
            timeCollections.push(start);
            listItems.push(globalize.formatDate(new Date(start), { format: timeFormat, type: 'time' }));
            start += interval;
        }
        var listTag = ListBase.createList(createdEl, listItems, null, true);
        return { collection: timeCollections, list: listTag };
    }
    TimePickerBase.createListItems = createListItems;
})(TimePickerBase || (TimePickerBase = {}));
/**
 * TimePicker is an intuitive interface component which provides an options to select a time value
 * from popup list or to set a desired time value.
 * ```
 * <input id='timepicker' type='text'/>
 * <script>
 *   var timePickerObj = new TimePicker({ value: new Date() });
 *   timePickerObj.appendTo('#timepicker');
 * </script>
 * ```
 */
var TimePicker = /** @class */ (function (_super) {
    __extends(TimePicker, _super);
    /**
     * Constructor for creating the widget
     */
    function TimePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.liCollections = [];
        _this.timeCollections = [];
        _this.disableItemCollection = [];
        return _this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    TimePicker.prototype.preRender = function () {
        this.keyConfigure = {
            enter: 'enter',
            escape: 'escape',
            end: 'end',
            tab: 'tab',
            home: 'home',
            down: 'downarrow',
            up: 'uparrow',
            left: 'leftarrow',
            right: 'rightarrow',
            open: 'alt+downarrow',
            close: 'alt+uparrow'
        };
        this.cloneElement = this.element.cloneNode(true);
        this.inputElement = this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-TIMEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
    };
    // element creation
    TimePicker.prototype.render = function () {
        this.initialize();
        this.createInputElement();
        this.setTimeAllowEdit();
        this.setEnable();
        this.validateInterval();
        this.bindEvents();
        this.validateDisable();
        this.setValue(this.getFormattedValue(this.value));
    };
    TimePicker.prototype.setTimeAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            attributes(this.inputElement, { 'readonly': '' });
        }
    };
    TimePicker.prototype.validateDisable = function () {
        this.setMinMax(this.initMin, this.initMax);
        this.popupCreation();
        this.popupObj.hide();
        if ((!isNaN(+this.value) && this.value !== null)) {
            if (!this.valueIsDisable(this.value)) {
                //disable value given in value property so reset the date based on current date
                if (this.strictMode) {
                    this.resetState();
                }
                this.initValue = null;
                this.initMax = this.getDateObject(this.initMax);
                this.initMin = this.getDateObject(this.initMin);
                this.timeCollections = this.liCollections = [];
                this.setMinMax(this.initMin, this.initMax);
            }
        }
    };
    TimePicker.prototype.validationAttribute = function (target, input) {
        var name = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        input.setAttribute('name', name);
        target.removeAttribute('name');
        var attributes = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes.length; i++) {
            if (isNullOrUndefined(target.getAttribute(attributes[i]))) {
                continue;
            }
            var attr = target.getAttribute(attributes[i]);
            input.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    };
    TimePicker.prototype.initialize = function () {
        this.globalize = new Internationalization(this.locale);
        this.defaultCulture = new Internationalization('en');
        // persist the value property.
        this.setProperties({ value: this.checkDateValue(new Date('' + this.value)) }, true);
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        if (this.angularTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.checkAttributes(); //check the input element attributes
        var localeText = { placeholder: this.placeholder };
        this.l10n = new L10n('timepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.initValue = this.checkDateValue(this.value);
        this.initMin = this.checkDateValue(this.min);
        this.initMax = this.checkDateValue(this.max);
        this.isNavigate = this.isPreventBlur = this.isTextSelected = false;
        this.activeIndex = this.valueWithMinutes = this.prevDate = null;
        if (!isNullOrUndefined(this.element.getAttribute('id'))) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            //for angular case
            this.element.id = getUniqueID('ej2_timepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
    };
    TimePicker.prototype.checkDateValue = function (value) {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    };
    TimePicker.prototype.createInputElement = function () {
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [' e-input-group-icon e-time-icon e-icons']
        }, this.createElement);
        this.inputWrapper.container.style.width = this.setWidth(this.width);
        attributes(this.inputElement, {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'false', 'aria-invalid': 'false'
        });
        if (!this.isNullOrEmpty(this.inputStyle)) {
            Input.addAttributes({ 'style': this.inputStyle }, this.inputElement);
        }
        addClass([this.inputWrapper.container], WRAPPERCLASS);
    };
    // destroy function
    TimePicker.prototype.destroy = function () {
        this.hide();
        this.unBindEvents();
        var ariaAttribute = {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'true', 'aria-invalid': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttribute, this.inputElement);
            if (this.angularTag === null) {
                this.inputWrapper.container.parentElement.appendChild(this.inputElement);
            }
            this.ensureInputAttribute();
            this.enableElement([this.inputElement]);
            this.inputElement.classList.remove('e-input');
            if (isNullOrUndefined(this.cloneElement.getAttribute('disabled'))) {
                Input.setEnabled(true, this.inputElement, this.floatLabelType);
            }
        }
        if (this.inputWrapper.container) {
            remove(this.inputWrapper.container);
        }
        this.inputWrapper = this.popupWrapper = this.cloneElement = undefined;
        this.liCollections = this.timeCollections = this.disableItemCollection = [];
        if (!isNullOrUndefined(this.rippleFn)) {
            this.rippleFn();
        }
        _super.prototype.destroy.call(this);
        var form = closest(this.element, 'form');
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
        }
    };
    TimePicker.prototype.ensureInputAttribute = function () {
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            var prop = this.inputElement.attributes[i].name;
            if (isNullOrUndefined(this.cloneElement.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.cloneElement.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    };
    //popup creation
    TimePicker.prototype.popupCreation = function () {
        this.popupWrapper = this.createElement('div', {
            className: ROOT + ' ' + POPUP,
            attrs: { 'id': this.element.id + '_popup', 'style': 'visibility:hidden' }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.generateList();
            append([this.listWrapper], this.popupWrapper);
        }
        document.body.appendChild(this.popupWrapper);
        this.addSelection();
        this.renderPopup();
        this.setScrollPosition();
    };
    TimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    TimePicker.prototype.generateList = function () {
        this.createListItems();
        this.wireListEvents();
        var rippleModel = { duration: 300, selector: '.' + LISTCLASS };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS);
    };
    TimePicker.prototype.popupCalculation = function () {
        var left = 0;
        if (Browser.isDevice) {
            var firstItem = this.isEmptyList() ? this.listTag : this.liCollections[0];
            left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                (this.enableRtl ? parseInt(getComputedStyle(this.inputElement).paddingRight, 10) :
                    parseInt(getComputedStyle(this.inputElement).paddingLeft, 10)));
        }
        return left;
    };
    TimePicker.prototype.isEmptyList = function () {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0 ||
            isNullOrUndefined(this.liCollections);
    };
    TimePicker.prototype.renderPopup = function () {
        var _this = this;
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        var offset = Browser.isDevice ? this.setPopupPosition() : 2;
        this.popupObj = new Popup(this.popupWrapper, {
            width: this.setPopupWidth(this.width),
            zIndex: this.zIndex,
            targetType: 'relative',
            collision: { X: 'flip', Y: 'flip' },
            relateTo: this.inputWrapper.container,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            offsetX: this.popupCalculation(),
            open: function () {
                _this.popupWrapper.style.visibility = 'visible';
                addClass([_this.inputWrapper.buttons[0]], SELECTED);
            }, close: function () {
                removeClass([_this.inputWrapper.buttons[0]], SELECTED);
                _this.unWireListEvents();
                _this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(_this.popupObj.element);
                _this.popupObj.destroy();
                _this.popupWrapper.innerHTML = '';
                _this.listWrapper = _this.popupWrapper = _this.listTag = undefined;
            }
        });
        if (!Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    };
    //util function
    TimePicker.prototype.getFormattedValue = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { skeleton: 'medium', type: 'time' });
        }
    };
    TimePicker.prototype.getDateObject = function (text) {
        if (!this.isNullOrEmpty(text)) {
            var dateValue = this.createDateObj(text);
            var value = !this.isNullOrEmpty(this.initValue);
            if (this.checkDateValue(dateValue)) {
                var date = value ? this.initValue.getDate() : DAY;
                var month = value ? this.initValue.getMonth() : MONTH;
                var year = value ? this.initValue.getFullYear() : YEAR;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    };
    TimePicker.prototype.removeErrorClass = function () {
        removeClass([this.inputWrapper.container], ERROR);
        attributes(this.inputElement, { 'aria-invalid': 'false' });
    };
    TimePicker.prototype.checkErrorState = function (val) {
        var value = this.getDateObject(val);
        if (this.validateState(value)) {
            this.removeErrorClass();
        }
        else {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
    };
    TimePicker.prototype.validateInterval = function () {
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.enableElement([this.inputWrapper.buttons[0]]);
        }
        else {
            this.disableTimeIcon();
        }
    };
    TimePicker.prototype.disableTimeIcon = function () {
        this.disableElement([this.inputWrapper.buttons[0]]);
        this.hide();
    };
    TimePicker.prototype.disableElement = function (element) {
        addClass(element, DISABLED);
    };
    TimePicker.prototype.enableElement = function (element) {
        removeClass(element, DISABLED);
    };
    TimePicker.prototype.selectInputText = function () {
        this.inputElement.setSelectionRange(0, (this.inputElement).value.length);
    };
    TimePicker.prototype.getMeridianText = function () {
        var meridian;
        if (this.locale === 'en' || this.locale === 'en-US') {
            meridian = getValue('dayPeriods.format.wide', getDefaultDateObject());
        }
        else {
            meridian = getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.dayPeriods.format.abbreviated', cldrData);
        }
        return meridian;
    };
    TimePicker.prototype.getCursorSelection = function () {
        var input = (this.inputElement);
        var start = 0;
        var end = 0;
        if (!isNaN(input.selectionStart)) {
            start = input.selectionStart;
            end = input.selectionEnd;
        }
        return { start: Math.abs(start), end: Math.abs(end) };
    };
    TimePicker.prototype.getActiveElement = function () {
        if (!isNullOrUndefined(this.popupWrapper)) {
            return this.popupWrapper.querySelectorAll('.' + SELECTED);
        }
        else {
            return null;
        }
    };
    TimePicker.prototype.isNullOrEmpty = function (value) {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    };
    TimePicker.prototype.setWidth = function (width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        }
        else {
            width = '100%';
        }
        return width;
    };
    TimePicker.prototype.setPopupWidth = function (width) {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice) {
            var firstItem = this.isEmptyList() ? this.listTag : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).textIndent, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    };
    TimePicker.prototype.setScrollPosition = function () {
        var listHeight = this.getPopupHeight();
        var element;
        element = this.selectedElement;
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else if (this.popupWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    };
    TimePicker.prototype.findScrollTop = function (element) {
        var listHeight = this.getPopupHeight();
        var nextEle = element.nextElementSibling;
        var height = nextEle ? nextEle.offsetTop : element.offsetTop;
        var liHeight = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupWrapper.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.setScrollTo = function () {
        var element;
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                var initialTime = this.timeCollections[0];
                var scrollTime = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
            }
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.getText = function () {
        return (isNullOrUndefined(this.checkDateValue(this.value))) ? '' : this.getValue(this.value);
    };
    TimePicker.prototype.getValue = function (value) {
        return (isNullOrUndefined(this.checkDateValue(value))) ? null : this.globalize.formatDate(value, {
            format: this.cldrTimeFormat(), type: 'time'
        });
    };
    TimePicker.prototype.cldrDateFormat = function () {
        var cldrDate;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDate = (getValue('dateFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDate = (this.getCultureDateObject(cldrData, '' + this.locale));
        }
        return cldrDate;
    };
    TimePicker.prototype.cldrTimeFormat = function () {
        var cldrTime;
        if (this.isNullOrEmpty(this.format)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = (getValue('timeFormats.short', getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.format;
        }
        return cldrTime;
    };
    TimePicker.prototype.dateToNumeric = function () {
        var cldrTime;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrTime = (getValue('timeFormats.medium', getDefaultDateObject()));
        }
        else {
            cldrTime = (getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.medium', cldrData));
        }
        return cldrTime;
    };
    TimePicker.prototype.getExactDateTime = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { format: this.dateToNumeric(), type: 'time' });
        }
    };
    TimePicker.prototype.setValue = function (value) {
        var time = this.checkValue(value);
        if (!this.strictMode && !this.validateState(time)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            if (this.isNullOrEmpty(time)) {
                this.initValue = null;
                this.validateMinMax(this.value, this.min, this.max);
            }
            else {
                this.initValue = this.compareFormatChange(time);
            }
        }
        this.updateInput(true, this.initValue);
    };
    TimePicker.prototype.compareFormatChange = function (value) {
        if (isNullOrUndefined(value)) {
            return null;
        }
        return (value !== this.getText()) ? this.getDateObject(value) : this.getDateObject(this.value);
    };
    TimePicker.prototype.updatePlaceHolder = function () {
        Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
    };
    //event related functions
    TimePicker.prototype.popupHandler = function (e) {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', '');
        }
        e.preventDefault();
        if (this.isPopupOpen()) {
            this.closePopup(0, e);
        }
        else {
            this.show(e);
        }
    };
    TimePicker.prototype.mouseDownHandler = function () {
        if (!this.readonly) {
            var curPos = this.getCursorSelection();
            this.inputElement.setSelectionRange(0, 0);
            EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        }
    };
    TimePicker.prototype.mouseUpHandler = function (event) {
        if (!this.readonly) {
            event.preventDefault();
            EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
            var curPos = this.getCursorSelection();
            if (!(curPos.start === 0 && curPos.end === this.inputElement.value.length)) {
                if (this.inputElement.value.length > 0) {
                    this.cursorDetails = this.focusSelection();
                }
                this.inputElement.setSelectionRange(this.cursorDetails.start, this.cursorDetails.end);
            }
        }
    };
    TimePicker.prototype.focusSelection = function () {
        var regex = new RegExp('^[a-zA-Z0-9]+$');
        var split = this.inputElement.value.split('');
        split.push(' ');
        var curPos = this.getCursorSelection();
        var start = 0;
        var end = 0;
        var isSeparator = false;
        if (!this.isTextSelected) {
            for (var i = 0; i < split.length; i++) {
                if (!regex.test(split[i])) {
                    end = i;
                    isSeparator = true;
                }
                if (isSeparator) {
                    if (curPos.start >= start && curPos.end <= end) {
                        end = end;
                        this.isTextSelected = true;
                        break;
                    }
                    else {
                        start = i + 1;
                        isSeparator = false;
                    }
                }
            }
        }
        else {
            start = curPos.start;
            end = curPos.end;
            this.isTextSelected = false;
        }
        return { start: start, end: end };
    };
    TimePicker.prototype.inputHandler = function (event) {
        if (!this.readonly && this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
                case 'home':
                case 'end':
                case 'up':
                case 'down':
                    this.keyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.updateValue(this.valueWithMinutes, event);
                    }
                    else {
                        this.updateValue(this.inputElement.value, event);
                    }
                    this.hide();
                    addClass([this.inputWrapper.container], FOCUS);
                    this.isNavigate = false;
                    if (this.isPopupOpen()) {
                        event.stopPropagation();
                    }
                    break;
                case 'open':
                    this.show(event);
                    break;
                case 'escape':
                    Input.setValue(this.objToString(this.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.previousState(this.value);
                    this.hide();
                    break;
                case 'close':
                    this.hide();
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    };
    TimePicker.prototype.onMouseClick = function (event) {
        var target = event.target;
        var li = this.selectedElement = closest(target, '.' + LISTCLASS);
        this.setSelection(li, event);
        if (li && li.classList.contains(LISTCLASS)) {
            this.hide();
            addClass([this.inputWrapper.container], FOCUS);
        }
    };
    TimePicker.prototype.closePopup = function (delay, e) {
        if (this.isPopupOpen() && this.popupWrapper) {
            var args = {
                popup: this.popupObj,
                event: e || null,
                cancel: false,
                name: 'open'
            };
            this.trigger('close', args);
            if (!args.cancel) {
                var animModel = {
                    name: 'FadeOut',
                    duration: ANIMATIONDURATION,
                    delay: delay ? delay : 0
                };
                this.popupObj.hide(new Animation(animModel));
                removeClass([this.inputWrapper.container], [ICONANIMATION]);
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            }
        }
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
            this.element.removeAttribute('readonly');
        }
    };
    TimePicker.prototype.checkValueChange = function (event, isNavigation) {
        if (!this.strictMode && !this.validateState(this.valueWithMinutes)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.setProperties({ value: this.compareFormatChange(this.inputElement.value) }, true);
            this.initValue = this.valueWithMinutes = this.compareFormatChange(this.inputElement.value);
            this.prevValue = this.inputElement.value;
            if (+this.prevDate !== +this.value) {
                this.changeEvent(event);
            }
        }
        else {
            if (!isNavigation) {
                if ((this.prevValue !== this.inputElement.value) || isNullOrUndefined(this.checkDateValue(this.value))) {
                    this.valueProcess(event, this.compareFormatChange(this.inputElement.value));
                }
            }
            else {
                var value = this.getDateObject(new Date(this.timeCollections[this.activeIndex]));
                if (+this.prevDate !== +value) {
                    this.valueProcess(event, value);
                }
            }
        }
    };
    TimePicker.prototype.onMouseOver = function (event) {
        var currentLi = closest(event.target, '.' + LISTCLASS);
        this.setHover(currentLi, HOVER);
    };
    TimePicker.prototype.setHover = function (li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeHover(className);
            addClass([li], className);
            if (className === NAVIGATION) {
                li.setAttribute('aria-selected', 'true');
            }
        }
    };
    TimePicker.prototype.setSelection = function (li, event) {
        if (this.isValidLI(li) && !li.classList.contains(SELECTED)) {
            this.checkValue(li.getAttribute('data-value'));
            this.selectedElement = li;
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], SELECTED);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.checkValueChange(event, true);
        }
    };
    TimePicker.prototype.onMouseLeave = function () {
        this.removeHover(HOVER);
    };
    TimePicker.prototype.scrollHandler = function () {
        if (this.getModuleName() === 'timepicker' && Browser.isDevice) {
            return;
        }
        else {
            this.hide();
        }
    };
    TimePicker.prototype.setMinMax = function (minVal, maxVal) {
        if (isNullOrUndefined(this.checkDateValue(minVal))) {
            this.initMin = this.getDateObject('12:00:00 AM');
        }
        if (isNullOrUndefined(this.checkDateValue(maxVal))) {
            this.initMax = this.getDateObject('11:59:59 PM');
        }
    };
    //protected function
    TimePicker.prototype.validateMinMax = function (dateVal, minVal, maxVal) {
        var value = dateVal instanceof Date ? dateVal : this.getDateObject(dateVal);
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            dateVal = this.strictOperation(this.initMin, this.initMax, dateVal, value);
        }
        else if (+(this.createDateObj(this.getFormattedValue(this.initMin))) >
            +(this.createDateObj(this.getFormattedValue(this.initMax)))) {
            this.disableTimeIcon();
        }
        if (this.strictMode) {
            dateVal = this.valueIsDisable(dateVal) ? dateVal : null;
        }
        this.checkErrorState(dateVal);
        return dateVal;
    };
    TimePicker.prototype.valueIsDisable = function (value) {
        if (this.disableItemCollection.length > 0) {
            if (this.disableItemCollection.length === this.timeCollections.length) {
                return false;
            }
            var time = value instanceof Date ? this.objToString(value) : value;
            for (var index = 0; index < this.disableItemCollection.length; index++) {
                if (time === this.disableItemCollection[index]) {
                    return false;
                }
            }
        }
        return true;
    };
    TimePicker.prototype.validateState = function (val) {
        if (!this.strictMode) {
            if (this.valueIsDisable(val)) {
                var value = typeof val === 'string' ? this.setCurrentDate(this.getDateObject(val)) :
                    this.setCurrentDate(this.getDateObject(val));
                var maxValue = this.setCurrentDate(this.getDateObject(this.initMax));
                var minValue = this.setCurrentDate(this.getDateObject(this.initMin));
                if (!isNullOrUndefined(this.checkDateValue(value))) {
                    if ((+(value) > +(maxValue)) || (+(value) < +(minValue))) {
                        return false;
                    }
                }
                else {
                    if ((+(maxValue) < +(minValue)) || this.inputElement.value !== '') {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        return true;
    };
    TimePicker.prototype.strictOperation = function (minimum, maximum, dateVal, val) {
        var maxValue = this.createDateObj(this.getFormattedValue(maximum));
        var minValue = this.createDateObj(this.getFormattedValue(minimum));
        var value = this.createDateObj(this.getFormattedValue(val));
        if (this.strictMode) {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                this.initValue = this.getDateObject(maxValue);
                Input.setValue(this.getValue(this.initValue), this.inputElement, this.floatLabelType, this.showClearButton);
                return this.inputElement.value;
            }
            else if (+minValue >= +value) {
                return this.getDateObject(minValue);
            }
            else if (+value >= +maxValue || +minValue === +maxValue) {
                return this.getDateObject(maxValue);
            }
        }
        else {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                if (!isNaN(+this.createDateObj(dateVal))) {
                    return dateVal;
                }
            }
        }
        return dateVal;
    };
    TimePicker.prototype.bindEvents = function () {
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.popupHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
        var form = closest(this.element, 'form');
        if (form) {
            EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
        }
        if (!Browser.isDevice) {
            this.inputEvent = new KeyboardEvents(this.inputWrapper.container, {
                keyAction: this.inputHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
            if (this.showClearButton) {
                EventHandler.add(this.inputElement, 'mousedown', this.mouseDownHandler, this);
            }
        }
    };
    TimePicker.prototype.formResetHandler = function () {
        if (!this.inputElement.getAttribute('value')) {
            this.value = null;
            if (this.inputElement) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.removeErrorClass();
            }
        }
        else {
            this.value = this.checkDateValue(new Date('' + this.element.getAttribute('value')));
        }
    };
    TimePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
    };
    TimePicker.prototype.unBindEvents = function () {
        if (this.inputWrapper) {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.popupHandler);
        }
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.inputEvent) {
            this.inputEvent.destroy();
        }
        EventHandler.remove(this.inputElement, 'mousedown touchstart', this.mouseDownHandler);
        if (this.showClearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler);
        }
        var form = closest(this.element, 'form');
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
        }
    };
    TimePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
    };
    TimePicker.prototype.clearHandler = function (e) {
        e.preventDefault();
        this.clear(e);
        if (this.popupWrapper) {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        this.initValue = null;
        this.resetState();
        this.changeEvent(event);
    };
    TimePicker.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.zIndex = this.zIndex;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.checkAttributes = function () {
        var attributes = ['step', 'disabled', 'readonly', 'style', 'name', 'value', 'min', 'max', 'placeholder'];
        var value;
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        var enabled = isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'readonly':
                        var readonly = !isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'style':
                        this.inputStyle = this.inputElement.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'placeholder':
                        this.placeholder = this.inputElement.getAttribute(prop);
                        break;
                    case 'min':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ min: value }, true);
                        }
                        break;
                    case 'max':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ max: value }, true);
                        }
                        break;
                    case 'value':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.initValue = value;
                            this.updateInput(false, this.initValue);
                        }
                        break;
                }
            }
        }
    };
    TimePicker.prototype.setCurrentDate = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        return new Date(YEAR, MONTH, DAY, value.getHours(), value.getMinutes(), value.getSeconds());
    };
    TimePicker.prototype.getTextFormat = function () {
        var time = 0;
        if (this.cldrTimeFormat().split(' ')[0] === 'a' || this.cldrTimeFormat().indexOf('a') === 0) {
            time = 1;
        }
        else if (this.cldrTimeFormat().indexOf('a') < 0) {
            var strArray = this.cldrTimeFormat().split(' ');
            for (var i = 0; i < strArray.length; i++) {
                if (strArray[i].toLowerCase().indexOf('h') >= 0) {
                    time = i;
                    break;
                }
            }
        }
        return time;
    };
    TimePicker.prototype.updateValue = function (value, event) {
        var val;
        if (this.isNullOrEmpty(value)) {
            this.resetState();
        }
        else {
            val = this.checkValue(value);
            if (this.strictMode) {
                // this case set previous value to the text box when set invalid date
                var inputVal = (val === null && value.trim().length > 0) ?
                    this.previousState(this.prevDate) : this.inputElement.value;
                Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
            }
        }
        this.checkValueChange(event, typeof value === 'string' ? false : true);
    };
    TimePicker.prototype.previousState = function (date) {
        var value = this.getDateObject(date);
        for (var i = 0; i < this.timeCollections.length; i++) {
            if (+value === this.timeCollections[i]) {
                this.activeIndex = i;
                this.selectedElement = this.liCollections[i];
                this.valueWithMinutes = new Date(this.timeCollections[i]);
                break;
            }
        }
        return this.prevValue;
    };
    TimePicker.prototype.resetState = function () {
        this.removeSelection();
        Input.setValue('', this.inputElement, this.floatLabelType, false);
        this.valueWithMinutes = this.activeIndex = null;
        if (!this.strictMode) {
            this.checkErrorState(null);
        }
    };
    TimePicker.prototype.objToString = function (val) {
        if (isNullOrUndefined(this.checkDateValue(val))) {
            return null;
        }
        else {
            return this.globalize.formatDate(val, { format: this.cldrTimeFormat(), type: 'time' });
        }
    };
    TimePicker.prototype.checkValue = function (value) {
        if (!this.isNullOrEmpty(value)) {
            var date = value instanceof Date ? value : this.getDateObject(value);
            return this.validateValue(date, value);
        }
        this.resetState();
        return this.valueWithMinutes = null;
    };
    TimePicker.prototype.validateValue = function (date, value) {
        var time;
        var val = this.validateMinMax(value, this.min, this.max);
        var newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== this.getFormattedValue(this.value)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
            time = this.objToString(this.valueWithMinutes);
        }
        else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = this.objToString(this.valueWithMinutes);
        }
        if (!this.strictMode && isNullOrUndefined(time)) {
            var value_1 = val.trim().length > 0 ? val : '';
            Input.setValue(value_1, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(time, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    };
    TimePicker.prototype.findNextElement = function (event) {
        var textVal = (this.inputElement).value;
        var value = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        var timeVal = null;
        var count = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                var index = this.validLiElement(0);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(this.timeCollections.length - 1, true);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else {
                if (event.action === 'down') {
                    for (var i = 0; i < count; i++) {
                        if (+value < this.timeCollections[i]) {
                            var index = this.validLiElement(i);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === count - 1) {
                            var index = this.validLiElement(0);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
                else {
                    for (var i = count - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            var index = this.validLiElement(i, true);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === 0) {
                            var index = this.validLiElement(count - 1);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(isNullOrUndefined(timeVal) ? null : new Date(timeVal));
        }
        else {
            var index = this.validLiElement(0, event.action === 'down' ? false : true);
            this.activeIndex = index;
            this.selectedElement = this.liCollections[index];
            this.elementValue(new Date(this.timeCollections[index]));
        }
    };
    TimePicker.prototype.elementValue = function (value) {
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            this.checkValue(value);
        }
    };
    TimePicker.prototype.validLiElement = function (index, backward) {
        var elementIndex = null;
        var items = isNullOrUndefined(this.popupWrapper) ? this.liCollections :
            this.popupWrapper.querySelectorAll('.' + LISTCLASS);
        var isCheck = true;
        if (items.length) {
            if (backward) {
                for (var i = index; i >= 0; i--) {
                    if (!items[i].classList.contains(DISABLED)) {
                        elementIndex = i;
                        break;
                    }
                    else if (i === 0) {
                        if (isCheck) {
                            index = i = items.length;
                            isCheck = false;
                        }
                    }
                }
            }
            else {
                for (var i = index; i <= items.length - 1; i++) {
                    if (!items[i].classList.contains(DISABLED)) {
                        elementIndex = i;
                        break;
                    }
                    else if (i === items.length - 1) {
                        if (isCheck) {
                            index = i = -1;
                            isCheck = false;
                        }
                    }
                }
            }
        }
        return elementIndex;
    };
    TimePicker.prototype.keyHandler = function (event) {
        if (isNullOrUndefined(this.step) || this.step <= 0 || this.inputWrapper.buttons[0].classList.contains(DISABLED)) {
            return;
        }
        var count = this.timeCollections.length;
        if (isNullOrUndefined(this.getActiveElement()) || this.getActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    var index = this.validLiElement(0, event.action === 'down' ? false : true);
                    this.activeIndex = index;
                    this.selectedElement = this.liCollections[index];
                    this.elementValue(new Date(this.timeCollections[index]));
                }
                else {
                    this.findNextElement(event);
                }
            }
            else {
                this.findNextElement(event);
            }
        }
        else {
            var nextItem = void 0;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                var index = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (count) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (count - 1) : this.activeIndex;
                this.activeIndex = index = this.validLiElement(this.activeIndex, (event.keyCode === 40 || event.keyCode === 39) ?
                    false : true);
                nextItem = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            }
            else if (event.action === 'home') {
                var index = this.validLiElement(0);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(count - 1, true);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(new Date(nextItem));
        }
        this.isNavigate = true;
        this.setHover(this.selectedElement, NAVIGATION);
        this.setActiveDescendant();
        this.selectInputText();
        if (this.isPopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setScrollPosition();
        }
    };
    TimePicker.prototype.setPopupPosition = function () {
        var offsetValue;
        var padding = 1;
        var popupHeight = this.getPopupHeight();
        var element = this.getActiveElement();
        var liHeight = this.liCollections[0].getBoundingClientRect().height;
        var listHeight = popupHeight / HALFPOSITION;
        var height = element.length === 0 ? this.liCollections[0].offsetTop : element[0].offsetTop;
        var lastItemOffsetValue = this.liCollections[this.liCollections.length - 1].offsetTop;
        var ulPadding = (parseInt(getComputedStyle(this.listTag).paddingTop, 10));
        if (lastItemOffsetValue - listHeight < height) {
            var count = popupHeight / liHeight;
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - ulPadding - HALFPOSITION;
        }
        else if ((height + liHeight) > listHeight) {
            offsetValue = listHeight - liHeight / HALFPOSITION;
        }
        else {
            offsetValue = height;
        }
        offsetValue = offsetValue + HALFPOSITION + ((liHeight - this.containerStyle.height) / HALFPOSITION);
        return -offsetValue;
    };
    TimePicker.prototype.getCultureTimeObject = function (ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.timeFormats.short', ld);
    };
    TimePicker.prototype.getCultureDateObject = function (ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.dateFormats.short', ld);
    };
    TimePicker.prototype.wireListEvents = function () {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    };
    TimePicker.prototype.unWireListEvents = function () {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            if (!Browser.isDevice) {
                EventHandler.remove(this.listWrapper, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.listWrapper, 'mouseout', this.onMouseLeave);
            }
        }
    };
    TimePicker.prototype.valueProcess = function (event, value) {
        var result = (isNullOrUndefined(this.checkDateValue(value))) ? null : value;
        if (+this.prevDate !== +result) {
            this.initValue = result;
            this.changeEvent(event);
        }
    };
    TimePicker.prototype.changeEvent = function (e) {
        this.addSelection();
        this.updateInput(true, this.initValue);
        var eventArgs = {
            event: (e || null),
            value: this.value,
            text: (this.inputElement).value,
            isInteracted: !isNullOrUndefined(e),
            element: this.element
        };
        eventArgs.value = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.prevDate = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.trigger('change', eventArgs);
    };
    TimePicker.prototype.updateInput = function (isUpdate, date) {
        if (isUpdate) {
            this.prevValue = this.getValue(date);
        }
        this.prevDate = this.valueWithMinutes = date;
        if ((this.value && +new Date(+this.value).setMilliseconds(0)) !== +date) {
            this.setProperties({ value: date }, true);
        }
    };
    TimePicker.prototype.setActiveDescendant = function () {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    };
    TimePicker.prototype.removeSelection = function () {
        this.removeHover(HOVER);
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + SELECTED);
            if (items.length) {
                removeClass(items, SELECTED);
                items[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.removeHover = function (className) {
        var hoveredItem = this.getHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.getHoverItem = function (className) {
        var hoveredItem;
        if (!isNullOrUndefined(this.popupWrapper)) {
            hoveredItem = this.popupWrapper.querySelectorAll('.' + className);
        }
        return hoveredItem;
    };
    TimePicker.prototype.setActiveClass = function () {
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +this.getDateObject(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        break;
                    }
                }
            }
        }
    };
    TimePicker.prototype.addSelection = function () {
        this.selectedElement = null;
        this.removeSelection();
        this.setActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], SELECTED);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    };
    TimePicker.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTCLASS) && !li.classList.contains(DISABLED));
    };
    TimePicker.prototype.createDateObj = function (val) {
        var today = this.globalize.formatDate(new Date(), { skeleton: 'short', type: 'date' });
        var value = null;
        if (typeof val === 'string') {
            if (val.toUpperCase().indexOf('AM') > -1 || val.toUpperCase().indexOf('PM') > -1) {
                today = this.defaultCulture.formatDate(new Date(), { skeleton: 'short', type: 'date' });
                value = isNaN(+new Date(today + ' ' + val)) ? null : new Date(new Date(today + ' ' + val).setMilliseconds(0));
                if (isNullOrUndefined(value)) {
                    value = this.TimeParse(today, val);
                }
            }
            else {
                value = this.TimeParse(today, val);
            }
        }
        else if (val instanceof Date) {
            value = val;
        }
        return value;
    };
    TimePicker.prototype.TimeParse = function (today, val) {
        var value;
        value = this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.cldrTimeFormat(), type: 'datetime'
        });
        value = isNullOrUndefined(value) ? this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.dateToNumeric(), type: 'datetime'
        }) : value;
        value = isNullOrUndefined(value) ? value : new Date(value.setMilliseconds(0));
        return value;
    };
    TimePicker.prototype.createListItems = function () {
        var _this = this;
        this.listWrapper = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        var start;
        var end;
        var interval = this.step * 60000;
        var listItems = [];
        this.timeCollections = [];
        this.disableItemCollection = [];
        start = +(this.getDateObject(this.initMin).setMilliseconds(0));
        end = +(this.getDateObject(this.initMax).setMilliseconds(0));
        while (end >= start) {
            this.timeCollections.push(start);
            listItems.push(this.globalize.formatDate(new Date(start), { format: this.cldrTimeFormat(), type: 'time' }));
            start += interval;
        }
        var listBaseOptions = {
            itemCreated: function (args) {
                var eventArgs = {
                    element: args.item,
                    text: args.text, value: _this.getDateObject(args.text), isDisabled: false
                };
                _this.trigger('itemRender', eventArgs);
                if (eventArgs.isDisabled) {
                    eventArgs.element.classList.add(DISABLED);
                }
                if (eventArgs.element.classList.contains(DISABLED)) {
                    _this.disableItemCollection.push(eventArgs.element.getAttribute('data-value'));
                }
            }
        };
        this.listTag = ListBase.createList(this.createElement, listItems, listBaseOptions, true);
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([this.listTag], this.listWrapper);
    };
    TimePicker.prototype.documentClickHandler = function (event) {
        event.preventDefault();
        var target = event.target;
        if (!(closest(target, '#' + this.popupObj.element.id)) && target !== this.inputElement
            && target !== (this.inputWrapper && this.inputWrapper.buttons[0]) &&
            target !== (this.inputWrapper && this.inputWrapper.clearButton) &&
            target !== (this.inputWrapper && this.inputWrapper.container)) {
            if (this.isPopupOpen()) {
                this.hide();
            }
        }
        else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
                event.preventDefault();
            }
        }
    };
    TimePicker.prototype.setEnableRtl = function () {
        Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.setEnable = function () {
        Input.setEnabled(this.enabled, this.inputElement, this.floatLabelType);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], DISABLED);
            attributes(this.inputElement, { 'aria-disabled': 'false' });
        }
        else {
            this.hide();
            addClass([this.inputWrapper.container], DISABLED);
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
    };
    TimePicker.prototype.getProperty = function (date, val) {
        if (val === 'min') {
            this.initMin = this.checkDateValue(new Date('' + date.min));
            this.setProperties({ min: this.initMin }, true);
        }
        else {
            this.initMax = this.checkDateValue(new Date('' + date.max));
            this.setProperties({ max: this.initMax }, true);
        }
        if (this.inputElement.value === '') {
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            this.checkValue(this.inputElement.value);
        }
        this.checkValueChange(null, false);
    };
    TimePicker.prototype.inputBlurHandler = function (e) {
        // IE popup closing issue when click over the scrollbar
        if (this.isPreventBlur && this.isPopupOpen()) {
            this.inputElement.focus();
            return;
        }
        this.closePopup(0, e);
        removeClass([this.inputWrapper.container], [FOCUS]);
        var blurArguments = {
            model: this
        };
        this.trigger('blur', blurArguments);
        if (this.getText() !== this.inputElement.value) {
            this.updateValue((this.inputElement).value, e);
        }
        else if (this.inputElement.value.trim().length === 0) {
            this.resetState();
        }
        this.cursorDetails = null;
        this.isNavigate = false;
    };
    /**
     * Focuses out the TimePicker textbox element.
     * @returns void
     */
    TimePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            var blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
    };
    TimePicker.prototype.isPopupOpen = function () {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT)) {
            return true;
        }
        return false;
    };
    TimePicker.prototype.inputFocusHandler = function () {
        var focusArguments = {
            model: this
        };
        if (!this.readonly && !Browser.isDevice) {
            this.selectInputText();
        }
        this.trigger('focus', focusArguments);
    };
    /**
     * Focused the TimePicker textbox element.
     * @returns void
     */
    TimePicker.prototype.focusIn = function () {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            var focusArguments = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    };
    /**
     * Hides the TimePicker popup.
     * @returns void
     */
    TimePicker.prototype.hide = function () {
        this.closePopup(100, null);
    };
    /**
     * Opens the popup to show the list items.
     * @returns void
     */
    TimePicker.prototype.show = function (event) {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupWrapper) {
            return;
        }
        else {
            var args = {
                popup: this.popupObj || null,
                cancel: false,
                event: event || null,
                name: 'open'
            };
            this.trigger('open', args);
            if (!args.cancel && !this.isPopupOpen() && !this.inputWrapper.buttons[0].classList.contains(DISABLED)) {
                this.inputElement.focus();
                this.popupCreation();
                if (!args.cancel) {
                    var openAnimation = {
                        name: 'FadeIn',
                        duration: ANIMATIONDURATION,
                    };
                    this.popupObj.refreshPosition(this.inputElement);
                    if (this.zIndex === 1000) {
                        this.popupObj.show(new Animation(openAnimation), this.element);
                    }
                    else {
                        this.popupObj.show(new Animation(openAnimation), null);
                    }
                    this.setActiveDescendant();
                    attributes(this.inputElement, { 'aria-expanded': 'true' });
                    addClass([this.inputWrapper.container], FOCUS);
                }
                EventHandler.add(document, 'mousedown', this.documentClickHandler, this);
            }
        }
    };
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    TimePicker.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * To get component name
     * @private
     */
    TimePicker.prototype.getModuleName = function () {
        return 'timepicker';
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    TimePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement, this.floatLabelType);
                    if (this.readonly) {
                        this.hide();
                    }
                    break;
                case 'cssClass':
                    this.inputWrapper.container.className += ' ' + newProp.cssClass;
                    if (this.popupWrapper) {
                        this.popupWrapper.className += ' ' + newProp.cssClass;
                    }
                    this.setProperties({ cssClass: newProp.cssClass }, true);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    this.setEnable();
                    break;
                case 'allowEdit':
                    this.setTimeAllowEdit();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
                case 'min':
                case 'max':
                    this.getProperty(newProp, prop);
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.updatePlaceHolder();
                    this.setValue(this.value);
                    break;
                case 'width':
                    setStyleAttribute(this.inputWrapper.container, { 'width': this.setWidth(newProp.width) });
                    this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.setValue(this.value);
                    break;
                case 'value':
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: this.checkDateValue(new Date(newProp.value)) }, true);
                        newProp.value = this.value;
                    }
                    else {
                        if ((newProp.value && +new Date(+newProp.value).setMilliseconds(0)) !== +this.value) {
                            newProp.value = this.checkDateValue(new Date('' + newProp.value));
                        }
                    }
                    this.initValue = newProp.value;
                    newProp.value = this.compareFormatChange(this.checkValue(newProp.value));
                    this.checkValueChange(null, false);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'strictMode':
                    if (newProp.strictMode) {
                        this.checkErrorState(null);
                    }
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.checkValue((this.inputElement).value);
                    this.checkValueChange(null, false);
                    break;
                case 'scrollTo':
                    if (this.checkDateValue(new Date('' + newProp.scrollTo))) {
                        if (this.popupWrapper) {
                            this.setScrollTo();
                        }
                        this.setProperties({ scrollTo: newProp.scrollTo }, true);
                    }
                    else {
                        this.setProperties({ scrollTo: null }, true);
                    }
                    break;
            }
        }
    };
    __decorate([
        Property(null)
    ], TimePicker.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], TimePicker.prototype, "strictMode", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "format", void 0);
    __decorate([
        Property(true)
    ], TimePicker.prototype, "enabled", void 0);
    __decorate([
        Property(false)
    ], TimePicker.prototype, "readonly", void 0);
    __decorate([
        Property('Never')
    ], TimePicker.prototype, "floatLabelType", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "placeholder", void 0);
    __decorate([
        Property(1000)
    ], TimePicker.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], TimePicker.prototype, "enablePersistence", void 0);
    __decorate([
        Property(true)
    ], TimePicker.prototype, "showClearButton", void 0);
    __decorate([
        Property(30)
    ], TimePicker.prototype, "step", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "scrollTo", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "value", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "min", void 0);
    __decorate([
        Property(null)
    ], TimePicker.prototype, "max", void 0);
    __decorate([
        Property(true)
    ], TimePicker.prototype, "allowEdit", void 0);
    __decorate([
        Property(false)
    ], TimePicker.prototype, "enableRtl", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "change", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "created", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "open", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "itemRender", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "close", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "blur", void 0);
    __decorate([
        Event()
    ], TimePicker.prototype, "focus", void 0);
    TimePicker = __decorate([
        NotifyPropertyChanges
    ], TimePicker);
    return TimePicker;
}(Component));
export { TimePicker };
