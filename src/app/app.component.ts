import { HomePage } from '../pages/home/home';
import { Page2 } from '../pages/page2/page2';
import { ReportListPage } from '../pages/report-list/report-list';
import { GoalsPage } from './../pages/goals/goals';
import { SettingsPage } from './../pages/settings/settings';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon?: string }>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', component: HomePage, icon: "home" },
      { title: 'Detalhe', component: ReportListPage, icon: "list" },
      { title: 'Metas', component: GoalsPage, icon: "football" },
      { title: 'Configurações', component: SettingsPage, icon: "settings" },
      { title: 'Page Two', component: Page2, icon: "game" },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title != 'Início') {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);

    }
  }
}
