import { SQLiteProvider } from "./sqlite";
import { Task } from "./Task";

export class TaskStatus{
    constructor(task: Task, isComplete: boolean, sqlite: SQLiteProvider)
    {
        this.Sqlite = sqlite;
        this.Task = task;
        this.isComplete = isComplete;
    }

    Sqlite: SQLiteProvider;
    Task: Task;

    private isComplete: boolean;
    set IsComplete(value: boolean)
    {
        this.isComplete = value;
        //TODO: Update database here.
    }

    get IsComplete()
    {
        return this.isComplete;
    }
}