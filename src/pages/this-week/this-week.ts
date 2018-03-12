import { Component, IterableDiffers } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-store/data/data';
import { WeekProvider } from '../../providers/week/week';
import { TaskStatus } from '../../resources/models/task-status';
import { Helpers } from '../../resources/helpers/helpers';

@Component({
  selector: 'page-this-week',
  templateUrl: 'this-week.html'
})
export class ThisWeekPage {

  private static readonly CompleteString: string = "Complete!";

  iterableDiffer;
  popupTimeout: number;
  TaskStatuses: TaskStatus[] = [];
  
  IsComplete: boolean = false;
  PercentComplete: string = "####";

  constructor(private navCtrl: NavController,
              private data: DataProvider,
              private week: WeekProvider,
              private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
    week.WeekChanged.on(this.updateWeek.bind(this));
    this.updateWeek();
  }

  async updateWeek() {
    this.TaskStatuses = await this.data.TaskStatuses(this.week.ThisWeek);
    this.listChanged();
  }

  showCompletePopup(){
    clearTimeout(this.popupTimeout);
    this.IsComplete = true;
    this.popupTimeout = setTimeout(this.hideCompletePopup.bind(this), 3000);
  }

  hideCompletePopup(){
    this.IsComplete = false;
  }

  listChanged()
  {
    if (this.TaskStatuses.length === 0)
    {
      this.PercentComplete = "No Data";
      this.hideCompletePopup();
    }

    let result = Helpers.findPercentageComplete(this.TaskStatuses);

    if (result === 100) {
      this.PercentComplete = ThisWeekPage.CompleteString;
      this.showCompletePopup();
    } else {
      this.PercentComplete = result + "%";
      this.hideCompletePopup();
    }
  }

  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.TaskStatuses);
    if (changes) {
      this.listChanged();
    }
  }
}
