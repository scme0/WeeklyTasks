import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-store/data/data';
import { SortingHelpers } from '../../providers/data-store/cache/SortingHelpers';
@Component({
  selector: 'page-this-week',
  templateUrl: 'this-week.html'
})
export class ThisWeekPage {
  thisWeek: string = SortingHelpers.getMonday(Date.now());
  constructor(public navCtrl: NavController, public data: DataProvider) {
    
  }
}
