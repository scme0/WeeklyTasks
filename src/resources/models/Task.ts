import { TaskIsCurrentChangedArgs } from "./task-is-current-changed-args";
import { LiteEvent } from "../helpers/lite-event";

export class Task
{
    private readonly onIsCurrentChanged = new LiteEvent<TaskIsCurrentChangedArgs>();

    public get IsCurrentChanged() { return this.onIsCurrentChanged.expose(); }

    public constructor(object: any)
    {
        this.update(object);
    }

    public update (object: any)
    {
        this.isCurrent = object.IsCurrent;
        this.Name = object.Name;
        this.Id = object.Id;
    }

    private isCurrent: boolean;

    set IsCurrent(value: boolean){
        if (value !== this.isCurrent)
        {
            this.isCurrent = value;
            this.onIsCurrentChanged.trigger(new TaskIsCurrentChangedArgs(this.Id, this.IsCurrent));
        }
    }

    get IsCurrent() : boolean{
        return this.isCurrent;
    }

    Name: string;
    Id: number;
}