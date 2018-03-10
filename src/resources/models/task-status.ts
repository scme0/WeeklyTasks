import { Task } from "./Task";
import { TaskIsCompleteChangedArgs } from "./task-is-complete-changed-args";
import { LiteEvent } from "../helpers/lite-event";

export class TaskStatus{

    private readonly onIsCompleteChanged = new LiteEvent<TaskIsCompleteChangedArgs>();

    public get IsCompleteChanged() { return this.onIsCompleteChanged.expose(); }

    constructor(task: Task, isComplete: boolean, private week: string)
    {
        this.Task = task;
        this.isComplete = isComplete; 
    }

    Task: Task;
    private isComplete: boolean;

    set IsComplete(value: boolean){
        if (value !== this.isComplete)
        {
            this.isComplete = value;
            this.onIsCompleteChanged.trigger(new TaskIsCompleteChangedArgs(this.Task.Id, this.isComplete, this.week));
        }
    }

    get IsComplete() : boolean
    {
        return this.isComplete;
    }
}