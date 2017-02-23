import { ReportStorageService } from './../../providers/report-storage.service';
import { ReportService } from '../../providers/report.service';
import { AppConstants } from './../../model/app-contants';
import { ReportModel } from './../../model/report-model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import * as moment from 'moment';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public viewCtrl: ViewController,
    public reportService: ReportService, public events: Events, 
    public reportStorageService: ReportStorageService) {
    moment.locale('pt-br');
    if (navParams.get(AppConstants.REPORT_PARAM)) {
      this.editing = true;
      this.report = navParams.get(AppConstants.REPORT_PARAM);
    }
    if (this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM)) {
      this.dateControl = this.navParams.get(AppConstants.REPORT_DATE_CTRL_PARAM);
      this.report.date = this.dateControl;
      this.formatedDateTitle = moment(this.dateControl).format('MMMM YYYY');
    }

    console.log("formatedDateTitle", this.formatedDateTitle);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditionPage');
  }

  async onConfirmClick() {
    if (this.editing) {
      await this.reportService.removeReport(this.report);
    }
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

}
