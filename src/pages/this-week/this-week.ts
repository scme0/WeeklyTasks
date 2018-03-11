import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-store/data/data';
import { WeekProvider } from '../../providers/week/week';
import { TaskStatus } from '../../resources/models/task-status';
import { Helpers } from '../../resources/helpers/helpers';

@Component({
  selector: 'page-this-week',
  templateUrl: 'this-week.html'
})
export class ThisWeekPage {
  TaskStatuses: TaskStatus[] = [];
  IsComplete: boolean;

  get PercentComplete(): string {
    if (this.TaskStatuses.length === 0)
      return "No Data";
    
    let result = Helpers.findPercentageComplete(this.TaskStatuses);

    if (result === 100){
      this.IsComplete = true;
      return "Complete!";
    } else {
      this.IsComplete = false;
      return result + "%";
    }
  }
  constructor(private navCtrl: NavController, private data: DataProvider, private week: WeekProvider) {
    week.WeekChanged.on(this.updateWeek.bind(this));
    this.updateWeek();
  }

  async updateWeek(){
    this.TaskStatuses = await this.data.TaskStatuses(this.week.ThisWeek);
  }
}
