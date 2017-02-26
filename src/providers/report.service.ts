import { ReportStorageService } from './report-storage.service';
import 'rxjs/add/operator/map';
import { ReportModel, ReportStorage } from '../model/report-model';
import { AppConstants } from './../model/app-contants';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Dictionary } from 'typescript-collections';

/*
  Generated class for the ReportService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ReportService {

  constructor(public http: Http, public reportStorageService: ReportStorageService) {
    console.log('Hello ReportService Provider');
  }

  public async saveReport(report: ReportModel) {
    await this.reportStorageService.addId(report);
    await this.reportStorageService.put(report).save();
  }

  public async loadReportsSumary(date: Date): Promise<ReportModel> {
    let reports: ReportModel[] = await this.loadAllReports(date);
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

  public async loadAllReports(date: Date): Promise<ReportModel[]> {
    return new Promise<ReportModel[]>(async (resolve, reject) => {
      resolve((await this.reportStorageService.load()).get(date));
    });
  }

  public async loadAllReportsOrdered(date: Date): Promise<ReportModel[]> {
    let reportsOrdered: ReportModel[] = await this.loadAllReports(date);
    return new Promise<ReportModel[]>((resolve, reject) => {
      if (reportsOrdered) {
        reportsOrdered.sort((r1, r2) => parseInt(r2.id) - parseInt(r1.id));
      }
      resolve(reportsOrdered);
    });
  }

  public async removeReport(report: ReportModel) {
    await this.reportStorageService.remove(report).save();
  }

  public async removeSelecteds(reports: ReportModel[]) {
    if (reports && reports.length > 0) {
      let reportsFiltered: ReportModel[] = reports.filter(r => !r.selected);
      await this.reportStorageService.putAll(ReportModel.getDate(reports[0]), reportsFiltered).save();
    }
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