import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';
import { IDataStore } from '../idata-store';
import { WeekProvider } from '../../week/week';
import { TaskStatus } from '../../../resources/models/task-status';

export class TaskContainer{
    constructor(public Id: number, 
                public Name: string, 
                public IsCurrent: boolean){}
}

export class TaskStatusContainer{
    constructor(public Id: number,
                public IsComplete: boolean){}
}

@Injectable()
export class SQLiteProvider implements IDataStore{
    database: SQLiteObject = null;

    constructor(private sqlite: SQLite, private week: WeekProvider) {
        console.log("SQLiteProvider ctor");
    }

    async create()
    {
        //Connect database
        this.database = await this.sqlite.create({name: 'data.db', location: 'default'});
        //Create Tasks table if not created.
        await this.createTasksTable();
    }

    private async createTasksTable(){
        return await this.database.executeSql(
            "CREATE TABLE IF NOT EXISTS Tasks(Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, IsCurrent INTEGER DEFAULT 0)", [])
            .catch(error => console.log("createTasksTable() error: " + JSON.stringify(error)));
    }

    async createTaskStatusTable(week: string){
        return await this.database.executeSql(
            "CREATE TABLE IF NOT EXISTS "+ week +"(Id INTEGER PRIMARY KEY, IsComplete INTEGER DEFAULT 0)",[])
            .catch(error => console.log("createTaskStatusTable(" + week +") error: " + JSON.stringify(error)));
    }

    async getTasks() : Promise<TaskContainer[]> {
        let tasks : TaskContainer[] = [];
        let result = await this.database.executeSql("SELECT * FROM Tasks",[]);
        for (let i = 0; i < result.rows.length; i++)
        {
            let item = result.rows.item(i);
            tasks.push(new TaskContainer(item.Id, item.Name, (item.IsCurrent === "true")));
        }
        return tasks;
    }

    public async getTaskStatus(taskId: number, week: string = this.week.ThisWeek) {
        await this.createTaskStatusTable(week);
        let result = await this.database.executeSql("SELECT * FROM " + week + " WHERE Id = ?",[taskId])
                .catch(error => console.log("getTaskStatus(" + taskId + "," + week + ") error: " + JSON.stringify(error)));
        let item = result.rows.length > 0 ? result.rows.item(0) : null;

        if (item){
            return new TaskStatusContainer(item.Id, (item.IsComplete === "true"));
        }
        return null;
    }

    public async getTaskStatuses(week: string) : Promise<TaskStatusContainer[]> {
        let result1 = await this.createTaskStatusTable(week);
        let taskStatuses : TaskStatusContainer[] = [];
        let result = await this.database.executeSql("SELECT * FROM " + week,[])
            .catch(error => console.log("getTaskStatuses(" + week + ") error: " + JSON.stringify(error)));
        for (let i = 0; i < result.rows.length; i++)
        {
            let item = result.rows.item(i);
            taskStatuses.push(new TaskStatusContainer(item.Id, (item.IsComplete === "true")));
        }
        return taskStatuses;
    }

    public async addTask(taskName: string, isCurrent: boolean) {
        return await this.database.executeSql("INSERT INTO Tasks (Name, IsCurrent) VALUES (?,?)",[taskName, isCurrent])
                                  .catch(error => console.log("addTask: error: " + JSON.stringify(error)));

    }

    public async removeTask (taskId: number) {
        return await this.database.executeSql("DELETE FROM Tasks WHERE Id = ?",[taskId])
                                  .catch(error => console.log("remoteTask: error: " + JSON.stringify(error)));
    }

    public async setTaskCurrent(taskId: number, isCurrent: boolean) {
        return await this.database.executeSql("UPDATE Tasks SET IsCurrent = ? WHERE Id = ?",[isCurrent, taskId])
                                  .catch(error => console.log("setTaskCurrency: error: " + JSON.stringify(error)));
    }

    public async addTaskStatus(taskId: number, isComplete: boolean, week: string = this.week.ThisWeek) {
        await this.createTaskStatusTable(week);

        return await this.database.executeSql("INSERT INTO " + week + " (Id, IsComplete) VALUES(?,?)",[taskId, isComplete])
                                  .catch(error => console.log("addTaskStatus: error: " + JSON.stringify(error)));
    }

    public async setTaskComplete(taskId: number, isComplete: boolean, week: string) {
        return await this.database.executeSql("UPDATE " + week + " SET IsComplete = ? WHERE Id = ?",[isComplete, taskId])
                                  .catch(error => console.log("setTaskStatus:  error: " + JSON.stringify(error)))
    }

    public async removeTaskStatus(taskId: number, week: string = this.week.ThisWeek) {
        return await this.database.executeSql("DELETE FROM " + week + " WHERE Id = ?",[taskId])
                                  .catch(error => console.log("removeTaskStatus: error: " + JSON.stringify(error)));
    }

    public async createSettingsTable(){
        return await this.database.executeSql(
            "CREATE TABLE IF NOT EXISTS Settings(PropertyName TEXT PRIMARY KEY, Value TEXT NOT NULL)", [])
            .catch(error => console.log("createTasksTable() error: " + JSON.stringify(error)));
    }

    public async saveSettings(object: any){
        await this.createSettingsTable();
        Object.keys(object).forEach(async propertyName =>{
            await this.database.executeSql(
                "INSERT OR REPLACE INTO Settings (PropertyName, Value) VALUES(?,?)",[propertyName,object[propertyName]])
                .catch(error => console.log("saveSettings(" + JSON.stringify(object) + ") error: " + JSON.stringify(error)))
        });
    }

    public async loadSettings(){
        await this.createSettingsTable();
        let result = await this.database.executeSql(
            "SELECT * FROM Settings",[])
            .catch(error => console.log("loadSettings() error: " + JSON.stringify(error)));
        let object = {};
        result.rows.forEach(row => {
            object[row.PropertyName] = row.Value;
        });
        return object;
    }
}