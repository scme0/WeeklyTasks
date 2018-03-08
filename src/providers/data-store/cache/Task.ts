import { CacheProvider } from "./cache";

export class Task
{
    public constructor(object: any, private CallbackObject: any, private CallbackMethod: string)
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
            this.CallbackObject[this.CallbackMethod](this.Id, this.IsCurrent);
        }
    }

    get IsCurrent(){
        return this.isCurrent;
    }

    Name: string;
    Id: number;
}