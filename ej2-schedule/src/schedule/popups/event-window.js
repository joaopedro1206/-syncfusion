import { createElement, isNullOrUndefined, addClass, remove, EventHandler, extend, append } from '-syncfusion/ej2-base';
import { cldrData, removeClass, getValue, getDefaultDateObject, closest } from '-syncfusion/ej2-base';
import { DataManager, Query } from '-syncfusion/ej2-data';
import { CheckBox, Button } from '-syncfusion/ej2-buttons';
import { Dialog } from '-syncfusion/ej2-popups';
import { DropDownList, MultiSelect } from '-syncfusion/ej2-dropdowns';
import { Input } from '-syncfusion/ej2-inputs';
import { DateTimePicker } from '-syncfusion/ej2-calendars';
import { Timezone, timezoneData } from '../timezone/timezone';
import { FieldValidator } from './form-validator';
import { RecurrenceEditor } from '../../recurrence-editor/recurrence-editor';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';
import * as util from '../base/util';
var EVENT_FIELD = 'e-field';
var REPEAT_CONTAINER_CLASS = 'e-recurrence-container';
var REPEAT_BUTTON_ICON_CLASS = 'e-recurrence-edit';
var REPEAT_BUTTON_CLASS = 'e-recurrence-edit-button';
var REPEAT_DIALOG_CLASS = 'e-recurrence-dialog';
var HIDE_STYLE_CLASS = 'e-hide';
/**
 * Event editor window
 */
var EventWindow = /** @class */ (function () {
    /**
     * Constructor for event window
     */
    function EventWindow(parent) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fields = this.parent.eventFields;
        this.fieldValidator = new FieldValidator();
        var timezone = new Timezone();
        this.localTimezoneName = timezone.getLocalTimezoneName();
        this.renderEventWindow();
    }
    EventWindow.prototype.renderEventWindow = function () {
        var dialogContent = this.getEventWindowContent();
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        if (this.parent.isAdaptive) {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                content: dialogContent,
                cssClass: cls.EVENT_WINDOW_DIALOG_CLASS + ' ' + cls.DEVICE_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                    this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>',
                height: '100%',
                isModal: true,
                showCloseIcon: false,
                target: document.body,
                visible: false,
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        }
        else {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                buttons: [{
                        buttonModel: { content: this.l10n.getConstant('deleteButton'), cssClass: cls.EVENT_WINDOW_DELETE_BUTTON_CLASS },
                        click: this.eventDelete.bind(this)
                    }, {
                        buttonModel: {
                            content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary ' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS,
                            isPrimary: true
                        },
                        click: this.eventSave.bind(this)
                    }, {
                        buttonModel: { cssClass: cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS, content: this.l10n.getConstant('cancelButton') },
                        click: this.dialogClose.bind(this)
                    }],
                content: dialogContent,
                cssClass: cls.EVENT_WINDOW_DIALOG_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>',
                isModal: true,
                showCloseIcon: true,
                target: document.body,
                visible: false,
                width: '500px',
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        }
        this.dialogObject.appendTo(this.element);
        addClass([this.element.parentElement], cls.EVENT_WINDOW_DIALOG_CLASS + '-container');
        if (this.parent.isAdaptive) {
            EventHandler.add(this.element.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS), 'click', this.dialogClose, this);
            EventHandler.add(this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_ICON_CLASS), 'click', this.eventSave, this);
        }
        this.applyFormValidation();
    };
    EventWindow.prototype.refresh = function () {
        this.destroy();
        this.renderEventWindow();
    };
    EventWindow.prototype.refreshRecurrenceEditor = function () {
        if (this.recurrenceEditor) {
            var recurrenceEditor = this.recurrenceEditor.element;
            this.recurrenceEditor.destroy();
            this.createRecurrenceEditor(recurrenceEditor);
        }
    };
    EventWindow.prototype.openEditor = function (data, type, isEventData, repeatType) {
        this.parent.removeNewEventElement();
        this.parent.quickPopup.quickPopupHide(true);
        if (this.parent.calendarMode === 'Islamic') {
            addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
        }
        else if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            removeClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
        }
        switch (type) {
            case 'Add':
                this.cellClickAction = !isEventData;
                this.parent.activeCellsData = data;
                this.onCellDetailsUpdate(data, repeatType);
                break;
            case 'Save':
            case 'EditOccurrence':
            case 'EditSeries':
                if (type === 'EditOccurrence' && !this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
                    addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
                }
                this.cellClickAction = false;
                this.onEventDetailsUpdate(data);
                break;
        }
    };
    EventWindow.prototype.setDialogContent = function () {
        this.dialogObject.content = this.getEventWindowContent();
        this.dialogObject.dataBind();
    };
    EventWindow.prototype.onBeforeOpen = function (args) {
        var eventProp = {
            type: 'Editor',
            data: this.eventData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element)
        };
        if (this.cellClickAction) {
            eventProp.duration = this.getSlotDuration();
        }
        this.parent.trigger(event.popupOpen, eventProp);
        args.cancel = eventProp.cancel;
        this.duration = this.cellClickAction ? eventProp.duration : null;
        this.refreshDateTimePicker(this.duration);
        if (this.cellClickAction && eventProp.duration !== this.getSlotDuration() && isNullOrUndefined(this.parent.editorTemplate)) {
            var startObj = this.getInstance(cls.EVENT_WINDOW_START_CLASS);
            var endObj = this.getInstance(cls.EVENT_WINDOW_END_CLASS);
            endObj.value = new Date(startObj.value.getTime() + (util.MS_PER_MINUTE * eventProp.duration));
            endObj.dataBind();
        }
    };
    EventWindow.prototype.onBeforeClose = function () {
        this.parent.eventBase.focusElement();
    };
    EventWindow.prototype.getEventWindowContent = function () {
        var container = createElement('div', { className: cls.FORM_CONTAINER_CLASS });
        var form = createElement('form', {
            id: this.parent.element.id + 'EditForm',
            className: cls.FORM_CLASS,
            attrs: { onsubmit: 'return false;' }
        });
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            append(this.parent.getEditorTemplate()(), form);
        }
        else {
            var content = this.getDefaultEventWindowContent();
            form.appendChild(content);
        }
        container.appendChild(form);
        return container;
    };
    EventWindow.prototype.getDefaultEventWindowContent = function () {
        var parentDiv = this.createDivElement(cls.EVENT_WINDOW_DIALOG_PARENT_CLASS);
        var titleLocationDiv = this.createDivElement(cls.EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS);
        var titleDiv = this.renderTextBox(cls.SUBJECT_CLASS);
        var locationDiv = this.renderTextBox(cls.LOCATION_CLASS);
        titleLocationDiv.appendChild(titleDiv);
        titleLocationDiv.appendChild(locationDiv);
        var startEndDateTimeDiv = this.createDivElement(cls.EVENT_WINDOW_START_END_DIV_CLASS);
        var startDateTimeDiv = this.renderDateTimePicker(cls.EVENT_WINDOW_START_CLASS, this.onTimeChange.bind(this));
        var endDateTimeDiv = this.renderDateTimePicker(cls.EVENT_WINDOW_END_CLASS);
        startEndDateTimeDiv.appendChild(startDateTimeDiv);
        startEndDateTimeDiv.appendChild(endDateTimeDiv);
        var timezoneParentDiv = this.createDivElement(cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        var startTimezoneDiv = this.renderDropDown(cls.EVENT_WINDOW_START_TZ_CLASS);
        var endTimezoneDiv = this.renderDropDown(cls.EVENT_WINDOW_END_TZ_CLASS);
        timezoneParentDiv.appendChild(startTimezoneDiv);
        timezoneParentDiv.appendChild(endTimezoneDiv);
        var allDayTimezoneDiv = this.createDivElement(cls.EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS);
        var allDayDiv = this.renderCheckBox(cls.EVENT_WINDOW_ALL_DAY_CLASS);
        var timezoneDiv = this.renderCheckBox(cls.TIME_ZONE_CLASS);
        allDayTimezoneDiv.appendChild(allDayDiv);
        allDayTimezoneDiv.appendChild(timezoneDiv);
        var repeatParentDiv = this.createDivElement(cls.EVENT_WINDOW_REPEAT_DIV_CLASS);
        var repeatDiv = this.renderCheckBox(cls.EVENT_WINDOW_REPEAT_CLASS);
        var repeatEditConainer = createElement('span', { className: REPEAT_CONTAINER_CLASS });
        var button = createElement('button', {
            className: REPEAT_BUTTON_CLASS,
            attrs: { type: 'button', 'title': this.l10n.getConstant('editRecurrence') }
        });
        this.buttonObj = new Button({ iconCss: REPEAT_BUTTON_ICON_CLASS + ' e-icons', cssClass: 'e-medium ' + this.parent.cssClass });
        repeatEditConainer.appendChild(button);
        this.buttonObj.appendTo(button);
        repeatDiv.appendChild(repeatEditConainer);
        repeatParentDiv.appendChild(repeatDiv);
        var description = this.createDivElement(cls.DESCRIPTION_CLASS + '-row');
        var descriptionDiv = this.renderTextBox(cls.DESCRIPTION_CLASS);
        description.appendChild(descriptionDiv);
        parentDiv.appendChild(titleLocationDiv);
        parentDiv.appendChild(startEndDateTimeDiv);
        parentDiv.appendChild(allDayTimezoneDiv);
        parentDiv.appendChild(timezoneParentDiv);
        parentDiv.appendChild(repeatParentDiv);
        if (!this.parent.isAdaptive) {
            this.createRecurrenceEditor(parentDiv);
        }
        else {
            EventHandler.add(button, 'click', this.loadRecurrenceEditor, this);
        }
        if (this.parent.resources.length > 0) {
            var resourceParentDiv = this.createDivElement(cls.EVENT_WINDOW_RESOURCES_DIV_CLASS);
            for (var i = 0; i < this.parent.resourceBase.resourceCollection.length; i++) {
                resourceParentDiv.appendChild(this.renderResourceDetails(i));
            }
            parentDiv.appendChild(resourceParentDiv);
        }
        parentDiv.appendChild(description);
        var submit = createElement('button', { attrs: { type: 'hidden', title: 'submit', style: 'display:none' } });
        parentDiv.appendChild(submit);
        return parentDiv;
    };
    EventWindow.prototype.createRecurrenceEditor = function (parentDiv) {
        var recurrenceEditor = this.createDivElement();
        parentDiv.appendChild(recurrenceEditor);
        this.recurrenceEditor = this.renderRecurrenceEditor();
        this.recurrenceEditor.appendTo(recurrenceEditor);
    };
    EventWindow.prototype.createDivElement = function (className) {
        return createElement('div', { className: className });
    };
    EventWindow.prototype.createInputElement = function (className, fieldName, type) {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', name: fieldName, value: '',
                title: ((this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))) === '') ?
                    fieldName : this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))
            }
        });
    };
    EventWindow.prototype.getSlotDuration = function () {
        return this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
    };
    EventWindow.prototype.renderDateTimePicker = function (value, changeEvent) {
        var dateTimeDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var dateTimeInput = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        dateTimeDiv.appendChild(dateTimeInput);
        var dateTimePicker = new DateTimePicker({
            change: changeEvent,
            calendarMode: this.parent.calendarMode,
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            floatLabelType: 'Always',
            format: (isNullOrUndefined(this.parent.dateFormat) ?
                this.getFormat('dateFormats') : this.parent.dateFormat) + ' ' + this.getFormat('timeFormats'),
            placeholder: this.getFieldLabel(value),
            step: this.getSlotDuration(),
            value: new Date(), width: '100%'
        });
        dateTimePicker.appendTo(dateTimeInput);
        return dateTimeDiv;
    };
    EventWindow.prototype.refreshDateTimePicker = function (duration) {
        var _this = this;
        var startEndElement = [].slice.call(this.element.querySelectorAll('.' + cls.EVENT_WINDOW_START_CLASS + ',.' +
            cls.EVENT_WINDOW_END_CLASS));
        startEndElement.forEach(function (element) {
            var instance = element.ej2_instances[0];
            instance.step = duration || _this.getSlotDuration();
            instance.dataBind();
        });
    };
    EventWindow.prototype.onTimeChange = function () {
        var startObj = this.getInstance(cls.EVENT_WINDOW_START_CLASS);
        if (startObj.element.parentElement.classList.contains('e-input-focus')) {
            var endObj = this.getInstance(cls.EVENT_WINDOW_END_CLASS);
            var duration = 0;
            if (this.cellClickAction) {
                duration = util.MS_PER_MINUTE * this.duration;
            }
            else {
                duration = this.eventData[this.fields.endTime].getTime() - this.eventData[this.fields.startTime].getTime();
            }
            endObj.value = new Date(startObj.value.getTime() + duration);
            endObj.dataBind();
        }
    };
    EventWindow.prototype.renderResourceDetails = function (index) {
        var resourceData = this.parent.resourceBase.resourceCollection[index];
        var fieldName = resourceData.field;
        var value = 'e-' + fieldName;
        var labelValue = resourceData.title;
        var resourceDiv = this.createDivElement(value + '-container' + ' ' + 'e-resources');
        var resourceInput = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        resourceDiv.appendChild(resourceInput);
        var resourceTemplate = '<div class="e-resource-template"><div class="e-resource-color" style="background-color:${' +
            resourceData.colorField + '}"></div><div class="e-resource-text">${' + resourceData.textField + '}</div></div>';
        if (resourceData.allowMultiple) {
            var listObj = new MultiSelect({
                cssClass: this.parent.cssClass || '',
                dataSource: resourceData.dataSource,
                change: this.onMultiselectResourceChange.bind(this),
                itemTemplate: resourceTemplate,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                mode: 'Box'
            });
            listObj.appendTo(resourceInput);
        }
        else {
            var drowDownList = new DropDownList({
                cssClass: this.parent.cssClass || '',
                change: this.onDropdownResourceChange.bind(this),
                dataSource: resourceData.dataSource,
                enableRtl: this.parent.enableRtl,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                itemTemplate: resourceTemplate
            });
            drowDownList.appendTo(resourceInput);
        }
        return resourceDiv;
    };
    EventWindow.prototype.renderDropDown = function (value) {
        var fieldName = this.getFieldName(value);
        var timezoneDiv = this.createDivElement(value + '-container');
        var timezoneInput = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        timezoneDiv.appendChild(timezoneInput);
        var drowDownList = new DropDownList({
            allowFiltering: true,
            change: this.onTimezoneChange.bind(this),
            cssClass: this.parent.cssClass || '',
            dataSource: timezoneData,
            enableRtl: this.parent.enableRtl,
            fields: { text: 'Text', value: 'Value' },
            filterBarPlaceholder: 'Search Timezone',
            filtering: function (e) {
                var query = new Query();
                query = (e.text !== '') ? query.where('Text', 'contains', e.text, true) : query;
                e.updateData(timezoneData, query);
            },
            htmlAttributes: { 'title': this.getFieldLabel(value), 'name': fieldName },
            floatLabelType: 'Always',
            placeholder: this.getFieldLabel(value),
            popupHeight: '230px',
        });
        drowDownList.appendTo(timezoneInput);
        return timezoneDiv;
    };
    EventWindow.prototype.onMultiselectResourceChange = function (args) {
        if (!args.value || !this.parent.activeViewOptions.group.byGroupID || this.parent.resources.length <= 1) {
            return;
        }
        var resourceCollection = this.parent.resourceBase.resourceCollection;
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        for (var i = 0; i < resourceCollection.length; i++) {
            if (resourceCollection[i].field === fieldName && i < resourceCollection.length - 1) {
                var resObject = this.createInstance(i);
                var datasource = [];
                for (var j = 0; j < args.value.length; j++) {
                    var resourceData = resourceCollection[i + 1].dataSource;
                    var query = new Query().where(resourceCollection[i + 1].groupIDField, 'equal', args.value[j]);
                    var filter = new DataManager({ json: resourceData }).executeLocal(query)[0];
                    var groupId = filter[resourceCollection[i + 1].idField];
                    var filterRes = this.filterDatasource(i, groupId);
                    datasource = datasource.concat(filterRes);
                }
                resObject.dataSource = datasource;
                resObject.dataBind();
            }
        }
    };
    EventWindow.prototype.createInstance = function (index) {
        var resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        var resObject = this.element.querySelector('.e-' + resourceData.field).
            ej2_instances[0];
        return resObject;
    };
    EventWindow.prototype.onDropdownResourceChange = function (args) {
        if (!args.value || this.parent.resources.length <= 1 || !this.parent.activeViewOptions.group.byGroupID) {
            return;
        }
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        var resourceCollection = this.parent.resourceBase.resourceCollection;
        for (var i = 0; i < resourceCollection.length; i++) {
            if ((i < resourceCollection.length - 1) && resourceCollection[i].field === fieldName) {
                var resObj = this.createInstance(i);
                var groupId = args.itemData[resourceCollection[i].idField];
                resObj.dataSource = this.filterDatasource(i, groupId);
                resObj.dataBind();
                var resValue = resObj.dataSource[0][resourceCollection[i + 1].idField];
                resObj.value = (resourceCollection[i + 1].allowMultiple) ? [resValue] : resValue;
                resObj.dataBind();
            }
        }
    };
    EventWindow.prototype.filterDatasource = function (index, groupId) {
        var resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        var query = new Query().where(resourceData.groupIDField, 'equal', groupId);
        var filter = new DataManager({ json: resourceData.dataSource }).executeLocal(query);
        return filter;
    };
    EventWindow.prototype.onTimezoneChange = function (args) {
        var fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        if (fieldName === this.parent.eventFields.startTimezone) {
            var startTimezoneObj = this.getInstance(cls.EVENT_WINDOW_START_TZ_CLASS);
            var endTimezoneObj = this.getInstance(cls.EVENT_WINDOW_END_TZ_CLASS);
            endTimezoneObj.value = startTimezoneObj.value;
            endTimezoneObj.dataBind();
        }
    };
    EventWindow.prototype.renderCheckBox = function (value) {
        var checkBoxDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var checkBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        checkBoxDiv.appendChild(checkBoxInput);
        var checkBox = new CheckBox({
            change: this.onChange.bind(this),
            cssClass: value + ' ' + this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            label: this.getFieldLabel(value)
        });
        checkBox.appendTo(checkBoxInput);
        checkBoxInput.setAttribute('name', fieldName);
        if (fieldName === 'Repeat') {
            this.repeatStatus = checkBox;
        }
        return checkBoxDiv;
    };
    EventWindow.prototype.renderTextBox = function (value) {
        var textBoxDiv = this.createDivElement(value + '-container');
        var fieldName = this.getFieldName(value);
        var elementType = (value === cls.DESCRIPTION_CLASS) ? 'textarea' : 'input';
        var textBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName, elementType);
        textBoxDiv.appendChild(textBoxInput);
        Input.createInput({
            element: textBoxInput,
            floatLabelType: 'Always',
            properties: {
                enableRtl: this.parent.enableRtl,
                placeholder: this.getFieldLabel(value)
            }
        });
        return textBoxDiv;
    };
    EventWindow.prototype.getFieldName = function (name) {
        var fieldName = '';
        switch (name) {
            case cls.SUBJECT_CLASS:
                fieldName = this.fields.subject;
                break;
            case cls.LOCATION_CLASS:
                fieldName = this.fields.location;
                break;
            case cls.EVENT_WINDOW_START_CLASS:
                fieldName = this.fields.startTime;
                break;
            case cls.EVENT_WINDOW_END_CLASS:
                fieldName = this.fields.endTime;
                break;
            case cls.DESCRIPTION_CLASS:
                fieldName = this.fields.description;
                break;
            case cls.EVENT_WINDOW_ALL_DAY_CLASS:
                fieldName = this.fields.isAllDay;
                break;
            case cls.EVENT_WINDOW_START_TZ_CLASS:
                fieldName = this.fields.startTimezone;
                break;
            case cls.EVENT_WINDOW_END_TZ_CLASS:
                fieldName = this.fields.endTimezone;
                break;
            case cls.TIME_ZONE_CLASS:
                fieldName = 'Timezone';
                break;
            case cls.EVENT_WINDOW_REPEAT_CLASS:
                fieldName = 'Repeat';
                break;
        }
        return fieldName;
    };
    EventWindow.prototype.getFieldLabel = function (fieldName) {
        var labelText = '';
        switch (fieldName) {
            case cls.SUBJECT_CLASS:
                labelText = this.parent.editorTitles.subject;
                break;
            case cls.LOCATION_CLASS:
                labelText = this.parent.editorTitles.location;
                break;
            case cls.DESCRIPTION_CLASS:
                labelText = this.parent.editorTitles.description;
                break;
            case cls.EVENT_WINDOW_START_CLASS:
                labelText = this.parent.editorTitles.startTime;
                break;
            case cls.EVENT_WINDOW_END_CLASS:
                labelText = this.parent.editorTitles.endTime;
                break;
            case cls.EVENT_WINDOW_START_TZ_CLASS:
                labelText = this.parent.editorTitles.startTimezone;
                break;
            case cls.EVENT_WINDOW_END_TZ_CLASS:
                labelText = this.parent.editorTitles.endTimezone;
                break;
            case cls.EVENT_WINDOW_REPEAT_CLASS:
                labelText = this.parent.editorTitles.recurrenceRule;
                break;
            case cls.EVENT_WINDOW_ALL_DAY_CLASS:
                labelText = this.parent.editorTitles.isAllDay;
                break;
            case cls.TIME_ZONE_CLASS:
                labelText = this.l10n.getConstant('timezone');
                break;
        }
        return labelText;
    };
    EventWindow.prototype.onChange = function (args) {
        var target = (args.event.target);
        if (target.classList.contains(cls.EVENT_WINDOW_ALL_DAY_CLASS)) {
            this.onAllDayChange(args.checked);
        }
        else if (target.classList.contains(cls.TIME_ZONE_CLASS)) {
            this.timezoneChangeStyle(args.checked);
        }
        else if (target.classList.contains(cls.EVENT_WINDOW_REPEAT_CLASS)) {
            this.onRepeatChange(args.checked);
        }
    };
    EventWindow.prototype.renderRepeatDialog = function () {
        var element = createElement('div');
        this.repeatDialogObject = new Dialog({
            header: this.l10n.getConstant('recurrence'),
            visible: false,
            content: '<div class="e-rec-editor"></div>',
            closeOnEscape: true,
            width: '90%',
            buttons: [{
                    click: this.repeatSaveDialog.bind(this),
                    buttonModel: { content: this.l10n.getConstant('save'), cssClass: 'e-save', isPrimary: true }
                },
                { click: this.repeatCancelDialog.bind(this), buttonModel: { cssClass: 'e-cancel', content: this.l10n.getConstant('cancel') } }],
            target: this.element,
            animationSettings: { effect: 'Zoom' },
            enableRtl: this.parent.enableRtl,
            isModal: true,
            cssClass: REPEAT_DIALOG_CLASS,
            open: this.repeatOpenDialog.bind(this)
        });
        this.element.appendChild(element);
        this.repeatDialogObject.appendTo(element);
        this.createRecurrenceEditor(this.repeatDialogObject.element.querySelector('.e-rec-editor'));
    };
    EventWindow.prototype.loadRecurrenceEditor = function () {
        this.repeatDialogObject.show();
        if (this.recurrenceEditor && this.repeatRule) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
        }
    };
    EventWindow.prototype.onRepeatChange = function (state) {
        if (state) {
            if (!this.repeatDialogObject) {
                this.renderRepeatDialog();
            }
            this.recurrenceEditor.setProperties({ startDate: this.repeatStartDate, selectedType: 0 });
            this.loadRecurrenceEditor();
        }
        else {
            if (this.repeatDialogObject) {
                this.repeatDialogObject.hide();
            }
            this.repeatRule = '';
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
                this.updateRepeatLabel(this.repeatRule);
            }
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
        }
    };
    EventWindow.prototype.repeatSaveDialog = function () {
        this.repeatRule = this.recurrenceEditor.getRecurrenceRule();
        var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
        if (this.recurrenceEditor.getRecurrenceRule()) {
            removeClass([element], HIDE_STYLE_CLASS);
        }
        else {
            addClass([element], HIDE_STYLE_CLASS);
            this.repeatStatus.setProperties({ checked: false });
        }
        this.updateRepeatLabel(this.repeatRule);
        this.closeRepeatDialog();
    };
    EventWindow.prototype.closeRepeatDialog = function () {
        this.repeatDialogObject.hide();
    };
    EventWindow.prototype.repeatCancelDialog = function () {
        this.closeRepeatDialog();
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatTempRule);
        }
        if (!this.repeatTempRule) {
            this.repeatStatus.setProperties({ checked: false });
        }
    };
    EventWindow.prototype.repeatOpenDialog = function () {
        this.repeatTempRule = this.recurrenceEditor.getRecurrenceRule();
    };
    EventWindow.prototype.onCellDetailsUpdate = function (event, repeatType) {
        this.element.querySelector('.' + cls.FORM_CLASS).removeAttribute('data-id');
        this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('newEvent');
        var eventObj = {};
        if (this.cellClickAction) {
            if (event.subject) {
                eventObj[this.fields.subject] = event.subject;
            }
            eventObj[this.fields.startTime] = event.startTime;
            eventObj[this.fields.endTime] = event.endTime;
            eventObj[this.fields.isAllDay] = event.isAllDay;
            if (this.parent.resources.length > 0 || this.parent.activeViewOptions.group.resources.length > 0) {
                this.parent.resourceBase.setResourceValues(eventObj, false);
            }
        }
        else {
            this.parent.activeCellsData = {
                startTime: (event.startTime || event[this.fields.startTime]),
                endTime: (event.endTime || event[this.fields.endTime]),
                isAllDay: (event.isAllDay || event[this.fields.isAllDay]),
                element: event.element,
                groupIndex: event.groupIndex
            };
            eventObj = event;
        }
        eventObj.Timezone = false;
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        this.showDetails(eventObj);
        var deleteButton = this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
        if (deleteButton) {
            addClass([deleteButton], cls.DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setProperties({ startDate: eventObj[this.fields.startTime], selectedType: repeatType || 0 });
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
            this.updateRepeatLabel(this.repeatRule);
        }
        else {
            var saveButton = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            this.disableButton(saveButton, false);
        }
        this.dialogObject.show();
    };
    EventWindow.prototype.applyFormValidation = function () {
        var getValidationRule = function (rules) { return (rules && Object.keys(rules).length > 0) ? rules : undefined; };
        var form = this.element.querySelector('.' + cls.FORM_CLASS);
        var rules = {};
        rules[this.parent.eventSettings.fields.subject.name] = getValidationRule(this.parent.eventSettings.fields.subject.validation);
        rules[this.parent.eventSettings.fields.location.name] = getValidationRule(this.parent.eventSettings.fields.location.validation);
        rules[this.parent.eventSettings.fields.startTime.name] = getValidationRule(this.parent.eventSettings.fields.startTime.validation);
        rules[this.parent.eventSettings.fields.endTime.name] = getValidationRule(this.parent.eventSettings.fields.endTime.validation);
        rules[this.parent.eventSettings.fields.description.name] =
            getValidationRule(this.parent.eventSettings.fields.description.validation);
        this.fieldValidator.renderFormValidator(form, rules, this.element);
    };
    EventWindow.prototype.showDetails = function (eventData) {
        var eventObj = extend({}, eventData, null, true);
        this.trimAllDay(eventObj);
        this.eventData = eventObj;
        var formelement = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        var keyNames = Object.keys(eventObj);
        for (var _i = 0, formelement_1 = formelement; _i < formelement_1.length; _i++) {
            var curElement = formelement_1[_i];
            var columnName = curElement.name || this.getColumnName(curElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                if (keyNames.indexOf(columnName) !== -1) {
                    this.setValueToElement(curElement, eventObj[columnName]);
                }
                else {
                    this.setDefaultValueToElement(curElement);
                }
            }
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            this.onAllDayChange(eventObj[this.fields.isAllDay]);
            var timezoneObj = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD);
            if (!(isNullOrUndefined(eventObj[this.fields.startTimezone]) && isNullOrUndefined(eventObj[this.fields.endTimezone]))) {
                timezoneObj.checked = true;
                timezoneObj.dataBind();
            }
            this.timezoneChangeStyle(timezoneObj.checked);
            delete eventObj.Timezone;
        }
    };
    EventWindow.prototype.getColumnName = function (element) {
        var attrName = element.getAttribute('data-name') || '';
        if (attrName === '') {
            var isDropDowns = false;
            var fieldSelector = '';
            if (element.classList.contains('e-dropdownlist')) {
                fieldSelector = 'e-ddl';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-multiselect')) {
                fieldSelector = 'e-multiselect';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-datetimepicker')) {
                fieldSelector = 'e-datetimepicker';
            }
            else if (element.classList.contains('e-datepicker')) {
                fieldSelector = 'e-datepicker';
            }
            else if (element.classList.contains('e-checkbox')) {
                fieldSelector = 'e-checkbox';
            }
            var classSelector = isDropDowns ? "." + fieldSelector + ":not(.e-control)" : "." + fieldSelector;
            var control = closest(element, classSelector) || element.querySelector("." + fieldSelector);
            if (control) {
                var attrEle = control.querySelector('[name]');
                if (attrEle) {
                    attrName = attrEle.name;
                }
            }
        }
        return attrName;
    };
    EventWindow.prototype.onAllDayChange = function (allDayStatus) {
        var startObj = this.getInstance(cls.EVENT_WINDOW_START_CLASS);
        var endObj = this.getInstance(cls.EVENT_WINDOW_END_CLASS);
        var timezoneDiv = this.element.querySelector('.e-time-zone-container');
        var format;
        if (allDayStatus) {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') : this.parent.dateFormat;
            addClass(this.element.querySelectorAll('.e-time-icon'), cls.EVENT_WINDOW_ICON_DISABLE_CLASS);
            addClass([timezoneDiv], cls.DISABLE_CLASS);
            if (this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)) {
                removeClass([this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], cls.ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        else {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') + ' ' + this.getFormat('timeFormats') :
                this.parent.dateFormat + ' ' + this.getFormat('timeFormats');
            removeClass(this.element.querySelectorAll('.e-time-icon'), cls.EVENT_WINDOW_ICON_DISABLE_CLASS);
            removeClass([timezoneDiv], cls.DISABLE_CLASS);
            if (this.element.querySelector('.e-checkbox-wrapper .e-time-zone').checked) {
                addClass([this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], cls.ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        if (this.cellClickAction) {
            this.updateDateTime(allDayStatus, startObj, endObj);
        }
        startObj.dataBind();
        endObj.dataBind();
    };
    EventWindow.prototype.updateDateTime = function (allDayStatus, startObj, endObj) {
        var startDate;
        var endDate;
        if (allDayStatus) {
            startDate = util.resetTime(new Date(this.parent.activeCellsData.startTime.getTime()));
            if (this.parent.activeCellsData.isAllDay) {
                var temp = util.addDays(new Date(this.parent.activeCellsData.endTime.getTime()), -1).getTime();
                endDate = (+this.parent.activeCellsData.startTime > temp) ? this.parent.activeCellsData.endTime : new Date(temp);
            }
            else {
                endDate = util.resetTime(new Date(this.parent.activeCellsData.endTime.getTime()));
            }
        }
        else {
            startDate = new Date(this.parent.activeCellsData.startTime.getTime());
            if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda' || this.parent.activeCellsData.isAllDay) {
                var startHour = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm', calendar: this.parent.getCalendarMode() });
                startDate.setHours(startHour.getHours(), startHour.getMinutes(), startHour.getSeconds());
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(util.MS_PER_MINUTE * this.getSlotDuration());
            }
            else {
                endDate = new Date(this.parent.activeCellsData.endTime.getTime());
            }
        }
        startObj.value = startDate;
        endObj.value = endDate;
        startObj.dataBind();
        endObj.dataBind();
    };
    EventWindow.prototype.getFormat = function (formatType) {
        var format;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject());
        }
        else {
            format = getValue(
            // tslint:disable-next-line:max-line-length
            'main.' + '' + this.parent.locale + '.dates.calendars.' + this.parent.getCalendarMode() + '.' + formatType + '.short', cldrData);
        }
        return format;
    };
    EventWindow.prototype.onEventDetailsUpdate = function (eventObj) {
        if (!this.parent.isAdaptive) {
            removeClass([this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS)], cls.DISABLE_CLASS);
        }
        this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('editEvent');
        this.element.querySelector('.' + cls.FORM_CLASS).setAttribute('data-id', eventObj[this.fields.id].toString());
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            eventObj = extend({}, eventObj, null, true);
            var timezoneObj = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD);
            var timezoneValue = void 0;
            if (eventObj[this.fields.startTimezone] || eventObj[this.fields.endTimezone]) {
                timezoneValue = true;
                this.parent.eventBase.timezoneConvert(eventObj);
            }
            else {
                timezoneValue = false;
            }
            eventObj.Timezone = timezoneValue;
            timezoneObj.checked = timezoneValue;
            timezoneObj.dataBind();
        }
        this.showDetails(eventObj);
        if (eventObj[this.fields.recurrenceRule] && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
        }
        else if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule('');
        }
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        if (eventObj[this.fields.recurrenceRule]) {
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
            }
            this.repeatRule = eventObj[this.fields.recurrenceRule];
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            var element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule]) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            }
            else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        }
        var isDisable = (this.parent.readonly || eventObj[this.fields.isReadonly]);
        if (!this.parent.isAdaptive) {
            var saveButton = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            var deleteButton = this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
            this.disableButton(saveButton, isDisable);
            this.disableButton(deleteButton, isDisable);
        }
        else {
            var saveIcon = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_ICON_CLASS);
            if (saveIcon) {
                if (isDisable) {
                    addClass([saveIcon], cls.ICON_DISABLE_CLASS);
                }
                else {
                    removeClass([saveIcon], cls.ICON_DISABLE_CLASS);
                }
            }
        }
        this.dialogObject.show();
    };
    EventWindow.prototype.disableButton = function (element, value) {
        if (element) {
            element.ej2_instances[0].disabled = value;
        }
    };
    EventWindow.prototype.renderRecurrenceEditor = function () {
        return new RecurrenceEditor({
            cssClass: this.parent.cssClass,
            dateFormat: this.parent.dateFormat,
            enableRtl: this.parent.enableRtl,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            locale: this.parent.locale
        });
    };
    EventWindow.prototype.updateRepeatLabel = function (repeatRule) {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        var data = repeatRule ?
            (this.l10n.getConstant('repeats') + ' ' + this.recurrenceEditor.getRuleSummary(repeatRule)) : this.l10n.getConstant('repeat');
        this.repeatStatus.setProperties({ label: data });
    };
    EventWindow.prototype.dialogClose = function () {
        this.parent.activeEventData = { event: undefined, element: undefined };
        this.parent.currentAction = null;
        this.dialogObject.hide();
        this.fieldValidator.destroyToolTip();
        this.resetFormFields();
        if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.resetFields();
        }
    };
    EventWindow.prototype.timezoneChangeStyle = function (value) {
        var _this = this;
        var timezoneDiv = this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        if (value) {
            addClass([timezoneDiv], cls.ENABLE_CLASS);
            var startTimezoneObj = this.getInstance(cls.EVENT_WINDOW_START_TZ_CLASS);
            var endTimezoneObj = this.getInstance(cls.EVENT_WINDOW_END_TZ_CLASS);
            var timezone = startTimezoneObj.dataSource;
            if (!startTimezoneObj.value || !this.parent.timezone) {
                var found = timezone.some(function (tz) { return tz.Value === _this.localTimezoneName; });
                if (!found) {
                    timezone.push({ Value: this.localTimezoneName, Text: this.localTimezoneName });
                    startTimezoneObj.dataSource = timezone;
                    endTimezoneObj.dataSource = timezone;
                    startTimezoneObj.dataBind();
                    endTimezoneObj.dataBind();
                }
            }
            startTimezoneObj.value = startTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            endTimezoneObj.value = endTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            startTimezoneObj.dataBind();
            endTimezoneObj.dataBind();
        }
        else {
            removeClass([timezoneDiv], cls.ENABLE_CLASS);
        }
    };
    EventWindow.prototype.resetFormFields = function () {
        var formelement = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (var index = 0, len = formelement.length; index < len; index++) {
            var columnName = formelement[index].name;
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                this.setDefaultValueToElement(formelement[index]);
            }
        }
    };
    EventWindow.prototype.eventSave = function (alert) {
        this.parent.uiStateValues.isBlock = false;
        var alertType;
        var formElement = this.element.querySelector('.' + cls.FORM_CLASS);
        if (formElement && formElement.classList.contains('e-formvalidator') &&
            !formElement.ej2_instances[0].validate()) {
            return;
        }
        var eventObj = extend({}, this.getObjectFromFormData(cls.EVENT_WINDOW_DIALOG_CLASS));
        if (!eventObj.Timezone) {
            eventObj[this.fields.startTimezone] = null;
            eventObj[this.fields.endTimezone] = null;
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            delete eventObj.Timezone;
            delete eventObj.Repeat;
            if (!eventObj[this.fields.startTime] || !eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('invalidDateError');
                return;
            }
            if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('startEndError');
                return;
            }
        }
        if (this.recurrenceEditor && this.recurrenceEditor.value && this.recurrenceEditor.value !== '') {
            alertType = this.recurrenceValidation(eventObj[this.fields.startTime], eventObj[this.fields.endTime], alert);
            if (!isNullOrUndefined(alertType)) {
                this.parent.quickPopup.openRecurrenceValidationAlert(alertType);
                return;
            }
        }
        var eventId = this.getEventIdFromForm();
        this.setDefaultValueToObject(eventObj);
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.startTime] = util.resetTime(new Date(eventObj[this.fields.startTime].getTime()));
            eventObj[this.fields.endTime] = util.addDays(util.resetTime(new Date(eventObj[this.fields.endTime].getTime())), 1);
        }
        var ruleData = this.recurrenceEditor ? this.recurrenceEditor.getRecurrenceRule() : null;
        eventObj[this.fields.recurrenceRule] = ruleData ? ruleData : undefined;
        var isResourceEventExpand = (this.parent.activeViewOptions.group.resources.length > 0 || this.parent.resources.length > 0)
            && !this.parent.activeViewOptions.group.allowGroupEdit;
        if (!isNullOrUndefined(eventId)) {
            var eveId = this.parent.eventBase.getEventIDType() === 'string' ? eventId : parseInt(eventId, 10);
            var editedData = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
                where(this.fields.id, 'equal', eveId))[0];
            eventObj = extend({}, editedData, eventObj);
            if (eventObj[this.fields.isReadonly]) {
                return;
            }
            var currentAction = void 0;
            if (!isNullOrUndefined(editedData[this.fields.recurrenceRule])) {
                currentAction = this.parent.currentAction;
                if (this.parent.currentAction === 'EditOccurrence') {
                    if (!eventObj[this.fields.recurrenceID]) {
                        eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                        eventObj.Guid = this.parent.activeEventData.event.Guid;
                    }
                    else {
                        eveId = eventObj[this.fields.recurrenceID];
                        currentAction = null;
                    }
                    if (this.editOccurrenceValidation(eveId, eventObj)) {
                        this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                        return;
                    }
                }
                if (this.parent.currentAction === 'EditSeries' || eventObj[this.fields.id] !== editedData[this.fields.id]) {
                    eventObj[this.fields.recurrenceID] = editedData[this.fields.id];
                }
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, 'Save', currentAction);
            }
            else {
                this.parent.saveEvent(eventObj, currentAction);
            }
        }
        else {
            this.parent.currentAction = 'Add';
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, this.parent.currentAction);
            }
            else {
                eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                this.parent.addEvent(eventObj);
            }
        }
        if (this.parent.uiStateValues.isBlock) {
            return;
        }
        this.dialogObject.hide();
    };
    EventWindow.prototype.getObjectFromFormData = function (className) {
        var formElement = this.getFormElements(className);
        var eventObj = {};
        for (var _i = 0, formElement_1 = formElement; _i < formElement_1.length; _i++) {
            var currentElement = formElement_1[_i];
            var columnName = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                eventObj[columnName] = this.getValueFromElement(currentElement);
            }
        }
        return eventObj;
    };
    EventWindow.prototype.setDefaultValueToObject = function (eventObj) {
        if (!isNullOrUndefined(eventObj[this.fields.subject])) {
            eventObj[this.fields.subject] = eventObj[this.fields.subject] || this.parent.eventSettings.fields.subject.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.location])) {
            eventObj[this.fields.location] = eventObj[this.fields.location] || this.parent.eventSettings.fields.location.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.description])) {
            eventObj[this.fields.description] = eventObj[this.fields.description] || this.parent.eventSettings.fields.description.default;
        }
    };
    EventWindow.prototype.recurrenceValidation = function (startDate, endDate, alert) {
        var alertMessage;
        var recEditor = this.recurrenceEditor;
        var interval = this.getInstance('e-repeat-interval.e-numerictextbox').value;
        if (alert !== this.l10n.getConstant('ok')) {
            if (this.parent.currentAction === 'EditSeries' &&
                !isNullOrUndefined(this.eventData[this.parent.eventFields.recurrenceException])) {
                alertMessage = 'seriesChangeAlert';
            }
            if (this.getInstance('e-end-on-left .e-ddl .e-dropdownlist').value === 'until' &&
                this.getInstance('e-end-on-date .e-datepicker').value < startDate) {
                alertMessage = 'wrongPattern';
            }
            if (isNullOrUndefined(alertMessage)) {
                switch (recEditor.value.split(';')[0].split('=')[1]) {
                    case 'DAILY':
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= (interval * 24))) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'WEEKLY':
                        var types = recEditor.value.split(';')[1].split('=')[1].split(',');
                        var obj = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
                        var temp = [];
                        var tempDiff = [];
                        for (var index = 0; index < types.length * (interval + 1); index++) {
                            temp[index] = (types.length > index) ? obj[types[index]] : temp[index - types.length] + (7 * interval);
                        }
                        var tempvalue = temp.sort(function (a, b) { return a - b; });
                        for (var index = 1; index < tempvalue.length; index++) {
                            tempDiff.push(tempvalue[index] - tempvalue[index - 1]);
                        }
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= Math.min.apply(Math, tempDiff) * 24)
                            || isNullOrUndefined(interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'MONTHLY':
                        if (this.getInstance('e-month-expander-checkbox-wrapper .e-radio').checked
                            && [29, 30, 31].indexOf(parseInt(recEditor.value.split(';')[1].split('=')[1], 10)) !== -1) {
                            alertMessage = 'dateValidation';
                        }
                        else if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'YEARLY':
                        if (endDate.getTime() >= new Date(+startDate).setFullYear(startDate.getFullYear() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                }
            }
        }
        else {
            if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                alertMessage = 'createError';
            }
            if (isNullOrUndefined(alertMessage)) {
                this.parent.quickPopup.quickDialog.hide();
            }
        }
        return alertMessage;
    };
    EventWindow.prototype.getRecurrenceIndex = function (recColl, event) {
        var recIndex;
        for (var index = 0; index < recColl.length; index++) {
            if (event[this.fields.startTime].valueOf() === recColl[index][this.fields.startTime].valueOf()) {
                recIndex = index;
                break;
            }
        }
        return recIndex;
    };
    EventWindow.prototype.trimAllDay = function (data) {
        if (data[this.fields.isAllDay]) {
            var temp = util.addDays(new Date(+data[this.fields.endTime]), -1).getTime();
            data[this.fields.endTime] = (+data[this.fields.startTime] > temp) ? data[this.fields.endTime] : new Date(temp);
        }
    };
    EventWindow.prototype.editOccurrenceValidation = function (eventId, currentData, editData) {
        if (editData === void 0) {
            editData = this.eventData;
        }
        var recurColl = this.parent.getOccurrencesByID(eventId);
        var excludedDatas = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
            where(this.fields.recurrenceID, 'equal', eventId));
        excludedDatas.map(function (data) { return recurColl.push(extend({}, data)); });
        currentData = extend({}, currentData);
        this.trimAllDay(currentData);
        for (var _i = 0, recurColl_1 = recurColl; _i < recurColl_1.length; _i++) {
            var data = recurColl_1[_i];
            this.trimAllDay(data);
        }
        this.parent.eventBase.sortByTime(recurColl);
        var index = this.getRecurrenceIndex(recurColl, editData);
        if (isNullOrUndefined(index)) {
            return false;
        }
        if (index === 0) {
            if (!isNullOrUndefined(recurColl[index + 1])) {
                return (!(new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)));
            }
            return false;
        }
        else {
            if (index === recurColl.length - 1) {
                if (!(new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                    new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0))) {
                    return true;
                }
            }
            else if (!((new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0)) &&
                (new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)))) {
                return true;
            }
        }
        return false;
    };
    EventWindow.prototype.resourceSaveEvent = function (eventObj, action, currentAction) {
        var _this = this;
        var lastResouceData = this.parent.resourceBase.resourceCollection.slice(-1)[0];
        var resourceData = eventObj[lastResouceData.field];
        resourceData = (resourceData instanceof Array) ? resourceData : [resourceData];
        var lastlevel = this.parent.resourceBase.lastResourceLevel;
        var eventList = [];
        var _loop_1 = function (i) {
            var events = extend({}, eventObj, null, true);
            events[this_1.fields.id] = this_1.parent.eventBase.getEventMaxID();
            var temp = [];
            var addValues = function () {
                if (action === 'Save' && i === resourceData.length - 1) {
                    if (temp.length > 0) {
                        temp[0][_this.fields.id] = eventObj[_this.fields.id];
                        for (var k = 1; k < temp.length; k++) {
                            temp[k][_this.fields.id] = _this.parent.eventBase.getEventMaxID(i);
                            eventList.push(temp[k]);
                            _this.parent.saveEvent(temp[0], currentAction);
                        }
                    }
                    else {
                        events[_this.fields.id] = eventObj[_this.fields.id];
                        _this.parent.saveEvent(events, currentAction);
                    }
                }
                else {
                    if (temp.length > 0) {
                        for (var j = 0; j < temp.length; j++) {
                            temp[j][_this.fields.id] = _this.parent.eventBase.getEventMaxID(j);
                            eventList.push(temp[j]);
                        }
                    }
                    else {
                        events[_this.fields.id] = _this.parent.eventBase.getEventMaxID(i);
                        eventList.push(events);
                    }
                }
            };
            if (this_1.parent.activeViewOptions.group.byGroupID && (!isNullOrUndefined(lastlevel))) {
                var lastResource = lastResouceData.dataSource;
                var index = util.findIndexInData(lastResource, lastResouceData.idField, resourceData[i]);
                var groupId_1 = lastResource[index][lastResouceData.groupIDField];
                var filter = lastlevel.filter(function (obj) { return obj.resourceData[lastResouceData.idField] === resourceData[i]; }).
                    filter(function (obj) { return obj.resourceData[lastResouceData.groupIDField] === groupId_1; })[0];
                var groupOrder = filter.groupOrder;
                for (var index_1 = 0; index_1 < this_1.parent.resourceBase.resourceCollection.length; index_1++) {
                    var field = this_1.parent.resourceBase.resourceCollection[index_1].field;
                    events[field] = (groupOrder[index_1] instanceof Array) ? groupOrder[index_1][0] : groupOrder[index_1];
                }
                addValues();
            }
            else {
                for (var index = 0; index < this_1.parent.resourceBase.resourceCollection.length - 1; index++) {
                    var field = this_1.parent.resourceBase.resourceCollection[index].field;
                    if (events[field] instanceof Array && events[field].length > 1) {
                        for (var k = 0; k < events[field].length; k++) {
                            var event_1 = extend({}, events, null, true);
                            event_1[field] = eventObj[field][k];
                            event_1[lastResouceData.field] = resourceData[i];
                            temp.push(event_1);
                        }
                    }
                    else {
                        if (temp.length === 0) {
                            events[field] = (eventObj[field] instanceof Array) ?
                                eventObj[field][0] : eventObj[field];
                            events[lastResouceData.field] = resourceData[i];
                        }
                        else {
                            for (var l = 0; l < temp.length; l++) {
                                temp[l][field] = (eventObj[field] instanceof Array) ?
                                    eventObj[field][0] : eventObj[field];
                            }
                        }
                    }
                }
                events[lastResouceData.field] = resourceData[i];
                addValues();
            }
        };
        var this_1 = this;
        for (var i = 0; i < resourceData.length; i++) {
            _loop_1(i);
        }
        if (eventList.length > 0) {
            for (var _i = 0, eventList_1 = eventList; _i < eventList_1.length; _i++) {
                var event_2 = eventList_1[_i];
                event_2[this.fields.recurrenceException] = null;
                event_2[this.fields.recurrenceID] = null;
            }
            this.parent.addEvent(eventList);
        }
    };
    EventWindow.prototype.getEventIdFromForm = function () {
        return this.element.querySelector('.' + cls.FORM_CLASS).getAttribute('data-id');
    };
    EventWindow.prototype.getFormElements = function (className) {
        if (className === cls.EVENT_WINDOW_DIALOG_CLASS) {
            return [].slice.call(this.element.querySelectorAll('.' + EVENT_FIELD));
        }
        return [].slice.call(this.parent.element.querySelectorAll('.' + className + ' .' + EVENT_FIELD));
    };
    EventWindow.prototype.getValueFromElement = function (element) {
        var value;
        if (element.classList.contains('e-datepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-datetimepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-dropdownlist')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-multiselect')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-checkbox')) {
            value = element.ej2_instances[0].checked;
        }
        else {
            if (element.type === 'checkbox') {
                value = element.checked;
            }
            else {
                value = element.value;
            }
        }
        return value;
    };
    EventWindow.prototype.setValueToElement = function (element, value) {
        if (element.classList.contains('e-datepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            var instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            var instance = element.ej2_instances[0];
            instance.value = [];
            instance.value = ((value instanceof Array) ? value : [value]);
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            var instance = element.ej2_instances[0];
            instance.checked = value;
            instance.dataBind();
        }
        else {
            if (element.type !== 'checkbox') {
                element.value = value || '';
            }
            else {
                element.checked = value;
            }
        }
    };
    EventWindow.prototype.setDefaultValueToElement = function (element) {
        if (element.classList.contains('e-datepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            var instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            var instance = element.ej2_instances[0];
            instance.value = null;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            var instance = element.ej2_instances[0];
            instance.value = [];
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            var instance = element.ej2_instances[0];
            instance.checked = false;
            instance.dataBind();
        }
        else {
            if (element.type === 'checkbox') {
                element.checked = false;
            }
            else {
                element.value = '';
            }
        }
    };
    EventWindow.prototype.getInstance = function (className) {
        return this.element.querySelector('.' + className).ej2_instances[0];
    };
    EventWindow.prototype.eventDelete = function () {
        switch (this.parent.currentAction) {
            case 'EditOccurrence':
                var fields = this.parent.eventFields;
                if (!isNullOrUndefined(this.parent.activeEventData.event[fields.recurrenceRule])) {
                    this.parent.currentAction = 'DeleteOccurrence';
                }
                else {
                    this.parent.currentAction = 'Delete';
                }
                break;
            case 'EditSeries':
                this.parent.currentAction = 'DeleteSeries';
                break;
        }
        this.dialogObject.hide();
        this.parent.quickPopup.openDeleteAlert();
    };
    EventWindow.prototype.destroyComponents = function () {
        var formelement = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (var _i = 0, formelement_2 = formelement; _i < formelement_2.length; _i++) {
            var element = formelement_2[_i];
            var instance = void 0;
            if (element.classList.contains('e-datetimepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-datepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-checkbox')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-dropdownlist')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-multiselect')) {
                instance = element.ej2_instances[0];
            }
            if (instance) {
                instance.destroy();
            }
        }
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
    };
    /**
     * To destroy the event window.
     * @return {void}
     * @private
     */
    EventWindow.prototype.destroy = function () {
        if (this.recurrenceEditor) {
            this.recurrenceEditor.destroy();
        }
        this.destroyComponents();
        this.fieldValidator.destroy();
        if (this.repeatDialogObject) {
            this.repeatDialogObject.destroy();
            remove(this.repeatDialogObject.element);
        }
        if (this.dialogObject) {
            this.dialogObject.destroy();
            this.dialogObject = null;
        }
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
    };
    return EventWindow;
}());
export { EventWindow };
