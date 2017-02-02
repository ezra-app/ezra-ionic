import { ReportModel } from '../../models/report-model';
import { ReportService } from '../../providers/report-service';
import { EditionPage } from '../edition/edition';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public reportService: ReportService, public modalCtrl: ModalController, public events: Events,
    public alertCtrl: AlertController) {
    reportService.loadAllReports().then(result => {
      if (result) {
        this.reports = result.sort((r1, r2) => parseInt(r2.id) - parseInt(r1.id));
      }
    });

    events.subscribe('report:updated', () => {
      reportService.loadAllReports().then(result => {
        if (result) {
          this.reports = result.sort((r1, r2) => parseInt(r2.id) - parseInt(r1.id));
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportListPage');
  }

  public onEditClick(report: ReportModel) {
    let modal = this.modalCtrl.create(EditionPage, { "report": report });
    modal.present();
  }

  onAddClick(): void {
    let modal = this.modalCtrl.create(EditionPage);
    modal.present();
  }

  onRemoveClick(report: ReportModel): void {
    this.showConfirm(() => {
      this.reportService.removeReport(report, this.reports).then(() => {
        this.events.publish('report:updated');
      });
    }, 'Remover?');
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
            console.log('Não');
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

    console.log("selecteds: ", this.selecteds);
  }

  async onRemoveSelectedClick() {
    this.showConfirm(() => {
      this.reportService.removeSelecteds(this.reports).then(() => {
        this.events.publish('report:updated');
        this.muliSelectEnabled = false;
        this.selecteds = 0;
      });
    }, `Remover ${this.selecteds} registros?`);
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

}
