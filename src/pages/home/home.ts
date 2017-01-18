import { ReportService } from '../../providers/report-service';
import { ReportModel } from '../../models/report-model';
import { EditionPage } from './../edition/edition';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ModalPage } from './modal-page';

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
    this.reportService.loadReports().then(r => {
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

  formatHour(hour: number, minute: number): string {
    if (!hour) {
      hour = 0;
    }
    if (!minute) {
      minute = 0;
    }
    return `${hour + ":" + minute}`;
  }

}
