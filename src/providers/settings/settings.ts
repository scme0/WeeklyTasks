import { Injectable } from "@angular/core";
import { SettingsStore } from "./settings-store";
import { SQLiteProvider } from "../data-store/sqlite/sqlite";

@Injectable()
export class SettingsProvider{
    
    private settings: SettingsStore = new SettingsStore();

    constructor(private sqlite: SQLiteProvider) {
        this.loadSettings();
    }

    public set HistoryEditable(value: boolean){
        this.settings.HistoryEditable = value;
        this.sqlite.saveSettings(this.settings);
    }

    public get HistoryEditable(): boolean{
        return this.settings.HistoryEditable;
    }

    async loadSettings()
    {
        let settingsObj = await this.sqlite.loadSettings();
        console.log("SettingsProvider loadSettings: " + JSON.stringify(settingsObj));
        this.settings.HistoryEditable = settingsObj["HistoryEditable"] || false;
    }
}