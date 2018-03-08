import { IDataStore } from "../idata-store";
import { SQLiteProvider } from "../sqlite/sqlite";
import { CacheProvider } from "../cache/cache";
import { Injectable } from "@angular/core";
import { Task } from "../cache/Task";
import { SortingHelpers } from "../cache/SortingHelpers";

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

    public TaskStatuses(week: string)
    {
        this.Sqlite.createTaskStatusTable(week);
        return this.Cache.getCachedWeek(week);
    }

    async create() : Promise<any>
    {
        this.Cache.setTaskCurrencyChangeCallback(this, "setTaskCurrency");
        this.Cache.setTaskCompleteChangeCallback(this, "setTaskComplete");

        await this.Sqlite.create();
        this.Cache.create();

        let thisWeek = SortingHelpers.getMonday(new Date());

        let tasks = await this.Sqlite.getTasks()
        tasks.forEach(async task => {
            this.Cache.addTaskAsObject(task);
            let taskStatus = await this.Sqlite.getTaskStatus(task.Id, thisWeek);
            if (taskStatus === null){
               await this.Sqlite.addTaskStatus(task.Id,false,thisWeek);
            }
            this.Cache.addTaskStatus(task.Id,false,thisWeek);
        });
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
    }

    async addTaskStatus(taskId: number, isComplete: boolean, week: string){

    }

    async setTaskStatus(taskId: number, isComplete: boolean, week: string){
        await this.Sqlite.setTaskStatus(taskId, isComplete, week);
        this.Cache.setTaskStatus(taskId, isComplete, week);
    }

    async removeTaskStatus(taskId: number, week: string){

    }
}