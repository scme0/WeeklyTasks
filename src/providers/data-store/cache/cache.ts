import { IDataStore } from "../idata-store";
import { Injectable } from "@angular/core";
import { Task } from "../../../resources/models/Task";
import { TaskStatus } from "../../../resources/models/task-status";
import { Helpers } from "../../../resources/helpers/helpers";
import { TaskIsCurrentChangedArgs } from "../../../resources/models/task-is-current-changed-args";
import { TaskIsCompleteChangedArgs } from "../../../resources/models/task-is-complete-changed-args";
import { LiteEvent } from "../../../resources/helpers/lite-event";
import { ITaskMap } from "../../../resources/models/task-map";
import { WeekProvider } from "../../week/week";

@Injectable()
export class CacheProvider implements IDataStore
{
    Tasks: Task[] = [];
    TasksMap: ITaskMap = {};

    TaskStatuses = {};

    private readonly onTaskCurrencyChanged = new LiteEvent<TaskIsCurrentChangedArgs>();
    private readonly onTaskCompleteChanged = new LiteEvent<TaskIsCompleteChangedArgs>();

    public get TaskCurrencyChanged() { return this.onTaskCurrencyChanged.expose(); }
    public get TaskCompleteChanged() { return this.onTaskCompleteChanged.expose(); }

    private order: boolean;

    set Order(value: boolean){
        this.order = value;
    }

    get Order(){
        return this.order;
    }

    constructor(private week: WeekProvider){}

    create(){}

    wipe(){
        this.Tasks.splice(0,this.Tasks.length);

        this.TasksMap = {};
        let weeks = Object.getOwnPropertyNames(this.TaskStatuses);
        for (let week of weeks)
        {
            let taskStatusList: TaskStatus[] = this.TaskStatuses[week];
            taskStatusList.splice(0,taskStatusList.length);
        }

        this.create();
    }

    addTaskAsObject(object: any){
        let task = new Task(object);
        task.IsCurrentChanged.on(this.taskCurrencyChange.bind(this));
        Helpers.insertSorted(this.Tasks,task,Helpers.TaskComparator());
        this.TasksMap[task.Id] = task;
        return task;
    }

    addTask(taskName: string, isCurrent: boolean, taskId: number = 0){
        this.addTaskAsObject({Name: taskName, IsCurrent: isCurrent, Id: taskId});
    }

    removeTask (taskId: number){
        let task = this.TasksMap[taskId];
        task.IsCurrentChanged.off(this.taskCurrencyChange.bind(this));
        this.Tasks.splice(this.Tasks.findIndex(task => task.Id == taskId),1);
        this.TasksMap[taskId] = null;
    }

    setTaskCurrent(taskId: number, isCurrent: boolean){
        let taskIdx = this.Tasks.findIndex(task => task.Id == taskId);
        let task = this.Tasks.splice(taskIdx,1)[0];
        Helpers.insertSorted(this.Tasks, task, Helpers.TaskComparator());
    }

    taskCurrencyChange(args: TaskIsCurrentChangedArgs){
        this.onTaskCurrencyChanged.trigger(args);
    }

    taskCompleteChange(args: TaskIsCompleteChangedArgs){
        this.onTaskCompleteChanged.trigger(args);
    }

    addTaskStatus(taskId: number, isComplete: boolean, week: string = this.week.ThisWeek) {
        let weekStatuses = this.getCachedWeek(week);
        let taskStatus = new TaskStatus(this.TasksMap[taskId], isComplete, week);
        taskStatus.IsCompleteChanged.on(this.taskCompleteChange.bind(this));
        Helpers.insertSorted(weekStatuses,taskStatus,Helpers.TaskStatusComparator());
        return taskStatus;
    }

    addTaskStatusAsObject(object: any, week: string = this.week.ThisWeek){
        return this.addTaskStatus(object.Id, object.IsComplete, week);
    }

    setTaskComplete(taskId: number, isComplete: boolean, week: string) {
        let weekStatuses = this.getCachedWeek(week);
        let taskStatusIdx = weekStatuses.findIndex(ts => ts.Task.Id === taskId);
        let taskStatus = weekStatuses.splice(taskStatusIdx,1)[0];
        taskStatus.IsComplete = isComplete;
        Helpers.insertSorted(weekStatuses,taskStatus,Helpers.TaskStatusComparator());
        return taskStatus;
    }

    removeTaskStatus(taskId: number, week: string = this.week.ThisWeek) {
        let weekStatuses = this.getCachedWeek(week);
        let taskStatusIdx = weekStatuses.findIndex(ts => ts.Task.Id === taskId);
        let taskStatus = weekStatuses[taskStatusIdx];
        weekStatuses.splice(taskStatusIdx,1);
        taskStatus.IsCompleteChanged.off(this.taskCompleteChange.bind(this));
        taskStatus.Task = null;
    }

    getCachedWeek(week: string = this.week.ThisWeek) : TaskStatus[]{
        let weekStatuses: TaskStatus[] = this.TaskStatuses[week];
        if (weekStatuses === undefined) {
            weekStatuses = [];
            this.TaskStatuses[week] = weekStatuses;
        }
        return weekStatuses;
    }

}