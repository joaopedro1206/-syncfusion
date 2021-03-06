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
import { Component, Property, Event, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '-syncfusion/ej2-base';
import { NotifyPropertyChanges, detach, Internationalization, getUniqueID } from '-syncfusion/ej2-base';
import { Input } from '../input/input';
var ROOT = 'e-textbox';
var CONTROL = 'e-control';
var HIDE_CLEAR = 'e-clear-icon-hide';
/**
 * Represents the TextBox component that allows the user to enter the values based on it's type.
 * ```html
 * <input name='images' id='textbox'/>
 * ```
 * ```typescript
 * <script>
 *   var textboxObj = new TextBox();
 *   textboxObj.appendTo('#textbox');
 * </script>
 * ```
 */
var TextBox = /** @class */ (function (_super) {
    __extends(TextBox, _super);
    function TextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousValue = null;
        return _this;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    TextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'floatLabelType':
                    Input.removeFloating(this.textboxWrapper);
                    Input.addFloating(this.element, this.floatLabelType, this.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
                    break;
                case 'value':
                    var prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (!this.isBlank(this.value)) {
                        this.value = this.value.toString();
                    }
                    this.isProtectedOnChange = prevOnChange;
                    Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
                    this.raiseChangeEvent();
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.element);
                    break;
                case 'type':
                    this.element.setAttribute('type', this.type);
                    this.raiseChangeEvent();
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.element, this.textboxWrapper);
                    this.bindClearEvent();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.textboxWrapper.container]);
                    break;
                case 'placeholder':
                    Input.setPlaceholder(this.placeholder, this.element);
                    break;
                case 'cssClass':
                    Input.setCssClass(this.cssClass, [this.textboxWrapper.container]);
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.element);
                    break;
            }
        }
    };
    /**
     * Gets the component name
     * @private
     */
    TextBox.prototype.getModuleName = function () {
        return 'textbox';
    };
    TextBox.prototype.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    TextBox.prototype.preRender = function () {
        this.cloneElement = this.element.cloneNode(true);
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTBOX') {
            var ejInstance = getValue('ej2_instances', this.element);
            var inputElement = this.createElement('input');
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                inputElement.innerHTML = this.element.innerHTML;
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        var attributes = this.element.attributes;
        this.checkAttributes(attributes);
        this.element.setAttribute('type', this.type);
        this.globalize = new Internationalization(this.locale);
        var localeText = { placeholder: this.placeholder };
        this.l10n = new L10n('textbox', localeText, this.locale);
        if (this.l10n.getConstant('placeholder') !== '') {
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        if (!this.element.hasAttribute('id')) {
            this.element.setAttribute('id', getUniqueID('textbox'));
        }
        if (!this.element.hasAttribute('name')) {
            this.element.setAttribute('name', this.element.getAttribute('id'));
        }
    };
    TextBox.prototype.checkAttributes = function (attrs) {
        for (var i = 0; i < attrs.length; i++) {
            var key = attrs[i].nodeName;
            if (key === 'disabled') {
                this.setProperties({ enabled: false }, true);
            }
            else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
            }
            else if (key === 'placeholder') {
                this.setProperties({ placeholder: attrs[i].nodeValue }, true);
            }
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    TextBox.prototype.render = function () {
        this.textboxWrapper = Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                cssClass: this.cssClass,
                readonly: this.readonly,
                placeholder: this.placeholder,
                showClearButton: this.showClearButton
            }
        });
        this.wireEvents();
        if (this.element.value !== '') {
            this.value = this.element.value;
        }
        if (!isNullOrUndefined(this.value)) {
            Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
        }
    };
    TextBox.prototype.wireEvents = function () {
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
        }
    };
    TextBox.prototype.focusHandler = function (args) {
        var eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('focus', eventArgs);
    };
    TextBox.prototype.focusOutHandler = function (args) {
        if (!(this.previousValue === null && this.value === null && this.element.value === '') &&
            (this.previousValue !== this.element.value)) {
            this.raiseChangeEvent(args, true);
        }
        var eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    };
    TextBox.prototype.inputHandler = function (args) {
        var eventArgs = {
            event: args,
            value: this.element.value,
            previousValue: this.value,
            container: this.textboxWrapper.container
        };
        this.trigger('input', eventArgs);
    };
    TextBox.prototype.changeHandler = function (args) {
        this.setProperties({ value: this.element.value }, true);
        this.raiseChangeEvent(args, true);
    };
    TextBox.prototype.raiseChangeEvent = function (event, interaction) {
        var eventArgs = {
            event: event,
            value: this.value,
            previousValue: this.previousValue,
            container: this.textboxWrapper.container,
            isInteraction: interaction ? interaction : false
        };
        this.trigger('change', eventArgs);
        this.previousValue = this.value;
    };
    TextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
        }
    };
    TextBox.prototype.resetInputHandler = function (event) {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            Input.setValue('', this.element, this.floatLabelType, this.showClearButton);
            this.value = '';
        }
    };
    TextBox.prototype.unWireEvents = function () {
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextBox element from the DOM.
     * @method destroy
     * @return {void}
     */
    TextBox.prototype.destroy = function () {
        this.unWireEvents();
        this.textboxWrapper.container.parentElement.appendChild(this.cloneElement);
        detach(this.textboxWrapper.container);
        this.textboxWrapper = null;
        this.cloneElement.classList.remove(ROOT, CONTROL);
        _super.prototype.destroy.call(this);
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    TextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Adding the multiple attributes as key-value pair to the TextBox element.
     * @param { { [key: string]: string } } attributes - Specifies the attributes to be add to TextBox element.
     * @return {void}
     */
    TextBox.prototype.addAttributes = function (attributes) {
        for (var _i = 0, _a = Object.keys(attributes); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === 'disabled') {
                this.setProperties({ enabled: false }, true);
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
            }
            else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
                Input.setReadonly(this.readonly, this.element);
            }
            else if (key === 'class') {
                this.element.classList.add(attributes[key]);
            }
            else if (key === 'placeholder') {
                this.setProperties({ placeholder: attributes[key] }, true);
                Input.setPlaceholder(this.placeholder, this.element);
            }
            else {
                this.element.setAttribute(key, attributes[key]);
            }
        }
    };
    /**
     * Removing the multiple attributes as key-value pair to the TextBox element.
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextBox element.
     * @return {void}
     */
    TextBox.prototype.removeAttributes = function (attributes) {
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var key = attributes_1[_i];
            if (key === 'disabled') {
                this.setProperties({ enabled: true }, true);
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
            }
            else if (key === 'readonly') {
                this.setProperties({ readonly: false }, true);
                Input.setReadonly(this.readonly, this.element);
            }
            else if (key === 'placeholder') {
                this.setProperties({ placeholder: null }, true);
                Input.setPlaceholder(this.placeholder, this.element);
            }
            else {
                this.element.removeAttribute(key);
            }
        }
    };
    __decorate([
        Property('text')
    ], TextBox.prototype, "type", void 0);
    __decorate([
        Property(false)
    ], TextBox.prototype, "readonly", void 0);
    __decorate([
        Property(null)
    ], TextBox.prototype, "value", void 0);
    __decorate([
        Property('Never')
    ], TextBox.prototype, "floatLabelType", void 0);
    __decorate([
        Property('')
    ], TextBox.prototype, "cssClass", void 0);
    __decorate([
        Property(null)
    ], TextBox.prototype, "placeholder", void 0);
    __decorate([
        Property(false)
    ], TextBox.prototype, "enableRtl", void 0);
    __decorate([
        Property(true)
    ], TextBox.prototype, "enabled", void 0);
    __decorate([
        Property(false)
    ], TextBox.prototype, "showClearButton", void 0);
    __decorate([
        Property(false)
    ], TextBox.prototype, "enablePersistence", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "created", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "change", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "blur", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "focus", void 0);
    __decorate([
        Event()
    ], TextBox.prototype, "input", void 0);
    TextBox = __decorate([
        NotifyPropertyChanges
    ], TextBox);
    return TextBox;
}(Component));
export { TextBox };
