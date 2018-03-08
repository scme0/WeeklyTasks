import { IDataStore } from "../idata-store";
import { Task } from "./Task";
import { TaskStatus } from "./task-status";
import { Injectable } from "@angular/core";
import { SortingHelpers } from "./SortingHelpers";

@Injectable()
export class CacheProvider implements IDataStore
{
    Tasks: Task[];
    TasksMap: Task[];

    TaskStatuses: TaskStatus[][];

    private taskCurrencyChangedCallback : any = null;
    private taskCompleteChangedCallback : any = null;

    private order: boolean;

    set Order(value: boolean){
        this.order = value;
    }

    get Order(){
        return this.order;
    }

    create(){
        this.Tasks = [];
        this.TaskStatuses = [];
    }

    setTaskCurrencyChangeCallback(object: any, method: string)
    {
        this.taskCurrencyChangedCallback = {Object: object, Method: method};
    }

    setTaskCompleteChangeCallback(object: any, method: string)
    {
        this.taskCompleteChangedCallback = {Object: object, Method: method};
    }

    addTaskAsObject(object: any){
        let task = new Task(object, this, "taskCurrencyChange");
        SortingHelpers.insertSorted(this.Tasks,task,SortingHelpers.TaskComparator());
        this.TasksMap[task.Id] = task;
    }

    addTask(taskName: string, isCurrent: boolean, taskId: number = 0){
        this.addTaskAsObject({Name: taskName, IsCurrent: isCurrent, Id: taskId});
    }

    addTaskStatusAsObject(object: any){
        console.log("not implemented yet");
    }

    removeTask (taskId: number){
        this.Tasks.splice(this.Tasks.findIndex(task => task.Id == taskId),1);
        this.TasksMap[taskId] = null;
    }

    setTaskCurrency(taskId: number, isCurrent: boolean){
        console.log("setTaskCurrency...")
        let taskIdx = this.Tasks.findIndex(task => task.Id == taskId);
        let task = this.Tasks.splice(taskIdx,1)[0];
        SortingHelpers.insertSorted(this.Tasks, task, SortingHelpers.TaskComparator());
    }

    taskCurrencyChange(taskId: number, isCurrent: boolean){
        let callback = this.taskCurrencyChangedCallback;
        if (callback !== null)
        {
            callback.Object[callback.Method](taskId,isCurrent);
        }
    }

    taskCompleteChange(taskId: number, isComplete: boolean){
        let callback = this.taskCompleteChangedCallback;
        if (callback !== null)
        {
            callback.Object[callback.Method](taskId,isComplete);
        }
    }

    addTaskStatus(taskId: number, isComplete: boolean, week: string) {
        let weekStatuses = this.getCachedWeek(week);
        weekStatuses.push(new TaskStatus(this.TasksMap[taskId],isComplete, this, "taskCompleteChange"));
    }

    setTaskStatus(taskId: number, isComplete: boolean, week: string) {

    }

    removeTaskStatus(taskId: number, week: string) {

    }

    getCachedWeek(week: string){
        let weekStatuses = this.TaskStatuses[week];
        if (weekStatuses === undefined) {
            weekStatuses = [];
            this.TaskStatuses[week] = weekStatuses;
        }
        return weekStatuses;
    }

}