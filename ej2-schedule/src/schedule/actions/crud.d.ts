import { CurrentAction } from '../base/type';
import { Schedule } from '../base/schedule';
import { Timezone } from '../timezone/timezone';
/**
 * Schedule CRUD operations
 */
export declare class Crud {
    parent: Schedule;
    timezone: Timezone;
    constructor(parent: Schedule);
    private getQuery;
    private getTable;
    private refreshData;
    addEvent(eventData: Object | Object[]): void;
    saveEvent(event: Object | Object[], action?: CurrentAction): void;
    deleteEvent(id: string | number | Object | Object[], action?: CurrentAction): void;
    private processCrudTimezone;
    private excludeDateCheck;
}
