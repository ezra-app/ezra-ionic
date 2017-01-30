import { EditionPage } from '../edition/edition';
import { ReportService } from '../../providers/report-service';
import { ReportModel } from '../../models/report-model';
import { Component } from '@angular/core';
import { AlertController, Events, ModalController, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    reportService: ReportService, public modalCtrl: ModalController, public events: Events,
    public alertCtrl: AlertController) {
    reportService.loadAllReports().then(result => {
      this.reports = result;
    });

    events.subscribe('report:created', () => {
      reportService.loadAllReports().then(result => {
        this.reports = result;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportListPage');
  }

  public itemSelected(report: ReportModel) {
    let modal = this.modalCtrl.create(EditionPage, { "report": report });
    modal.present();
  }

  onAddClick(): void {
    let modal = this.modalCtrl.create(EditionPage);
    modal.present();
  }

  onRemoveClick(report: ReportModel): void {
    this.showConfirm(report);
  }

  showConfirm(report: ReportModel): void {
    let confirm = this.alertCtrl.create({
      title: 'Remover?',
      message: 'Tem certeza que deseja remover?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            console.log('Sim');
          }
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

}
