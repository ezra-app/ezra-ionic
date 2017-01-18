import { ReportModel } from '../models/report-model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ReportService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ReportService {

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello ReportService Provider');
  }

  async saveReport(report: ReportModel) {
    let reports: ReportModel[] = await this.storage.get('reports:list') as ReportModel[];
    if (!reports) {
      reports = [];
    }
    reports.push(report);
    this.storage.set('reports:list', reports);
    console.log("report saved: ");
    console.log(reports);
  }

  async loadReports(): Promise<ReportModel> {
    let reports: ReportModel[] = await this.storage.get('reports:list') as ReportModel[];
    if (reports) {
      console.log("returned reports 0", reports[reports.length-1].hours);
      return reports.reduce((prev, curr, currIndex, array) => {
          var reportSumary = new ReportModel();
      reportSumary.hours = (parseInt(prev.hours) + parseInt(curr.hours)).toString();
      reportSumary.minutes = (parseInt(prev.minutes)  + parseInt(curr.minutes)).toString();
      reportSumary.publications = (parseInt(prev.publications) + parseInt(curr.publications)).toString();
      reportSumary.revisits = (parseInt(prev.revisits) + parseInt(curr.revisits)).toString();
      reportSumary.studies = (parseInt(prev.studies) + parseInt(curr.studies)).toString();
      reportSumary.videos = (parseInt(prev.videos) + parseInt(curr.videos)).toString();

      return reportSumary;
      });
    } else {
      console.log("returned new report");
      return new ReportModel();
    }
  }

}
