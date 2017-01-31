import { ReportService } from '../../providers/report-service';
import { ReportModel } from './../../models/report-model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public viewCtrl: ViewController, 
    public reportService: ReportService, public events: Events) {
      if(navParams.get("report")) {
        this.editing = true;
        this.report = navParams.get("report");
      }

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditionPage');
  }

  onConfirmClick(): void {
    this.reportService.saveReport(this.report).then(()=> {
      this.events.publish('report:updated');
      this.viewCtrl.dismiss();
    }).catch((err) => {
      alert(err);
    });
    
  }

  onCancelClick(): void {
    this.viewCtrl.dismiss()
  }

}
