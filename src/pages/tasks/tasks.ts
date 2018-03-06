import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SQLiteProvider } from "../../providers/sqlite/sqlite";

@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html'
  })
  export class TasksPage {

    tasks = [];

    constructor(public navCtrl: NavController, private data: SQLiteProvider) {
        data.subscribeForChanges(this,"refresh");
    }
  
    ionViewDidLoad() {
        this.refresh();
    }

    async refresh() {
        this.tasks = await this.data.GetAllTasks();
        console.log(JSON.stringify(this.tasks));
    }

    deleteTask(task){
        this.data.removeTask(task.Id);
    }
  }