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
import { Component, EventHandler, addClass, append, Property, Event, L10n, compile } from '-syncfusion/ej2-base';
import { setStyleAttribute, extend, removeClass, prepend, isNullOrUndefined, detach, getValue } from '-syncfusion/ej2-base';
import { NotifyPropertyChanges, rippleEffect, ChildProperty, Complex } from '-syncfusion/ej2-base';
import { DataManager, Query, DataUtil } from '-syncfusion/ej2-data';
import { ListBase, cssClass as ListBaseClasses } from '-syncfusion/ej2-lists';
var FieldSettings = /** @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "value", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "groupBy", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "htmlAttributes", void 0);
    return FieldSettings;
}(ChildProperty));
export { FieldSettings };
export var dropDownBaseClasses = {
    root: 'e-dropdownbase',
    rtl: 'e-rtl',
    content: 'e-content',
    selected: 'e-active',
    hover: 'e-hover',
    noData: 'e-nodata',
    fixedHead: 'e-fixed-head',
    focus: 'e-item-focus',
    li: ListBaseClasses.li,
    group: ListBaseClasses.group,
    disabled: ListBaseClasses.disabled,
    grouping: 'e-dd-group'
};
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
var DropDownBase = /** @class */ (function (_super) {
    __extends(DropDownBase, _super);
    /**
     * * Constructor for DropDownBase class
     */
    function DropDownBase(options, element) {
        return _super.call(this, options, element) || this;
    }
    ;
    DropDownBase.prototype.getPropObject = function (prop, newProp, oldProp) {
        var newProperty = new Object();
        var oldProperty = new Object();
        // tslint:disable-next-line:no-function-constructor-with-string-args
        var propName = new Function('prop', 'return prop');
        newProperty[propName(prop)] = newProp[propName(prop)];
        oldProperty[propName(prop)] = oldProp[propName(prop)];
        var data = new Object();
        data.newProperty = newProperty;
        data.oldProperty = oldProperty;
        return data;
    };
    DropDownBase.prototype.getValueByText = function (text, ignoreCase, ignoreAccent) {
        var value = null;
        if (!isNullOrUndefined(this.listData)) {
            if (ignoreCase) {
                value = this.checkValueCase(text, true, ignoreAccent);
            }
            else {
                value = this.checkValueCase(text, false, ignoreAccent);
            }
        }
        return value;
    };
    ;
    DropDownBase.prototype.checkValueCase = function (text, ignoreCase, ignoreAccent, isTextByValue) {
        var _this = this;
        var value = null;
        if (isTextByValue) {
            value = text;
        }
        var dataSource = this.listData;
        var fields = this.fields;
        var type = this.typeOfData(dataSource).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
                var item = dataSource_1[_i];
                if (!isNullOrUndefined(item)) {
                    if (ignoreAccent) {
                        value = this.checkingAccent(String(item), text, ignoreCase);
                    }
                    else {
                        if (ignoreCase) {
                            if (this.checkIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase);
                            }
                        }
                        else {
                            if (this.checkNonIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase, isTextByValue);
                            }
                        }
                    }
                }
            }
        }
        else {
            if (ignoreCase) {
                dataSource.filter(function (item) {
                    if (_this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = getValue(fields.value, item);
                    }
                });
            }
            else {
                if (isTextByValue) {
                    dataSource.filter(function (item) {
                        var itemValue = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && itemValue.toString() === value.toString()) {
                            value = getValue(fields.text, item);
                        }
                    });
                }
                else {
                    dataSource.filter(function (item) {
                        if (_this.checkNonIgnoreCase(getValue(fields.text, item), text)) {
                            value = getValue(fields.value, item);
                        }
                    });
                }
            }
        }
        return value;
    };
    DropDownBase.prototype.checkingAccent = function (item, text, ignoreCase) {
        var dataItem = DataUtil.ignoreDiacritics(String(item));
        var textItem = DataUtil.ignoreDiacritics(text.toString());
        var value = null;
        if (ignoreCase) {
            if (this.checkIgnoreCase(dataItem, textItem)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        }
        else {
            if (this.checkNonIgnoreCase(String(item), text)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        }
        return value;
    };
    DropDownBase.prototype.checkIgnoreCase = function (item, text) {
        return String(item).toLowerCase() === text.toString().toLowerCase() ? true : false;
    };
    DropDownBase.prototype.checkNonIgnoreCase = function (item, text) {
        return String(item) === text.toString() ? true : false;
    };
    DropDownBase.prototype.getItemValue = function (dataItem, typedText, ignoreCase, isTextByValue) {
        var value = null;
        var dataSource = this.listData;
        var type = this.typeOfData(dataSource).typeof;
        if (isTextByValue) {
            value = dataItem.toString();
        }
        else {
            if (ignoreCase) {
                value = type === 'string' ? String(dataItem) : this.getFormattedValue(String(dataItem));
            }
            else {
                value = type === 'string' ? typedText : this.getFormattedValue(typedText);
            }
        }
        return value;
    };
    DropDownBase.prototype.l10nUpdate = function (actionFailure) {
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            var template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            var compiledString = void 0;
            this.list.innerHTML = '';
            compiledString = compile(template);
            for (var _i = 0, _a = compiledString({}); _i < _a.length; _i++) {
                var item = _a[_i];
                this.list.appendChild(item);
            }
        }
        else {
            var l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new L10n('dropdowns', l10nLocale, this.locale);
            this.list.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    };
    DropDownBase.prototype.getTextByValue = function (value) {
        var text;
        text = this.checkValueCase(value, false, false, true);
        return text;
    };
    DropDownBase.prototype.getFormattedValue = function (value) {
        if (this.listData && this.listData.length) {
            var item = this.typeOfData(this.listData);
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'number'
                || item.typeof === 'number') {
                return parseInt(value, 10);
            }
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'boolean'
                || item.typeof === 'boolean') {
                return (value === 'true');
            }
        }
        return value;
    };
    /**
     * Sets RTL to dropdownbase wrapper
     */
    DropDownBase.prototype.setEnableRtl = function () {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        this.enableRtl ? addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    };
    ;
    /**
     * Initialize the Component.
     */
    DropDownBase.prototype.initialize = function () {
        this.bindEvent = true;
        if (this.element.tagName === 'UL') {
            var jsonElement = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        }
        else if (this.element.tagName === 'SELECT') {
            var dataSource = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) {
                this.renderItemsBySelect();
            }
        }
        else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    };
    ;
    /**
     * Get the properties to be maintained in persisted state.
     */
    DropDownBase.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    ;
    /**
     * Sets the enabled state to DropDownBase.
     */
    DropDownBase.prototype.setEnabled = function () {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
    };
    ;
    DropDownBase.prototype.renderItemsBySelect = function () {
        var element = this.element;
        var fields = { value: 'value', text: 'text' };
        var jsonElement = [];
        var group = element.querySelectorAll('select>optgroup');
        var option = element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                var optionGroup = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                var child = item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            var items = element.querySelectorAll('select>option');
        }
        this.fields.text = fields.text;
        this.fields.value = fields.value;
        this.resetList(jsonElement, fields);
    };
    DropDownBase.prototype.getJSONfromOption = function (items, options, fields) {
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            var json = {};
            json[fields.text] = option.innerText;
            json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    };
    /**
     * Execute before render the list items
     * @private
     */
    DropDownBase.prototype.preRender = function () {
        // there is no event handler
        this.scrollTimer = -1;
        this.enableRtlElements = [];
        this.isRequested = false;
        this.isDataFetched = false;
    };
    /**
     * Creates the list items of DropDownBase component.
     */
    DropDownBase.prototype.setListData = function (dataSource, fields, query) {
        var _this = this;
        fields = fields ? fields : this.fields;
        var ulElement;
        this.isActive = true;
        var eventArgs = { cancel: false, data: dataSource, query: query };
        this.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.showSpinner();
        if (dataSource instanceof DataManager) {
            this.isRequested = true;
            if (this.isDataFetched) {
                this.emptyDataRequest(fields);
                return;
            }
            eventArgs.data.executeQuery(this.getQuery(eventArgs.query)).then(function (e) {
                _this.trigger('actionComplete', e);
                if (e.cancel) {
                    return;
                }
                var listItems = e.result;
                if (listItems.length === 0) {
                    _this.isDataFetched = true;
                }
                ulElement = _this.renderItems(listItems, fields);
                _this.onActionComplete(ulElement, listItems, e);
                _this.isRequested = false;
                _this.bindChildItems(listItems, ulElement, fields, e);
            }).catch(function (e) {
                _this.isRequested = false;
                _this.onActionFailure(e);
                _this.hideSpinner();
            });
        }
        else {
            var dataManager = new DataManager(eventArgs.data);
            var listItems = (this.getQuery(eventArgs.query)).executeLocal(dataManager);
            var localDataArgs = { cancel: false, result: listItems };
            this.trigger('actionComplete', localDataArgs);
            if (localDataArgs.cancel) {
                return;
            }
            ulElement = this.renderItems(localDataArgs.result, fields);
            this.onActionComplete(ulElement, localDataArgs.result);
            this.bindChildItems(localDataArgs.result, ulElement, fields);
        }
    };
    DropDownBase.prototype.bindChildItems = function (listItems, ulElement, fields, e) {
        var _this = this;
        if (listItems.length >= 100 && this.getModuleName() === 'autocomplete') {
            setTimeout(function () {
                var childNode = _this.remainingItems(_this.sortedData, fields);
                append(childNode, ulElement);
                _this.liCollections = _this.list.querySelectorAll('.' + dropDownBaseClasses.li);
                _this.updateListValues();
                _this.raiseDataBound(listItems, e);
            }, 0);
        }
        else {
            this.raiseDataBound(listItems, e);
        }
    };
    DropDownBase.prototype.updateListValues = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.raiseDataBound = function (listItems, e) {
        this.hideSpinner();
        this.trigger('dataBound', { items: listItems, e: e });
    };
    DropDownBase.prototype.remainingItems = function (dataSource, fields) {
        var spliceData = new DataManager(dataSource).executeLocal(new Query().skip(100));
        if (this.itemTemplate) {
            var listElements = this.templateListItem(spliceData, fields);
            return [].slice.call(listElements.childNodes);
        }
        var type = this.typeOfData(spliceData).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return ListBase.createListItemFromArray(this.createElement, spliceData, true, this.listOption(spliceData, fields));
        }
        return ListBase.createListItemFromJson(this.createElement, spliceData, this.listOption(spliceData, fields), 1, true);
    };
    DropDownBase.prototype.emptyDataRequest = function (fields) {
        var listItems = [];
        this.onActionComplete(this.renderItems(listItems, fields), listItems);
        this.isRequested = false;
        this.hideSpinner();
    };
    DropDownBase.prototype.showSpinner = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.hideSpinner = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.onActionFailure = function (e) {
        this.liCollections = [];
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.list], dropDownBaseClasses.noData);
    };
    DropDownBase.prototype.onActionComplete = function (ulElement, list, e) {
        this.listData = list;
        this.list.innerHTML = '';
        this.list.appendChild(ulElement);
        this.liCollections = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    };
    DropDownBase.prototype.postRender = function (listElement, list, bindEvent) {
        var focusItem = listElement.querySelector('.' + dropDownBaseClasses.li);
        var selectedItem = listElement.querySelector('.' + dropDownBaseClasses.selected);
        if (focusItem && !selectedItem) {
            focusItem.classList.add(dropDownBaseClasses.focus);
        }
        if (list.length <= 0) {
            this.l10nUpdate();
            addClass([listElement], dropDownBaseClasses.noData);
        }
        else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
        if (this.groupTemplate) {
            this.renderGroupTemplate(listElement);
        }
    };
    /**
     * Get the query to do the data operation before list item generation.
     */
    DropDownBase.prototype.getQuery = function (query) {
        return query ? query : this.query ? this.query : new Query();
    };
    /**
     * To render the template content for group header element.
     */
    DropDownBase.prototype.renderGroupTemplate = function (listEle) {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            var dataSource = this.dataSource;
            var headerItems = listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            var tempHeaders = ListBase.renderGroupTemplate(this.groupTemplate, dataSource, this.fields.properties, headerItems);
        }
    };
    /**
     * To create the ul li list items
     */
    DropDownBase.prototype.createListItems = function (dataSource, fields) {
        if (dataSource && fields.groupBy || this.element.querySelector('optgroup')) {
            if (fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            addClass([this.list], dropDownBaseClasses.grouping);
        }
        else {
            dataSource = this.getSortedDataSource(dataSource);
        }
        var options = this.listOption(dataSource, fields);
        var spliceData = (dataSource.length > 100) ?
            new DataManager(dataSource).executeLocal(new Query().take(100))
            : dataSource;
        this.sortedData = dataSource;
        return ListBase.createList(this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true);
    };
    ;
    DropDownBase.prototype.listOption = function (dataSource, fields) {
        var iconCss = isNullOrUndefined(fields.iconCss) ? false : true;
        var fieldValues = !isNullOrUndefined(fields.properties) ?
            fields.properties : fields;
        var options = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        return extend({}, options, fields, true);
    };
    ;
    DropDownBase.prototype.setFloatingHeader = function (e) {
        if (isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = this.createElement('div', { className: dropDownBaseClasses.fixedHead });
            if (!this.list.querySelector('li').classList.contains(dropDownBaseClasses.group)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        if (!isNullOrUndefined(this.fixedHeaderElement) && this.fixedHeaderElement.style.zIndex === '0') {
            this.setFixedHeader();
        }
        this.scrollStop(e);
    };
    DropDownBase.prototype.scrollStop = function (e) {
        var target = e.target;
        var liHeight = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        var topIndex = Math.round(target.scrollTop / liHeight);
        var liCollections = this.ulElement.querySelectorAll('li');
        for (var i = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
                var currentLi = liCollections[i];
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.top = e.target.scrollTop + 'px';
                this.fixedHeaderElement.style.display = 'block';
                break;
            }
            else {
                this.fixedHeaderElement.style.display = 'none';
                this.fixedHeaderElement.style.top = 'none';
            }
        }
    };
    /**
     * To render the list items
     */
    DropDownBase.prototype.renderItems = function (listData, fields) {
        var ulElement;
        if (this.itemTemplate && listData) {
            var dataSource = listData;
            if (dataSource && fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            else {
                dataSource = this.getSortedDataSource(dataSource);
            }
            this.sortedData = dataSource;
            var spliceData = (dataSource.length > 100) ?
                new DataManager(dataSource).executeLocal(new Query().take(100))
                : dataSource;
            ulElement = this.templateListItem((this.getModuleName() === 'autocomplete') ? spliceData : dataSource, fields);
        }
        else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    };
    ;
    DropDownBase.prototype.templateListItem = function (dataSource, fields) {
        var option = this.listOption(dataSource, fields);
        return ListBase.renderContentTemplate(this.createElement, this.itemTemplate, dataSource, fields.properties, option);
    };
    DropDownBase.prototype.typeOfData = function (items) {
        var item = { typeof: null, item: null };
        for (var i = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                return item = { typeof: typeof items[i], item: items[i] };
            }
        }
        return item;
    };
    DropDownBase.prototype.setFixedHeader = function () {
        this.list.parentElement.style.display = 'block';
        var liWidth = this.liCollections[0].offsetWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        var firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    };
    DropDownBase.prototype.getSortedDataSource = function (dataSource) {
        if (dataSource && this.sortOrder !== 'None') {
            var textField = this.fields.text ? this.fields.text : 'text';
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    };
    /**
     * Return the index of item which matched with given value in data source
     */
    DropDownBase.prototype.getIndexByValue = function (value) {
        var index;
        var listItems = this.getItems();
        for (var i = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    };
    ;
    /**
     * To dispatch the event manually
     */
    DropDownBase.prototype.dispatchEvent = function (element, type) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    };
    /**
     * To set the current fields
     */
    DropDownBase.prototype.setFields = function () {
        if (this.fields.value && !this.fields.text) {
            this.fields.text = this.fields.value;
        }
        else if (!this.fields.value && this.fields.text) {
            this.fields.value = this.fields.text;
        }
        else if (!this.fields.value && !this.fields.text) {
            this.fields.value = this.fields.text = 'text';
        }
    };
    /**
     * reset the items list.
     */
    DropDownBase.prototype.resetList = function (dataSource, fields, query) {
        if (this.list) {
            this.setListData(dataSource, fields, query);
        }
    };
    DropDownBase.prototype.updateSelection = function () {
        // This is for after added the item, need to update the selected index values.
    };
    DropDownBase.prototype.renderList = function () {
        // This is for render the list items.
        this.render();
    };
    DropDownBase.prototype.updateDataSource = function (props) {
        this.resetList(this.dataSource);
    };
    DropDownBase.prototype.setUpdateInitial = function (props, newProp) {
        this.isDataFetched = false;
        var updateData = {};
        for (var j = 0; props.length > j; j++) {
            if (newProp[props[j]] && props[j] === 'fields') {
                this.setFields();
            }
            else if (newProp[props[j]]) {
                updateData[props[j]] = newProp[props[j]];
            }
        }
        if (Object.keys(updateData).length > 0) {
            if (Object.keys(updateData).indexOf('dataSource') === -1) {
                updateData.dataSource = this.dataSource;
            }
            this.updateDataSource(updateData);
        }
    };
    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     * @private
     */
    DropDownBase.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'dropdownbase') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        this.setUpdateInitial(['sortOrder', 'itemTemplate'], newProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'query':
                case 'sortOrder':
                case 'dataSource':
                case 'itemTemplate':
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'groupTemplate':
                    this.renderGroupTemplate(this.list);
                    if (this.ulElement && this.fixedHeaderElement) {
                        var firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
                        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
                    }
                    break;
                case 'locale':
                    if (this.list && (!isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) {
                        this.l10nUpdate();
                    }
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
            }
        }
    };
    ;
    /**
     * Build and render the component
     * @private
     */
    DropDownBase.prototype.render = function (isEmptyData) {
        this.list = this.createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        var rippleModel = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        var group = this.element.querySelector('select>optgroup');
        if (this.fields.groupBy || !isNullOrUndefined(group)) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            var wrapperElement = this.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    };
    ;
    /**
     * Return the module name of this component.
     * @private
     */
    DropDownBase.prototype.getModuleName = function () {
        return 'dropdownbase';
    };
    ;
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    DropDownBase.prototype.getItems = function () {
        return this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    };
    ;
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     */
    DropDownBase.prototype.addItem = function (items, itemIndex) {
        if (!this.list || this.list.textContent === this.noRecordsTemplate) {
            this.renderList();
        }
        var itemsCount = this.getItems().length;
        var selectedItemValue = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]);
        var index;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        var fields = this.fields;
        if (items && fields.groupBy) {
            items = ListBase.groupDataSource(items, fields.properties);
        }
        var liCollections = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isHeader = item.isHeader;
            var li = this.createElement('li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });
            if (isHeader) {
                li.innerText = getValue(fields.text, item);
            }
            if (this.itemTemplate && !isHeader) {
                var compiledString = compile(this.itemTemplate);
                append(compiledString(item), li);
            }
            else if (!isHeader) {
                li.appendChild(document.createTextNode(getValue(fields.text, item)));
            }
            li.setAttribute('data-value', getValue(fields.value, item));
            li.setAttribute('role', 'option');
            this.notify('addItem', { module: 'CheckBoxSelection', item: li });
            liCollections.push(li);
            this.listData.push(item);
            this.updateActionCompleteData(li, item);
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.appendChild(this.ulElement);
            append(liCollections, this.ulElement);
        }
        else {
            for (var i = 0; i < items.length; i++) {
                if (this.liCollections[index]) {
                    this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                }
                else {
                    this.ulElement.appendChild(liCollections[i]);
                }
                var tempLi = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
            }
        }
        if (selectedItemValue || itemIndex === 0) {
            this.updateSelection();
        }
    };
    DropDownBase.prototype.validationAttribute = function (target, hidden) {
        var name = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        hidden.setAttribute('name', name);
        target.removeAttribute('name');
        var attributes = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes.length; i++) {
            if (!target.getAttribute(attributes[i])) {
                continue;
            }
            var attr = target.getAttribute(attributes[i]);
            hidden.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    };
    DropDownBase.prototype.setZIndex = function () {
        // this is for component wise
    };
    DropDownBase.prototype.updateActionCompleteData = function (li, item) {
        // this is for ComboBox custom value
    };
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     */
    DropDownBase.prototype.getDataByValue = function (value) {
        if (!isNullOrUndefined(this.listData)) {
            var type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!isNullOrUndefined(item) && item === value) {
                        return item;
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.listData; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownBase.prototype.destroy = function () {
        if (document.body.contains(this.list)) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            detach(this.list);
        }
        _super.prototype.destroy.call(this);
    };
    ;
    __decorate([
        Complex({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], DropDownBase.prototype, "fields", void 0);
    __decorate([
        Property(false)
    ], DropDownBase.prototype, "enableRtl", void 0);
    __decorate([
        Property(false)
    ], DropDownBase.prototype, "enablePersistence", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "itemTemplate", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "groupTemplate", void 0);
    __decorate([
        Property('No Records Found')
    ], DropDownBase.prototype, "noRecordsTemplate", void 0);
    __decorate([
        Property('The Request Failed')
    ], DropDownBase.prototype, "actionFailureTemplate", void 0);
    __decorate([
        Property('None')
    ], DropDownBase.prototype, "sortOrder", void 0);
    __decorate([
        Property(true)
    ], DropDownBase.prototype, "enabled", void 0);
    __decorate([
        Property([])
    ], DropDownBase.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "query", void 0);
    __decorate([
        Property(1000)
    ], DropDownBase.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], DropDownBase.prototype, "ignoreAccent", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "select", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "created", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "destroyed", void 0);
    DropDownBase = __decorate([
        NotifyPropertyChanges
    ], DropDownBase);
    return DropDownBase;
}(Component));
export { DropDownBase };
