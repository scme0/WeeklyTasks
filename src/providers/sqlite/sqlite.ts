import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';

export class ObjectSubscription{
    constructor(object : any,method: string) {
        this.Object = object;
        this.Method = method;
    }
    Object: any;
    Method: string;
}

@Injectable()
export class SQLiteProvider{
    database: SQLiteObject = null;

    subscriptions: ObjectSubscription[] = [];

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

    subscribeForChanges(object: any, method : string)
    {
        console.log("method: " + method);
        this.subscriptions.push(new ObjectSubscription(object,method));
    }

    // unsubscribeForChanges(object, subscription)
    // {
    //     let objSub :any = {Object:object,Subscription:subscription};
    //     this.subscriptions.splice(this.subscriptions.findIndex(objSub),1);
    // }

    notifyChanges()
    {
        this.subscriptions.forEach(objSub => objSub.Object[objSub.Method]());    
    }

    async addTask(taskName: string, isCurrent: boolean)
    {
        await this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES ('" + taskName + "','" + isCurrent + "')",[])
                           .then(success => {
                               this.notifyChanges();
                               })
                           .catch(failure => console.log(failure))

    }

    async removeTask (taskId: number)
    {
        await this.database.executeSql("DELETE FROM Tasks WHERE Id = " + taskId,[])
                           .then(success => {
                               console.log("Task Removed");
                               this.notifyChanges()
                           }).catch(error => {
                               console.log("Error caught while trying to remove... " + error);
                           })
    }

    async setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        await this.database.executeSql("UPDATE Tasks SET IsCurrent = " + isCurrent + " WHERE Id = " + taskId,[isCurrent, taskId])
                           .then(success => {
                               this.notifyChanges();
                            })
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