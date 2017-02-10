import { AppConstants } from './../../model/app-contants';
import { SettingsPage } from './../settings/settings';
import { ReportListPage } from '../report-list/report-list';
import { ReportModel } from '../../model/report-model';
import { ReportService } from '../../providers/report-service';
import { EditionPage } from './../edition/edition';
import { Component } from '@angular/core';
import { Events, Gesture, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import * as moment from 'moment';

const DIRECTION_LEFT: string = '2';
const DIRECTION_RIGHT: string = '4';

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
  dateControl: Date = new Date();
  datePickerValue: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public reportService: ReportService,
    public viewCtrl: ViewController, public events: Events, public toastCtrl: ToastController) {

    this.datePickerValue = moment(this.dateControl).format(AppConstants.DATE_PICKER_FORMAT);
    this.loadReports();
    events.subscribe(AppConstants.EVENT_REPORT_UPDATED, () => {
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
    let modal = this.modalCtrl.create(EditionPage, { dateControl: this.dateControl });
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
    return moment().hour(parseInt(hours)).minute(parseInt(minutes)).format(AppConstants.TIME_FORMAT);
  }

  onReportSumaryClick(): void {
    this.navCtrl.push(ReportListPage, { dateControl: this.dateControl });
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

  onSwipe(event: Gesture) {
    var momentCrtl: moment.Moment = moment(this.datePickerValue);
    var now: moment.Moment = moment();
    if (event.direction == DIRECTION_LEFT) {
      if (momentCrtl.get('month') != now.get('month') || momentCrtl.get('year') != now.get('year')) {
        this.datePickerValue = momentCrtl.add(1, 'months').format(AppConstants.DATE_PICKER_FORMAT);
      }
    } else {
      this.datePickerValue = momentCrtl.subtract(1, 'months').format(AppConstants.DATE_PICKER_FORMAT);
    }
  }

}
