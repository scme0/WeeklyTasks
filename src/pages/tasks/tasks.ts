import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { SQLiteProvider } from "../../providers/sqlite/sqlite";

@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html'
})
export class TasksPage {

    tasks = [];

    constructor(public navCtrl: NavController, private data: SQLiteProvider, private alertCtrl: AlertController) {
        data.subscribeForChanges(this, "refresh");
    }

    addTask() {
        let alert = this.alertCtrl.create({
            title: 'Add Task',
            inputs: [
                {
                    name: 'taskName',
                    placeholder: 'Name'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Add',
                    handler: data => {
                        let something: string;
                        if (data.taskName == undefined || data.taskName === "" || typeof data.taskName  !== "string") {
                            return false;
                        } else {
                            this.data.addTask(data.taskName,true);
                            return true;
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    ionViewDidLoad() {
        this.refresh();
    }

    async refresh() {
        this.tasks = await this.data.GetAllTasks();
        console.log(JSON.stringify(this.tasks));
    }

    deleteTask(task) {
        this.data.removeTask(task.Id);
    }
}