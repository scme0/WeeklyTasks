export interface IDataStore{
    create()

    addTask(taskName: string, isCurrent: boolean)

    removeTask (taskId: number)

    setTaskCurrency(taskId: number, isCurrent: boolean)

    addTaskStatus(taskId: number, isComplete: boolean, week: string);

    setTaskStatus(taskId: number, isComplete: boolean, week: string);

    removeTaskStatus(taskId: number, week: string);
}