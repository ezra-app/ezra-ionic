import 'rxjs/add/operator/map';
import { ReportModel } from '../models/report-model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  public async saveReport(report: ReportModel) {
    let reports: ReportModel[] = await this.storage.get('reports:list') as ReportModel[];
    if (!reports) {
      reports = [];
      await this.storage.set('reports:ids', 1);
    }
    report.id = await this.storage.get('reports:ids');
    console.log('id: ' + report.id);
    this.storage.set('reports:ids', parseInt(report.id) + 1);
    reports.push(report);
    this.storage.set('reports:list', reports);
    console.log("report saved: ");
    console.log(reports);
  }

  public async loadReportsSumary(): Promise<ReportModel> {
    let reports: ReportModel[] = await this.storage.get('reports:list') as ReportModel[];
    if (reports && reports.length > 0) {
      return reports.reduce((prev, curr, currIndex, array) => {
        var reportSumary = new ReportModel();
        reportSumary.hours = this.sumAsNumber(prev.hours, curr.hours);
        reportSumary.minutes = this.sumAsNumber(prev.minutes, curr.minutes);
        reportSumary.publications = this.sumAsNumber(prev.publications, curr.publications);
        reportSumary.revisits = this.sumAsNumber(prev.revisits, curr.revisits);
        reportSumary.studies = this.sumAsNumber(prev.studies, curr.studies);
        reportSumary.videos = this.sumAsNumber(prev.videos, curr.videos);

        return reportSumary;
      });
    } else {
      console.log("returned new report");
      return new ReportModel();
    }
  }
  
  public async loadAllReports(): Promise<ReportModel[]> {
    return await this.storage.get('reports:list') as ReportModel[];
  }

  public async removeReport(reports: ReportModel[], report: ReportModel) {
    let reportsFiltered: ReportModel[] = reports.filter(r => r.id != report.id)
    await this.storage.set('reports:list', reportsFiltered);
  }

  private sumAsNumber(...values: any[]): string {
    var result: number = 0;
    values.forEach(value => {
      if (value && !isNaN(value)) {
        result += parseInt(value);
      }
    });
    return result.toString();
  }

}
