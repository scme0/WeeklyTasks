import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeekProvider } from '../../providers/week/week';
import { Helpers } from '../../resources/helpers/helpers';
import { DataProvider } from '../../providers/data-store/data/data';
import { TaskStatus } from '../../resources/models/task-status';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  Helpers = Helpers;
  Weeks = [];
  PercentComplete(tasks): string {
    if (tasks.length === 0)
      return "No Data";
  
    let result = Helpers.findPercentageComplete(tasks);

    if (result === 100){
      return "Complete!";
    } else {
      return result + "%";
    }
  }
  constructor(public navCtrl: NavController, 
              public week: WeekProvider, 
              public data: DataProvider,
              private settings: SettingsProvider) { 
    this.updateWeeksList();
  }

  async updateWeeksList() {
    this.week.Weeks.forEach(async week => {
      let taskStatuses = await this.data.TaskStatuses(week);
      this.Weeks.push({Week: Helpers.FromTableNameDataString(week), Tasks: taskStatuses, Expanded: false});
    });
  }

  expandData(data){
    if (data.Tasks.length > 0)
      data.Expanded = !data.Expanded;
  }

  taskClicked(event, task){
    console.log("task clicked");
    task.IsComplete = !task.IsComplete;
    event.stopPropagation();
  }
}
