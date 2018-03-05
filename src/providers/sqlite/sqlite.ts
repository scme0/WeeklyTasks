import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';

@Injectable()
export class SQLiteProvider{
    database: SQLiteObject = null;

    subscriptions: any[] = [];

    constructor(private sqlite: SQLite) {
        sqlite.echoTest().then(value => {
            sqlite.create({name: 'data.db',
            location: 'default'})
                  .then(db => {
                      this.database = db;
                      db.executeSql("CREATE TABLE IF NOT EXISTS Tasks(Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, IsCurrent INTEGER DEFAULT 0)", []);
                                //    .then(success =>{
                                //     // this.addTask("Something",false);
                                //    });
                });
        });
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

    addTask(taskName: string, isCurrent: boolean)
    {
        this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES ({0},{1})",[taskName,isCurrent])
                     .then(success => this.notifyChanges)

    }

    removeTask (taskId: number)
    {
        return this.database.executeSql("DELETE FROM Tasks WHERE Id = {0}",[taskId])
                            .then(success => this.notifyChanges)
    }

    setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        return this.database.executeSql("UPDATE Tasks SET IsCurrent = {0} WHERE Id = {1}",[isCurrent, taskId])
                            .then(success => this.notifyChanges)
    }

    GetAllTasks() : Promise<any>
    {
        return this.database.executeSql("SELECT * FROM Tasks",[]);
    }


}