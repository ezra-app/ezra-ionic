import { ReportModel } from '../../model/report-model';
import { ReportService } from '../../providers/report.service';
import { EditionPage } from '../edition/edition';
import { AppConstants } from './../../model/app-contants';
import { ReportUtils } from './../../providers/report-utils';
import { Component } from '@angular/core';
import { AlertController, Events, ModalController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

/*
  Generated class for the ReportList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-list',
  templateUrl: 'report-list.html'
})
export class ReportListPage {

  reports: ReportModel[] = new Array<ReportModel>();
  muliSelectEnabled: boolean = false;
  selecteds: number = 0;
  dateControl: Date = new Date();
  datePickerValue: string;
  maxDatePickerValue: string = moment(new Date()).format(AppConstants.DATE_PICKER_FORMAT);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public reportService: ReportService, public modalCtrl: ModalController, public events: Events,
    public alertCtrl: AlertController) {

    if (this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM)) {
      this.dateControl = this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM);
    }
    this.datePickerValue = moment(this.dateControl).format(AppConstants.DATE_PICKER_FORMAT);
    this.fetchReports();
    events.subscribe(AppConstants.EVENT_REPORT_UPDATED, () => {
      this.dateControl = moment(this.datePickerValue, AppConstants.DATE_PICKER_FORMAT).toDate();
      this.fetchReports();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportListPage');
  }

  private async fetchReports() {
    this.reports = await this.reportService.loadAllReportsOrdered(this.dateControl);
  }

  public onEditClick(report: ReportModel) {
    if (!this.muliSelectEnabled) {
      let modal = this.modalCtrl.create(EditionPage, { report: report, reportDate: ReportModel.getDate(report) });
      modal.present();
    }
  }

  onAddClick(): void {
    let modal = this.modalCtrl.create(EditionPage, { reportDate: moment(this.dateControl).toDate() });
    modal.present();
  }

  onRemoveClick(report: ReportModel): void {
    if (!this.muliSelectEnabled) {
      this.showConfirm(() => {
        this.reportService.removeReport(report).then(() => {
          this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
        });
      }, 'Remover?');
    }
  }

  showConfirm(yesFunction: Function, title?: string, message?: string): void {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Sim',
          handler: yesFunction
        },
        {
          text: 'Nao',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  onPress(report: ReportModel) {
    this.muliSelectEnabled = true;
    report.selected = true;
    this.updateSelecteds(report.selected);
  }

  onSelectClick(report: ReportModel) {
    if (this.muliSelectEnabled) {
      report.selected = !report.selected;
      this.updateSelecteds(report.selected);
    }
  }

  updateSelecteds(selected: boolean) {
    if (selected) {
      this.selecteds++;
    } else if (this.selecteds > 0) {
      this.selecteds--;
    }

    if (this.selecteds <= 0) {
      this.muliSelectEnabled = false;
    }
  }

  async onRemoveSelectedClick() {
    this.showConfirm(() => {
      this.reportService.removeSelecteds(this.reports).then(() => {
        this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
        this.muliSelectEnabled = false;
        this.selecteds = 0;
      });
    }, `Remover ${this.selecteds} registros?`);
  }

  formatHours(hours: string, minutes: string): string {
    return ReportUtils.formatHours(hours, minutes);
  }

  onDatePickerChange() {
    this.events.publish(AppConstants.EVENT_REPORT_UPDATED);
  }

  formatDay(date: Date): string {
    return ReportUtils.formatDay(date);
  }

  getDate(report: ReportModel): Date {
    return ReportModel.getDate(report);
  }
}
