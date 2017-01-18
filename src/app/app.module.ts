import { ReportService } from '../providers/report-service';
import { EditionPage } from './../pages/edition/edition';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Page2 } from '../pages/page2/page2';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditionPage,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditionPage,
    Page2
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler}, 
      Storage,
      ReportService
    ]
})
export class AppModule {}
