import { EventClickArgs, TdData } from '../base/interface';
import { Timezone } from '../timezone/timezone';
import { Schedule } from '../base/schedule';
/**
 * EventBase for appointment rendering
 */
export declare class EventBase {
    parent: Schedule;
    timezone: Timezone;
    slots: Object[];
    cssClass: string;
    groupOrder: string[];
    /**
     * Constructor for EventBase
     */
    constructor(parent: Schedule);
    processData(events: {
        [key: string]: Object;
    }[], timeZonePropChanged?: boolean, oldTimezone?: string): Object[];
    timezonePropertyChange(oldTimezone: string): void;
    /** @private */
    timezoneConvert(eventData: {
        [key: string]: Object;
    }): void;
    private processTimezoneChange;
    private processTimezone;
    filterBlockEvents(eventObj: {
        [key: string]: Object;
    }): Object[];
    filterEvents(startDate: Date, endDate: Date, appointments?: Object[], resourceTdData?: TdData): Object[];
    filterEventsByResource(resourceTdData: TdData, appointments?: Object[]): Object[];
    sortByTime(appointments: Object[]): Object[];
    sortByDateTime(appointments: Object[]): Object[];
    getSmallestMissingNumber(array: Object[]): number;
    splitEventByDay(event: {
        [key: string]: Object;
    }): Object[];
    splitEvent(event: {
        [key: string]: Object;
    }, dateRender: Date[]): {
        [key: string]: Object;
    }[];
    private cloneEventObject;
    private dateInRange;
    getSelectedEventElements(target: Element): Element[];
    getSelectedEvents(): EventClickArgs;
    removeSelectedAppointmentClass(): void;
    addSelectedAppointments(cells: Element[]): void;
    getSelectedAppointments(): Element[];
    focusElement(): void;
    selectWorkCellByTime(eventsData: Object[]): Element;
    getGroupIndexFromEvent(eventData: {
        [key: string]: Object;
    }): number;
    isAllDayAppointment(event: {
        [key: string]: Object;
    }): boolean;
    addEventListener(): void;
    private appointmentBorderRemove;
    wireAppointmentEvents(element: HTMLElement, isAllDay?: boolean, event?: {
        [key: string]: Object;
    }): void;
    renderResizeHandler(element: HTMLElement, spanEvent: {
        [key: string]: Object;
    }, isReadOnly: boolean): void;
    private eventClick;
    private eventDoubleClick;
    getEventByGuid(guid: string): Object;
    generateGuid(): string;
    getEventIDType(): string;
    getEventMaxID(resourceId?: number): number | string;
    private activeEventData;
    generateOccurrence(event: {
        [key: string]: Object;
    }, viewDate?: Date): Object[];
    getRecurrenceEvent(eventData: {
        [key: string]: Object;
    }): {
        [key: string]: Object;
    };
    getOccurrencesByID(id: number | string): Object[];
    getOccurrencesByRange(startTime: Date, endTime: Date): Object[];
    applyResourceColor(element: HTMLElement, eventData: {
        [key: string]: Object;
    }, type: string, groupOrder?: string[], alpha?: string): void;
    createBlockAppointmentElement(record: {
        [key: string]: Object;
    }, resIndex: number): HTMLElement;
    setWrapperAttributes(appointmentWrapper: HTMLElement, resIndex: number): void;
    getReadonlyAttribute(event: {
        [key: string]: Object;
    }): string;
    isBlockRange(eventData: Object | Object[]): boolean;
}
