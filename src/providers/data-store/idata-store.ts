export interface IDataStore{
    create()

    addTask(taskName: string, isCurrent: boolean)

    removeTask (taskId: number)

    setTaskCurrency(taskId: number, isCurrent: boolean)

    setTaskComplete(taskId: number, week: string, isComplete: boolean)
}