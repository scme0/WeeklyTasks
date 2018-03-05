import { Component } from '@angular/core';

import { ThisWeekPage } from '../this-week/this-week';
import { HistoryPage } from '../history/history';
import { TasksPage } from '../tasks/tasks';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  ThisWeekPage = ThisWeekPage;
  HistoryPage = HistoryPage
  TasksPage = TasksPage;

  constructor() {

  }
}
