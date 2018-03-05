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
    
        console.log("poop1");
        // let result = await this.sqlite.echoTest();
        // console.log("poop2 :" + JSON.stringify(result));
        // if (result)
        // {

            this.database = await this.sqlite.create({name: 'data.db',
                                       location: 'default'});
            
            console.log("poop3");
            await this.database.executeSql("CREATE TABLE IF NOT EXISTS Tasks(Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, IsCurrent INTEGER DEFAULT 0)", []);
                                //    .then(success =>{
                                    this.addTask("Something",false);
                                //    });
        // }
        // console.log("poop4");
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
        this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES ('" + taskName + "','" + isCurrent + "')",[])
                     .then(success => this.notifyChanges).catch(failure => console.log(failure))

    }

    removeTask (taskId: number)
    {
        return this.database.executeSql("DELETE FROM Tasks WHERE Id = " + taskId,[])
                            .then(success => this.notifyChanges)
    }

    setTaskCurrency(taskId: number, isCurrent: boolean)
    {
        return this.database.executeSql("UPDATE Tasks SET IsCurrent = " + isCurrent + " WHERE Id = " + taskId,[isCurrent, taskId])
                            .then(success => this.notifyChanges)
    }

    GetAllTasks() : Promise<any>
    {
        return this.database.executeSql("SELECT * FROM Tasks",[]);
    }


}