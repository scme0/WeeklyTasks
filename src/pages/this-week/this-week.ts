import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLiteProvider } from '../../providers/sqlite/sqlite';

@Component({
  selector: 'page-this-week',
  templateUrl: 'this-week.html'
})
export class ThisWeekPage {
  tasks = []
  constructor(public navCtrl: NavController, private data: SQLiteProvider) {
    console.log("here");
    data.GetAllTasks().then(success => {
      console.log(JSON.stringify(success));
    })
    
  }

}
