import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SQLiteProvider } from '../providers/sqlite/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
      rootPage:any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, data: SQLiteProvider) {
    platform.ready().then(() => {
      data.create().then(success => {
        this.rootPage = TabsPage;
        console.log("here3");

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      })
    });
  }
}
