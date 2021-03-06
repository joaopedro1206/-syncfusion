import { ActionBaseArgs, ResizeEdges, DragEventArgs, ResizeEventArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
/**
 * Base class for the common drag and resize related actions
 */
export declare class ActionBase {
    parent: Schedule;
    actionObj: ActionBaseArgs;
    resizeEdges: ResizeEdges;
    scrollArgs: ActionBaseArgs;
    scrollEdges: ResizeEdges;
    constructor(parent: Schedule);
    getChangedData(): {
        [key: string]: Object;
    };
    saveChangedData(eventArgs: DragEventArgs | ResizeEventArgs): void;
    calculateIntervalTime(date: Date): Date;
    getContentAreaDimension(): {
        [key: string]: Object;
    };
    getPageCoordinates(e: MouseEvent & TouchEvent): (MouseEvent & TouchEvent) | Touch;
    getIndex(index: number): number;
    updateTimePosition(date: Date): void;
    getResourceElements(table: HTMLTableCellElement[]): HTMLTableCellElement[];
    getOriginalElement(element: HTMLElement): HTMLElement[];
    createCloneElement(element: HTMLElement): HTMLElement;
    removeCloneElement(): void;
    getCursorElement(e: MouseEvent & TouchEvent): HTMLElement;
    autoScroll(): void;
    autoScrollValidation(e: MouseEvent & TouchEvent): boolean;
    actionClass(type: string): void;
    updateScrollPosition(e: MouseEvent & TouchEvent): void;
    /**
     * To destroy the action base module.
     * @return {void}
     * @private
     */
    destroy(): void;
}
