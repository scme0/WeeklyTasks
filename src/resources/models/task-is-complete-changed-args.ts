export class TaskIsCompleteChangedArgs {
    constructor(private taskId: number, private value: boolean, private week: string){}
    public get TaskId() { return this.taskId;}
    public get IsChanged() { return this.value };
    public get Week() { return this.week };
}