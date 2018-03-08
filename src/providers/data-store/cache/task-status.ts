import { Task } from "./Task";
import { CacheProvider } from "./cache";

export class TaskStatus{
    constructor(task: Task, isComplete: boolean, private CallbackObject: any, private CallbackMethod: string)
    {
        this.Task = task;
        this.isComplete = isComplete;
    }

    Task: Task;
    private isComplete: boolean;

    set IsComplete(value: boolean)
    {
        if (value !== this.isComplete)
        {
            this.isComplete = value;
            this.CallbackObject[this.CallbackMethod](this.Task.Id,this.isComplete);
        }
    }

    get IsComplete()
    {
        return this.isComplete;
    }
}