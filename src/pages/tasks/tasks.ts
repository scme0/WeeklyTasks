import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SQLiteProvider } from "../../providers/sqlite/sqlite";

@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html'
  })
  export class TasksPage {
    tasks = []
    constructor(public navCtrl: NavController, private data: SQLiteProvider) {
    }
  
    ionViewDidLoad() {
        this.refresh();
    }

    async refresh(){
        this.tasks = await this.data.GetAllTasks();
    }
  }