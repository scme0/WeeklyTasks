import { Injectable } from "@angular/core";
import { SettingsStore } from "./settings-store";
import { SQLiteProvider } from "../data-store/sqlite/sqlite";

@Injectable()
export class SettingsProvider{
    
    private settings: SettingsStore = new SettingsStore();

    constructor(private sqlite: SQLiteProvider) {
        this.loadSettings();
    }

    set HistoryEditable(value: boolean){
        this.settings.HistoryEditable = value;
        this.sqlite.saveSettings(this.settings);
    }

    get HistoryEditable(): boolean{
        return this.settings.HistoryEditable;
    }

    loadSettings()
    {
        let settingsObj = this.sqlite.loadSettings();
        this.settings.HistoryEditable = settingsObj["HistoryEditable"];
    }
}