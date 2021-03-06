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
/// <reference path='../calendar/calendar-model.d.ts'/>
import { EventHandler, Property, Internationalization, NotifyPropertyChanges } from '-syncfusion/ej2-base';
import { KeyboardEvents, Animation, Event, L10n, Browser, formatUnit } from '-syncfusion/ej2-base';
import { detach, addClass, removeClass, closest, attributes } from '-syncfusion/ej2-base';
import { isNullOrUndefined, setValue, getUniqueID } from '-syncfusion/ej2-base';
import { Popup } from '-syncfusion/ej2-popups';
import { Input } from '-syncfusion/ej2-inputs';
import { Calendar } from '../calendar/calendar';
//class constant defination
var DATEWRAPPER = 'e-date-wrapper';
var ROOT = 'e-datepicker';
var POPUPWRAPPER = 'e-popup-wrapper';
var INPUTWRAPPER = 'e-input-group-icon';
var POPUP = 'e-popup';
var INPUTCONTAINER = 'e-input-group';
var INPUTFOCUS = 'e-input-focus';
var INPUTROOT = 'e-input';
var ERROR = 'e-error';
var RTL = 'e-rtl';
var LINK = 'e-day';
var ACTIVE = 'e-active';
var OVERFLOW = 'e-date-overflow';
var DATEICON = 'e-date-icon';
var ICONS = 'e-icons';
var OPENDURATION = 300;
var CLOSEDURATION = 200;
var OFFSETVALUE = 4;
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
var DatePicker = /** @class */ (function (_super) {
    __extends(DatePicker, _super);
    /**
     * Constructor for creating the widget.
     */
    function DatePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousElementValue = '';
        _this.isDateIconClicked = false;
        _this.keyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            tab: 'tab'
        };
        _this.calendarKeyConfigs = {
            escape: 'escape',
            enter: 'enter',
            tab: 'tab'
        };
        return _this;
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    DatePicker.prototype.render = function () {
        this.initialize();
        this.bindEvents();
    };
    DatePicker.prototype.setAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            attributes(this.inputElement, { 'readonly': '' });
        }
    };
    DatePicker.prototype.initialize = function () {
        this.createInput();
        this.setAllowEdit();
        this.updateInput();
        this.previousElementValue = this.inputElement.value;
        this.previousDate = new Date(+this.value);
    };
    DatePicker.prototype.createInput = function () {
        var ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.getModuleName() === 'datepicker') {
            var l10nLocale = { placeholder: null };
            this.globalize = new Internationalization(this.locale);
            this.l10n = new L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
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
            buttons: [INPUTWRAPPER + ' ' + DATEICON + ' ' + ICONS]
        }, this.createElement);
        this.setWidth(this.width);
        if (this.inputElement.name !== '') {
            this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute('name'));
        }
        else {
            this.inputElement.setAttribute('name', '' + this.element.id);
        }
        attributes(this.inputElement, ariaAttrs);
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
        }
        else {
            this.inputElement.setAttribute('aria-disabled', 'false');
        }
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        addClass([this.inputWrapper.container], DATEWRAPPER);
    };
    DatePicker.prototype.updateInput = function () {
        var formatOptions;
        if (this.value && !this.isCalendar()) {
            this.disabledDates();
        }
        if (!+new Date('' + this.value)) {
            this.setProperties({ value: null }, true);
        }
        if (this.strictMode) {
            //calls the Calendar processDate protected method to update the date value according to the strictMode true behaviour.
            _super.prototype.validateDate.call(this);
            this.minMaxUpdates();
            _super.prototype.minMaxUpdate.call(this);
        }
        if (!isNullOrUndefined(this.value)) {
            var dateValue = this.value;
            var dateString = void 0;
            var tempFormat = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd'
                    });
                }
                else {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                    });
                }
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                dateString = this.globalize.formatDate(this.value, formatOptions);
            }
            if ((+dateValue <= +this.max) && (+dateValue >= +this.min)) {
                Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            else {
                var value = (+dateValue >= +this.max || !+this.value) || (!+this.value || +dateValue <= +this.min);
                if (!this.strictMode && value) {
                    Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
                }
            }
        }
        if (isNullOrUndefined(this.value) && this.strictMode) {
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
    };
    ;
    DatePicker.prototype.minMaxUpdates = function () {
        if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max && this.strictMode) {
            this.setProperties({ value: this.min }, true);
            this.changedArgs = { value: this.value };
        }
        else {
            if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max && this.strictMode) {
                this.setProperties({ value: this.max }, true);
                this.changedArgs = { value: this.value };
            }
        }
    };
    DatePicker.prototype.bindEvents = function () {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            // To prevent the twice triggering.
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
            }
            if (this.formElement) {
                EventHandler.add(this.formElement, 'reset', this.resetFormHandler, this);
            }
        }
        else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (this.formElement) {
                EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
            }
        }
        this.keyboardModules = new KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyActionHandle.bind(this),
            keyConfigs: this.keyConfigs
        });
    };
    DatePicker.prototype.resetFormHandler = function () {
        if (this.inputElement.getAttribute('value')) {
            this.value = this.checkDateValue(new Date('' + this.element.getAttribute('value')));
        }
        else {
            this.value = null;
            if (this.inputElement) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
                removeClass([this.inputWrapper.container], ERROR);
            }
        }
    };
    DatePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
    };
    DatePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    DatePicker.prototype.resetHandler = function (e) {
        e.preventDefault();
        this.clear(e);
    };
    DatePicker.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.updateInput();
        this.changeEvent(event);
    };
    DatePicker.prototype.dateIconHandler = function (e) {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', '');
        }
        e.preventDefault();
        if (!this.readonly) {
            if (this.isCalendar()) {
                this.hide(e);
            }
            else {
                this.isDateIconClicked = true;
                this.show(null, e);
                if (this.getModuleName() === 'datetimepicker') {
                    this.inputElement.focus();
                }
                this.inputElement.focus();
                addClass([this.inputWrapper.container], [INPUTFOCUS]);
                addClass(this.inputWrapper.buttons, ACTIVE);
            }
        }
    };
    DatePicker.prototype.CalendarKeyActionHandle = function (e) {
        switch (e.action) {
            case 'escape':
                if (this.isCalendar()) {
                    this.hide(e);
                }
                else {
                    this.inputWrapper.container.children[this.index].blur();
                }
                break;
            case 'enter':
                if (!this.isCalendar()) {
                    this.show(null, e);
                }
                else {
                    if (+this.value !== +this.currentDate && !this.isCalendar()) {
                        this.inputWrapper.container.children[this.index].focus();
                    }
                }
                if (this.getModuleName() === 'datetimepicker') {
                    this.inputElement.focus();
                }
                break;
            case 'tab':
                this.hide(e);
        }
    };
    DatePicker.prototype.inputFocusHandler = function () {
        var focusArguments = {
            model: this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
    };
    DatePicker.prototype.inputBlurHandler = function (e) {
        this.strictModeUpdate();
        this.updateInput();
        this.changeTrigger(e);
        this.errorClass();
        if (this.isCalendar() && document.activeElement === this.inputElement) {
            this.hide(e);
        }
        if (this.getModuleName() === 'datepicker') {
            var blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.calendarKeyboardModules = new KeyboardEvents(this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.CalendarKeyActionHandle.bind(this),
                keyConfigs: this.calendarKeyConfigs
            });
        }
    };
    DatePicker.prototype.documentHandler = function (e) {
        if (e.type !== 'touchstart') {
            e.preventDefault();
        }
        var target = e.target;
        if (!(closest(target, '.e-datepicker.e-popup-wrapper'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
        }
    };
    DatePicker.prototype.inputKeyActionHandle = function (e) {
        switch (e.action) {
            case 'altUpArrow':
                this.hide(e);
                this.inputElement.focus();
                break;
            case 'altDownArrow':
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                if (this.getModuleName() === 'datepicker') {
                    this.show(null, e);
                }
                break;
            case 'escape':
                this.hide(e);
                break;
            case 'enter':
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                this.errorClass();
                if (!this.isCalendar() && document.activeElement === this.inputElement) {
                    this.hide(e);
                }
                if (this.isCalendar()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            case 'tab':
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                this.errorClass();
                this.hide(e);
                break;
            default:
                this.previousDate = ((!isNullOrUndefined(this.value) && new Date(+this.value)) || null);
                if (this.isCalendar()) {
                    _super.prototype.keyActionHandle.call(this, e);
                }
        }
    };
    DatePicker.prototype.strictModeUpdate = function () {
        var format;
        var formatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            format = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
        }
        else {
            format = isNullOrUndefined(this.format) ? this.format : this.format.replace('dd', 'd');
        }
        if (!isNullOrUndefined(format)) {
            var len = format.split('M').length - 1;
            if (len < 3) {
                format = format.replace('MM', 'M');
            }
        }
        var dateOptions;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            }
            else {
                dateOptions = {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd' };
            }
            else {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            dateOptions = formatOptions;
        }
        var date;
        if ((this.getModuleName() === 'datetimepicker')) {
            if (this.checkDateValue(this.globalize.parseDate(this.inputElement.value, dateOptions))) {
                date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.parseDate(this.inputElement.value, formatOptions);
            }
        }
        else {
            date = this.globalize.parseDate(this.inputElement.value, dateOptions);
        }
        if (this.strictMode && date) {
            Input.setValue(this.globalize.formatDate(date, dateOptions), this.inputElement, this.floatLabelType, this.showClearButton);
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        else if (!this.strictMode) {
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        if (this.strictMode && !date && this.inputElement.value === '') {
            this.setProperties({ value: null }, true);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
        if (isNullOrUndefined(this.value)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
    };
    DatePicker.prototype.createCalendar = function () {
        var _this = this;
        this.popupWrapper = this.createElement('div', { className: '' + ROOT + ' ' + POPUPWRAPPER });
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (Browser.isDevice) {
            this.modelHeader();
            this.modal = this.createElement('div');
            this.modal.className = '' + ROOT + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        //this.calendarElement represent the Calendar object from the Calendar class.
        this.calendarElement.querySelector('table tbody').className = '';
        this.popupObj = new Popup(this.popupWrapper, {
            content: this.calendarElement,
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: function () {
                if (_this.getModuleName() !== 'datetimepicker') {
                    if (document.activeElement !== _this.inputElement) {
                        _this.calendarElement.children[1].firstElementChild.focus();
                        _this.calendarKeyboardModules = new KeyboardEvents(_this.calendarElement.children[1].firstElementChild, {
                            eventName: 'keydown',
                            keyAction: _this.CalendarKeyActionHandle.bind(_this),
                            keyConfigs: _this.calendarKeyConfigs
                        });
                        _this.calendarKeyboardModules = new KeyboardEvents(_this.inputWrapper.container.children[_this.index], {
                            eventName: 'keydown',
                            keyAction: _this.CalendarKeyActionHandle.bind(_this),
                            keyConfigs: _this.calendarKeyConfigs
                        });
                    }
                }
            }, close: function () {
                if (_this.isDateIconClicked) {
                    _this.inputWrapper.container.children[_this.index].focus();
                }
                if (_this.value) {
                    _this.disabledDates();
                }
                if (_this.popupObj) {
                    _this.popupObj.destroy();
                }
                detach(_this.popupWrapper);
                _this.popupObj = _this.popupWrapper = null;
                _this.setAriaAttributes();
            }
        });
        this.popupObj.element.className += ' ' + this.cssClass;
        this.setAriaAttributes();
    };
    DatePicker.prototype.modelHeader = function () {
        var dateOptions;
        var modelHeader = this.createElement('div', { className: 'e-model-header' });
        var yearHeading = this.createElement('h1', { className: 'e-model-year' });
        var h2 = this.createElement('div');
        var daySpan = this.createElement('span', { className: 'e-model-day' });
        var monthSpan = this.createElement('span', { className: 'e-model-month' });
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'y', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'y', skeleton: 'dateTime', calendar: 'islamic' };
        }
        yearHeading.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'E', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'E', skeleton: 'dateTime', calendar: 'islamic' };
        }
        daySpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions) + ', ';
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime', calendar: 'islamic' };
        }
        monthSpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        modelHeader.appendChild(yearHeading);
        h2.appendChild(daySpan);
        h2.appendChild(monthSpan);
        modelHeader.appendChild(h2);
        this.calendarElement.insertBefore(modelHeader, this.calendarElement.firstElementChild);
    };
    DatePicker.prototype.changeTrigger = function (event) {
        if (this.inputElement.value !== this.previousElementValue) {
            if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
                this.changedArgs.value = this.value;
                this.changedArgs.event = event || null;
                this.changedArgs.element = this.element;
                this.changedArgs.isInteracted = !isNullOrUndefined(event);
                this.trigger('change', this.changedArgs);
                this.previousElementValue = this.inputElement.value;
                this.previousDate = new Date('' + this.value);
            }
        }
    };
    DatePicker.prototype.navigatedEvent = function () {
        this.trigger('navigated', this.navigatedArgs);
    };
    DatePicker.prototype.changeEvent = function (event) {
        if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
            this.selectCalendar(event);
            this.changedArgs.event = event ? event : null;
            this.changedArgs.element = this.element;
            this.changedArgs.isInteracted = !isNullOrUndefined(event);
            this.trigger('change', this.changedArgs);
            this.previousDate = this.value && new Date(+this.value);
            this.hide(event);
            this.previousElementValue = this.inputElement.value;
            this.errorClass();
        }
    };
    DatePicker.prototype.requiredModules = function () {
        var modules = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }
        return modules;
    };
    DatePicker.prototype.selectCalendar = function (e) {
        var date;
        var tempFormat;
        var formatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            tempFormat = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
        }
        else {
            tempFormat = this.format;
        }
        if (this.value) {
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
        }
        if (!isNullOrUndefined(date)) {
            Input.setValue(date, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    };
    DatePicker.prototype.isCalendar = function () {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER)) {
            return true;
        }
        return false;
    };
    DatePicker.prototype.setWidth = function (width) {
        if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        }
        else if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (this.width) : (formatUnit(this.width));
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    };
    /**
     * Shows the Calendar.
     * @returns void
     */
    DatePicker.prototype.show = function (type, e) {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        }
        else {
            var prevent_1 = true;
            var outOfRange = void 0;
            if (!isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max)) {
                outOfRange = new Date('' + this.value);
                this.setProperties({ 'value': null }, true);
            }
            else {
                outOfRange = this.value || null;
            }
            if (!this.isCalendar()) {
                _super.prototype.render.call(this);
                this.setProperties({ 'value': outOfRange || null }, true);
                this.previousDate = outOfRange;
                this.createCalendar();
            }
            this.preventArgs = {
                preventDefault: function () {
                    prevent_1 = false;
                },
                popup: this.popupObj,
                event: e || null,
                cancel: false,
                appendTo: document.body
            };
            this.trigger('open', this.preventArgs);
            if (prevent_1 && !this.preventArgs.cancel) {
                addClass(this.inputWrapper.buttons, ACTIVE);
                this.preventArgs.appendTo.appendChild(this.popupWrapper);
                this.popupObj.refreshPosition(this.inputElement);
                var openAnimation = {
                    name: 'FadeIn',
                    duration: Browser.isDevice ? 0 : OPENDURATION,
                };
                if (this.zIndex === 1000) {
                    this.popupObj.show(new Animation(openAnimation), this.element);
                }
                else {
                    this.popupObj.show(new Animation(openAnimation), null);
                }
                this.setAriaAttributes();
            }
            else {
                this.popupObj.destroy();
                this.popupWrapper = this.popupObj = null;
            }
            EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
        }
    };
    /**
     * Hide the Calendar.
     * @returns void
     */
    DatePicker.prototype.hide = function (event) {
        if (!isNullOrUndefined(this.popupWrapper)) {
            var prevent_2 = true;
            this.preventArgs = {
                preventDefault: function () {
                    prevent_2 = false;
                },
                popup: this.popupObj,
                event: event || null,
                cancel: false
            };
            removeClass(this.inputWrapper.buttons, ACTIVE);
            removeClass([document.body], OVERFLOW);
            if (this.isCalendar()) {
                this.trigger('close', this.preventArgs);
            }
            if (this.isCalendar() && (prevent_2 && !this.preventArgs.cancel)) {
                var closeAnimation = {
                    name: 'FadeOut',
                    duration: CLOSEDURATION,
                };
                this.popupObj.hide();
                this.keyboardModule.destroy();
                removeClass(this.inputWrapper.buttons, ACTIVE);
            }
            this.setAriaAttributes();
            this.previousElementValue = this.inputElement.value;
            if (Browser.isDevice && this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
            EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
        }
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
            this.element.removeAttribute('readonly');
        }
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    DatePicker.prototype.focusIn = function (triggerEvent) {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            var focusArguments = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    DatePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            var blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
    };
    /**
     * Gets the current view of the DatePicker.
     * @returns string
     */
    DatePicker.prototype.currentView = function () {
        var currentView;
        if (this.calendarElement) {
            // calls the Calendar currentView public method
            currentView = _super.prototype.currentView.call(this);
        }
        return currentView;
    };
    /**
     * Navigates to specified month or year or decade view of the DatePicker.
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    DatePicker.prototype.navigateTo = function (view, date) {
        if (this.calendarElement) {
            // calls the Calendar navigateTo public method
            _super.prototype.navigateTo.call(this, view, date);
        }
    };
    /**
     * To destroy the widget.
     * @returns void
     */
    DatePicker.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.keyboardModules.destroy();
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            _super.prototype.destroy.call(this);
        }
        var ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-disabled': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttrs, this.inputElement);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObj = this.popupWrapper = null;
            this.keyboardModule.destroy();
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                removeClass([this.inputElement], [INPUTROOT]);
            }
            removeClass([this.element], [ROOT]);
            detach(this.inputWrapper.container);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    };
    DatePicker.prototype.ensureInputAttribute = function () {
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            var prop = this.inputElement.attributes[i].name;
            if (isNullOrUndefined(this.inputEleCopy.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.inputEleCopy.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    };
    /**
     * Initialize the event handler
     * @private
     */
    DatePicker.prototype.preRender = function () {
        this.inputEleCopy = this.element.cloneNode(true);
        this.inputElement = this.element;
        this.formElement = closest(this.inputElement, 'form');
        this.index = this.showClearButton ? 2 : 1;
        this.ngTag = null;
        if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
            this.ngTag = this.element.tagName;
            this.inputElement = this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
        if (this.element.getAttribute('id')) {
            if (this.ngTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            if (this.getModuleName() === 'datetimepicker') {
                this.element.id = getUniqueID('ej2-datetimepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            }
            else {
                this.element.id = getUniqueID('ej2-datepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            }
        }
        if (this.ngTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.checkHtmlAttributes();
        _super.prototype.preRender.call(this);
    };
    ;
    DatePicker.prototype.validationAttribute = function (target, inputElement) {
        var nameAttribute = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        inputElement.setAttribute('name', nameAttribute);
        target.removeAttribute('name');
        var attribute = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attribute.length; i++) {
            if (isNullOrUndefined(target.getAttribute(attribute[i]))) {
                continue;
            }
            var attr = target.getAttribute(attribute[i]);
            inputElement.setAttribute(attribute[i], attr);
            target.removeAttribute(attribute[i]);
        }
    };
    DatePicker.prototype.checkHtmlAttributes = function () {
        this.globalize = new Internationalization(this.locale);
        var attributes = ['value', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder', 'type'];
        var options;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                options = {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            }
            else {
                options = {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                options = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
            }
            else {
                options = { format: this.format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        var enabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ enabled: !enabled }, true);
                        break;
                    case 'readonly':
                        var readonly = this.inputElement.getAttribute(prop) === 'readonly' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        if (this.placeholder === null) {
                            var placeholder = this.inputElement.getAttribute(prop);
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, true);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'value':
                        if (!this.value) {
                            var value = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(value, options), {}), true);
                        }
                        break;
                    case 'min':
                        if (+this.min === +new Date(1900, 0, 1)) {
                            this.setProperties(setValue(prop, this.globalize.parseDate(this.inputElement.getAttribute(prop)), {}), true);
                        }
                        break;
                    case 'max':
                        if (+this.max === +new Date(2099, 11, 31)) {
                            this.setProperties(setValue(prop, this.globalize.parseDate(this.inputElement.getAttribute(prop)), {}), true);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text') {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    };
    /**
     * To get component name.
     * @private
     */
    DatePicker.prototype.getModuleName = function () {
        return 'datepicker';
    };
    DatePicker.prototype.disabledDates = function () {
        var valueCopy;
        var formatOptions;
        var globalize;
        valueCopy = this.checkDateValue(this.value) ? new Date(+this.value) : new Date('' + this.value);
        var previousValCopy = this.previousDate;
        //calls the Calendar render method to check the disabled dates through renderDayCell event and update the input value accordingly.
        this.minMaxUpdates();
        _super.prototype.render.call(this);
        this.previousDate = previousValCopy;
        var date = valueCopy && +(valueCopy);
        var dateIdString = '*[id^="/id"]'.replace('/id', '' + date);
        if (!this.strictMode) {
            if (typeof this.value === 'string' || ((typeof this.value === 'object') && (+this.value) !== (+valueCopy))) {
                this.setProperties({ value: valueCopy }, true);
            }
        }
        if (!isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
            if (this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled')) {
                if (!this.strictMode) {
                    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                }
            }
        }
        var inputVal;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                });
            }
            else {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                });
            }
            inputVal = globalize;
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
            }
            else {
                formatOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            inputVal = this.globalize.formatDate(valueCopy, formatOptions);
        }
        Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    DatePicker.prototype.setAriaAttributes = function () {
        if (this.isCalendar()) {
            Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': '' + this.setActiveDescendant()
            });
        }
        else {
            Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': 'null'
            });
        }
    };
    DatePicker.prototype.errorClass = function () {
        var dateIdString = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        var isDisabledDate = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!isNullOrUndefined(this.value) && !(+new Date(+this.value).setMilliseconds(0) >= +this.min
            && +new Date(+this.value).setMilliseconds(0) <= +this.max))
            || (!this.strictMode && this.inputElement.value !== '' && isNullOrUndefined(this.value) || isDisabledDate)) {
            addClass([this.inputWrapper.container], ERROR);
        }
        else {
            removeClass([this.inputWrapper.container], ERROR);
        }
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    DatePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        var options = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    if (typeof newProp.value === 'string') {
                        newProp.value = this.checkDateValue(new Date('' + newProp.value));
                        this.setProperties({ value: newProp.value }, true);
                    }
                    this.previousElementValue = this.inputElement.value;
                    if (isNullOrUndefined(this.value)) {
                        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                        this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                    }
                    this.updateInput();
                    this.changeTrigger(null);
                    break;
                case 'format':
                    this.updateInput();
                    break;
                case 'allowEdit':
                    this.setAllowEdit();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    if (!this.enabled) {
                        this.inputElement.setAttribute('aria-disabled', 'true');
                    }
                    else {
                        this.inputElement.setAttribute('aria-disabled', 'false');
                    }
                    this.bindEvents();
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.updateInput();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
                    if (this.popupWrapper) {
                        this.popupWrapper.className += ' ' + newProp.cssClass;
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'strictMode':
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    if (this.calendarElement) {
                        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
                    }
                    break;
            }
            this.hide(null);
        }
    };
    __decorate([
        Property(null)
    ], DatePicker.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], DatePicker.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], DatePicker.prototype, "strictMode", void 0);
    __decorate([
        Property(null)
    ], DatePicker.prototype, "format", void 0);
    __decorate([
        Property(true)
    ], DatePicker.prototype, "enabled", void 0);
    __decorate([
        Property(null)
    ], DatePicker.prototype, "values", void 0);
    __decorate([
        Property(false)
    ], DatePicker.prototype, "isMultiSelection", void 0);
    __decorate([
        Property(true)
    ], DatePicker.prototype, "showClearButton", void 0);
    __decorate([
        Property(true)
    ], DatePicker.prototype, "allowEdit", void 0);
    __decorate([
        Property(false)
    ], DatePicker.prototype, "enableRtl", void 0);
    __decorate([
        Property(false)
    ], DatePicker.prototype, "enablePersistence", void 0);
    __decorate([
        Property(1000)
    ], DatePicker.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], DatePicker.prototype, "readonly", void 0);
    __decorate([
        Property(null)
    ], DatePicker.prototype, "placeholder", void 0);
    __decorate([
        Property('Never')
    ], DatePicker.prototype, "floatLabelType", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "open", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "close", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "blur", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "focus", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "created", void 0);
    __decorate([
        Event()
    ], DatePicker.prototype, "destroyed", void 0);
    DatePicker = __decorate([
        NotifyPropertyChanges
    ], DatePicker);
    return DatePicker;
}(Calendar));
export { DatePicker };
