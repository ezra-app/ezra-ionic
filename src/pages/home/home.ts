import { SettingsPage } from './../settings/settings';
import { ReportListPage } from '../report-list/report-list';
import { ReportModel } from '../../models/report-model';
import { ReportService } from '../../providers/report-service';
import { EditionPage } from './../edition/edition';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  reportSumary: ReportModel = new ReportModel();
  activityCounterIcon: string = 'play';


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public reportService: ReportService,
    public viewCtrl: ViewController, public events: Events) {

    this.loadReports();
    events.subscribe('report:created', () => {
      console.log('Welcome');
      this.loadReports();
    });
  }

  loadReports(): void {
    this.reportService.loadReportsSumary().then(r => {
      this.reportSumary = r;
      console.log(r);
    }).catch((err => {
      alert(err);
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  onAddClick(): void {
    let modal = this.modalCtrl.create(EditionPage);
    modal.present();
  }

  formatNumber(value: number): string {
    if (value == undefined || isNaN(value)) {
      return '0';
    } else {
      return value.toString();
    }
  }

  normalizeHour(hour: string): string {
    if (hour == undefined) {
      return '00';
    } else if (hour.length == 1) {
      return '0' + hour;
    } else {
      return hour;
    }
  }

  onReportSumaryClick(): void {
    this.navCtrl.push(ReportListPage);
  }

  onActivityCounterClick(): void {
    if(this.activityCounterIcon == 'play') {
      this.activityCounterIcon = 'pause';
    } else {
      this.activityCounterIcon = 'play';
    }
  }

  onSettingsButtonClick(): void {
    this.navCtrl.push(SettingsPage);
  }

}
