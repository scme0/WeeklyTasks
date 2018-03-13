import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HistoryPage } from '../pages/history/history';
import { ThisWeekPage } from '../pages/this-week/this-week';

import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { TasksPage } from '../pages/tasks/tasks';
import { SQLiteProvider } from '../providers/data-store/sqlite/sqlite';
import { CacheProvider } from '../providers/data-store/cache/cache';
import { DataProvider } from '../providers/data-store/data/data';
import { WeekProvider } from '../providers/week/week';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsProvider } from '../providers/settings/settings';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ThisWeekPage,
    TasksPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    ThisWeekPage,
    TasksPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    FileChooser,
    FilePath,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLiteProvider,
    CacheProvider,
    DataProvider,
    WeekProvider,
    SettingsProvider,
  ]
})
export class AppModule {}
