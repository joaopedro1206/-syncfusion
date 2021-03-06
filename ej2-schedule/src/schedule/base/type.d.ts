/**
 * types
 */
/**
 * An enum type that denotes the view mode of the schedule. Available options are as follows
 * * Day
 * * Week
 * * WorkWeek
 * * Month
 * * Agenda
 * * MonthAgenda
 * * TimelineDay
 * * TimelineWeek
 * * TimelineWorkWeek
 * * TimelineMonth
 */
export declare type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth';
export declare type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence' | 'EditSeries';
export declare type ReturnType = {
    result: Object[];
    count: number;
    aggregates?: Object;
};
export declare type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' | 'ValidationAlert' | 'RecurrenceValidationAlert';
export declare type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';
export declare type CalendarType = 'Islamic' | 'Gregorian';
