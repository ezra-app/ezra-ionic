import { StatisticsService } from '../../providers/statistics-service';
import { ReportModel } from '../../model/report-model';
import { ReportService } from '../../providers/report.service';
import { ReportListPage } from '../report-list/report-list';
import { AppConstants } from './../../model/app-contants';
import { ReportUtils } from './../../providers/report-utils';
import { EditionPage } from './../edition/edition';
import { SettingsPage } from './../settings/settings';
import { Component } from '@angular/core';
import {
    Events,
    Gesture,
    ModalController,
    NavController,
    NavParams,
    ToastController,
    ViewController
} from 'ionic-angular';
import { SocialSharing } from 'ionic-native';
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
  maxDatePickerValue: string = moment(new Date()).format(AppConstants.DATE_PICKER_FORMAT);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public reportService: ReportService,
    public viewCtrl: ViewController, public events: Events, public toastCtrl: ToastController,
    public statisticsService: StatisticsService) {

    this.datePickerValue = moment(this.dateControl).format(AppConstants.DATE_PICKER_FORMAT);
    this.loadReports();
    events.subscribe(AppConstants.EVENT_REPORT_UPDATED, () => {
      this.dateControl = moment(this.datePickerValue, AppConstants.DATE_PICKER_FORMAT).toDate();
      this.loadReports();
    });
  }

  loadReports(): void {
    this.reportService.loadReportsSumary(this.dateControl).then(r => {
      this.reportSumary = r;
    }).catch((err => {
      alert(err);
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  onAddClick(): void {
    let modal = this.modalCtrl.create(EditionPage, { reportDate: this.dateControl });
    modal.present();
  }
  
  formatNumber(value: number): string {
    return ReportUtils.formatNumber(value);
  }

  formatHours(hours: string, minutes: string): string {
    return ReportUtils.formatHours(hours, minutes);
  }

  onReportSumaryClick(): void {
    this.navCtrl.push(ReportListPage, { reportDate: this.dateControl });
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


  onShareButtonClick() {
    SocialSharing.shareViaWhatsApp(ReportUtils.formatShareMessage(this.reportSumary, this.dateControl)).then(() => {
    }).catch((err) => {});
  }

  onEmailButtonClick() {
    SocialSharing.shareViaEmail(ReportUtils.formatShareMessage(this.reportSumary, this.dateControl), "Meu Relatório", ["betolinck@gmail.com"]).then(() => {
    }).catch((err) => {});
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
    this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
  }

  onDatePickerChange() {
    this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
  }

  getHourPerDay(): string {
    return ReportUtils.formatHours('0', this.statisticsService.calculatePerDayInMinutes(this.reportSumary).toString());
  }

  getHoutTarget(): number {
    return this.statisticsService.getHoursTarget();
  }

  getHoursLeft():  string {
    return ReportUtils.formatHours('0', this.statisticsService.getHoursLeftInMinutes(this.reportSumary).toString());
  }

}
