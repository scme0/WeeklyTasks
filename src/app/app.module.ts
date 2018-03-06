import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HistoryPage } from '../pages/history/history';
import { ThisWeekPage } from '../pages/this-week/this-week';

import { SQLiteProvider } from '../providers/sqlite/sqlite';

import { SQLite } from '@ionic-native/sqlite';
import { TasksPage } from '../pages/tasks/tasks';
import { AddTaskPage } from '../pages/tasks/add-task/add-task';

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ThisWeekPage,
    TasksPage,
    AddTaskPage,
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
    AddTaskPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLiteProvider,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
