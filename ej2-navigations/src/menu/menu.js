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
/// <reference path='../common/menu-base-model.d.ts'/>
import { attributes, NotifyPropertyChanges, Property } from '-syncfusion/ej2-base';
import { Browser, Complex } from '-syncfusion/ej2-base';
import { MenuBase, FieldSettings } from '../common/menu-base';
var VMENU = 'e-vertical';
var SCROLLABLE = 'e-scrollable';
/**
 * The Menu is a graphical user interface that serve as navigation headers for your application or site.
 * ```html
 * <ul id = 'menu'></ul>
 * ```
 * ```typescript
 * <script>
 * var menuObj = new Menu({ items: [{ text: 'Home' }, { text: 'Contact Us' },{ text: 'Login' }]});
 * menuObj.appendTo("#menu");
 * </script>
 * ```
 */
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    /**
     * Constructor for creating the component.
     * @private
     */
    function Menu(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.tempItems = [];
        return _this;
    }
    /**
     * Get module name.
     * @returns string
     * @private
     */
    Menu.prototype.getModuleName = function () {
        return 'menu';
    };
    /**
     * For internal use only - prerender processing.
     * @private
     */
    Menu.prototype.preRender = function () {
        this.isMenu = true;
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.template = document.querySelector(this.template).innerHTML.trim();
                    this.clearChanges();
                }
            }
            catch (e) {
                /* action on catch */
            }
        }
        else {
            this.tempItems = this.items;
            this.items = [];
            this.tempItems.map(this.createMenuItems, this);
            this.setProperties({ items: this.items }, true);
            this.tempItems = [];
        }
        _super.prototype.preRender.call(this);
    };
    Menu.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        attributes(this.element, { 'role': 'menubar', 'tabindex': '0' });
        if (this.orientation === 'Vertical') {
            this.element.classList.add(VMENU);
            this.element.setAttribute('aria-orientation', 'vertical');
        }
        else {
            if (Browser.isDevice && !this.enableScrolling) {
                this.element.parentElement.classList.add(SCROLLABLE);
            }
        }
    };
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {MenuModel} newProp
     * @param {MenuModel} oldProp
     * @returns void
     */
    Menu.prototype.onPropertyChanged = function (newProp, oldProp) {
        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'orientation':
                    if (newProp.orientation === 'Vertical') {
                        this.element.classList.add(VMENU);
                        this.element.setAttribute('aria-orientation', 'vertical');
                    }
                    else {
                        this.element.classList.remove(VMENU);
                        this.element.removeAttribute('aria-orientation');
                    }
                    break;
            }
        }
    };
    Menu.prototype.createMenuItems = function (item, index) {
        var pIdField;
        var record = { items: [] };
        var idx;
        var i;
        var items = this.items;
        var fields = ['itemId', 'text', 'iconCss', 'url', 'separator', 'children'];
        pIdField = this.getField('parentId');
        for (i = 0; i < fields.length; i++) {
            var field = this.getField(fields[i]);
            if (item[field]) {
                record[field] = item[field];
            }
        }
        if (item[pIdField]) {
            idx = this.getIndex(item[pIdField].toString(), true);
            for (i = 0; i < idx.length; i++) {
                if (!items[idx[i]].items) {
                    items[idx[i]].items = [];
                }
                items = items[idx[i]].items;
            }
            items.push(record);
        }
        else {
            this.items.push(record);
        }
    };
    __decorate([
        Property('Horizontal')
    ], Menu.prototype, "orientation", void 0);
    __decorate([
        Property(null)
    ], Menu.prototype, "template", void 0);
    __decorate([
        Property(false)
    ], Menu.prototype, "enableScrolling", void 0);
    __decorate([
        Complex({}, FieldSettings)
    ], Menu.prototype, "fields", void 0);
    Menu = __decorate([
        NotifyPropertyChanges
    ], Menu);
    return Menu;
}(MenuBase));
export { Menu };
