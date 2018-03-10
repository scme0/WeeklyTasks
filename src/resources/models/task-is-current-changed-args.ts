export class TaskIsCurrentChangedArgs{
    constructor(private taskId: number, private value: boolean){}
    public get TaskId() { return this.taskId;}
    public get IsChanged() { return this.value };
}