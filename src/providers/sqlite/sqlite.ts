import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';
import { Task } from './Task';
import { TaskStatus } from './task-status';

@Injectable()
export class SQLiteProvider{
    database: SQLiteObject = null;

    Tasks: Task[] = [];

    ThisWeekTasks: TaskStatus[] = [];

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

        await this.updateTasks();
    }

    private async updateTasks()
    {
        let result = await this.database.executeSql("SELECT * FROM Tasks ORDER BY IsCurrent DESC, Name ASC",[]);
        this.Tasks.splice(0,this.Tasks.length);
        for (let i = 0; i < result.rows.length; i++)
        {
            this.Tasks.push(new Task(result.rows.item(i), this));
        }
    }

    public async addTask(taskName: string, isCurrent: boolean)
    {
        await this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES (?,?)",[taskName,isCurrent])
                           .then(success => this.updateTasks())
                           .catch(error => console.log("addTask: error: " + error));

    }

    public async removeTask (taskId: number)
    {
        await this.database.executeSql("DELETE FROM Tasks WHERE Id = ?",[taskId])
                           .then(success => this.updateTasks())
                           .catch(error => console.log("remoteTask: error: " + error));
    }

    public async setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        console.log("setTaskCurrency");
        await this.database.executeSql("UPDATE Tasks SET IsCurrent = ? WHERE Id = ?",[isCurrent, taskId])
                           .then(success => this.updateTasks())
                           .catch(error => console.log("setTaskCurrency: error: " + error));
    }
}