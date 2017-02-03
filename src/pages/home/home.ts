import { SettingsPage } from './../settings/settings';
import { ReportListPage } from '../report-list/report-list';
import { ReportModel } from '../../models/report-model';
import { ReportService } from '../../providers/report-service';
import { EditionPage } from './../edition/edition';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import * as moment from 'moment';

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
  dateControl: string = moment().format('YYYY-MM-DD');


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public reportService: ReportService,
    public viewCtrl: ViewController, public events: Events, public toastCtrl: ToastController) {

    this.loadReports();
    events.subscribe('report:updated', () => {
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

  formatHours(hours: string, minutes: string): string {
    if (!hours || hours == '') {
      hours = '0'
    }
    if (!minutes || minutes == '') {
      minutes = '0'
    }
    return moment().hour(parseInt(hours)).minute(parseInt(minutes)).format("HH:mm");
  }

  onReportSumaryClick(): void {
    this.navCtrl.push(ReportListPage, { "dateControl": this.dateControl });
  }

  onActivityCounterClick(): void {
    if (this.activityCounterIcon == 'play') {
      this.activityCounterIcon = 'pause';
      this.showToast('Contador iniciado');
    } else {
      this.activityCounterIcon = 'play';
      this.showToast('Contador pausado');
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  onSettingsButtonClick(): void {
    this.navCtrl.push(SettingsPage);
  }

}
