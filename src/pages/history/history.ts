import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeekProvider } from '../../providers/week/week';
import { Helpers } from '../../resources/helpers/helpers';
import { DataProvider } from '../../providers/data-store/data/data';
import { TaskStatus } from '../../resources/models/task-status';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  Helpers = Helpers;
  Weeks = [];
  PercentComplete(tasks): string {
    return Helpers.findPercentageComplete(tasks);
  }
  constructor(public navCtrl: NavController, 
              public week: WeekProvider, 
              public data: DataProvider) { 
    this.updateWeeksList();
  }

  async updateWeeksList() {
    this.week.Weeks.forEach(async week => {
      let taskStatuses = await this.data.TaskStatuses(week);
      this.Weeks.push({Week: Helpers.FromTableNameDataString(week), Tasks: taskStatuses, Expanded: false});
    });
  }
}
