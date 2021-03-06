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
import { Component, Property, Event, EventHandler, L10n, compile, isNullOrUndefined } from '-syncfusion/ej2-base';
import { NotifyPropertyChanges, detach, append, Animation } from '-syncfusion/ej2-base';
import { addClass, removeClass, KeyboardEvents, setValue, getValue, ChildProperty } from '-syncfusion/ej2-base';
import { Collection, Complex, Browser, Ajax, getUniqueID } from '-syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner } from '-syncfusion/ej2-popups';
var ROOT = 'e-uploader';
var CONTROL_WRAPPER = 'e-upload';
var INPUT_WRAPPER = 'e-file-select';
var DROP_AREA = 'e-file-drop';
var DROP_WRAPPER = 'e-file-select-wrap';
var LIST_PARENT = 'e-upload-files';
var FILE = 'e-upload-file-list';
var STATUS = 'e-file-status';
var ACTION_BUTTONS = 'e-upload-actions';
var UPLOAD_BUTTONS = 'e-file-upload-btn e-css e-btn e-flat e-primary';
var CLEAR_BUTTONS = 'e-file-clear-btn e-css e-btn e-flat';
var FILE_NAME = 'e-file-name';
var FILE_TYPE = 'e-file-type';
var FILE_SIZE = 'e-file-size';
var REMOVE_ICON = 'e-file-remove-btn';
var DELETE_ICON = 'e-file-delete-btn';
var ABORT_ICON = 'e-file-abort-btn';
var RETRY_ICON = 'e-file-reload-btn';
var DRAG_HOVER = 'e-upload-drag-hover';
var PROGRESS_WRAPPER = 'e-upload-progress-wrap';
var PROGRESSBAR = 'e-upload-progress-bar';
var PROGRESSBAR_TEXT = 'e-progress-bar-text';
var UPLOAD_INPROGRESS = 'e-upload-progress';
var UPLOAD_SUCCESS = 'e-upload-success';
var UPLOAD_FAILED = 'e-upload-fails';
var TEXT_CONTAINER = 'e-file-container';
var VALIDATION_FAILS = 'e-validation-fails';
var RTL = 'e-rtl';
var DISABLED = 'e-disabled';
var RTL_CONTAINER = 'e-rtl-container';
var ICON_FOCUSED = 'e-clear-icon-focus';
var PROGRESS_INNER_WRAPPER = 'e-progress-inner-wrap';
var PAUSE_UPLOAD = 'e-file-pause-btn';
var RESUME_UPLOAD = 'e-file-play-btn';
var RESTRICT_SEQUENTIAL = 'e-restrict-sequential';
var FilesProp = /** @class */ (function (_super) {
    __extends(FilesProp, _super);
    function FilesProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], FilesProp.prototype, "name", void 0);
    __decorate([
        Property(null)
    ], FilesProp.prototype, "size", void 0);
    __decorate([
        Property('')
    ], FilesProp.prototype, "type", void 0);
    return FilesProp;
}(ChildProperty));
export { FilesProp };
var ButtonsProps = /** @class */ (function (_super) {
    __extends(ButtonsProps, _super);
    function ButtonsProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Browse...')
    ], ButtonsProps.prototype, "browse", void 0);
    __decorate([
        Property('Upload')
    ], ButtonsProps.prototype, "upload", void 0);
    __decorate([
        Property('Clear')
    ], ButtonsProps.prototype, "clear", void 0);
    return ButtonsProps;
}(ChildProperty));
export { ButtonsProps };
var AsyncSettings = /** @class */ (function (_super) {
    __extends(AsyncSettings, _super);
    function AsyncSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], AsyncSettings.prototype, "saveUrl", void 0);
    __decorate([
        Property('')
    ], AsyncSettings.prototype, "removeUrl", void 0);
    __decorate([
        Property(0)
    ], AsyncSettings.prototype, "chunkSize", void 0);
    __decorate([
        Property(3)
    ], AsyncSettings.prototype, "retryCount", void 0);
    __decorate([
        Property(500)
    ], AsyncSettings.prototype, "retryAfterDelay", void 0);
    return AsyncSettings;
}(ChildProperty));
export { AsyncSettings };
/**
 * The uploader component allows to upload images, documents, and other files from local to server.
 * ```html
 * <input type='file' name='images[]' id='upload'/>
 * ```
 * ```typescript
 * <script>
 *   var uploadObj = new Uploader();
 *   uploadObj.appendTo('#upload');
 * </script>
 * ```
 */
var Uploader = /** @class */ (function (_super) {
    __extends(Uploader, _super);
    /**
     * Triggers when change the Uploader value.
     */
    function Uploader(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initialAttr = { accept: null, multiple: false, disabled: false };
        _this.fileList = [];
        _this.filesData = [];
        _this.uploadedFilesData = [];
        _this.isForm = false;
        _this.allTypes = false;
        _this.pausedData = [];
        _this.uploadMetaData = [];
        _this.tabIndex = '0';
        _this.count = -1;
        return _this;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    Uploader.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'allowedExtensions':
                    this.setExtensions(this.allowedExtensions);
                    this.clearAll();
                    break;
                case 'enabled':
                    this.setControlStatus();
                    break;
                case 'multiple':
                    this.setMultipleSelection();
                    break;
                case 'enableRtl':
                    this.setRTL();
                    this.reRenderFileList();
                    break;
                case 'buttons':
                    this.buttons.browse = isNullOrUndefined(this.buttons.browse) ? '' : this.buttons.browse;
                    this.buttons.clear = isNullOrUndefined(this.buttons.clear) ? '' : this.buttons.clear;
                    this.buttons.upload = isNullOrUndefined(this.buttons.upload) ? '' : this.buttons.upload;
                    this.renderButtonTemplates();
                    break;
                case 'dropArea':
                    this.unBindDropEvents();
                    this.setDropArea();
                    break;
                case 'files':
                    this.renderPreLoadFiles();
                    break;
                case 'directoryUpload':
                    this.updateDirectoryAttributes();
                    break;
                case 'minFileSize':
                case 'maxFileSize':
                case 'template':
                case 'autoUpload':
                    if (this.sequentialUpload) {
                        this.count = -1;
                    }
                    this.clearAll();
                    break;
                case 'sequentialUpload':
                    this.count = -1;
                    this.clearAll();
                    break;
                case 'locale':
                    this.l10n.setLocale(this.locale);
                    this.setLocalizedTexts();
                    this.preLocaleObj = getValue('currentLocale', this.l10n);
                    break;
            }
        }
    };
    Uploader.prototype.setLocalizedTexts = function () {
        if (isNullOrUndefined(this.template)) {
            if (typeof (this.buttons.browse) === 'string') {
                this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                    this.localizedTexts('Browse') : this.buttons.browse;
                this.browseButton.setAttribute('title', this.browseButton.innerText);
                this.uploadWrapper.querySelector('.' + DROP_AREA).innerHTML = this.localizedTexts('dropFilesHint');
            }
            this.updateFileList();
        }
    };
    Uploader.prototype.getKeyValue = function (val) {
        var keyValue;
        for (var _i = 0, _a = Object.keys(this.preLocaleObj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (this.preLocaleObj[key] === val) {
                keyValue = key;
            }
        }
        return keyValue;
    };
    Uploader.prototype.updateFileList = function () {
        var element;
        if (this.fileList.length > 0 && !isNullOrUndefined(this.uploadWrapper.querySelector('.' + LIST_PARENT))) {
            for (var i = 0; i < this.fileList.length; i++) {
                element = this.fileList[i].querySelector('.e-file-status');
                element.innerHTML = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                this.filesData[i].status = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                /* istanbul ignore next */
                if (this.fileList[i].classList.contains(UPLOAD_SUCCESS)) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('delete'));
                }
                if (this.fileList[i].querySelector('.e-file-play-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('resume'));
                }
                if (this.fileList[i].querySelector('.e-file-remove-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('remove'));
                }
                if (this.fileList[i].querySelector('.e-file-reload-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('retry'));
                }
                if (!this.autoUpload) {
                    this.uploadButton.innerText = (this.buttons.upload === 'Upload') ?
                        this.localizedTexts('Upload') : this.buttons.upload;
                    this.uploadButton.setAttribute('title', this.localizedTexts('Upload'));
                    this.clearButton.innerText = (this.buttons.clear === 'Clear') ?
                        this.localizedTexts('Clear') : this.buttons.clear;
                    this.clearButton.setAttribute('title', this.localizedTexts('Clear'));
                }
            }
        }
    };
    Uploader.prototype.reRenderFileList = function () {
        if (this.listParent) {
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createFileList(this.filesData);
            if (this.actionButtons) {
                this.removeActionButtons();
                this.renderActionButtons();
                this.checkActionButtonStatus();
            }
        }
    };
    Uploader.prototype.preRender = function () {
        this.cloneElement = this.element.cloneNode(true);
        this.localeText = { Browse: 'Browse...', Clear: 'Clear', Upload: 'Upload',
            dropFilesHint: 'Or drop files here', invalidMaxFileSize: 'File size is too large',
            invalidMinFileSize: 'File size is too small', invalidFileType: 'File type is not allowed',
            uploadFailedMessage: 'File failed to upload', uploadSuccessMessage: 'File uploaded successfully',
            removedSuccessMessage: 'File removed successfully', removedFailedMessage: 'Unable to remove file', inProgress: 'Uploading',
            readyToUploadMessage: 'Ready to upload', abort: 'Abort', remove: 'Remove', cancel: 'Cancel', delete: 'Delete file',
            pauseUpload: 'File upload paused', pause: 'Pause', resume: 'Resume', retry: 'Retry',
            fileUploadCancel: 'File upload canceled'
        };
        this.l10n = new L10n('uploader', this.localeText, this.locale);
        this.preLocaleObj = getValue('currentLocale', this.l10n);
        this.checkHTMLAttributes();
        if (this.asyncSettings.saveUrl === '' && this.asyncSettings.removeUrl === '' && !this.autoUpload) {
            var parentEle = this.element.parentElement;
            for (; parentEle && parentEle !== document.documentElement; parentEle = parentEle.parentElement) {
                if (parentEle.tagName === 'FORM') {
                    this.isForm = true;
                    this.formElement = parentEle;
                    parentEle.setAttribute('enctype', 'multipart/form-data');
                    parentEle.setAttribute('encoding', 'multipart/form-data');
                }
            }
        }
        // tslint:disable-next-line
        var ejInstance = getValue('ej2_instances', this.element);
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-UPLOADER') {
            var inputElement = this.createElement('input', { attrs: { type: 'file' } });
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                inputElement.innerHTML = this.element.innerHTML;
            }
            if (!inputElement.hasAttribute('name')) {
                inputElement.setAttribute('name', 'UploadFiles');
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        /* istanbul ignore next */
        if (ejInstance[0].isPureReactComponent) {
            if (!isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.name);
            }
            else if (!isNullOrUndefined(ejInstance[0].props.id) && isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.id);
            }
            else {
                this.element.setAttribute('name', 'UploadFiles');
            }
        }
        if (isNullOrUndefined(this.element.getAttribute('name'))) {
            this.element.setAttribute('name', this.element.getAttribute('id'));
        }
        if (!this.element.hasAttribute('type')) {
            this.element.setAttribute('type', 'file');
        }
        this.updateDirectoryAttributes();
        this.keyConfigs = {
            previous: 'shift+tab',
            enter: 'enter',
            next: 'tab'
        };
        if (this.element.hasAttribute('tabindex')) {
            this.tabIndex = this.element.getAttribute('tabindex');
        }
    };
    Uploader.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Return the module name of the component.
     */
    Uploader.prototype.getModuleName = function () {
        return 'uploader';
    };
    Uploader.prototype.updateDirectoryAttributes = function () {
        if (this.directoryUpload) {
            this.element.setAttribute('directory', 'true');
            this.element.setAttribute('webkitdirectory', 'true');
        }
        else {
            this.element.removeAttribute('directory');
            this.element.removeAttribute('webkitdirectory');
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Uploader.prototype.render = function () {
        this.renderBrowseButton();
        this.initializeUpload();
        this.wireEvents();
        this.setMultipleSelection();
        this.setExtensions(this.allowedExtensions);
        this.setRTL();
        this.renderPreLoadFiles();
        this.setControlStatus();
    };
    Uploader.prototype.renderBrowseButton = function () {
        this.browseButton = this.createElement('button', { className: 'e-css e-btn', attrs: { 'type': 'button' } });
        this.browseButton.setAttribute('tabindex', this.tabIndex);
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.innerText);
        }
        else {
            this.browseButton.appendChild(this.buttons.browse);
        }
        this.element.setAttribute('aria-label', 'Uploader');
    };
    Uploader.prototype.renderActionButtons = function () {
        this.element.setAttribute('tabindex', '-1');
        this.actionButtons = this.createElement('div', { className: ACTION_BUTTONS });
        this.uploadButton = this.createElement('button', { className: UPLOAD_BUTTONS, attrs: { 'type': 'button', 'tabindex': '-1' } });
        this.clearButton = this.createElement('button', { className: CLEAR_BUTTONS, attrs: { 'type': 'button', 'tabindex': '-1' } });
        this.actionButtons.appendChild(this.clearButton);
        this.actionButtons.appendChild(this.uploadButton);
        this.renderButtonTemplates();
        this.uploadWrapper.appendChild(this.actionButtons);
        this.browseButton.blur();
        this.uploadButton.focus();
        this.wireActionButtonEvents();
    };
    Uploader.prototype.wireActionButtonEvents = function () {
        EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    };
    Uploader.prototype.unwireActionButtonEvents = function () {
        EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    };
    Uploader.prototype.removeActionButtons = function () {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            detach(this.actionButtons);
            this.actionButtons = null;
        }
    };
    Uploader.prototype.renderButtonTemplates = function () {
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.innerText);
        }
        else {
            this.browseButton.innerHTML = '';
            this.browseButton.appendChild(this.buttons.browse);
        }
        if (this.uploadButton) {
            var uploadText = void 0;
            uploadText = isNullOrUndefined(this.buttons.upload) ? 'Upload' : this.buttons.upload;
            this.buttons.upload = uploadText;
            if (typeof (this.buttons.upload) === 'string') {
                this.uploadButton.innerText = (this.buttons.upload === 'Upload') ?
                    this.localizedTexts('Upload') : this.buttons.upload;
                this.uploadButton.setAttribute('title', this.uploadButton.innerText);
            }
            else {
                this.uploadButton.innerHTML = '';
                this.uploadButton.appendChild(this.buttons.upload);
            }
        }
        if (this.clearButton) {
            var clearText = void 0;
            clearText = isNullOrUndefined(this.buttons.clear) ? 'Clear' : this.buttons.clear;
            this.buttons.clear = clearText;
            if (typeof (this.buttons.clear) === 'string') {
                this.clearButton.innerText = (this.buttons.clear === 'Clear') ?
                    this.localizedTexts('Clear') : this.buttons.clear;
                this.clearButton.setAttribute('title', this.clearButton.innerText);
            }
            else {
                this.clearButton.innerHTML = '';
                this.clearButton.appendChild(this.buttons.clear);
            }
        }
    };
    Uploader.prototype.initializeUpload = function () {
        this.element.setAttribute('tabindex', '-1');
        var inputWrapper = this.createElement('span', { className: INPUT_WRAPPER });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = this.createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(this.browseButton);
        this.dropAreaWrapper.appendChild(inputWrapper);
        var fileDropArea = this.createElement('span', { className: DROP_AREA });
        fileDropArea.innerHTML = this.localizedTexts('dropFilesHint');
        this.dropAreaWrapper.appendChild(fileDropArea);
        this.uploadWrapper = this.createElement('div', { className: CONTROL_WRAPPER, attrs: { 'aria-activedescendant': 'li-focused' } });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
        this.setDropArea();
    };
    Uploader.prototype.renderPreLoadFiles = function () {
        if (isNullOrUndefined(this.files[0].size) || !isNullOrUndefined(this.template)) {
            return;
        }
        var files = [].slice.call(this.files);
        var filesData = [];
        if (!this.multiple) {
            this.clearData();
            files = [files[0]];
        }
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var data = files_1[_i];
            var fileData = {
                name: data.name + '.' + data.type.split('.')[data.type.split('.').length - 1],
                rawFile: '',
                size: data.size,
                status: this.localizedTexts('uploadSuccessMessage'),
                type: data.type,
                validationMessages: { minSize: '', maxSize: '' },
                statusCode: '2'
            };
            filesData.push(fileData);
            this.filesData.push(fileData);
        }
        this.createFileList(filesData);
        if (!this.autoUpload && this.listParent && !this.actionButtons && !this.isForm && this.showFileList) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    };
    Uploader.prototype.checkActionButtonStatus = function () {
        if (this.actionButtons) {
            var length_1 = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
                this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length_1 > 0 && length_1 === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
            else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    };
    Uploader.prototype.setDropArea = function () {
        var dropTextArea = this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof (this.dropArea) !== 'string') ? this.dropArea :
                document.querySelector(this.dropArea);
            var element = this.element;
            var enableDropText = false;
            while (element.parentNode) {
                element = element.parentNode;
                if (element === this.dropZoneElement) {
                    enableDropText = true;
                    dropTextArea.textContent = this.localizedTexts('dropFilesHint');
                }
            }
            if (!enableDropText) {
                dropTextArea.textContent = '';
            }
        }
        else {
            this.dropZoneElement = this.uploadWrapper;
            dropTextArea.textContent = this.localizedTexts('dropFilesHint');
        }
        this.bindDropEvents();
    };
    Uploader.prototype.setMultipleSelection = function () {
        if (this.multiple && !this.element.hasAttribute('multiple')) {
            var newAttr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
        else if (!this.multiple) {
            this.element.removeAttribute('multiple');
        }
    };
    Uploader.prototype.checkAutoUpload = function (fileData) {
        if (this.autoUpload) {
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.sequenceUpload(fileData);
            }
            else {
                this.upload(fileData);
            }
            this.removeActionButtons();
        }
        else if (!this.actionButtons) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    };
    Uploader.prototype.sequenceUpload = function (fileData) {
        if (this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1') {
            ++this.count;
            var isFileListCreated = this.showFileList ? false : true;
            if (typeof this.filesData[this.count] === 'object') {
                this.upload(this.filesData[this.count], isFileListCreated);
                if (this.filesData[this.count].statusCode === '0') {
                    this.sequenceUpload(fileData);
                }
            }
            else {
                --this.count;
            }
        }
    };
    Uploader.prototype.wireEvents = function () {
        EventHandler.add(this.browseButton, 'click', this.browseButtonClick, this);
        EventHandler.add(this.element, 'change', this.onSelectFiles, this);
        EventHandler.add(document, 'click', this.removeFocus, this);
        this.keyboardModule = new KeyboardEvents(this.uploadWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
    };
    Uploader.prototype.unWireEvents = function () {
        EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
        EventHandler.remove(document, 'click', this.removeFocus);
        this.keyboardModule.destroy();
    };
    Uploader.prototype.resetForm = function () {
        this.clearAll();
    };
    Uploader.prototype.keyActionHandler = function (e) {
        var targetElement = e.target;
        switch (e.action) {
            case 'next':
                if (e.target === this.browseButton && isNullOrUndefined(this.listParent)) {
                    this.browseButton.blur();
                }
                else if (e.target === this.uploadButton) {
                    this.uploadButton.blur();
                }
                else {
                    this.setTabFocus(e);
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.target === this.clearButton && this.uploadButton.hasAttribute('disabled')) {
                        this.clearButton.blur();
                    }
                }
                break;
            case 'previous':
                if (e.target === this.browseButton) {
                    this.browseButton.blur();
                }
                else {
                    this.setReverseFocus(e);
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            case 'enter':
                if (e.target === this.clearButton) {
                    this.clearButtonClick();
                }
                else if (e.target === this.uploadButton) {
                    this.uploadButtonClick();
                }
                else if (e.target === this.browseButton) {
                    this.browseButtonClick();
                }
                else if (targetElement.classList.contains(PAUSE_UPLOAD)) {
                    var metaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                }
                else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                }
                else if (targetElement.classList.contains(RETRY_ICON)) {
                    var metaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '1';
                    metaData.file.status = this.localizedTexts('readyToUploadMessage');
                    this.chunkUpload(metaData.file);
                }
                else {
                    this.removeFiles(e);
                    if (!targetElement.classList.contains(ABORT_ICON)) {
                        this.browseButton.focus();
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    };
    Uploader.prototype.getCurrentMetaData = function (fileInfo, e) {
        var fileData;
        var targetMetaData;
        if (isNullOrUndefined(fileInfo)) {
            var target = this.uploadWrapper.querySelector('.' + ICON_FOCUSED).parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        }
        else {
            fileData = fileInfo;
        }
        for (var i = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
            }
        }
        return targetMetaData;
    };
    Uploader.prototype.setReverseFocus = function (e) {
        var target = e.target;
        if (target === this.uploadButton) {
            this.uploadButton.blur();
            this.clearButton.focus();
        }
        else if (target === this.clearButton && this.listParent && this.listParent.querySelector('.e-icons')) {
            this.clearButton.blur();
            var items = [].slice.call(this.listParent.querySelectorAll('span.e-icons'));
            items[items.length - 1].classList.add(ICON_FOCUSED);
            items[items.length - 1].focus();
        }
        else {
            var iconElements = [].slice.call(this.listParent.querySelectorAll('span.e-icons'));
            var index = iconElements.indexOf(target);
            if (index > 0) {
                this.removeFocus();
                iconElements[index - 1].classList.add(ICON_FOCUSED);
                iconElements[index - 1].focus();
            }
            else {
                this.removeFocus();
                this.browseButton.focus();
            }
        }
    };
    Uploader.prototype.setTabFocus = function (e) {
        var target = e.target;
        if (target === this.clearButton) {
            this.removeFocus();
            if (this.uploadButton.hasAttribute('disabled')) {
                return;
            }
            this.uploadButton.focus();
        }
        else if (target.classList.contains('e-icons')) {
            var iconElements = [].slice.call(this.listParent.querySelectorAll('span.e-icons'));
            var index = iconElements.indexOf(target);
            if (index < (iconElements.length - 1)) {
                this.removeFocus();
                iconElements[index + 1].classList.add(ICON_FOCUSED);
                iconElements[index + 1].focus();
            }
            else {
                this.removeFocus();
                this.clearButton.focus();
            }
        }
        else {
            this.browseButton.blur();
            var iconElement = this.listParent.querySelectorAll('span.e-icons')[0];
            iconElement.focus();
            iconElement.classList.add(ICON_FOCUSED);
        }
    };
    Uploader.prototype.removeFocus = function () {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            document.activeElement.blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    };
    Uploader.prototype.browseButtonClick = function () {
        this.element.click();
    };
    Uploader.prototype.uploadButtonClick = function () {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        }
        else {
            this.upload(this.filesData);
        }
    };
    Uploader.prototype.clearButtonClick = function () {
        this.clearAll();
        /* istanbul ignore next */
        if (this.sequentialUpload) {
            this.count = -1;
        }
    };
    Uploader.prototype.bindDropEvents = function () {
        if (this.dropZoneElement) {
            EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    };
    Uploader.prototype.unBindDropEvents = function () {
        if (this.dropZoneElement) {
            EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    };
    Uploader.prototype.onDragLeave = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    };
    Uploader.prototype.dragHover = function (e) {
        if (!this.enabled) {
            return;
        }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        e.preventDefault();
        e.stopPropagation();
    };
    Uploader.prototype.dropElement = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    };
    /* istanbul ignore next */
    Uploader.prototype.onPasteFile = function (event) {
        var item = event.clipboardData.items;
        if (item.length !== 1) {
            return;
        }
        var pasteFile = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    };
    Uploader.prototype.removeFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var selectedElement = args.target.parentElement;
        var index = this.fileList.indexOf(selectedElement);
        var liElement = this.fileList[index];
        var fileData = this.filesData[index];
        if (args.target.classList.contains(ABORT_ICON)) {
            fileData.statusCode = '5';
            if (!isNullOrUndefined(liElement)) {
                var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                createSpinner({ target: spinnerTarget, width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.uploadSequential();
            }
        }
        else {
            this.remove(fileData, false, false, args);
        }
        this.element.value = '';
        this.checkActionButtonStatus();
    };
    Uploader.prototype.removeFilesData = function (file, customTemplate) {
        var index;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        var selectedElement = this.getLiElement(file);
        if (isNullOrUndefined(selectedElement)) {
            return;
        }
        detach(selectedElement);
        index = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (this.fileList.length === 0 && !isNullOrUndefined(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
            this.removeActionButtons();
        }
        if (this.sequentialUpload) {
            /* istanbul ignore next */
            if (index <= this.count) {
                --this.count;
            }
        }
    };
    Uploader.prototype.removeUploadedFile = function (file, eventArgs, removeDirectly, custom) {
        var _this = this;
        var selectedFiles = file;
        var name = this.element.getAttribute('name');
        var ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        var formData = new FormData();
        var liElement = this.getLiElement(file);
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            if (!removeDirectly) {
                _this.trigger('removing', eventArgs);
            }
            if (eventArgs.cancel) {
                e.cancel = true;
                return;
            }
            if (!isNullOrUndefined(liElement) && (!isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
                !isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
                var spinnerTarget = void 0;
                spinnerTarget = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) :
                    liElement.querySelector('.' + REMOVE_ICON);
                createSpinner({ target: spinnerTarget, width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (eventArgs.postRawFile && !isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
                formData.append(name, selectedFiles.rawFile);
            }
            else {
                formData.append(name, selectedFiles.name);
            }
            _this.updateFormData(formData, eventArgs.customFormData);
        };
        ajax.onLoad = function (e) { _this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    };
    /* istanbul ignore next */
    Uploader.prototype.updateFormData = function (formData, customData) {
        if (customData.length > 0 && customData[0]) {
            var _loop_1 = function (i) {
                var data = customData[i];
                // tslint:disable-next-line
                var value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            };
            for (var i = 0; i < customData.length; i++) {
                _loop_1(i);
            }
        }
    };
    Uploader.prototype.removeCompleted = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
        };
        this.trigger('success', args);
        this.removeFilesData(files, customTemplate);
        var index = this.uploadedFilesData.indexOf(files);
        this.uploadedFilesData.splice(index, 1);
        this.trigger('change', { files: this.uploadedFilesData });
    };
    Uploader.prototype.removeFailed = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            var index = this.filesData.indexOf(files);
            var rootElement = this.fileList[index];
            if (rootElement) {
                var statusElement = rootElement.querySelector('.' + STATUS);
                rootElement.classList.remove(UPLOAD_SUCCESS);
                statusElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                statusElement.classList.add(UPLOAD_FAILED);
            }
            this.checkActionButtonStatus();
        }
        this.trigger('failure', args);
        var liElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            var spinnerTarget = liElement.querySelector('.' + DELETE_ICON);
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.getFilesFromFolder = function (event) {
        this.filesEntries = [];
        var items;
        items = this.multiple ? event.dataTransfer.items : [event.dataTransfer.items[0]];
        var validDirectoryUpload = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) {
            return;
        }
        var _loop_2 = function (i) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isFile) {
                var files_2 = [];
                // tslint:disable-next-line
                (item).file(function (fileObj) {
                    var path = item.fullPath;
                    files_2.push({ 'path': path, 'file': fileObj });
                });
                this_1.renderSelectedFiles(event, files_2, true);
            }
            else if (item.isDirectory) {
                this_1.traverseFileTree(item, event);
            }
        };
        var this_1 = this;
        for (var i = 0; i < items.length; i++) {
            _loop_2(i);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.checkDirectoryUpload = function (items) {
        for (var i = 0; i < items.length; i++) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isDirectory) {
                return true;
            }
        }
        return false;
    };
    // tslint:disable
    /* istanbul ignore next */
    Uploader.prototype.traverseFileTree = function (item, event) {
        var _this = this;
        if (typeof (item) === 'boolean') {
            var files_3 = [];
            var _loop_3 = function (i) {
                this_2.filesEntries[i].file(function (fileObj) {
                    var path = _this.filesEntries[i].fullPath;
                    files_3.push({ 'path': path, 'file': fileObj });
                });
            };
            var this_2 = this;
            for (var i = 0; i < this.filesEntries.length; i++) {
                _loop_3(i);
            }
            this.renderSelectedFiles(event, files_3, true);
        }
        else if (item.isFile) {
            this.filesEntries.push(item);
        }
        else if (item.isDirectory) {
            // tslint:disable-next-line
            var directoryReader = item.createReader();
            // tslint:disable-next-line
            directoryReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    _this.traverseFileTree(entries[i]);
                    // tslint:disable-next-line
                }
                ;
                _this.traverseFileTree(true);
                _this.filesEntries = [];
            });
        }
    };
    // tslint:enable
    Uploader.prototype.onSelectFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var targetFiles;
        if (args.type === 'drop') {
            /* istanbul ignore next */
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            }
            else {
                var files = args.dataTransfer.files;
                targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                this.renderSelectedFiles(args, targetFiles);
            }
        }
        else {
            targetFiles = [].slice.call(args.target.files);
            this.renderSelectedFiles(args, targetFiles);
        }
    };
    Uploader.prototype.renderSelectedFiles = function (args, 
    // tslint:disable-next-line
    targetFiles, directory, paste) {
        var eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            isModified: false,
            modifiedFilesData: [],
            progressInterval: '',
            isCanceled: false
        };
        /* istanbul ignore next */
        if (targetFiles.length < 1) {
            eventArgs.isCanceled = true;
            this.trigger('selected', eventArgs);
            return;
        }
        var fileData = [];
        if (!this.multiple) {
            this.clearData(true);
            targetFiles = [targetFiles[0]];
        }
        for (var i = 0; i < targetFiles.length; i++) {
            var file = directory ? targetFiles[i].file : targetFiles[i];
            var fileName = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
                getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
                this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
            var fileDetails = {
                name: fileName,
                rawFile: file,
                size: file.size,
                status: this.localizedTexts('readyToUploadMessage'),
                type: this.getFileType(file.name),
                validationMessages: this.validatedFileSize(file.size),
                statusCode: '1'
            };
            if (paste) {
                fileDetails.fileSource = 'paste';
            }
            fileDetails.status = fileDetails.validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                fileDetails.validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : fileDetails.status;
            if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
                fileDetails.statusCode = '0';
            }
            fileData.push(fileDetails);
        }
        eventArgs.filesData = fileData;
        if (this.allowedExtensions.indexOf('*') > -1) {
            this.allTypes = true;
        }
        if (!this.allTypes) {
            fileData = this.checkExtension(fileData);
        }
        this.trigger('selected', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (this.showFileList) {
            if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                var dataFiles = this.allTypes ? eventArgs.modifiedFilesData :
                    this.checkExtension(eventArgs.modifiedFilesData);
                this.updateSortedFileList(dataFiles);
                this.filesData = dataFiles;
                if (!this.isForm) {
                    this.checkAutoUpload(dataFiles);
                }
            }
            else {
                this.createFileList(fileData);
                this.filesData = this.filesData.concat(fileData);
                if (!this.isForm) {
                    this.checkAutoUpload(fileData);
                }
            }
            if (!isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                this.progressInterval = eventArgs.progressInterval;
            }
        }
        else {
            this.filesData = this.filesData.concat(fileData);
            if (this.autoUpload) {
                this.upload(this.filesData, true);
            }
        }
    };
    Uploader.prototype.clearData = function (singleUpload) {
        if (!isNullOrUndefined(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
        }
        if (Browser.info.name !== 'msie' && !singleUpload) {
            this.element.value = '';
        }
        this.fileList = [];
        this.filesData = [];
        this.removeActionButtons();
    };
    Uploader.prototype.updateSortedFileList = function (filesData) {
        var previousListClone = this.createElement('div', { id: 'clonewrapper' });
        var added = -1;
        var removedList;
        if (this.listParent) {
            for (var i = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                var liElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = this.listParent.querySelectorAll('li');
            for (var _i = 0, removedList_1 = removedList; _i < removedList_1.length; _i++) {
                var item = removedList_1[_i];
                detach(item);
            }
            this.removeActionButtons();
            var oldList = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (var index = 0; index < filesData.length; index++) {
                for (var j = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j].name === filesData[index].name) {
                        this.listParent.appendChild(oldList[j]);
                        EventHandler.add(oldList[j].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j]);
                        added = index;
                    }
                }
                if (added !== index) {
                    this.createFileList([filesData[index]]);
                }
            }
        }
        else {
            this.createFileList(filesData);
        }
    };
    Uploader.prototype.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    Uploader.prototype.checkExtension = function (files) {
        var dropFiles = files;
        if (!this.isBlank(this.allowedExtensions)) {
            var allowedExtensions = [];
            var extensions = this.allowedExtensions.split(',');
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (var i = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    };
    Uploader.prototype.validatedFileSize = function (fileSize) {
        var minSizeError = '';
        var maxSizeError = '';
        if (fileSize < this.minFileSize) {
            minSizeError = this.localizedTexts('invalidMinFileSize');
        }
        else if (fileSize > this.maxFileSize) {
            maxSizeError = this.localizedTexts('invalidMaxFileSize');
        }
        else {
            minSizeError = '';
            maxSizeError = '';
        }
        var errorMessage = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    };
    Uploader.prototype.createCustomfileList = function (fileData) {
        this.createParentUL();
        for (var _i = 0, fileData_1 = fileData; _i < fileData_1.length; _i++) {
            var listItem = fileData_1[_i];
            var liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
            this.uploadTemplateFn = this.templateComplier(this.template);
            this.listParent.appendChild(liElement);
            var fromElements = [].slice.call(this.uploadTemplateFn(listItem));
            append(fromElements, liElement);
            this.fileList.push(liElement);
        }
    };
    Uploader.prototype.createParentUL = function () {
        if (isNullOrUndefined(this.listParent)) {
            this.listParent = this.createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    };
    Uploader.prototype.createFileList = function (fileData) {
        this.createParentUL();
        if (this.template !== '' && !isNullOrUndefined(this.template)) {
            this.createCustomfileList(fileData);
        }
        else {
            for (var _i = 0, fileData_2 = fileData; _i < fileData_2.length; _i++) {
                var listItem = fileData_2[_i];
                var liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
                var textContainer = this.createElement('span', { className: TEXT_CONTAINER });
                var textElement = this.createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                textElement.innerHTML = this.getFileNameOnly(listItem.name);
                var fileExtension = this.createElement('span', { className: FILE_TYPE });
                fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                if (!this.enableRtl) {
                    textContainer.appendChild(textElement);
                    textContainer.appendChild(fileExtension);
                }
                else {
                    var rtlContainer = this.createElement('span', { className: RTL_CONTAINER });
                    rtlContainer.appendChild(fileExtension);
                    rtlContainer.appendChild(textElement);
                    textContainer.appendChild(rtlContainer);
                }
                var fileSize = this.createElement('span', { className: FILE_SIZE });
                fileSize.innerHTML = this.bytesToSize(listItem.size);
                textContainer.appendChild(fileSize);
                var statusElement = this.createElement('span', { className: STATUS });
                textContainer.appendChild(statusElement);
                statusElement.innerHTML = listItem.status;
                liElement.appendChild(textContainer);
                var iconElement = this.createElement('span', { className: ' e-icons', attrs: { 'tabindex': '-1' } });
                /* istanbul ignore next */
                if (Browser.info.name === 'msie') {
                    iconElement.classList.add('e-msie');
                }
                iconElement.setAttribute('title', this.localizedTexts('remove'));
                liElement.appendChild(iconElement);
                EventHandler.add(iconElement, 'click', this.removeFiles, this);
                if (listItem.statusCode === '2') {
                    statusElement.classList.add(UPLOAD_SUCCESS);
                    iconElement.classList.add(DELETE_ICON);
                    iconElement.setAttribute('title', this.localizedTexts('delete'));
                }
                else if (listItem.statusCode !== '1') {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(VALIDATION_FAILS);
                }
                if (this.autoUpload && listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                    statusElement.innerHTML = '';
                }
                if (!iconElement.classList.contains(DELETE_ICON)) {
                    iconElement.classList.add(REMOVE_ICON);
                }
                this.listParent.appendChild(liElement);
                this.fileList.push(liElement);
                this.truncateName(textElement);
            }
        }
    };
    Uploader.prototype.truncateName = function (name) {
        var nameElement = name;
        var text;
        if (nameElement.offsetWidth < nameElement.scrollWidth) {
            text = nameElement.textContent;
            nameElement.dataset.tail = text.slice(text.length - 10);
        }
    };
    Uploader.prototype.getFileType = function (name) {
        var extension;
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    };
    Uploader.prototype.getFileNameOnly = function (name) {
        var type = this.getFileType(name);
        var names = name.split('.' + type);
        return type = names[0];
    };
    Uploader.prototype.setInitialAttributes = function () {
        if (this.initialAttr.accept) {
            this.element.setAttribute('accept', this.initialAttr.accept);
        }
        if (this.initialAttr.disabled) {
            this.element.setAttribute('disabled', 'disabled');
        }
        if (this.initialAttr.multiple) {
            var newAttr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    };
    Uploader.prototype.filterfileList = function (files) {
        var filterFiles = [];
        var li;
        for (var i = 0; i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    };
    Uploader.prototype.updateStatus = function (files, status, statusCode) {
        if (!(status === '' || isNullOrUndefined(status)) && !(statusCode === '' || isNullOrUndefined(statusCode))) {
            files.status = status;
            files.statusCode = statusCode;
        }
        var li = this.getLiElement(files);
        if (!isNullOrUndefined(li)) {
            if (!isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || isNullOrUndefined(status)))) {
                li.querySelector('.' + STATUS).textContent = status;
            }
        }
        return files;
    };
    Uploader.prototype.getLiElement = function (files) {
        var index;
        for (var i = 0; i < this.filesData.length; i++) {
            if (this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    };
    Uploader.prototype.createProgressBar = function (liElement) {
        var progressbarWrapper = this.createElement('span', { className: PROGRESS_WRAPPER });
        var progressBar = this.createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        var progressbarInnerWrapper = this.createElement('span', { className: PROGRESS_INNER_WRAPPER });
        progressBar.setAttribute('style', 'width: 0%');
        var progressbarText = this.createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    };
    /* istanbul ignore next */
    Uploader.prototype.updateProgressbar = function (e, li) {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                var value = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            }
            else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    };
    Uploader.prototype.changeProgressValue = function (li, progressValue) {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue);
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    };
    Uploader.prototype.uploadInProgress = function (e, files, customUI, request) {
        var li = this.getLiElement(files);
        if (isNullOrUndefined(li) && (!customUI)) {
            return;
        }
        if (!isNullOrUndefined(li)) {
            /* istanbul ignore next */
            if (files.statusCode === '5') {
                this.cancelUploadingFile(files, e, request, li);
            }
            if (!(li.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0) && li.querySelector('.' + STATUS)) {
                li.querySelector('.' + STATUS).classList.add(UPLOAD_INPROGRESS);
                this.createProgressBar(li);
                this.updateProgressBarClasses(li, UPLOAD_INPROGRESS);
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            }
            this.updateProgressbar(e, li);
            var iconEle = li.querySelector('.' + REMOVE_ICON);
            if (!isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        }
        else {
            this.cancelUploadingFile(files, e, request);
        }
        var args = { e: e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3') };
        this.trigger('progress', args);
    };
    /* istanbul ignore next */
    Uploader.prototype.cancelUploadingFile = function (files, e, request, li) {
        var _this = this;
        if (files.statusCode === '5') {
            var eventArgs = {
                event: e,
                fileData: files,
                cancel: false
            };
            this.trigger('canceling', eventArgs);
            if (eventArgs.cancel) {
                files.statusCode = '3';
                if (!isNullOrUndefined(li)) {
                    var spinnerTarget = li.querySelector('.' + ABORT_ICON);
                    if (!isNullOrUndefined(spinnerTarget)) {
                        hideSpinner(spinnerTarget);
                        detach(li.querySelector('.e-spinner-pane'));
                    }
                }
                return;
            }
            request.emitError = false;
            request.httpRequest.abort();
            var formData = new FormData();
            if (files.statusCode === '5') {
                var name_1 = this.element.getAttribute('name');
                formData.append(name_1, files.name);
                formData.append('cancel-uploading', files.name);
                var ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                ajax.onLoad = function (e) { _this.removecanceledFile(e, files); return {}; };
                ajax.send(formData);
            }
        }
    };
    Uploader.prototype.removecanceledFile = function (e, file) {
        var liElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) {
            return;
        }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        var spinnerTarget = liElement.querySelector('.' + REMOVE_ICON);
        if (!isNullOrUndefined(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var args = { event: e, response: requestResponse, operation: 'cancel', file: file };
        this.trigger('success', args);
    };
    Uploader.prototype.renderFailureState = function (e, file, liElement) {
        var _this = this;
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
        if (isNullOrUndefined(deleteIcon)) {
            return;
        }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': '-1' } });
        liElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        /* istanbul ignore next */
        retryElement.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement, false); }, false);
    };
    Uploader.prototype.reloadcanceledFile = function (e, file, liElement, custom) {
        file.statusCode = '1';
        file.status = this.localizedTexts('readyToUploadMessage');
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!isNullOrUndefined(liElement.querySelector('.' + RETRY_ICON))) {
                detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }
        if (this.sequentialUpload) {
            /* istanbul ignore next */
            liElement.classList.add(RESTRICT_SEQUENTIAL);
        }
        this.upload([file]);
    };
    /* istanbul ignore next */
    Uploader.prototype.uploadComplete = function (e, file, customUI) {
        var status = e.target;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            var li = this.getLiElement(file);
            if (isNullOrUndefined(li) && (!customUI || isNullOrUndefined(customUI))) {
                return;
            }
            if (!isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                var iconEle = li.querySelector('.' + ABORT_ICON);
                if (!isNullOrUndefined(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', this.localizedTexts('delete'));
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        }
        else {
            this.uploadFailed(e, file);
        }
    };
    Uploader.prototype.getResponse = function (e) {
        // tslint:disable-next-line
        var target = e.currentTarget;
        var response = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    };
    Uploader.prototype.raiseSuccessEvent = function (e, file) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, this.localizedTexts('uploadSuccessMessage'), '2')
        };
        this.trigger('success', args);
        this.uploadedFilesData.push(file);
        this.trigger('change', { file: this.uploadedFilesData });
        this.checkActionButtonStatus();
        if (this.sequentialUpload && this.fileList.length > 0) {
            if ((!(this.getLiElement(file)).classList.contains(RESTRICT_SEQUENTIAL))) {
                this.uploadSequential();
            }
            else {
                /* istanbul ignore next */
                (this.getLiElement(file)).classList.remove(RESTRICT_SEQUENTIAL);
            }
        }
    };
    Uploader.prototype.uploadFailed = function (e, file) {
        var li = this.getLiElement(file);
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, this.localizedTexts('uploadFailedMessage'), '0')
        };
        if (!isNullOrUndefined(li)) {
            this.renderFailureState(e, file, li);
        }
        this.trigger('failure', args);
        this.checkActionButtonStatus();
        this.uploadSequential();
    };
    Uploader.prototype.uploadSequential = function () {
        if (this.sequentialUpload) {
            if (this.autoUpload) {
                /* istanbul ignore next */
                this.checkAutoUpload(this.filesData);
            }
            else {
                this.uploadButtonClick();
            }
        }
    };
    Uploader.prototype.updateProgressBarClasses = function (li, className) {
        var progressBar = li.querySelector('.' + PROGRESSBAR);
        if (!isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    };
    Uploader.prototype.removeProgressbar = function (li, callType) {
        var _this = this;
        if (!isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(function () { _this.animateProgressBar(li, callType); }, 750);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.animateProgressBar = function (li, callType) {
        if (callType === 'success') {
            li.classList.add(UPLOAD_SUCCESS);
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        }
        else {
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) {
            detach(li.querySelector('.' + PROGRESS_WRAPPER));
        }
    };
    Uploader.prototype.setExtensions = function (extensions) {
        this.element.setAttribute('accept', extensions);
    };
    Uploader.prototype.templateComplier = function (uploadTemplate) {
        if (uploadTemplate) {
            var exception = void 0;
            try {
                if (document.querySelectorAll(uploadTemplate).length) {
                    return compile(document.querySelector(uploadTemplate).innerHTML.trim());
                }
            }
            catch (exception) {
                return compile(uploadTemplate);
            }
        }
        return undefined;
    };
    Uploader.prototype.setRTL = function () {
        this.enableRtl ? addClass([this.uploadWrapper], RTL) : removeClass([this.uploadWrapper], RTL);
    };
    Uploader.prototype.localizedTexts = function (localeText) {
        this.l10n.setLocale(this.locale);
        return this.l10n.getConstant(localeText);
    };
    Uploader.prototype.setControlStatus = function () {
        if (!this.enabled) {
            this.uploadWrapper.classList.add(DISABLED);
            this.element.setAttribute('disabled', 'disabled');
            this.browseButton.setAttribute('disabled', 'disabled');
            if (!isNullOrUndefined(this.clearButton)) {
                this.clearButton.setAttribute('disabled', 'disabled');
            }
            if (!isNullOrUndefined(this.uploadButton)) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
        }
        else {
            if (this.uploadWrapper.classList.contains(DISABLED)) {
                this.uploadWrapper.classList.remove(DISABLED);
            }
            if (!isNullOrUndefined(this.browseButton) && this.element.hasAttribute('disabled')) {
                this.element.removeAttribute('disabled');
                this.browseButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.clearButton) && this.clearButton.hasAttribute('disabled')) {
                this.clearButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.uploadButton) && this.uploadButton.hasAttribute('disabled')) {
                this.uploadButton.hasAttribute('disabled');
            }
        }
    };
    Uploader.prototype.checkHTMLAttributes = function () {
        if (this.element.hasAttribute('accept')) {
            this.allowedExtensions = this.element.getAttribute('accept');
            this.initialAttr.accept = this.allowedExtensions;
        }
        if (this.element.hasAttribute('multiple')) {
            this.multiple = true;
            this.initialAttr.multiple = true;
        }
        if (this.element.hasAttribute('disabled')) {
            this.enabled = false;
            this.initialAttr.disabled = true;
        }
    };
    Uploader.prototype.chunkUpload = function (file, custom) {
        var start = 0;
        var end = Math.min(this.asyncSettings.chunkSize, file.size);
        var index = 0;
        var blob = file.rawFile.slice(start, end);
        var metaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom);
    };
    Uploader.prototype.sendRequest = function (file, metaData, custom) {
        var _this = this;
        var formData = new FormData();
        var blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        var totalChunk = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        var ajax = new Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.onLoad = function (e) { _this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = function (e) {
            _this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        var eventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                _this.trigger('uploading', eventArgs);
            }
            _this.trigger('chunkUploading', eventArgs);
            if (eventArgs.cancel) {
                _this.eventCancelByArgs(e, eventArgs, file);
            }
            else {
                _this.updateFormData(formData, eventArgs.customFormData);
            }
        };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    };
    Uploader.prototype.eventCancelByArgs = function (e, eventArgs, file) {
        var _this = this;
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') {
            return;
        }
        var liElement = this.getLiElement(eventArgs.fileData);
        liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
        liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': '-1' } });
        liElement.insertBefore(this.pauseButton, liElement.querySelector('.' + REMOVE_ICON));
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        /* istanbul ignore next */
        this.pauseButton.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement); }, false);
        this.checkActionButtonStatus();
    };
    Uploader.prototype.checkChunkUpload = function () {
        return (this.asyncSettings.chunkSize <= 0 || isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    };
    Uploader.prototype.chunkUploadComplete = function (e, metaData, custom) {
        var _this = this;
        var response = e.target;
        var liElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
            var totalChunk = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            var eventArgs = {
                event: e,
                file: metaData.file,
                chunkIndex: metaData.chunkIndex,
                totalChunk: totalChunk,
                chunkSize: this.asyncSettings.chunkSize,
                response: requestResponse
            };
            this.trigger('chunkSuccess', eventArgs);
            if (isNullOrUndefined(custom) || !custom) {
                liElement = this.getLiElement(metaData.file);
            }
            this.updateMetaData(metaData);
            if (metaData.end === metaData.file.size) {
                metaData.file.statusCode = '3';
            }
            if (metaData.file.statusCode === '5') {
                var eventArgs_1 = { event: e, fileData: metaData.file, cancel: false };
                this.trigger('canceling', eventArgs_1);
                if (eventArgs_1.cancel) {
                    metaData.file.statusCode = '3';
                    var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                    if (!isNullOrUndefined(liElement) && !isNullOrUndefined(spinnerTarget)) {
                        hideSpinner(spinnerTarget);
                        detach(liElement.querySelector('.e-spinner-pane'));
                    }
                    this.sendNextRequest(metaData);
                    return;
                }
                metaData.request.emitError = false;
                response.abort();
                var formData = new FormData();
                var name_2 = this.element.getAttribute('name');
                formData.append(name_2, metaData.file.name);
                formData.append('cancel-uploading', metaData.file.name);
                formData.append('cancelUploading', metaData.file.name);
                var ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                ajax.onLoad = function (e) { _this.removeChunkFile(e, metaData, custom); return {}; };
                ajax.send(formData);
            }
            else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    var index = this.pausedData.indexOf(metaData);
                    if (index >= 0) {
                        this.pausedData.splice(index, 1);
                    }
                    if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
                        if (liElement) {
                            detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        this.removeChunkProgressBar(metaData);
                    }
                    this.raiseSuccessEvent(e, metaData.file);
                    return;
                }
                this.sendNextRequest(metaData);
            }
        }
        else {
            this.chunkUploadFailed(e, metaData);
        }
    };
    Uploader.prototype.sendNextRequest = function (metaData) {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.removeChunkFile = function (e, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) && !custom)) {
            var liElement = this.getLiElement(metaData.file);
            var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
            var spinnerTarget = deleteIcon;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            var pauseIcon = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(deleteIcon)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    };
    Uploader.prototype.pauseUpload = function (metaData, e, custom) {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    };
    Uploader.prototype.abortUpload = function (metaData, custom, eventArgs) {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        var liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            var targetElement = liElement.querySelector('.' + PAUSE_UPLOAD);
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (var i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        this.trigger('pausing', eventArgs);
    };
    Uploader.prototype.resumeUpload = function (metaData, e, custom) {
        var liElement = this.getLiElement(metaData.file);
        var targetElement;
        if (!isNullOrUndefined(liElement)) {
            targetElement = liElement.querySelector('.' + RESUME_UPLOAD);
        }
        if (!isNullOrUndefined(targetElement) && (isNullOrUndefined(custom) || !custom)) {
            targetElement.classList.remove(RESUME_UPLOAD);
            targetElement.classList.add(PAUSE_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('pause'));
            targetElement.nextElementSibling.classList.remove(REMOVE_ICON);
            targetElement.nextElementSibling.classList.add(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('abort'));
        }
        metaData.file.status = this.localizedTexts('inProgress');
        metaData.file.statusCode = '3';
        this.updateMetaData(metaData);
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.trigger('resuming', eventArgs);
        for (var i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].end === this.pausedData[i].file.size) {
                this.chunkUploadComplete(e, metaData, custom);
            }
            else {
                if (this.pausedData[i].file.name === metaData.file.name) {
                    this.pausedData[i].start = this.pausedData[i].end;
                    this.pausedData[i].end = this.pausedData[i].end + this.asyncSettings.chunkSize;
                    this.pausedData[i].end = Math.min(this.pausedData[i].end, this.pausedData[i].file.size);
                    this.pausedData[i].chunkIndex = this.pausedData[i].chunkIndex + 1;
                    this.sendRequest(this.pausedData[i].file, this.pausedData[i], custom);
                }
            }
        }
    };
    Uploader.prototype.updateMetaData = function (metaData) {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        }
        else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    };
    Uploader.prototype.removeChunkProgressBar = function (metaData) {
        var liElement = this.getLiElement(metaData.file);
        if (!isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            var cancelButton = liElement.querySelector('.' + ABORT_ICON);
            if (!isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    };
    Uploader.prototype.chunkUploadFailed = function (e, metaData, custom) {
        var _this = this;
        var chunkCount = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        var liElement;
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var eventArgs = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        this.trigger('chunkFailure', eventArgs);
        // To prevent triggering of failure event
        // tslint:disable-next-line
        if (!eventArgs.cancel) {
            if (metaData.retryCount < this.asyncSettings.retryCount) {
                setTimeout(function () { _this.retryRequest(liElement, metaData, custom); }, this.asyncSettings.retryAfterDelay);
            }
            else {
                if (!isNullOrUndefined(liElement)) {
                    var pauseButton = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                        liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                    if (!isNullOrUndefined(pauseButton)) {
                        pauseButton.classList.add(RETRY_ICON);
                        pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                    }
                    this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                    this.removeProgressbar(liElement, 'failure');
                    liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                    var iconElement = liElement.querySelector('.' + ABORT_ICON);
                    iconElement.classList.remove(ABORT_ICON);
                    if (!isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                        detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                    }
                    if (metaData.start > 0) {
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    }
                    else {
                        iconElement.classList.add(REMOVE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('remove'));
                    }
                }
                metaData.retryCount = 0;
                var file = metaData.file;
                var args = {
                    e: e, response: requestResponse,
                    operation: 'upload',
                    file: this.updateStatus(file, this.localizedTexts('uploadFailedMessage'), '0')
                };
                this.trigger('failure', args);
                this.uploadSequential();
            }
        }
    };
    Uploader.prototype.retryRequest = function (liElement, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.checkPausePlayAction = function (e) {
        var targetElement = e.target;
        var selectedElement = e.target.parentElement;
        var index = this.fileList.indexOf(selectedElement);
        var fileData = this.filesData[index];
        var metaData = this.getCurrentMetaData(fileData);
        if (targetElement.classList.contains(PAUSE_UPLOAD)) {
            this.pauseUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RESUME_UPLOAD)) {
            this.resumeUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RETRY_ICON)) {
            if (metaData.file.status === this.localizedTexts('fileUploadCancel')) {
                this.retryUpload(metaData, false);
            }
            else {
                this.retryUpload(metaData, true);
            }
        }
    };
    Uploader.prototype.retryUpload = function (metaData, fromcanceledStage) {
        if (fromcanceledStage) {
            metaData.end = metaData.end + this.asyncSettings.chunkSize;
            metaData.start = metaData.start + this.asyncSettings.chunkSize;
            this.sendRequest(metaData.file, metaData);
        }
        else {
            metaData.file.statusCode = '1';
            metaData.file.status = this.localizedTexts('readyToUploadMessage');
            this.chunkUpload(metaData.file);
        }
        if (this.sequentialUpload) {
            /* istanbul ignore next */
            (this.getLiElement(metaData.file)).classList.add(RESTRICT_SEQUENTIAL);
        }
    };
    Uploader.prototype.chunkUploadInProgress = function (e, metaData, custom) {
        var _this = this;
        if (metaData.file.statusCode === '4') {
            return;
        }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        var liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(liElement)) {
            return;
        }
        var target;
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        if (!isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                var statusElement = liElement.querySelector('.' + STATUS);
                if (isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                var clearIcon = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                    liElement.querySelector('.' + DELETE_ICON);
                if (!isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && isNullOrUndefined(this.template) && metaData.file.statusCode !== '4') {
                var loadedSize = (metaData.chunkIndex * this.asyncSettings.chunkSize);
                var value = Math.min((((loadedSize + e.loaded) / metaData.file.size) * 100), 100);
                this.changeProgressValue(liElement, Math.round(value).toString() + '%');
            }
            if (metaData.chunkIndex === 0) {
                this.checkActionButtonStatus();
            }
        }
        if (isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD)) && isNullOrUndefined(this.template)) {
            this.pauseButton = this.createElement('span', { className: 'e-icons e-file-pause-btn', attrs: { 'tabindex': '-1' } });
            if (Browser.info.name === 'msie') {
                this.pauseButton.classList.add('e-msie');
            }
            liElement.insertBefore(this.pauseButton, liElement.querySelector('.' + ABORT_ICON));
            this.pauseButton.setAttribute('title', this.localizedTexts('pause'));
            this.pauseButton.addEventListener('click', function (e) { _this.checkPausePlayAction(e); }, false);
        }
    };
    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    Uploader.prototype.bytesToSize = function (bytes) {
        var i = -1;
        var size;
        if (!bytes) {
            return '0.0 KB';
        }
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        if (i >= 2) {
            bytes = bytes * 1024;
            i = 1;
        }
        return Math.max(bytes, 0).toFixed(1) + ' ' + ['KB', 'MB'][i];
    };
    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */
    Uploader.prototype.sortFileList = function (filesData) {
        var files = filesData;
        var fileNames = [];
        for (var i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        var sortedFileNames = fileNames.sort();
        var sortedFilesData = [];
        var index = 0;
        for (var _i = 0, sortedFileNames_1 = sortedFileNames; _i < sortedFileNames_1.length; _i++) {
            var name_3 = sortedFileNames_1[_i];
            for (var i = 0; i < files.length; i++) {
                if (name_3 === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    Uploader.prototype.destroy = function () {
        this.element.value = null;
        this.clearAll();
        this.unWireEvents();
        this.unBindDropEvents();
        if (this.multiple) {
            this.element.removeAttribute('multiple');
        }
        if (!this.enabled) {
            this.element.removeAttribute('disabled');
        }
        this.element.removeAttribute('accept');
        this.setInitialAttributes();
        this.uploadWrapper.parentElement.appendChild(this.cloneElement);
        this.cloneElement.classList.remove('e-control', ROOT);
        detach(this.uploadWrapper);
        this.uploadWrapper = null;
        _super.prototype.destroy.call(this);
    };
    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument.
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    Uploader.prototype.upload = function (files, custom) {
        var uploadFiles = this.validateFileType(files);
        this.uploadFiles(uploadFiles, custom);
    };
    Uploader.prototype.validateFileType = function (files) {
        var uploadFiles = [];
        if (files instanceof Array) {
            uploadFiles = files;
        }
        else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    };
    Uploader.prototype.uploadFiles = function (files, custom) {
        var _this = this;
        var selectedFiles = [];
        if (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl)) {
            return;
        }
        if (!custom || isNullOrUndefined(custom)) {
            if (!this.multiple) {
                var file = [];
                file.push(files[0]);
                selectedFiles = this.filterfileList(file);
            }
            else {
                selectedFiles = this.filterfileList(files);
            }
        }
        else {
            selectedFiles = files;
        }
        var chunkEnabled = this.checkChunkUpload();
        var _loop_4 = function (i) {
            var ajax = new Ajax(this_3.asyncSettings.saveUrl, 'POST', true, null);
            var eventArgs = {
                fileData: selectedFiles[i],
                customFormData: [],
                cancel: false
            };
            var formData = new FormData();
            ajax.beforeSend = function (e) {
                eventArgs.currentRequest = ajax.httpRequest;
                _this.trigger('uploading', eventArgs);
                if (eventArgs.cancel) {
                    _this.eventCancelByArgs(e, eventArgs, selectedFiles[i]);
                }
                _this.updateFormData(formData, eventArgs.customFormData);
            };
            if (selectedFiles[i].statusCode === '1') {
                var name_4 = this_3.element.getAttribute('name');
                formData.append(name_4, selectedFiles[i].rawFile, selectedFiles[i].name);
                if (chunkEnabled && selectedFiles[i].size > this_3.asyncSettings.chunkSize) {
                    this_3.chunkUpload(selectedFiles[i], custom);
                }
                else {
                    ajax.onLoad = function (e) { _this.uploadComplete(e, selectedFiles[i], custom); return {}; };
                    ajax.onUploadProgress = function (e) {
                        _this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                        return {};
                    };
                    /* istanbul ignore next */
                    ajax.onError = function (e) { _this.uploadFailed(e, selectedFiles[i]); return {}; };
                    ajax.send(formData);
                }
            }
        };
        var this_3 = this;
        for (var i = 0; i < selectedFiles.length; i++) {
            _loop_4(i);
        }
    };
    /**
     * Remove the uploaded file from server manually by calling the remove URL action.
     * If you pass an empty argument to this method, the complete file list can be cleared,
     * otherwise remove the specific file based on its argument (“file_data”).
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to remove from file list/server.
     * @param { boolean } customTemplate - Set true if the component rendering with customize template.
     * @param { boolean } removeDirectly - Set true if files remove without removing event.
     * @returns void
     */
    Uploader.prototype.remove = function (fileData, customTemplate, removeDirectly, args) {
        var eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: true
        };
        if (this.isForm) {
            eventArgs.filesData = this.getFilesData();
            this.trigger('removing', eventArgs);
            if (!eventArgs.cancel) {
                this.clearAll();
            }
            return;
        }
        var removeFiles = [];
        fileData = !isNullOrUndefined(fileData) ? fileData : this.filesData;
        if (fileData instanceof Array) {
            removeFiles = fileData;
        }
        else {
            removeFiles.push(fileData);
        }
        eventArgs.filesData = removeFiles;
        var removeUrl = this.asyncSettings.removeUrl;
        var validUrl = (removeUrl === '' || isNullOrUndefined(removeUrl)) ? false : true;
        for (var _i = 0, removeFiles_1 = removeFiles; _i < removeFiles_1.length; _i++) {
            var files = removeFiles_1[_i];
            if ((files.statusCode === '2' || files.statusCode === '4') && validUrl) {
                this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
            }
            else {
                if (!removeDirectly) {
                    this.trigger('removing', eventArgs);
                }
                if (eventArgs.cancel) {
                    return;
                }
                this.removeFilesData(files, customTemplate);
            }
        }
    };
    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    Uploader.prototype.clearAll = function () {
        if (isNullOrUndefined(this.listParent)) {
            if (Browser.info.name !== 'msie') {
                this.element.value = '';
            }
            this.filesData = [];
            return;
        }
        var eventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        this.trigger('clearing', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.clearData();
    };
    /**
     * Get the data of files which are shown in file list.
     * @returns FileInfo[]
     */
    Uploader.prototype.getFilesData = function () {
        return this.filesData;
    };
    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.pause = function (fileData, custom) {
        var fileDataFiles = this.validateFileType(fileData);
        this.pauseUploading(fileDataFiles, custom);
    };
    Uploader.prototype.pauseUploading = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    Uploader.prototype.getFiles = function (fileData) {
        var files = [];
        if (!isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        }
        else {
            files = fileData;
        }
        return files;
    };
    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.resume = function (fileData, custom) {
        var fileDataFiles = this.validateFileType(fileData);
        this.resumeFiles(fileDataFiles, custom);
    };
    Uploader.prototype.resumeFiles = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    Uploader.prototype.retry = function (fileData, fromcanceledStage, custom) {
        var fileDataFiles = this.validateFileType(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    };
    Uploader.prototype.retryFailedFiles = function (fileData, fromcanceledStage, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                }
                else {
                    var liElement = void 0;
                    if (!custom) {
                        liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    };
    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    Uploader.prototype.cancel = function (fileData) {
        var cancelingFiles = this.validateFileType(fileData);
        this.cancelUpload(cancelingFiles);
    };
    Uploader.prototype.cancelUpload = function (fileData) {
        var files = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    var metaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
        else {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    };
    Uploader.prototype.showHideUploadSpinner = function (files) {
        var liElement = this.getLiElement(files);
        if (!isNullOrUndefined(liElement) && isNullOrUndefined(this.template)) {
            var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
    };
    __decorate([
        Complex({ saveUrl: '', removeUrl: '' }, AsyncSettings)
    ], Uploader.prototype, "asyncSettings", void 0);
    __decorate([
        Property(false)
    ], Uploader.prototype, "sequentialUpload", void 0);
    __decorate([
        Property(false)
    ], Uploader.prototype, "enableRtl", void 0);
    __decorate([
        Property(true)
    ], Uploader.prototype, "enabled", void 0);
    __decorate([
        Property(null)
    ], Uploader.prototype, "template", void 0);
    __decorate([
        Property(true)
    ], Uploader.prototype, "multiple", void 0);
    __decorate([
        Property(true)
    ], Uploader.prototype, "autoUpload", void 0);
    __decorate([
        Complex({}, ButtonsProps)
    ], Uploader.prototype, "buttons", void 0);
    __decorate([
        Property('')
    ], Uploader.prototype, "allowedExtensions", void 0);
    __decorate([
        Property(0)
    ], Uploader.prototype, "minFileSize", void 0);
    __decorate([
        Property(30000000)
    ], Uploader.prototype, "maxFileSize", void 0);
    __decorate([
        Property(null)
    ], Uploader.prototype, "dropArea", void 0);
    __decorate([
        Collection([{}], FilesProp)
    ], Uploader.prototype, "files", void 0);
    __decorate([
        Property(true)
    ], Uploader.prototype, "showFileList", void 0);
    __decorate([
        Property(false)
    ], Uploader.prototype, "directoryUpload", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "created", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "selected", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "uploading", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "success", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "failure", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "removing", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "clearing", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "progress", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "change", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "chunkSuccess", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "chunkFailure", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "chunkUploading", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "canceling", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "pausing", void 0);
    __decorate([
        Event()
    ], Uploader.prototype, "resuming", void 0);
    Uploader = __decorate([
        NotifyPropertyChanges
    ], Uploader);
    return Uploader;
}(Component));
export { Uploader };
