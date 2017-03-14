import 'rxjs/add/operator/map';
import { ReportModel } from '../model/report-model';
import { ReportStorageService } from './report-storage.service';
import { ReportUtils } from './report-utils';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

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
    return ReportUtils.summaryReports(reports);
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
        reportsOrdered.sort((r1, r2) => parseInt(r2.year + r2.day) - parseInt(r1.year + r1.day));
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
}