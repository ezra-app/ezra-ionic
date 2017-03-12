import { StatisticsService } from '../providers/statistics-service';
import { HomePage } from '../pages/home/home';
import { ReportListPage } from '../pages/report-list/report-list';
import { ReportStorageService } from '../providers/report-storage.service';
import { ReportService } from '../providers/report.service';
import { EditionPage } from './../pages/edition/edition';
import { GoalsPage } from './../pages/goals/goals';
import { SettingsPage } from './../pages/settings/settings';
import { MyApp } from './app.component';
import { ErrorHandler, NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditionPage,
    ReportListPage,
    GoalsPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditionPage,
    ReportListPage,
    GoalsPage,
    SettingsPage
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler}, 
      Storage,
      ReportService,
      ReportStorageService,
      StatisticsService
    ]
})
export class AppModule {}
