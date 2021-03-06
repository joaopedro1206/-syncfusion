import { extend, closest, isNullOrUndefined } from '-syncfusion/ej2-base';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * Work cell interactions
 */
var WorkCellInteraction = /** @class */ (function () {
    function WorkCellInteraction(parent) {
        this.parent = parent;
    }
    WorkCellInteraction.prototype.cellMouseDown = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.notify(event.cellMouseDown, { event: e });
    };
    WorkCellInteraction.prototype.cellClick = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        var queryStr = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.HEADER_CELLS_CLASS;
        var target = closest(e.target, queryStr);
        if (isNullOrUndefined(target)) {
            return;
        }
        if (!isNullOrUndefined(closest(e.target, '.' + cls.NEW_EVENT_CLASS))) {
            this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
            return;
        }
        var navigateEle = closest(e.target, '.' + cls.NAVIGATE_CLASS);
        var navigateView = this.parent.getNavigateView();
        var sameView = this.parent.currentView === navigateView;
        if (isNullOrUndefined(navigateEle) || sameView ||
            isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly) {
                this.parent.quickPopup.quickPopupHide();
                return;
            }
            var isWorkCell = target.classList.contains(cls.WORK_CELLS_CLASS) ||
                target.classList.contains(cls.ALLDAY_CELLS_CLASS);
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            var args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(event.cellClick, args);
            if (args.cancel) {
                return;
            }
            if (isWorkCell) {
                this.parent.selectCell(target);
            }
            this.parent.notify(event.cellClick, args);
        }
        else {
            var date = this.parent.getDateFromElement(target);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView());
            }
        }
    };
    WorkCellInteraction.prototype.cellDblClick = function (e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        var args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellDoubleClick' });
        this.parent.trigger(event.cellDoubleClick, args);
        if (args.cancel) {
            return;
        }
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    };
    WorkCellInteraction.prototype.isPreventAction = function (e) {
        if (closest(e.target, '.' + cls.NAVIGATE_CLASS)) {
            return false;
        }
        if (closest(e.target, '.' + cls.APPOINTMENT_WRAPPER_CLASS) &&
            !closest(e.target, '.' + cls.MORE_INDICATOR_CLASS)) {
            return true;
        }
        var target = closest(e.target, '.' + cls.APPOINTMENT_CLASS + ',.' + cls.RESOURCE_GROUP_CELLS_CLASS);
        if (!isNullOrUndefined(target)) {
            return true;
        }
        target = closest(e.target, '.' + cls.HEADER_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    };
    return WorkCellInteraction;
}());
export { WorkCellInteraction };
