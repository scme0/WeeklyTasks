import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { DataProvider } from "../../providers/data-store/data/data";

@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html'
})
export class TasksPage {

    constructor(public navCtrl: NavController, 
                private data: DataProvider,
                private alertCtrl: AlertController) {
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

    deleteTask(task) {
        let alert = this.alertCtrl.create({
            title: 'Delete Task?',
            message: 'Deleting a task could make you lose historical data. Perhaps deactivate instead?',
            buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
            },
            {
                text: 'Delete',
                handler: () => {
                    this.data.removeTask(task.Id);
                }
            }
            ]
        });
        alert.present();
    }
}