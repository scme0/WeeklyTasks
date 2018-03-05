import { Component } from '@angular/core';

import { ThisWeekPage } from '../this-week/this-week';
import { HistoryPage } from '../history/history';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  ThisWeekPage = ThisWeekPage;
  HistoryPage = HistoryPage

  constructor() {

  }
}
