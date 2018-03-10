import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-store/data/data';
import { WeekProvider } from '../../providers/week/week';
import { TaskStatus } from '../../resources/models/task-status';

@Component({
  selector: 'page-this-week',
  templateUrl: 'this-week.html'
})
export class ThisWeekPage {
  TaskStatuses: TaskStatus[] = [];
  get PercentComplete(): string {
    if (this.TaskStatuses.length === 0)
      return "";
      
    let counter:number = 0.0;
    this.TaskStatuses.forEach(taskStatus => {if (taskStatus.IsComplete) counter++;})
    return +((counter/this.TaskStatuses.length * 100.0).toFixed(2)) + "%";
  }
  constructor(private navCtrl: NavController, private data: DataProvider, private week: WeekProvider) {
    week.WeekChanged.on(this.updateWeek.bind(this));
    this.updateWeek();
  }

  async updateWeek()
  {
    this.TaskStatuses = await this.data.TaskStatuses(this.week.ThisWeek);
  }
}
