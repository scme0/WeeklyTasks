import { IDataStore } from "../idata-store";
import { SQLiteProvider } from "../sqlite/sqlite";
import { CacheProvider } from "../cache/cache";
import { Injectable } from "@angular/core";
import { Task } from "../cache/Task";

@Injectable()
export class DataProvider implements IDataStore
{
    constructor(private Sqlite : SQLiteProvider, private Cache : CacheProvider)
    {
    }

    get Tasks() : Task[]
    {
        return this.Cache.Tasks;
    }

    async create() : Promise<any>
    {
        this.Cache.setTaskCurrencyChangeCallback(this, "setTaskCurrency");
        this.Cache.setTaskCompleteChangeCallback(this, "setTaskComplete");

        await this.Sqlite.create();
        this.Cache.create();

        let tasks = await this.Sqlite.getTasks()
        tasks.forEach(task => {
            this.Cache.addTaskAsObject(task);
        });
        //TODO: Complete this.
        // let taskStatuses = await this.Sqlite.getTaskStatuses("this_week");
        // taskStatuses.forEach(taskStatus => {
        //     this.Cache.addTaskStatusAsObject(taskStatus);
        // });
    }

    async addTask(taskName: string, isCurrent: boolean)
    {
        let result = await this.Sqlite.addTask(taskName, isCurrent);
        this.Cache.addTask(taskName, isCurrent, result.insertId);
    }

    async removeTask (taskId: number)
    {
        await this.Sqlite.removeTask(taskId);
        this.Cache.removeTask(taskId);
    }

    async setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        await this.Sqlite.setTaskCurrency(taskId, isCurrent);
        this.Cache.setTaskCurrency(taskId, isCurrent);
        console.log("setTaskCurrency: taskId: " + taskId + " isCurrent: " + isCurrent);
    }

    async setTaskComplete(taskId: number, week: string, isComplete: boolean)
    {
        await this.Sqlite.setTaskComplete(taskId, week, isComplete);
        this.Cache.setTaskComplete(taskId, week, isComplete);
    }
}