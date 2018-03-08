import { Task } from "./Task";

export class SortingHelpers
{
    public static insertSorted(arr, item, comparator = null) {
        if (comparator == null) {
            comparator = SortingHelpers.DefaultComparator();
        }
    
        // get the index we need to insert the item at
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
    
        // insert the item'
        console.log("inserting: idx: " + index + " item: " + item.Id);
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
            let defaultComparator = SortingHelpers.DefaultComparator();
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

    public static getMonday(d) {
        d = new Date(d);
        let day = d.getDay()
        let diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff)).toDateString();
    }
}