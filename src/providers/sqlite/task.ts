import { SQLiteProvider } from "./sqlite";

export class Task
{
    public constructor(object: any, sqlite: SQLiteProvider)
    {
        this.Sqlite = sqlite
        this.update(object);
    }
    public update (object: any)
    {
        this.isCurrent = object.IsCurrent;
        this.Name = object.Name;
        this.Id = object.Id;
    }
    set IsCurrent(value: boolean){
        this.isCurrent = value;
        this.Sqlite.setTaskCurrency(this.Id, this.IsCurrent);
    }
    get IsCurrent(){
        return this.isCurrent;
    }
    isCurrent: boolean;
    Name: string;
    Id: number;
    Sqlite: SQLiteProvider;
}