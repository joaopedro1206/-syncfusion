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
import { Component, EventHandler, Property, Event, Browser, L10n } from '-syncfusion/ej2-base';
import { NotifyPropertyChanges } from '-syncfusion/ej2-base';
import { attributes, addClass, removeClass, setStyleAttribute, detach, closest } from '-syncfusion/ej2-base';
import { isNullOrUndefined, getValue, formatUnit, setValue, merge } from '-syncfusion/ej2-base';
import { Internationalization, getNumericObject } from '-syncfusion/ej2-base';
import { Input } from '../input/input';
var ROOT = 'e-control-wrapper e-numeric';
var SPINICON = 'e-input-group-icon';
var SPINUP = 'e-spin-up';
var SPINDOWN = 'e-spin-down';
var ERROR = 'e-error';
var INCREMENT = 'increment';
var DECREMENT = 'decrement';
var INTREGEXP = new RegExp('^(-)?(\\d*)$');
var DECIMALSEPARATOR = '.';
var COMPONENT = 'e-numerictextbox';
var CONTROL = 'e-control';
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
var NumericTextBox = /** @class */ (function (_super) {
    __extends(NumericTextBox, _super);
    function NumericTextBox(options, element) {
        return _super.call(this, options, element) || this;
    }
    NumericTextBox.prototype.preRender = function () {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        var ejInstance = getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            var input = this.createElement('input');
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                input.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                input.innerHTML = this.element.innerHTML;
            }
            if (this.element.hasAttribute('id')) {
                this.element.removeAttribute('id');
            }
            this.element.classList.remove('e-control', 'e-numerictextbox');
            this.element.appendChild(input);
            this.element = input;
            setValue('ej2_instances', ejInstance, this.element);
        }
        attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
        var localeText = { incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: '' };
        this.l10n = new L10n('numerictextbox', localeText, this.locale);
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.checkAttributes();
        this.prevValue = this.value;
        this.validateMinMax();
        this.validateStep();
        if (this.placeholder === null) {
            this.updatePlaceholder();
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    NumericTextBox.prototype.render = function () {
        if (this.element.tagName.toLowerCase() === 'input') {
            this.createWrapper();
            if (this.showSpinButton) {
                this.spinBtnCreation();
            }
            if (!isNullOrUndefined(this.width)) {
                setStyleAttribute(this.container, { 'width': formatUnit(this.width) });
            }
            if (!this.container.classList.contains('e-input-group')) {
                this.container.classList.add('e-input-group');
            }
            this.changeValue(this.value === null || isNaN(this.value) ? null : this.strictMode ? this.trimValue(this.value) : this.value);
            this.wireEvents();
            if (this.value !== null && !isNaN(this.value)) {
                if (this.decimals) {
                    this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                }
            }
        }
    };
    NumericTextBox.prototype.checkAttributes = function () {
        var attributes = ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name'];
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        var enabled = this.element.getAttribute(prop) === 'disabled' ||
                            this.element.getAttribute(prop) === 'true' ? false : true;
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'readonly':
                        var readonly = this.element.getAttribute(prop) === 'readonly'
                            || this.element.getAttribute(prop) === 'true' ? true : false;
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'style':
                        this.inputStyle = this.element.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputName = this.element.getAttribute(prop);
                        break;
                    default:
                        var value = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                            this.setProperties(setValue(prop, value, {}), true);
                        }
                        break;
                }
            }
        }
    };
    NumericTextBox.prototype.updatePlaceholder = function () {
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
    };
    NumericTextBox.prototype.initCultureFunc = function () {
        this.instance = new Internationalization(this.locale);
    };
    NumericTextBox.prototype.initCultureInfo = function () {
        this.cultureInfo.format = this.format;
        if (getValue('currency', this) !== null) {
            setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    };
    /* Wrapper creation */
    NumericTextBox.prototype.createWrapper = function () {
        var inputObj = Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
                enabled: this.enabled
            }
        }, this.createElement);
        this.inputWrapper = inputObj;
        this.container = inputObj.container;
        this.container.setAttribute('class', ROOT + ' ' + this.container.getAttribute('class'));
        if (this.readonly) {
            attributes(this.element, { 'aria-readonly': 'true' });
        }
        this.hiddenInput = (this.createElement('input', { attrs: { type: 'hidden', 'validateHidden': 'true' } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        attributes(this.hiddenInput, { 'name': this.inputName });
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        if (this.inputStyle !== null) {
            attributes(this.container, { 'style': this.inputStyle });
        }
    };
    /* Spinner creation */
    NumericTextBox.prototype.spinBtnCreation = function () {
        this.spinDown = Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container, this.createElement);
        attributes(this.spinDown, {
            'title': this.l10n.getConstant('decrementTitle'),
            'aria-label': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        attributes(this.spinUp, {
            'title': this.l10n.getConstant('incrementTitle'),
            'aria-label': this.l10n.getConstant('incrementTitle')
        });
        this.wireSpinBtnEvents();
    };
    NumericTextBox.prototype.validateMinMax = function () {
        if (!(typeof (this.min) === 'number' && !isNaN(this.min))) {
            this.setProperties({ min: -(Number.MAX_VALUE) }, true);
        }
        if (!(typeof (this.max) === 'number' && !isNaN(this.max))) {
            this.setProperties({ max: Number.MAX_VALUE }, true);
        }
        if (this.decimals !== null) {
            if (this.min !== -(Number.MAX_VALUE)) {
                this.setProperties({ min: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.min)) }, true);
            }
            if (this.max !== (Number.MAX_VALUE)) {
                this.setProperties({ max: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.max)) }, true);
            }
        }
        this.setProperties({ min: this.min > this.max ? this.max : this.min }, true);
        attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
    };
    NumericTextBox.prototype.formattedValue = function (decimals, value) {
        return this.instance.getNumberFormat({
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals, useGrouping: false
        })(value);
    };
    NumericTextBox.prototype.validateStep = function () {
        if (this.decimals !== null) {
            this.setProperties({ step: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.step)) }, true);
        }
    };
    NumericTextBox.prototype.action = function (operation, event) {
        this.isInteract = true;
        var value = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
        this.changeValue(this.performAction(value, this.step, operation));
        this.raiseChangeEvent(event);
    };
    NumericTextBox.prototype.checkErrorClass = function () {
        if (this.isValidState) {
            removeClass([this.container], ERROR);
        }
        else {
            addClass([this.container], ERROR);
        }
        attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    };
    NumericTextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    NumericTextBox.prototype.resetHandler = function (e) {
        e.preventDefault();
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide'))) {
            this.clear(e);
        }
    };
    NumericTextBox.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
    };
    NumericTextBox.prototype.wireEvents = function () {
        EventHandler.add(this.element, 'focus', this.focusIn, this);
        EventHandler.add(this.element, 'blur', this.focusOut, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
        }
    };
    NumericTextBox.prototype.wireSpinBtnEvents = function () {
        /* bind spin button events */
        EventHandler.add(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    };
    NumericTextBox.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, 'focus', this.focusIn);
        EventHandler.remove(this.element, 'blur', this.focusOut);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
        EventHandler.remove(this.element, 'paste', this.pasteHandler);
    };
    NumericTextBox.prototype.unwireSpinBtnEvents = function () {
        /* unbind spin button events */
        EventHandler.remove(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner);
    };
    NumericTextBox.prototype.changeHandler = function (event) {
        event.stopPropagation();
        if (!this.element.value.length) {
            this.setProperties({ value: null }, true);
        }
        var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    };
    NumericTextBox.prototype.raiseChangeEvent = function (event) {
        if (this.prevValue !== this.value) {
            var eventArgs = {};
            this.changeEventArgs = { value: this.value, previousValue: this.prevValue, isInteraction: this.isInteract, event: event };
            if (event) {
                this.changeEventArgs.event = event;
            }
            merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.trigger('change', eventArgs);
        }
    };
    NumericTextBox.prototype.pasteHandler = function () {
        var _this = this;
        var beforeUpdate = this.element.value;
        setTimeout(function () {
            if (!_this.numericRegex().test(_this.element.value)) {
                _this.setElementValue(beforeUpdate);
            }
        });
    };
    NumericTextBox.prototype.preventHandler = function () {
        var _this = this;
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(function () {
            if (_this.element.selectionStart > 0) {
                var currentPos = _this.element.selectionStart;
                var prevPos = _this.element.selectionStart - 1;
                var start = 0;
                var ignoreKeyCode = void 0;
                var valArray = _this.element.value.split('');
                var numericObject = getNumericObject(_this.locale);
                var decimalSeparator = getValue('decimal', numericObject);
                ignoreKeyCode = decimalSeparator.charCodeAt(0);
                if (_this.element.value[prevPos] === ' ' && _this.element.selectionStart > 0 && !iOS) {
                    if (isNullOrUndefined(_this.prevVal)) {
                        _this.element.value = _this.element.value.trim();
                    }
                    else if (prevPos !== 0) {
                        _this.element.value = _this.prevVal;
                    }
                    else if (prevPos === 0) {
                        _this.element.value = _this.element.value.trim();
                    }
                    _this.element.setSelectionRange(prevPos, prevPos);
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) &&
                    _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 1]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 1]) &&
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.value = _this.element.value.substring(0, prevPos) +
                            _this.element.value.substring(currentPos, _this.element.value.length);
                        _this.element.setSelectionRange(prevPos, prevPos);
                        if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) && _this.element.selectionStart > 0
                            && _this.element.value.length) {
                            _this.preventHandler();
                        }
                    }
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 2])) && _this.element.selectionStart > 1 &&
                    _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 2]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 2]) &&
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.setSelectionRange(prevPos, prevPos);
                        _this.nextEle = _this.element.value[_this.element.selectionStart];
                        _this.cursorPosChanged = true;
                        _this.preventHandler();
                    }
                }
                if (_this.cursorPosChanged === true && _this.element.value[_this.element.selectionStart] === _this.nextEle &&
                    isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1]))) {
                    _this.element.setSelectionRange(_this.element.selectionStart + 1, _this.element.selectionStart + 1);
                    _this.cursorPosChanged = false;
                    _this.nextEle = null;
                }
                if (_this.element.value.trim() === '') {
                    _this.element.setSelectionRange(start, start);
                }
                if (_this.element.selectionStart > 0) {
                    if ((_this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === 45) && _this.element.selectionStart > 1) {
                        if (isNullOrUndefined(_this.prevVal)) {
                            _this.element.value = _this.element.value;
                        }
                        else {
                            _this.element.value = _this.prevVal;
                        }
                        _this.element.setSelectionRange(_this.element.selectionStart, _this.element.selectionStart);
                    }
                }
                _this.prevVal = _this.element.value;
            }
        });
    };
    NumericTextBox.prototype.keyUpHandler = function (event) {
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && Browser.isDevice) {
            this.preventHandler();
        }
    };
    ;
    NumericTextBox.prototype.inputHandler = function (event) {
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        var fireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && Browser.isDevice) {
            this.preventHandler();
        }
    };
    ;
    NumericTextBox.prototype.keyDownHandler = function (event) {
        if (!this.readonly) {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.action(INCREMENT, event);
                    break;
                case 40:
                    event.preventDefault();
                    this.action(DECREMENT, event);
                    break;
                default: break;
            }
        }
    };
    ;
    NumericTextBox.prototype.performAction = function (value, step, operation) {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        var updatedValue = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    };
    ;
    NumericTextBox.prototype.correctRounding = function (value, step, result) {
        var floatExp = new RegExp('[,.](.*)');
        var valueText = value.toString();
        var stepText = step.toString();
        var floatValue = floatExp.test(value.toString());
        var floatStep = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            var valueCount = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            var stepCount = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            var max = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    };
    ;
    NumericTextBox.prototype.roundValue = function (result, precision) {
        precision = precision || 0;
        var divide = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    };
    ;
    NumericTextBox.prototype.updateValue = function (value, event) {
        if (event) {
            this.isInteract = true;
        }
        if (value !== null && !isNaN(value)) {
            if (this.decimals) {
                value = this.roundNumber(value, this.decimals);
            }
        }
        this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
        this.raiseChangeEvent(event);
    };
    NumericTextBox.prototype.updateCurrency = function (prop, propVal) {
        setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    };
    NumericTextBox.prototype.changeValue = function (value) {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        }
        else {
            var numberOfDecimals = void 0;
            var decimalPart = value.toString().split('.')[1];
            numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
            if (this.decimals !== null) {
                numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
            }
            this.setProperties({ value: this.roundNumber(value, numberOfDecimals) }, true);
        }
        this.modifyText();
        if (!this.strictMode) {
            this.validateState();
        }
    };
    ;
    NumericTextBox.prototype.modifyText = function () {
        if (this.value || this.value === 0) {
            var value = this.formatNumber();
            var elementValue = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = value;
        }
        else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    };
    ;
    NumericTextBox.prototype.setElementValue = function (val, element) {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    };
    NumericTextBox.prototype.validateState = function () {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    };
    NumericTextBox.prototype.formatNumber = function () {
        var numberOfDecimals;
        var currentValue = this.value;
        var decimalPart = currentValue.toString().split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    };
    ;
    NumericTextBox.prototype.trimValue = function (value) {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    };
    ;
    NumericTextBox.prototype.roundNumber = function (value, precision) {
        var result = value;
        var decimals = precision || 0;
        var result1 = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        var result2 = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    };
    ;
    NumericTextBox.prototype.cancelEvent = function (event) {
        event.preventDefault();
        return false;
    };
    NumericTextBox.prototype.keyPressHandler = function (event) {
        if (!Browser.isDevice && Browser.info.version === '11.0' && event.keyCode === 13) {
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
        }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) {
            return true;
        }
        var currentChar = String.fromCharCode(event.which);
        var text = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        else {
            return true;
        }
    };
    ;
    NumericTextBox.prototype.numericRegex = function () {
        var numericObject = getNumericObject(this.locale);
        var decimalSeparator = getValue('decimal', numericObject);
        var fractionRule = '*';
        if (decimalSeparator === DECIMALSEPARATOR) {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.decimals === 0 && this.validateDecimalOnType) {
            return INTREGEXP;
        }
        if (this.decimals && this.validateDecimalOnType) {
            fractionRule = '{0,' + this.decimals + '}';
        }
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    };
    ;
    NumericTextBox.prototype.mouseWheel = function (event) {
        event.preventDefault();
        var delta;
        var rawEvent = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / 120;
        }
        else if (rawEvent.detail) {
            delta = -rawEvent.detail / 3;
        }
        if (delta > 0) {
            this.action(INCREMENT, event);
        }
        else if (delta < 0) {
            this.action(DECREMENT, event);
        }
        this.cancelEvent(event);
    };
    NumericTextBox.prototype.focusIn = function (event) {
        var _this = this;
        if (!this.enabled || this.readonly) {
            return;
        }
        this.isFocused = true;
        removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            var formatValue_1 = this.formatNumber();
            this.setElementValue(formatValue_1);
            if (!this.isPrevFocused) {
                var delay = (Browser.isDevice && Browser.isIos) ? 600 : 0;
                setTimeout(function () {
                    _this.element.setSelectionRange(0, formatValue_1.length);
                }, delay);
            }
        }
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
        }
    };
    ;
    NumericTextBox.prototype.focusOut = function (event) {
        var _this = this;
        if (this.isPrevFocused) {
            event.preventDefault();
            if (Browser.isDevice) {
                var value_1 = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                var ele_1 = this.element;
                setTimeout(function () {
                    _this.setElementValue(value_1, ele_1);
                }, 200);
            }
        }
        else {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!Browser.isDevice) {
                EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        var formElement = closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var focusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    };
    ;
    NumericTextBox.prototype.mouseDownOnSpinner = function (event) {
        var _this = this;
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var result = this.getElementData(event);
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(function () { _this.isCalled = true; _this.action(action, event); }, 150);
        EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    };
    NumericTextBox.prototype.touchMoveOnSpinner = function (event) {
        var target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    };
    NumericTextBox.prototype.mouseUpOnSpinner = function (event) {
        if (this.isPrevFocused) {
            this.element.focus();
            if (!Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        EventHandler.remove(document, 'mouseup', this.mouseUpClick);
    };
    NumericTextBox.prototype.getElementData = function (event) {
        if ((event.which && event.which === 3) || (event.button && event.button === 2)
            || !this.enabled || this.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    };
    NumericTextBox.prototype.floatLabelTypeUpdate = function () {
        Input.removeFloating(this.inputWrapper);
        var hiddenInput = this.hiddenInput;
        this.hiddenInput.remove();
        Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    };
    NumericTextBox.prototype.mouseUpClick = function (event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
    };
    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    NumericTextBox.prototype.increment = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    NumericTextBox.prototype.decrement = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    NumericTextBox.prototype.destroy = function () {
        this.unwireEvents();
        detach(this.hiddenInput);
        if (this.showSpinButton) {
            this.unwireSpinBtnEvents();
            detach(this.spinUp);
            detach(this.spinDown);
        }
        this.container.parentElement.appendChild(this.cloneElement);
        detach(this.container);
        _super.prototype.destroy.call(this);
    };
    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    NumericTextBox.prototype.getText = function () {
        return this.element.value;
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    NumericTextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    NumericTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        var elementVal;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.container, { 'width': formatUnit(newProp.width) });
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.container], oldProp.cssClass);
                    break;
                case 'enabled':
                    Input.setEnabled(newProp.enabled, this.element);
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(newProp.enableRtl, [this.container]);
                    break;
                case 'readonly':
                    Input.setReadonly(newProp.readonly, this.element);
                    if (this.readonly) {
                        attributes(this.element, { 'aria-readonly': 'true' });
                    }
                    else {
                        this.element.removeAttribute('aria-readonly');
                    }
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.element);
                    break;
                case 'step':
                    this.step = newProp.step;
                    this.validateStep();
                    break;
                case 'showSpinButton':
                    if (newProp.showSpinButton) {
                        this.spinBtnCreation();
                    }
                    else {
                        detach(this.spinUp);
                        detach(this.spinDown);
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
                    this.bindClearEvent();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    this.floatLabelTypeUpdate();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    break;
                case 'min':
                case 'max':
                    setValue(prop, getValue(prop, newProp), this);
                    this.validateMinMax();
                    this.updateValue(this.value);
                    break;
                case 'strictMode':
                    this.strictMode = newProp.strictMode;
                    this.updateValue(this.value);
                    this.validateState();
                    break;
                case 'locale':
                    this.initCultureFunc();
                    this.l10n.setLocale(this.locale);
                    if (!isNullOrUndefined(this.spinDown)) {
                        attributes(this.spinDown, {
                            'title': this.l10n.getConstant('decrementTitle'),
                            'aria-label': this.l10n.getConstant('decrementTitle')
                        });
                    }
                    if (!isNullOrUndefined(this.spinUp)) {
                        attributes(this.spinUp, {
                            'title': this.l10n.getConstant('incrementTitle'),
                            'aria-label': this.l10n.getConstant('incrementTitle')
                        });
                    }
                    this.updatePlaceholder();
                    Input.setPlaceholder(this.placeholder, this.element);
                    this.updateValue(this.value);
                    break;
                case 'currency':
                    var propVal = getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    var propValue = getValue(prop, newProp);
                    this.setProperties({ currency: propValue }, true);
                    this.updateCurrency('currency', propValue);
                    break;
                case 'format':
                    setValue(prop, getValue(prop, newProp), this);
                    this.initCultureInfo();
                    this.updateValue(this.value);
                    break;
                case 'decimals':
                    this.decimals = newProp.decimals;
                    this.updateValue(this.value);
            }
        }
    };
    /**
     * Gets the component name
     * @private
     */
    NumericTextBox.prototype.getModuleName = function () {
        return 'numerictextbox';
    };
    __decorate([
        Property('')
    ], NumericTextBox.prototype, "cssClass", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "value", void 0);
    __decorate([
        Property(-(Number.MAX_VALUE))
    ], NumericTextBox.prototype, "min", void 0);
    __decorate([
        Property(Number.MAX_VALUE)
    ], NumericTextBox.prototype, "max", void 0);
    __decorate([
        Property(1)
    ], NumericTextBox.prototype, "step", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "placeholder", void 0);
    __decorate([
        Property(true)
    ], NumericTextBox.prototype, "showSpinButton", void 0);
    __decorate([
        Property(false)
    ], NumericTextBox.prototype, "readonly", void 0);
    __decorate([
        Property(true)
    ], NumericTextBox.prototype, "enabled", void 0);
    __decorate([
        Property(false)
    ], NumericTextBox.prototype, "enableRtl", void 0);
    __decorate([
        Property(false)
    ], NumericTextBox.prototype, "showClearButton", void 0);
    __decorate([
        Property(false)
    ], NumericTextBox.prototype, "enablePersistence", void 0);
    __decorate([
        Property('n2')
    ], NumericTextBox.prototype, "format", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "decimals", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "currency", void 0);
    __decorate([
        Property(null)
    ], NumericTextBox.prototype, "currencyCode", void 0);
    __decorate([
        Property(true)
    ], NumericTextBox.prototype, "strictMode", void 0);
    __decorate([
        Property(false)
    ], NumericTextBox.prototype, "validateDecimalOnType", void 0);
    __decorate([
        Property('Never')
    ], NumericTextBox.prototype, "floatLabelType", void 0);
    __decorate([
        Event()
    ], NumericTextBox.prototype, "created", void 0);
    __decorate([
        Event()
    ], NumericTextBox.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], NumericTextBox.prototype, "change", void 0);
    NumericTextBox = __decorate([
        NotifyPropertyChanges
    ], NumericTextBox);
    return NumericTextBox;
}(Component));
export { NumericTextBox };
