import { Task } from "../models/Task";
import { TaskStatus } from "../models/task-status";

export class Helpers
{
    public static insertSorted(arr, item, comparator = null) {
        if (comparator == null) {
            comparator = Helpers.DefaultComparator();
        }
    
        var min = 0;
        var max = arr.length;
        var index = Math.floor((min + max) / 2);
        while (max > min) {
            if (comparator(item, arr[index]) < 0) {
                max = index;
            } else {
                min = index + 1;
            }
            index = Math.floor((min + max) / 2);
        }
    
        arr.splice(index, 0, item);
    };

    public static DefaultComparator()
    {
        // emulate the default Array.sort() comparator
        return function(a, b) {
            if (typeof a !== 'string') a = String(a);
            if (typeof b !== 'string') b = String(b);
            return (a > b ? 1 : (a < b ? -1 : 0));
        };
    }

    public static TaskComparator()
    {
        return function(a: Task, b: Task)
        {
            let defaultComparator = Helpers.DefaultComparator();
            if (a.IsCurrent != b.IsCurrent){
                if (a.IsCurrent) return -1;
                else return 1;
            }
            else {
                let result = defaultComparator(a.Name,b.Name);
                if (result === 0)
                    return a.Id - b.Id;
                else return result;
            }
        }
    }

    public static TaskStatusComparator()
    {
        return function(a: TaskStatus, b: TaskStatus){
            let defaultComparator = Helpers.DefaultComparator();
            if (a.IsComplete != b.IsComplete){
                if (a.IsComplete) return 1;
                else return -1;
            }
            else {
                let result = defaultComparator(a.Task.Name,b.Task.Name);
                if (result === 0)
                    return a.Task.Id - b.Task.Id;
                else return result;
            }
        }
    }

    public static ToTableNameDateString(date: Date): string {
        return "week" + date.getFullYear() + "" + this.pad(date.getMonth() + 1,2) + "" + this.pad(date.getDate(),2);
    }

    public static FromTableNameDataString(dateString: string): Date {
        let year: number = Number.parseInt(dateString.slice(4,8));
        let month: number = Number.parseInt(dateString.slice(8,10)) - 1;
        let day: number = Number.parseInt(dateString.slice(10,12));
        return new Date(year,month, day);
    }

    public static pad(num:number, size:number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    public static findPercentageComplete(tasks: TaskStatus[])
    {
        if (tasks)
        {   
            let counter:number = 0.0;
            tasks.forEach(taskStatus => {if (taskStatus.IsComplete) counter++;})

            return +((counter/tasks.length * 100.0).toFixed(2));
        }
        return -1;
    }

    public static convertToType(value: string): any
    {
        if (value === "true" || value === "false")
        {
            return (value === "true");
        }

        let numberValue: number = +value;
        
        if (!isNaN(numberValue))
            return numberValue;

        return value;
    }
}