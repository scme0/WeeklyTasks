import { IDataStore } from "../idata-store";
import { SQLiteProvider } from "../sqlite/sqlite";
import { CacheProvider } from "../cache/cache";
import { Injectable } from "@angular/core";
import { Task } from "../../../resources/models/Task";
import { WeekProvider } from "../../week/week";
import { TaskStatus } from "../../../resources/models/task-status";
import { TaskIsCurrentChangedArgs } from "../../../resources/models/task-is-current-changed-args";
import { TaskIsCompleteChangedArgs } from "../../../resources/models/task-is-complete-changed-args";

@Injectable()
export class DataProvider implements IDataStore {
    subscribedWeeks: string[] = [];

    constructor(private Sqlite: SQLiteProvider, private Cache: CacheProvider, private Week: WeekProvider) {
    }

    public get Tasks(): Task[] {
        return this.Cache.Tasks;
    }

    public async TaskStatuses(week: string): Promise<TaskStatus[]> {
        if (week != this.Week.ThisWeek)
            this.subscribedWeeks.push(week);

        return this.updateStatuses(week);
    }

    private async updateStatuses(week: string)
    {
        let sqlStatuses = await this.Sqlite.getTaskStatuses(week);
        let cacheStatuses = this.Cache.getCachedWeek(week);

        if (cacheStatuses.length !== sqlStatuses.length) {
            cacheStatuses.splice(0, cacheStatuses.length);
            sqlStatuses.forEach(status => this.Cache.addTaskStatusAsObject(status, week));
        }
        return cacheStatuses;
    }

    async create(): Promise<any> {
        this.Cache.TaskCompleteChanged.on(this.taskCompleteUpdate.bind(this));
        this.Cache.TaskCurrencyChanged.on(this.taskCurrentUpdated.bind(this));

        await this.Sqlite.create();
        this.Cache.create();

        this.sync();
    }

    private async sync() {
        this.Cache.wipe();
        let tasks = await this.Sqlite.getTasks()
        let cachedStatuses = this.Cache.getCachedWeek();
        tasks.forEach(async task => {
            let t: Task = this.Cache.addTaskAsObject(task);
            let taskStatus = await this.Sqlite.getTaskStatus(t.Id);
            if (!taskStatus) {
                if (t.IsCurrent === true) {
                    await this.Sqlite.addTaskStatus(t.Id, false);
                    this.Cache.addTaskStatus(t.Id, false);
                }
            } else if (taskStatus) {
                if (t.IsCurrent === true) {
                    if (!cachedStatuses.find(status => status.Task.Id === t.Id))
                        this.Cache.addTaskStatusAsObject(taskStatus);
                } else {
                    await this.Sqlite.removeTaskStatus(t.Id);
                    this.Cache.removeTaskStatus(t.Id);
                }
            }
        });

        this.subscribedWeeks.forEach(week => this.updateStatuses(week));
    }

    async wipe() {
        await this.Sqlite.wipe();
        await this.sync();
    }

    async exportData() {
        return await this.Sqlite.exportData();
    }

    async importData(json: string, wipe:boolean = false) {
        if (wipe){
            await this.Sqlite.wipe();
        }
        await this.Sqlite.importData(json);
        await this.sync();
    }

    async addTask(taskName: string, isCurrent: boolean) {
        let result = await this.Sqlite.addTask(taskName, isCurrent);
        this.Cache.addTask(taskName, isCurrent, result.insertId);
        if (isCurrent === true) {
            await this.Sqlite.addTaskStatus(result.insertId, false);
            this.Cache.addTaskStatus(result.insertId, false);
        }
    }

    async removeTask(taskId: number) {
        await this.Sqlite.removeTask(taskId);
        this.Cache.removeTask(taskId);
        await this.Sqlite.removeTaskStatus(taskId);
        this.Cache.removeTaskStatus(taskId);
    }

    taskCurrentUpdated(args: TaskIsCurrentChangedArgs) {
        this.setTaskCurrent(args.TaskId, args.IsChanged);
    }

    taskCompleteUpdate(args: TaskIsCompleteChangedArgs) {
        this.setTaskComplete(args.TaskId, args.IsChanged, args.Week);
    }

    async setTaskCurrent(taskId: number, isCurrent: boolean) {
        let result = await this.Sqlite.setTaskCurrent(taskId, isCurrent);
        this.Cache.setTaskCurrent(taskId, isCurrent);

        if (isCurrent === true) {
            await this.Sqlite.addTaskStatus(taskId, false);
            this.Cache.addTaskStatus(taskId, false);
        }
        else {
            let result3 = await this.Sqlite.removeTaskStatus(taskId);
            this.Cache.removeTaskStatus(taskId);
        }
    }

    async setTaskComplete(taskId: number, isComplete: boolean, week: string) {
        let result = await this.Sqlite.setTaskComplete(taskId, isComplete, week);
        this.Cache.setTaskComplete(taskId, isComplete, week);
    }
}