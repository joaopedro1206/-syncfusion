import { Dialog, Popup } from '-syncfusion/ej2-popups';
import { Schedule } from '../base/schedule';
import { EventClickArgs } from '../base/interface';
/**
 * Quick Popups interactions
 */
export declare class QuickPopups {
    private l10n;
    private parent;
    private crudAction;
    private isMultipleEventSelect;
    quickDialog: Dialog;
    quickPopup: Popup;
    morePopup: Popup;
    private fieldValidator;
    /**
     * Constructor for QuickPopups
     */
    constructor(parent: Schedule);
    private render;
    private renderQuickPopup;
    private renderMorePopup;
    private renderQuickDialog;
    private renderButton;
    private quickDialogClass;
    private applyFormValidation;
    openRecurrenceAlert(): void;
    openRecurrenceValidationAlert(type: string): void;
    openDeleteAlert(): void;
    openValidationError(type: string): void;
    private showQuickDialog;
    private createMoreEventList;
    tapHoldEventPopup(e: Event): void;
    private isCellBlocked;
    private cellClick;
    private isSameEventClick;
    private eventClick;
    private getResourceText;
    private getFormattedString;
    moreEventClick(data: EventClickArgs, endDate: Date, groupIndex?: string): void;
    private saveClick;
    private detailsClick;
    private editClick;
    deleteClick(): void;
    private updateMoreEventContent;
    private closeClick;
    private dialogButtonClick;
    private updateTapHoldEventPopup;
    private getTimezone;
    private getRecurrenceSummary;
    private getDateFormat;
    private getDataFromTarget;
    private beforeQuickDialogClose;
    private beforeQuickPopupOpen;
    private applyEventColor;
    private quickPopupOpen;
    private quickPopupClose;
    private morePopupOpen;
    private morePopupClose;
    quickPopupHide(hideAnimation?: Boolean): void;
    private navigationClick;
    private documentClick;
    onClosePopup(): void;
    private addEventListener;
    private removeEventListner;
    private destroyButtons;
    destroy(): void;
}
