import { Injectable } from "@angular/core";
import { LiteEvent } from "../../resources/helpers/lite-event";
import { Helpers } from "../../resources/helpers/helpers";

@Injectable()
export class WeekProvider
{
    Weeks :string[] = [];

    private readonly onWeekChanged = new LiteEvent<void>();

    public get WeekChanged() { return this.onWeekChanged.expose(); }

    public get ThisWeek() { return this.Weeks[0]; }

    constructor() {
        this.getNextGroupOfWeeks(15);
        setInterval(this.checkThisWeekStillValid.bind(this), 5000);
    }

    getNextGroupOfWeeks(numberOfWeeks: number)
    {
        let startDate: any;
        if (this.Weeks.length === 0){
            startDate = this.getMondayOfWeek(new Date());
            this.Weeks.push(Helpers.ToTableNameDateString(startDate));
        }
        else
        {
            startDate = Helpers.FromTableNameDataString(this.Weeks[this.Weeks.length - 1]);
        }

        for(let i = 0; i < numberOfWeeks; i++){
            startDate = new Date(startDate);
            let setDate = startDate.getDate() + 7;
            startDate = startDate.setDate(setDate);
            let startDateStr = Helpers.ToTableNameDateString(this.getMondayOfWeek(new Date(startDate)));
            this.Weeks.push(startDateStr);
        }
    }

    private checkThisWeekStillValid()
    {
        let currentWeek = Helpers.ToTableNameDateString(this.getMondayOfWeek(new Date()));
        if (this.Weeks[0] !== currentWeek)
        {
            this.Weeks.unshift(currentWeek);
            this.onWeekChanged.trigger();
        }
    }

    private getMondayOfWeek(d) {
        d = new Date(d);
        let day = d.getDay()
        let diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }
}