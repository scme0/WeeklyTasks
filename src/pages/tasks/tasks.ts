import { Component } from "@angular/core";
import { NavController,ModalController, NavParams } from "ionic-angular";
import { SQLiteProvider } from "../../providers/sqlite/sqlite";
import { AddTaskPage } from "./add-task/add-task";

@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html'
  })
  export class TasksPage {

    tasks = [];

    constructor(public navCtrl: NavController, private data: SQLiteProvider, private modalCtrl: ModalController) {
        data.subscribeForChanges(this,"refresh");
    }

    addTask(){
        let profileModal = this.modalCtrl.create(AddTaskPage);
        profileModal.present();
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