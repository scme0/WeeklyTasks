export interface IDataStore{
    create();

    wipe();

    addTask(taskName: string, isCurrent: boolean);

    removeTask (taskId: number);

    setTaskCurrent(taskId: number, isCurrent: boolean);

    setTaskComplete(taskId: number, isComplete: boolean, week: string);
}