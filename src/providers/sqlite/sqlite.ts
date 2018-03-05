import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';

@Injectable()
export class SQLiteProvider{
    database: SQLiteObject = null;

    subscriptions: any[] = [];

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

    subscribeForChanges(subscription)
    {
        this.subscriptions.push(subscription);
    }

    unsubscribeForChanges(subscription)
    {
        this.subscriptions.splice(this.subscriptions.findIndex(subscription),1);
    }

    notifyChanges()
    {
        this.subscriptions.forEach(subscription => subscription);    
    }

    async addTask(taskName: string, isCurrent: boolean)
    {
        await this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES ('" + taskName + "','" + isCurrent + "')",[])
                     .then(success => this.notifyChanges).catch(failure => console.log(failure))

    }

    async removeTask (taskId: number)
    {
        await this.database.executeSql("DELETE FROM Tasks WHERE Id = " + taskId,[])
                            .then(success => this.notifyChanges)
    }

    async setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        await this.database.executeSql("UPDATE Tasks SET IsCurrent = " + isCurrent + " WHERE Id = " + taskId,[isCurrent, taskId])
                            .then(success => this.notifyChanges)
    }

    async GetAllTasks()
    {
        let tasks : any[] = []
        await this.database.executeSql("SELECT * FROM Tasks",[])
                           .then(result => {
                               for(let i = 0; i < result.rows.length; i++)
                               {
                                   tasks.push(result.rows.item(i));
                               }
                           });

        return tasks;

    }


}