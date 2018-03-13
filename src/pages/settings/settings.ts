import { Component } from "@angular/core";
import { SettingsProvider } from "../../providers/settings/settings";
import { DataProvider } from "../../providers/data-store/data/data";
import { FileChooser } from '@ionic-native/file-chooser';
import { ToastController, AlertController } from "ionic-angular";
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    constructor(private settings: SettingsProvider,
        private data: DataProvider,
        private fileChooser: FileChooser,
        private file: File,
        private filePath: FilePath,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController) {

    }

    setupCloudBackup() {
        //TODO
    }

    importFromCloudBackup() {
        //TODO
    }

    async export() {
        let fileName = "WeeklyTasksDatabase.json";
        let json = await this.data.exportData();

        let dirUrl = this.file.externalRootDirectory + "/Download/";

        if (!await this.file.checkDir(this.file.externalRootDirectory, "Download")) {
            let dir = await this.file.createDir(this.file.externalRootDirectory, "Download", false)
                .catch(error => "export() error: " + JSON.stringify(error));
            if (typeof (dir) === "string")
                dirUrl = dir;
            else
                dirUrl = dir.toURL();
        }

        let file = await this.file.createFile(dirUrl, fileName, true);
        let fileWriter = file.createWriter(fileWriterCallback => {
            fileWriterCallback.write(json);
            this.toastCtrl.create({
                message: 'File exported to ' + file.toURL(),
                duration: 1000,
                position: 'bottom'
            }).present();
        },
            error => {
                console.log("Error Exporting Database: " + JSON.stringify(error));
                this.toastCtrl.create({
                    message: 'Unable to export to ' + file.toURL(),
                    duration: 1000,
                    position: 'bottom'
                }).present();
            });
    }

    async import() {
        let fileUri = await this.fileChooser.open()
            .catch(error => console.log("error: " + error));

        if (fileUri) {
            let fileUrl = await this.filePath.resolveNativePath(fileUri)
                .catch(error => console.log("fileUrl error: " + error));

            if (fileUrl) {
                console.log("fileUrl: " + fileUrl);
                let dir = fileUrl.slice(0, fileUrl.lastIndexOf("/") + 1);
                let file = fileUrl.slice(fileUrl.lastIndexOf("/") + 1, fileUrl.length);
                console.log("dir: " + dir + " file: " + file);
                let fileString = await this.file.readAsText(dir, file);
                console.log("fileString: " + fileString);
                let alert = this.alertCtrl.create({
                    title: 'Import Database From File',
                    message: 'Do you want to replace your current Database or Merge the imported and current?',
                    buttons: [
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Merge',
                            handler: () => {
                                this.importData(fileString, false);
                            }
                        },
                        {
                            text: 'Replace',
                            handler: () => {
                                this.importData(fileString, true);
                            }
                        }
                    ]
                });
                alert.present();

            }
        }
    }

    private importData(json: string, wipe: boolean) {
        this.data.importData(json, wipe);
        this.toastCtrl.create({
            message: 'Database Imported',
            duration: 1000,
            position: 'bottom'
        }).present();
    }

    clearAllData() {
        let alert = this.alertCtrl.create({
            title: 'Clear All Data',
            message: 'Are you sure you want to Clear All Data on this app?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Clear All Data',
                    handler: () => {
                        this.data.wipe()
                            .then(result => {
                                this.toastCtrl.create({
                                    message: 'All Data Cleared',
                                    duration: 1000,
                                    position: 'bottom'
                                }).present();
                            });
                    }
                }
            ]
        });
        alert.present();
    }
}