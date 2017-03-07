import { ReportStorageService } from './../../providers/report-storage.service';
import { ReportService } from '../../providers/report.service';
import { AppConstants } from './../../model/app-contants';
import { ReportModel } from './../../model/report-model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import * as moment from 'moment';
moment.locale('pt-br');

/*
  Generated class for the Edition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edition',
  templateUrl: 'edition.html'
})
export class EditionPage {

  report: ReportModel = new ReportModel();
  editing: boolean;
  dateControl: Date = new Date();
  formatedDateTitle: string;

  datePickerValue: string;
  maxDatePickerValue: string = moment(new Date()).format(AppConstants.DATE_PICKER_FORMAT);

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public viewCtrl: ViewController,
    public reportService: ReportService, public events: Events,
    public reportStorageService: ReportStorageService) {
    if (navParams.get(AppConstants.REPORT_PARAM)) {
      this.editing = true;
      this.fillReport(navParams.get(AppConstants.REPORT_PARAM));
    }
    if (this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM)) {
      this.dateControl = this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM);
      this.setDate(this.dateControl);
      this.datePickerValue = moment(this.dateControl).format(AppConstants.DATE_PICKER_FORMAT);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditionPage');
  }

  fillReport(reportLoaded: ReportModel): void {
    this.report.hours = reportLoaded.hours;
    this.report.minutes = reportLoaded.minutes;
    this.report.day = reportLoaded.day;
    this.report.month = reportLoaded.month;
    this.report.year = reportLoaded.year;
    this.report.publications = reportLoaded.publications;
    this.report.revisits = reportLoaded.revisits;
    this.report.studies = reportLoaded.studies;
    this.report.videos = reportLoaded.videos;
    this.report.id = reportLoaded.id;
  }

  async onConfirmClick() {
    if (this.editing) {
      await this.reportService.removeReport(this.report);
    }
    console.log(this.datePickerValue);
    this.setDate(moment(this.datePickerValue, AppConstants.DATE_PICKER_FORMAT).toDate());
    this.saveReport();
  }

  saveReport() {
    this.reportService.saveReport(this.report).then(() => {
      this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
      this.viewCtrl.dismiss();
    }).catch((err) => {
      alert(err);
    });
  }

  onCancelClick(): void {
    this.viewCtrl.dismiss().then(() => this.events.publish(AppConstants.EVENT_REPORT_UPDATED));
  }

  setDate(date: Date) {
    this.report.year = this.dateControl.getFullYear().toString();
    this.report.month = this.dateControl.getMonth().toString();
    this.report.day = this.dateControl.getDate().toString();

    console.log(ReportModel.getDate(this.report));
  }

  onDatePickerChange() {
    this.dateControl = moment(this.datePickerValue, AppConstants.DATE_PICKER_FORMAT).toDate();
  }

}
