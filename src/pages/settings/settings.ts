import { Component } from "@angular/core";
import { SettingsProvider } from "../../providers/settings/settings";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage{
    constructor(private settings: SettingsProvider){
        
    }
}