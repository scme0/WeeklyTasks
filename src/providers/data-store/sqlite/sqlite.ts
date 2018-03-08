import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';
import { IDataStore } from '../idata-store';

@Injectable()
export class SQLiteProvider implements IDataStore{
    database: SQLiteObject = null;

    constructor(private sqlite: SQLite) {
        console.log("SQLiteProvider ctor");
    }

    async create()
    {
        //Connect database
        this.database = await this.sqlite.create({name: 'data.db', location: 'default'});
        //Create Tasks table if not created.
        await this.database.executeSql(
            "CREATE TABLE IF NOT EXISTS Tasks(Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, IsCurrent INTEGER DEFAULT 0)", []);
    }

    async getTasks() : Promise<any[]>
    {
        let tasks = [];
        let result = await this.database.executeSql("SELECT * FROM Tasks",[]);
        for (let i = 0; i < result.rows.length; i++)
        {
            tasks.push(result.rows.item(i));
        }
        return tasks;
    }

    async getTaskStatuses(week: string) : Promise<any[]>
    {
        let taskStatuses = [];
        let result = await this.database.executeSql("SELECT * FROM ?",[week]);
        for (let i = 0; i < result.rows.length; i++)
        {
            taskStatuses.push(result.rows.item(i));
        }
        return taskStatuses;
    }

    public async addTask(taskName: string, isCurrent: boolean)
    {
        return await this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES (?,?)",[taskName,isCurrent])
                                  .catch(error => console.log("addTask: error: " + error));

    }

    public async removeTask (taskId: number)
    {
        return await this.database.executeSql("DELETE FROM Tasks WHERE Id = ?",[taskId])
                                  .catch(error => console.log("remoteTask: error: " + error));
    }

    public async setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        return await this.database.executeSql("UPDATE Tasks SET IsCurrent = ? WHERE Id = ?",[isCurrent, taskId])
                                  .catch(error => console.log("setTaskCurrency: error: " + error));
    }

    public async setTaskComplete(taskId: number, week: string, isComplete: boolean)
    {
        console.log("setTaskComplete not implemented");
    }
}