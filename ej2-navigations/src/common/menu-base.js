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
import { Component, Property, ChildProperty, NotifyPropertyChanges } from '-syncfusion/ej2-base';
import { Event, EventHandler, KeyboardEvents, Touch } from '-syncfusion/ej2-base';
import { Animation } from '-syncfusion/ej2-base';
import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '-syncfusion/ej2-base';
import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '-syncfusion/ej2-base';
import { ListBase } from '-syncfusion/ej2-lists';
import { getZindexPartial, calculatePosition, isCollide, fit, Popup } from '-syncfusion/ej2-popups';
import { getScrollableParent } from '-syncfusion/ej2-popups';
import { HScroll } from '../common/h-scroll';
import { VScroll } from '../common/v-scroll';
var ENTER = 'enter';
var ESCAPE = 'escape';
var FOCUSED = 'e-focused';
var HEADER = 'e-menu-header';
var SELECTED = 'e-selected';
var SEPARATOR = 'e-separator';
var UPARROW = 'uparrow';
var DOWNARROW = 'downarrow';
var LEFTARROW = 'leftarrow';
var RIGHTARROW = 'rightarrow';
var HOME = 'home';
var END = 'end';
var CARET = 'e-caret';
var ITEM = 'e-menu-item';
var DISABLED = 'e-disabled';
var HIDE = 'e-menu-hide';
var ICONS = 'e-icons';
var RTL = 'e-rtl';
var POPUP = 'e-menu-popup';
/**
 * Configures the field options of the Menu.
 */
var FieldSettings = /** @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('id')
    ], FieldSettings.prototype, "itemId", void 0);
    __decorate([
        Property('parentId')
    ], FieldSettings.prototype, "parentId", void 0);
    __decorate([
        Property('text')
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        Property('iconCss')
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        Property('url')
    ], FieldSettings.prototype, "url", void 0);
    __decorate([
        Property('separator')
    ], FieldSettings.prototype, "separator", void 0);
    __decorate([
        Property('items')
    ], FieldSettings.prototype, "children", void 0);
    return FieldSettings;
}(ChildProperty));
export { FieldSettings };
/**
 * Specifies menu items.
 */
var MenuItem = /** @class */ (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], MenuItem.prototype, "iconCss", void 0);
    __decorate([
        Property('')
    ], MenuItem.prototype, "id", void 0);
    __decorate([
        Property(false)
    ], MenuItem.prototype, "separator", void 0);
    __decorate([
        Collection([], MenuItem)
    ], MenuItem.prototype, "items", void 0);
    __decorate([
        Property('')
    ], MenuItem.prototype, "text", void 0);
    __decorate([
        Property('')
    ], MenuItem.prototype, "url", void 0);
    return MenuItem;
}(ChildProperty));
export { MenuItem };
/**
 * Animation configuration settings.
 */
var MenuAnimationSettings = /** @class */ (function (_super) {
    __extends(MenuAnimationSettings, _super);
    function MenuAnimationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('SlideDown')
    ], MenuAnimationSettings.prototype, "effect", void 0);
    __decorate([
        Property(400)
    ], MenuAnimationSettings.prototype, "duration", void 0);
    __decorate([
        Property('ease')
    ], MenuAnimationSettings.prototype, "easing", void 0);
    return MenuAnimationSettings;
}(ChildProperty));
export { MenuAnimationSettings };
/**
 * @private
 * Base class for Menu and ContextMenu components.
 */
var MenuBase = /** @class */ (function (_super) {
    __extends(MenuBase, _super);
    /**
     * Constructor for creating the widget.
     * @private
     */
    function MenuBase(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.navIdx = [];
        _this.animation = new Animation({});
        _this.isTapHold = false;
        return _this;
    }
    /**
     * Initialized third party configuration settings.
     * @private
     */
    MenuBase.prototype.preRender = function () {
        if (this.element.tagName === 'EJS-CONTEXTMENU') {
            this.element.style.display = 'none';
            this.element.classList.remove('e-' + this.getModuleName());
            this.element.classList.remove('e-control');
            var ejInst = getValue('ej2_instances', this.element);
            var ul = this.createElement('ul');
            this.ngElement = this.element;
            this.element = ul;
            this.element.classList.add('e-control');
            this.element.classList.add('e-' + this.getModuleName());
            setValue('ej2_instances', ejInst, this.element);
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
        }
        if (this.element.tagName === 'EJS-MENU') {
            var ele = this.element;
            var ejInstance = getValue('ej2_instances', ele);
            var ul = this.createElement('ul');
            var wrapper = this.createElement('EJS-MENU', { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (var idx = 0, len = ele.attributes.length; idx < len; idx++) {
                ul.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            detach(ele);
            ele = ul;
            wrapper.appendChild(ele);
            setValue('ej2_instances', ejInstance, ele);
            this.ngElement = wrapper;
            this.element = ele;
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
        }
    };
    /**
     * Initialize the control rendering
     * @private
     */
    MenuBase.prototype.render = function () {
        this.initialize();
        this.renderItems();
        this.wireEvents();
    };
    MenuBase.prototype.initialize = function () {
        var wrapper = this.getWrapper();
        if (!wrapper) {
            wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            if (this.isMenu) {
                this.element.parentElement.insertBefore(wrapper, this.element);
            }
            else {
                document.body.appendChild(wrapper);
            }
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        wrapper.appendChild(this.element);
    };
    MenuBase.prototype.renderItems = function () {
        if (!this.items.length) {
            var items = ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            this.element.innerHTML = '';
        }
        var ul = this.createItems(this.items);
        append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
        var wrapper = this.getWrapper();
        this.element.classList.contains('e-vertical') ?
            this.addScrolling(wrapper, this.element, 'vscroll', wrapper.offsetHeight, this.element.offsetHeight)
            : this.addScrolling(wrapper, this.element, 'hscroll', wrapper.offsetWidth, this.element.offsetWidth);
    };
    MenuBase.prototype.wireEvents = function () {
        var wrapper = this.getWrapper();
        if (this.target) {
            var target = void 0;
            var targetElems = selectAll(this.target);
            for (var i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (Browser.isIos) {
                    new Touch(target, { tapHold: this.touchHandler.bind(this) });
                }
                else {
                    EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                }
            }
            this.targetElement = target;
            for (var _i = 0, _a = getScrollableParent(this.targetElement); _i < _a.length; _i++) {
                var parent_1 = _a[_i];
                EventHandler.add(parent_1, 'scroll', this.scrollHandler, this);
            }
        }
        if (!Browser.isDevice) {
            this.delegateMoverHandler = this.moverHandler.bind(this);
            this.delegateMouseDownHandler = this.mouseDownHandler.bind(this);
            EventHandler.add(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler, this);
            EventHandler.add(document, 'mousedown', this.delegateMouseDownHandler, this);
        }
        this.delegateClickHandler = this.clickHandler.bind(this);
        EventHandler.add(document, 'click', this.delegateClickHandler, this);
        this.wireKeyboardEvent(wrapper);
        this.rippleFn = rippleEffect(wrapper, { selector: '.' + ITEM });
    };
    MenuBase.prototype.wireKeyboardEvent = function (element) {
        var keyConfigs = {
            downarrow: DOWNARROW,
            uparrow: UPARROW,
            enter: ENTER,
            leftarrow: LEFTARROW,
            rightarrow: RIGHTARROW,
            escape: ESCAPE
        };
        if (this.isMenu) {
            keyConfigs.home = HOME;
            keyConfigs.end = END;
        }
        new KeyboardEvents(element, {
            keyAction: this.keyBoardHandler.bind(this),
            keyConfigs: keyConfigs
        });
    };
    MenuBase.prototype.mouseDownHandler = function (e) {
        if (closest(e.target, '.e-' + this.getModuleName() + '-wrapper') !== this.getWrapper()
            && !closest(e.target, '.e-' + this.getModuleName() + '-popup')) {
            this.closeMenu(this.navIdx.length, e);
        }
    };
    MenuBase.prototype.keyBoardHandler = function (e) {
        var actionName = '';
        var trgt = e.target;
        var actionNeeded = this.isMenu && !this.element.classList.contains('e-vertical') && this.navIdx.length < 1;
        e.preventDefault();
        if (this.enableScrolling && e.keyCode === 13 && trgt.classList.contains('e-scroll-nav')) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [closest(trgt, '.e-' + this.getModuleName() + '-wrapper')]);
        }
        if (actionNeeded) {
            switch (e.action) {
                case RIGHTARROW:
                    actionName = RIGHTARROW;
                    e.action = DOWNARROW;
                    break;
                case LEFTARROW:
                    actionName = LEFTARROW;
                    e.action = UPARROW;
                    break;
                case DOWNARROW:
                    actionName = DOWNARROW;
                    e.action = RIGHTARROW;
                    break;
                case UPARROW:
                    actionName = UPARROW;
                    e.action = '';
                    break;
            }
        }
        else if (this.enableRtl) {
            switch (e.action) {
                case LEFTARROW:
                    actionNeeded = true;
                    actionName = LEFTARROW;
                    e.action = RIGHTARROW;
                    break;
                case RIGHTARROW:
                    actionNeeded = true;
                    actionName = RIGHTARROW;
                    e.action = LEFTARROW;
                    break;
            }
        }
        switch (e.action) {
            case DOWNARROW:
            case UPARROW:
            case END:
            case HOME:
                this.upDownKeyHandler(e);
                break;
            case RIGHTARROW:
                this.rightEnterKeyHandler(e);
                break;
            case LEFTARROW:
                this.leftEscKeyHandler(e);
                break;
            case ENTER:
                this.rightEnterKeyHandler(e);
                break;
            case ESCAPE:
                this.leftEscKeyHandler(e);
                break;
        }
        if (actionNeeded) {
            e.action = actionName;
        }
    };
    MenuBase.prototype.upDownKeyHandler = function (e) {
        var cul = this.getUlByNavIdx();
        var defaultIdx = (e.action === DOWNARROW || e.action === HOME) ? 0 : cul.childElementCount - 1;
        var fliIdx = defaultIdx;
        var fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            if (e.action !== END && e.action !== HOME) {
                fliIdx = this.getIdx(cul, fli);
            }
            fli.classList.remove(FOCUSED);
            if (e.action !== END && e.action !== HOME) {
                e.action === DOWNARROW ? fliIdx++ : fliIdx--;
                if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                    fliIdx = defaultIdx;
                }
            }
        }
        var cli = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        cul.children[fliIdx].focus();
    };
    MenuBase.prototype.isValidLI = function (cli, index, action) {
        var wrapper = this.getWrapper();
        var cul = this.getUlByNavIdx();
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            ((action === DOWNARROW) || (action === RIGHTARROW)) ? index++ : index--;
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    };
    MenuBase.prototype.getUlByNavIdx = function (navIdxLen) {
        if (navIdxLen === void 0) { navIdxLen = this.navIdx.length; }
        if (this.isMenu) {
            var popup = [this.getWrapper()].concat([].slice.call(selectAll('.' + POPUP)))[navIdxLen];
            return isNullOrUndefined(popup) ? null : select('.e-menu-parent', popup);
        }
        else {
            return this.getWrapper().children[navIdxLen];
        }
    };
    MenuBase.prototype.rightEnterKeyHandler = function (e) {
        var eventArgs;
        var cul = this.getUlByNavIdx();
        var fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            var fliIdx = this.getIdx(cul, fli);
            var navIdx = this.navIdx.concat(fliIdx);
            var index = void 0;
            var item = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.openMenu(fli, item, null, null, e);
                fli.classList.remove(FOCUSED);
                if (this.isMenu && this.navIdx.length === 1) {
                    this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                }
                fli.classList.add(SELECTED);
                if (e.action === ENTER) {
                    eventArgs = { element: fli, item: item };
                    this.trigger('select', eventArgs);
                }
                fli.focus();
                cul = this.getUlByNavIdx();
                index = this.isValidLI(cul.children[0], 0, e.action);
                cul.children[index].classList.add(FOCUSED);
                cul.children[index].focus();
            }
            else {
                if (e.action === ENTER) {
                    if (this.isMenu && this.navIdx.length === 0) {
                        this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                    }
                    else {
                        fli.classList.remove(FOCUSED);
                    }
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli, item: item };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    };
    MenuBase.prototype.leftEscKeyHandler = function (e) {
        if (this.navIdx.length) {
            this.closeMenu(this.navIdx.length, e);
            var cul = this.getUlByNavIdx();
            var sli = this.getLIByClass(cul, SELECTED);
            if (sli) {
                sli.setAttribute('aria-expanded', 'false');
                sli.classList.remove(SELECTED);
                sli.classList.add(FOCUSED);
                sli.focus();
            }
        }
        else {
            if (e.action === ESCAPE) {
                this.closeMenu(null, e);
            }
        }
    };
    MenuBase.prototype.scrollHandler = function (e) {
        this.closeMenu(null, e);
    };
    MenuBase.prototype.touchHandler = function (e) {
        this.isTapHold = true;
        this.cmenuHandler(e.originalEvent);
    };
    MenuBase.prototype.cmenuHandler = function (e) {
        e.preventDefault();
        this.closeMenu(null, e);
        if (this.canOpen(e.target)) {
            if (e.changedTouches) {
                this.openMenu(null, null, e.changedTouches[0].pageY + 1, e.changedTouches[0].pageX + 1, e);
            }
            else {
                this.openMenu(null, null, e.pageY + 1, e.pageX + 1, e);
            }
        }
    };
    MenuBase.prototype.closeMenu = function (ulIndex, e) {
        if (ulIndex === void 0) { ulIndex = 0; }
        if (e === void 0) { e = null; }
        if (this.isMenuVisible()) {
            var ul = void 0;
            var sli = void 0;
            var item = void 0;
            var items = void 0;
            var closeArgs = void 0;
            var beforeCloseArgs = void 0;
            var popupEle = void 0;
            var popupObj = void 0;
            var wrapper = this.getWrapper();
            var popups = this.getPopups();
            for (var cnt = this.isMenu ? popups.length + 1 : wrapper.childElementCount; cnt > ulIndex; cnt--) {
                ul = this.isMenu && cnt !== 1 ? select('.e-ul', popups[cnt - 2])
                    : selectAll('.e-menu-parent', wrapper)[cnt - 1];
                if (this.isMenu && ul.classList.contains('e-menu')) {
                    sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    break;
                }
                item = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items = item ? item.items : this.items;
                beforeCloseArgs = { element: ul, parentItem: item, items: items, event: e, cancel: false };
                this.trigger('beforeClose', beforeCloseArgs);
                if (!beforeCloseArgs.cancel) {
                    if (this.isMenu) {
                        popupEle = closest(ul, '.' + POPUP);
                        this.unWireKeyboardEvent(popupEle);
                        this.destroyScrollObj(getInstance(popupEle.children[0], VScroll), popupEle.children[0]);
                        popupObj = getInstance(popupEle, Popup);
                        popupObj.hide();
                        popupObj.destroy();
                        detach(popupEle);
                    }
                    else {
                        this.toggleAnimation(ul, false);
                    }
                    this.navIdx.length = ulIndex ? ulIndex - 1 : ulIndex;
                    closeArgs = { element: ul, parentItem: item, items: items };
                    this.trigger('onClose', closeArgs);
                }
            }
        }
    };
    MenuBase.prototype.destroyScrollObj = function (scrollObj, scrollEle) {
        if (scrollObj) {
            scrollObj.destroy();
            scrollEle.parentElement.appendChild(select('.e-menu-parent', scrollEle));
            detach(scrollEle);
        }
    };
    MenuBase.prototype.getPopups = function () {
        return [].slice.call(document.querySelectorAll('.' + POPUP));
    };
    MenuBase.prototype.isMenuVisible = function () {
        return (this.navIdx.length > 0 || (this.element.classList.contains('e-contextmenu') && isVisible(this.element).valueOf()));
    };
    MenuBase.prototype.canOpen = function (target) {
        var canOpen = true;
        if (this.filter) {
            canOpen = false;
            var filter = this.filter.split(' ');
            for (var i = 0, len = filter.length; i < len; i++) {
                if (closest(target, '.' + filter[i])) {
                    canOpen = true;
                    break;
                }
            }
        }
        return canOpen;
    };
    MenuBase.prototype.openMenu = function (li, item, top, left, e, target) {
        var _this = this;
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        if (e === void 0) { e = null; }
        if (target === void 0) { target = this.targetElement; }
        var ul;
        var popupObj;
        var popupWrapper;
        var eventArgs;
        var wrapper = this.getWrapper();
        if (li) {
            ul = this.createItems(item[this.getField('children', this.navIdx.length - 1)]);
            if (!this.isMenu && Browser.isDevice) {
                wrapper.lastChild.style.display = 'none';
                var data = {
                    text: item[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                var hdata = new MenuItem(this.items[0], null, data, true);
                var hli = this.createItems([hdata]).children[0];
                hli.classList.add(HEADER);
                ul.insertBefore(hli, ul.children[0]);
            }
            if (this.isMenu) {
                popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-menu-popup'
                });
                document.body.appendChild(popupWrapper);
                var isNestedOrVerticalMenu = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                popupObj = new Popup(popupWrapper, {
                    relateTo: li,
                    collision: { X: isNestedOrVerticalMenu || this.enableRtl ? 'none' : 'flip', Y: 'fit' },
                    position: isNestedOrVerticalMenu ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
                    targetType: 'relative',
                    enableRtl: this.enableRtl,
                    content: ul,
                    open: function () {
                        var scrollEle = select('.e-menu-vscroll', popupObj.element);
                        if (scrollEle) {
                            scrollEle.style.height = 'inherit';
                            scrollEle.style.maxHeight = '';
                        }
                        var ul = select('.e-ul', popupObj.element);
                        popupObj.element.style.maxHeight = '';
                        ul.focus();
                        _this.triggerOpen(ul);
                    }
                });
                if (this.cssClass) {
                    addClass([popupWrapper], this.cssClass.split(' '));
                }
                popupObj.hide();
                eventArgs = this.triggerBeforeOpen(li, ul, item, e, 0, 0);
                top = eventArgs.top;
                left = eventArgs.left;
                popupWrapper.style.display = 'block';
                popupWrapper.style.maxHeight = popupWrapper.getBoundingClientRect().height + 'px';
                this.addScrolling(popupWrapper, ul, 'vscroll', popupWrapper.offsetHeight, ul.offsetHeight);
                this.checkScrollOffset(e);
                var collide = void 0;
                if (!left && !top) {
                    popupObj.refreshPosition(li, true);
                    left = parseInt(popupWrapper.style.left, 10);
                    top = parseInt(popupWrapper.style.top, 10);
                    if (this.enableRtl) {
                        left = isNestedOrVerticalMenu ? left - popupWrapper.offsetWidth - li.parentElement.offsetWidth
                            : left - popupWrapper.offsetWidth + li.offsetWidth;
                    }
                    collide = isCollide(popupWrapper, null, left, top);
                    if ((isNestedOrVerticalMenu || this.enableRtl) && (collide.indexOf('right') > -1 || collide.indexOf('left') > -1)) {
                        popupObj.collision.X = 'none';
                        left = this.enableRtl ? calculatePosition(li, isNestedOrVerticalMenu ? 'right' : 'left', 'top').left : left -
                            popupWrapper.offsetWidth - closest(li, '.e-' + this.getModuleName() + '-wrapper').offsetWidth;
                    }
                    collide = isCollide(popupWrapper, null, left, top);
                    if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
                        left = this.callFit(popupWrapper, true, false, top, left).left;
                    }
                    popupWrapper.style.left = left + 'px';
                }
                else {
                    popupObj.collision = { X: 'none', Y: 'none' };
                }
                popupWrapper.style.display = '';
            }
            else {
                ul.style.zIndex = this.element.style.zIndex;
                wrapper.appendChild(ul);
                eventArgs = this.triggerBeforeOpen(li, ul, item, e, top, left);
                top = eventArgs.top;
                left = eventArgs.left;
            }
        }
        else {
            ul = this.element;
            ul.style.zIndex = getZindexPartial(target ? target : this.element).toString();
            eventArgs = this.triggerBeforeOpen(li, ul, item, e, top, left);
            top = eventArgs.top;
            left = eventArgs.left;
        }
        if (eventArgs.cancel) {
            if (this.isMenu) {
                popupObj.destroy();
                detach(popupWrapper);
            }
            this.navIdx.pop();
        }
        else {
            if (this.isMenu) {
                this.wireKeyboardEvent(popupWrapper);
                rippleEffect(popupWrapper, { selector: '.' + ITEM });
                popupWrapper.style.left = left + 'px';
                popupWrapper.style.top = top + 'px';
                var animationOptions = this.animationSettings.effect !== 'None' ? {
                    name: this.animationSettings.effect, duration: this.animationSettings.duration,
                    timingFunction: this.animationSettings.easing
                } : null;
                popupObj.show(animationOptions, li);
            }
            else {
                this.setPosition(li, ul, top, left);
                this.toggleAnimation(ul);
            }
        }
    };
    MenuBase.prototype.callFit = function (element, x, y, top, left) {
        return fit(element, null, { X: x, Y: y }, { top: top, left: left });
    };
    MenuBase.prototype.triggerBeforeOpen = function (li, ul, item, e, top, left) {
        var navIdx = this.getIndex(li ? li.id : null, true);
        var items = li ? item[this.getField('children', this.navIdx.length - 1)] : this.items;
        var eventArgs = {
            element: ul, items: items, parentItem: item, event: e, cancel: false, top: top, left: left
        };
        this.trigger('beforeOpen', eventArgs);
        return eventArgs;
    };
    MenuBase.prototype.checkScrollOffset = function (e) {
        var wrapper = this.getWrapper();
        if (wrapper.children[0].classList.contains('e-menu-hscroll') && this.navIdx.length === 1) {
            var trgt = isNullOrUndefined(e) ? this.element : closest(e.target, '.' + ITEM);
            var offsetEle = select('.e-hscroll-bar', wrapper);
            var offsetLeft = void 0;
            var offsetRight = void 0;
            if (offsetEle.scrollLeft > trgt.offsetLeft) {
                offsetEle.scrollLeft -= (offsetEle.scrollLeft - trgt.offsetLeft);
            }
            offsetLeft = offsetEle.scrollLeft + offsetEle.offsetWidth;
            offsetRight = trgt.offsetLeft + trgt.offsetWidth;
            if (offsetLeft < offsetRight) {
                offsetEle.scrollLeft += (offsetRight - offsetLeft);
            }
        }
    };
    MenuBase.prototype.addScrolling = function (wrapper, ul, scrollType, wrapperOffset, contentOffset) {
        if (this.enableScrolling && wrapperOffset < contentOffset) {
            var scrollEle = this.createElement('div', { className: 'e-menu-' + scrollType });
            wrapper.appendChild(scrollEle);
            scrollEle.appendChild(ul);
            scrollEle.style.maxHeight = wrapper.style.maxHeight;
            var scrollObj = void 0;
            wrapper.style.overflow = 'hidden';
            if (scrollType === 'vscroll') {
                scrollObj = new VScroll({ enableRtl: this.enableRtl }, scrollEle);
                scrollObj.scrollStep = select('.e-' + scrollType + '-bar', wrapper).offsetHeight / 2;
            }
            else {
                scrollObj = new HScroll({ enableRtl: this.enableRtl }, scrollEle);
                scrollObj.scrollStep = select('.e-' + scrollType + '-bar', wrapper).offsetWidth;
            }
        }
    };
    MenuBase.prototype.setPosition = function (li, ul, top, left) {
        var px = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element || (!isNullOrUndefined(left) && !isNullOrUndefined(top))) {
            var collide = isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                var offset = this.callFit(ul, false, true, top, left);
                top = offset.top - 20;
            }
            collide = isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                var offset = this.callFit(ul, true, false, top, left);
                left = offset.left;
            }
        }
        else {
            if (Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            }
            else {
                var x = this.enableRtl ? 'left' : 'right';
                var offset = calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                var collide = isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                var xCollision = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
                if (xCollision) {
                    offset = calculatePosition(li, this.enableRtl ? 'right' : 'left', 'top');
                    left = offset.left;
                }
                if (this.enableRtl || xCollision) {
                    left = (this.enableRtl && xCollision) ? left : left - ul.offsetWidth;
                }
                if (collide.indexOf('bottom') > -1) {
                    offset = this.callFit(ul, false, true, top, left);
                    top = offset.top;
                }
            }
        }
        this.toggleVisiblity(ul, false);
        ul.style.top = top + px;
        ul.style.left = left + px;
    };
    MenuBase.prototype.toggleVisiblity = function (ul, isVisible) {
        if (isVisible === void 0) { isVisible = true; }
        ul.style.visibility = isVisible ? 'hidden' : '';
        ul.style.display = isVisible ? 'block' : 'none';
    };
    MenuBase.prototype.createItems = function (items) {
        var _this = this;
        var level = this.navIdx ? this.navIdx.length : 0;
        var showIcon = this.hasField(items, this.getField('iconCss', level));
        var id = 'id';
        var listBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: this.getFields(level),
            template: this.template,
            itemCreating: function (args) {
                if (!args.curData[args.fields[id]]) {
                    args.curData[args.fields[id]] = getUniqueID('menuitem');
                    _this.clearChanges();
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (_this.isMenu && !args.curData[_this.getField('separator', level)]) {
                    args.curData.htmlAttributes['aria-label'] = args.curData[args.fields.text];
                }
            },
            itemCreated: function (args) {
                if (args.curData[_this.getField('separator', level)]) {
                    args.item.classList.add(SEPARATOR);
                    args.item.removeAttribute('role');
                }
                if (showIcon && !args.curData[args.fields.iconCss]
                    && !args.curData[_this.getField('separator', level)]) {
                    args.item.classList.add('e-blankicon');
                }
                if (args.curData[args.fields.child]
                    && args.curData[args.fields.child].length) {
                    var span = _this.createElement('span', { className: ICONS + ' ' + CARET });
                    args.item.appendChild(span);
                    args.item.setAttribute('aria-haspopup', 'true');
                    args.item.setAttribute('aria-expanded', 'false');
                    if (!_this.isMenu) {
                        args.item.removeAttribute('role');
                    }
                    args.item.classList.add('e-menu-caret-icon');
                }
                if (_this.isMenu && _this.template) {
                    args.item.setAttribute('id', args.curData[args.fields.id].toString());
                    args.item.removeAttribute('data-uid');
                }
                var eventArgs = { item: args.curData, element: args.item };
                _this.trigger('beforeItemRender', eventArgs);
            }
        };
        var ul = ListBase.createList(this.createElement, items, listBaseOptions, !this.template);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    };
    MenuBase.prototype.moverHandler = function (e) {
        var wrapper = this.getWrapper();
        var trgt = e.target;
        var cli = this.getLI(trgt);
        if (cli && closest(cli, '.e-' + this.getModuleName() + '-wrapper')) {
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [wrapper].concat(this.getPopups()) : [wrapper]);
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        }
        if (this.isMenu) {
            if ((trgt.parentElement !== wrapper && !closest(trgt, '.e-' + this.getModuleName() + '-popup')) && !cli) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
                if (this.navIdx.length) {
                    this.closeMenu(null, e);
                }
            }
            wrapper = closest(trgt, '.e-menu-vscroll');
            if (trgt.tagName === 'DIV' && wrapper) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
            }
        }
    };
    MenuBase.prototype.removeLIStateByClass = function (classList, element) {
        var li;
        var _loop_1 = function (i) {
            classList.forEach(function (className) {
                li = select('.' + className, element[i]);
                if (li) {
                    li.classList.remove(className);
                }
            });
        };
        for (var i = 0; i < element.length; i++) {
            _loop_1(i);
        }
    };
    MenuBase.prototype.getField = function (propName, level) {
        if (level === void 0) { level = 0; }
        var fieldName = this.fields[propName];
        return typeof fieldName === 'string' ? fieldName :
            (!fieldName[level] ? fieldName[fieldName.length - 1].toString()
                : fieldName[level].toString());
    };
    MenuBase.prototype.getFields = function (level) {
        if (level === void 0) { level = 0; }
        return {
            id: this.getField('itemId', level),
            iconCss: this.getField('iconCss', level),
            text: this.getField('text', level),
            url: this.getField('url', level),
            child: this.getField('children', level),
            separator: this.getField('separator', level)
        };
    };
    MenuBase.prototype.hasField = function (items, field) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i][field]) {
                return true;
            }
        }
        return false;
    };
    MenuBase.prototype.clickHandler = function (e) {
        if (this.isTapHold) {
            this.isTapHold = false;
        }
        else {
            var wrapper = this.getWrapper();
            var trgt = e.target;
            var cli = this.getLI(trgt);
            var cliWrapper = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            var isInstLI = cli && cliWrapper && (wrapper.firstElementChild.id === cliWrapper.firstElementChild.id || this.isMenu);
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                var navIdx = this.getIndex(cli.id, true);
                var item = this.getItem(navIdx);
                var eventArgs = { element: cli, item: item };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || Browser.isDevice || this.showItemOnClick)) {
                var ul = void 0;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1];
                    this.toggleAnimation(ul);
                    var sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    detach(cli.parentNode);
                    this.navIdx.pop();
                }
                else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        var showSubMenu = true;
                        var cul = cli.parentNode;
                        var cliIdx = this.getIdx(cul, cli);
                        if (this.isMenu || !Browser.isDevice) {
                            var culIdx = this.isMenu ? Array.prototype.indexOf.call([wrapper].concat(this.getPopups()), closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === cliIdx) {
                                showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || showSubMenu)) {
                                var sli = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.closeMenu(culIdx + 1, e);
                            }
                        }
                        if (showSubMenu) {
                            var idx = this.navIdx.concat(cliIdx);
                            var item = this.getItem(idx);
                            if (item[this.getField('children', idx.length - 1)] &&
                                item[this.getField('children', idx.length - 1)].length) {
                                if (e.type === 'mouseover' || (Browser.isDevice && this.isMenu)) {
                                    this.setLISelected(cli);
                                }
                                cli.setAttribute('aria-expanded', 'true');
                                this.navIdx.push(cliIdx);
                                this.openMenu(cli, item, null, null, e);
                            }
                            else {
                                if (e.type !== 'mouseover') {
                                    this.closeMenu(null, e);
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (this.isMenu && trgt.tagName === 'DIV' && this.navIdx.length && closest(trgt, '.e-menu-vscroll')) {
                    var popupEle = closest(trgt, '.' + POPUP);
                    var cIdx = Array.prototype.indexOf.call(this.getPopups(), popupEle) + 1;
                    if (cIdx < this.navIdx.length) {
                        this.closeMenu(cIdx + 1, e);
                        this.removeLIStateByClass([FOCUSED, SELECTED], [popupEle]);
                    }
                }
                else {
                    if (trgt.tagName !== 'UL' || trgt.parentElement !== wrapper) {
                        if (!cli || !cli.querySelector('.' + CARET)) {
                            this.closeMenu(null, e);
                        }
                    }
                }
            }
        }
    };
    MenuBase.prototype.setLISelected = function (li) {
        var sli = this.getLIByClass(li.parentElement, SELECTED);
        if (sli) {
            sli.classList.remove(SELECTED);
        }
        if (!this.isMenu) {
            li.classList.remove(FOCUSED);
        }
        li.classList.add(SELECTED);
    };
    MenuBase.prototype.getLIByClass = function (ul, classname) {
        for (var i = 0, len = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classname)) {
                return ul.children[i];
            }
        }
        return null;
    };
    MenuBase.prototype.getItem = function (navIdx) {
        navIdx = navIdx.slice();
        var idx = navIdx.pop();
        var items = this.getItems(navIdx);
        return items[idx];
    };
    MenuBase.prototype.getItems = function (navIdx) {
        var items = this.items;
        for (var i = 0; i < navIdx.length; i++) {
            items = items[navIdx[i]][this.getField('children', i)];
        }
        return items;
    };
    MenuBase.prototype.getIdx = function (ul, li, skipHdr) {
        if (skipHdr === void 0) { skipHdr = true; }
        var idx = Array.prototype.indexOf.call(ul.children, li);
        if (skipHdr && ul.children[0].classList.contains(HEADER)) {
            idx--;
        }
        return idx;
    };
    MenuBase.prototype.getLI = function (elem) {
        if (elem.tagName === 'LI' && elem.classList.contains('e-menu-item')) {
            return elem;
        }
        return closest(elem, 'li.e-menu-item');
    };
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {MenuBaseModel} newProp
     * @param {MenuBaseModel} oldProp
     * @returns void
     */
    MenuBase.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        var wrapper = this.getWrapper();
        var _loop_2 = function (prop) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrapper], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    wrapper.classList.toggle(RTL);
                    break;
                case 'showItemOnClick':
                    this_1.unWireEvents();
                    this_1.showItemOnClick = newProp.showItemOnClick;
                    this_1.wireEvents();
                    break;
                case 'enableScrolling':
                    if (newProp.enableScrolling) {
                        var ul_1;
                        this_1.element.classList.contains('e-vertical') ?
                            this_1.addScrolling(wrapper, this_1.element, 'vscroll', wrapper.offsetHeight, this_1.element.offsetHeight)
                            : this_1.addScrolling(wrapper, this_1.element, 'hscroll', wrapper.offsetWidth, this_1.element.offsetWidth);
                        this_1.getPopups().forEach(function (wrapper) {
                            ul_1 = select('.e-ul', wrapper);
                            _this.addScrolling(wrapper, ul_1, 'vscroll', wrapper.offsetHeight, ul_1.offsetHeight);
                        });
                    }
                    else {
                        var ul_2 = wrapper.children[0];
                        this_1.element.classList.contains('e-vertical') ? this_1.destroyScrollObj(getInstance(ul_2, VScroll), ul_2)
                            : this_1.destroyScrollObj(getInstance(ul_2, HScroll), ul_2);
                        wrapper.style.overflow = '';
                        wrapper.appendChild(this_1.element);
                        this_1.getPopups().forEach(function (wrapper) {
                            ul_2 = wrapper.children[0];
                            _this.destroyScrollObj(getInstance(ul_2, VScroll), ul_2);
                            wrapper.style.overflow = '';
                        });
                    }
                    break;
                case 'items':
                    var idx = void 0;
                    var navIdx = void 0;
                    var item = void 0;
                    if (!Object.keys(oldProp.items).length) {
                        var ul_3 = this_1.element;
                        ul_3.innerHTML = '';
                        var lis = [].slice.call(this_1.createItems(newProp.items).children);
                        lis.forEach(function (li) {
                            ul_3.appendChild(li);
                        });
                        for (var i = 1, count = wrapper.childElementCount; i < count; i++) {
                            detach(wrapper.lastElementChild);
                        }
                        this_1.navIdx = [];
                    }
                    else {
                        var keys = Object.keys(newProp.items);
                        for (var i = 0; i < keys.length; i++) {
                            navIdx = this_1.getChangedItemIndex(newProp, [], Number(keys[i]));
                            if (navIdx.length <= this_1.getWrapper().children.length) {
                                idx = navIdx.pop();
                                item = this_1.getItems(navIdx);
                                this_1.insertAfter([item[idx]], item[idx].text);
                                this_1.removeItem(item, navIdx, idx);
                            }
                            navIdx.length = 0;
                        }
                    }
                    break;
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_2(prop);
        }
    };
    MenuBase.prototype.getChangedItemIndex = function (newProp, index, idx) {
        index.push(idx);
        var key = Object.keys(newProp.items[idx]).pop();
        if (key === 'items') {
            var item = newProp.items[idx];
            this.getChangedItemIndex(item, index, Number(Object.keys(item.items).pop()));
        }
        else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    };
    MenuBase.prototype.removeItem = function (item, navIdx, idx) {
        item.splice(idx, 1);
        var uls = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            detach(uls[navIdx.length].children[idx]);
        }
    };
    /**
     * Used to unwire the bind events.
     * @private
     */
    MenuBase.prototype.unWireEvents = function () {
        var wrapper = this.getWrapper();
        if (this.target) {
            var target = void 0;
            var touchModule = void 0;
            var targetElems = selectAll(this.target);
            for (var i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (Browser.isIos) {
                    touchModule = getInstance(target, Touch);
                    if (touchModule) {
                        touchModule.destroy();
                    }
                }
                else {
                    EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                }
            }
            for (var _i = 0, _a = getScrollableParent(this.targetElement); _i < _a.length; _i++) {
                var parent_2 = _a[_i];
                EventHandler.remove(parent_2, 'scroll', this.scrollHandler);
            }
        }
        if (!Browser.isDevice) {
            EventHandler.remove(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler);
            EventHandler.remove(document, 'mousedown', this.delegateMouseDownHandler);
        }
        EventHandler.remove(document, 'click', this.delegateClickHandler);
        this.unWireKeyboardEvent(wrapper);
        this.rippleFn();
    };
    MenuBase.prototype.unWireKeyboardEvent = function (element) {
        var keyboardModule = getInstance(element, KeyboardEvents);
        if (keyboardModule) {
            keyboardModule.destroy();
        }
    };
    MenuBase.prototype.toggleAnimation = function (ul, isMenuOpen) {
        var _this = this;
        if (isMenuOpen === void 0) { isMenuOpen = true; }
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        }
        else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: function (options) {
                    options.element.style.display = 'block';
                    options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                },
                end: function (options) {
                    _this.end(options.element, isMenuOpen);
                }
            });
        }
    };
    MenuBase.prototype.triggerOpen = function (ul) {
        var item = this.navIdx.length ? this.getItem(this.navIdx) : null;
        var eventArgs = {
            element: ul, parentItem: item, items: item ? item.items : this.items
        };
        this.trigger('onOpen', eventArgs);
    };
    MenuBase.prototype.end = function (ul, isMenuOpen) {
        if (isMenuOpen) {
            ul.style.display = 'block';
            ul.style.maxHeight = '';
            this.triggerOpen(ul);
            if (ul.querySelector('.' + FOCUSED)) {
                ul.querySelector('.' + FOCUSED).focus();
            }
            else {
                var ele = void 0;
                ele = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1];
                if (ele) {
                    ele.querySelector('.' + SELECTED).focus();
                }
                else {
                    this.element.focus();
                }
            }
        }
        else {
            if (ul === this.element) {
                var fli = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                var sli = this.getLIByClass(this.element, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                ul.style.display = 'none';
            }
            else {
                detach(ul);
            }
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    MenuBase.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Get wrapper element.
     * @returns Element
     * @private
     */
    MenuBase.prototype.getWrapper = function () {
        return closest(this.element, '.e-' + this.getModuleName() + '-wrapper');
    };
    MenuBase.prototype.getIndex = function (data, isUniqueId, items, nIndex, isCallBack, level) {
        if (items === void 0) { items = this.items; }
        if (nIndex === void 0) { nIndex = []; }
        if (isCallBack === void 0) { isCallBack = false; }
        if (level === void 0) { level = 0; }
        var item;
        level = isCallBack ? level + 1 : 0;
        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if ((isUniqueId ? item[this.getField('itemId', level)] : item[this.getField('text', level)]) === data) {
                nIndex.push(i);
                break;
            }
            else if (item[this.getField('children', level)]
                && item[this.getField('children', level)].length) {
                nIndex = this.getIndex(data, isUniqueId, item[this.getField('children', level)], nIndex, true, level);
                if (nIndex[nIndex.length - 1] === -1) {
                    if (i !== len - 1) {
                        nIndex.pop();
                    }
                }
                else {
                    nIndex.unshift(i);
                    break;
                }
            }
            else {
                if (i === len - 1) {
                    nIndex.push(-1);
                }
            }
        }
        return (!isCallBack && nIndex[0] === -1) ? [] : nIndex;
    };
    /**
     * This method is used to enable or disable the menu items in the Menu based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.enableItems = function (items, enable, isUniqueId) {
        if (enable === void 0) { enable = true; }
        var ul;
        var idx;
        var navIdx;
        var disabled = DISABLED;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            idx = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (enable) {
                    if (this.isMenu) {
                        ul.children[idx].classList.remove(disabled);
                        ul.children[idx].removeAttribute('aria-disabled');
                    }
                    else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.remove(disabled);
                        }
                        else {
                            ul.children[idx].classList.remove(disabled);
                        }
                    }
                }
                else {
                    if (this.isMenu) {
                        ul.children[idx].classList.add(disabled);
                        ul.children[idx].setAttribute('aria-disabled', 'true');
                    }
                    else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.add(disabled);
                        }
                        else {
                            ul.children[idx].classList.add(disabled);
                        }
                    }
                }
            }
        }
    };
    /**
     * This method is used to show the menu items in the Menu based on the items text.
     * @param items Text items that needs to be shown.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.showItems = function (items, isUniqueId) {
        this.showHideItems(items, false, isUniqueId);
    };
    /**
     * This method is used to hide the menu items in the Menu based on the items text.
     * @param items Text items that needs to be hidden.
     * @returns void
     */
    MenuBase.prototype.hideItems = function (items, isUniqueId) {
        this.showHideItems(items, true, isUniqueId);
    };
    MenuBase.prototype.showHideItems = function (items, ishide, isUniqueId) {
        var ul;
        var index;
        var navIdx;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            index = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (ishide) {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.add(HIDE);
                    }
                    else {
                        ul.children[index].classList.add(HIDE);
                    }
                }
                else {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.remove(HIDE);
                    }
                    else {
                        ul.children[index].classList.remove(HIDE);
                    }
                }
            }
        }
    };
    /**
     * It is used to remove the menu items from the Menu based on the items text.
     * @param items Text items that needs to be removed.
     * @returns void
     */
    MenuBase.prototype.removeItems = function (items, isUniqueId) {
        var idx;
        var navIdx;
        var iitems;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            this.removeItem(iitems, navIdx, idx);
        }
    };
    /**
     * It is used to insert the menu items after the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item after that the element to be inserted.
     * @returns void
     */
    MenuBase.prototype.insertAfter = function (items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId);
    };
    /**
     * It is used to insert the menu items before the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item before that the element to be inserted.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.insertBefore = function (items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId, false);
    };
    MenuBase.prototype.insertItems = function (items, text, isUniqueId, isAfter) {
        if (isAfter === void 0) { isAfter = true; }
        var li;
        var idx;
        var navIdx;
        var iitems;
        var menuitem;
        var showIcon;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(text, isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0], 'items', items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            var uls = this.isMenu ? [this.getWrapper()].concat(this.getPopups()) : [].slice.call(this.getWrapper().children);
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                showIcon = this.hasField(iitems, this.getField('iconCss', navIdx.length - 1));
                li = this.createItems(iitems).children[idx];
                var ul = this.isMenu ? select('.e-menu-parent', uls[navIdx.length]) : uls[navIdx.length];
                ul.insertBefore(li, ul.children[idx]);
            }
        }
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    MenuBase.prototype.destroy = function () {
        var _this = this;
        var wrapper = this.getWrapper();
        if (wrapper) {
            _super.prototype.destroy.call(this);
            this.unWireEvents();
            if (this.ngElement && !this.isMenu) {
                this.ngElement.style.display = 'block';
            }
            else {
                this.closeMenu();
                this.element.innerHTML = '';
                ['top', 'left', 'display', 'z-index'].forEach(function (key) {
                    _this.element.style.removeProperty(key);
                });
                ['role', 'tabindex', 'class', 'style'].forEach(function (key) {
                    if (key === 'class' && _this.element.classList.contains('e-menu-parent')) {
                        _this.element.classList.remove('e-menu-parent');
                    }
                    if (['class', 'style'].indexOf(key) === -1 || !_this.element.getAttribute(key)) {
                        _this.element.removeAttribute(key);
                    }
                    if (_this.isMenu && key === 'class' && _this.element.classList.contains('e-vertical')) {
                        _this.element.classList.remove('e-vertical');
                    }
                });
                wrapper.parentNode.insertBefore(this.element, wrapper);
            }
            if (this.isMenu && this.ngElement) {
                detach(this.element);
                wrapper.style.display = '';
                wrapper.classList.remove('e-' + this.getModuleName() + '-wrapper');
                wrapper.removeAttribute('data-ripple');
            }
            else {
                detach(wrapper);
            }
        }
    };
    __decorate([
        Event()
    ], MenuBase.prototype, "beforeItemRender", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "beforeOpen", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "onOpen", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "beforeClose", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "onClose", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "select", void 0);
    __decorate([
        Event()
    ], MenuBase.prototype, "created", void 0);
    __decorate([
        Property('')
    ], MenuBase.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], MenuBase.prototype, "showItemOnClick", void 0);
    __decorate([
        Property('')
    ], MenuBase.prototype, "target", void 0);
    __decorate([
        Property('')
    ], MenuBase.prototype, "filter", void 0);
    __decorate([
        Property(null)
    ], MenuBase.prototype, "template", void 0);
    __decorate([
        Property(false)
    ], MenuBase.prototype, "enableScrolling", void 0);
    __decorate([
        Complex({}, FieldSettings)
    ], MenuBase.prototype, "fields", void 0);
    __decorate([
        Collection([], MenuItem)
    ], MenuBase.prototype, "items", void 0);
    __decorate([
        Complex({}, MenuAnimationSettings)
    ], MenuBase.prototype, "animationSettings", void 0);
    MenuBase = __decorate([
        NotifyPropertyChanges
    ], MenuBase);
    return MenuBase;
}(Component));
export { MenuBase };
