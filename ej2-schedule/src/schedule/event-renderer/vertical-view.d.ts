import { Schedule } from '../base/schedule';
import { EventBase } from './event-base';
/**
 * Vertical view appointment rendering
 */
export declare class VerticalEvent extends EventBase {
    private dateRender;
    private renderedEvents;
    private renderedAllDayEvents;
    private overlapEvents;
    private moreEvents;
    private overlapList;
    private allDayEvents;
    private slotCount;
    private interval;
    private allDayLevel;
    private startHour;
    private endHour;
    private element;
    private allDayElement;
    private animation;
    private fields;
    private cellHeight;
    private resources;
    /**
     * Constructor for vertical view
     */
    constructor(parent: Schedule);
    renderAppointments(): void;
    private initializeValues;
    private isValidEvent;
    private getHeight;
    private appendEvent;
    private processBlockEvents;
    private renderBlockEvents;
    private renderEvents;
    private setValues;
    private getResourceList;
    private createAppointmentElement;
    private createMoreIndicator;
    private renderSpannedIcon;
    private isSpannedEvent;
    private renderAllDayEvents;
    private renderNormalEvents;
    private getTopValue;
    private getOverlapIndex;
    private adjustOverlapElements;
    private setAllDayRowHeight;
    private addOrRemoveClass;
    private getEventHeight;
    private rowExpandCollapse;
    private animationUiUpdate;
}
