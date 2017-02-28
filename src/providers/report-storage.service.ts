import { AppConstants } from './../model/app-contants';
import { Injectable } from '@angular/core';
import { ReportModel } from './../model/report-model';
import { Storage } from '@ionic/storage';

type ReportDataObj = { [key: number]: ReportDataObjValue }
type ReportDataObjValue = { [key: number]: ReportModel[] }

@Injectable()
export class ReportStorageService {
    private reportData: ReportDataObj = {};

    constructor(public storage: Storage) {
        this.load();
    }

    public async load(): Promise<ReportStorageService> {
        let data = await this.storage.get(AppConstants.REPORTS_LIST_STORAGE_KEY);
        if (data) {
            this.reportData = JSON.parse(data);
        } else {
            this.reportData = {};
        }
        return this;
    }

    public put(report: ReportModel): ReportStorageService {
        let dataByYear: ReportDataObjValue = this.getMapByYear(ReportModel.getDate(report));
        let dataByMonth: ReportModel[] = dataByYear[ReportModel.getDate(report).getMonth()];
        if (!dataByMonth) {
            dataByMonth = [];
            dataByYear[ReportModel.getDate(report).getMonth()] = dataByMonth;
        }
        dataByMonth.push(report);
        return this;
    }

    public async addId(report: ReportModel) {
        if (!report.id) {
            let id: string = await this.storage.get('reports:ids');
            if (!id) {
                await this.storage.set('reports:ids', 1);
            }
            report.id = await this.storage.get('reports:ids');
            this.storage.set('reports:ids', parseInt(report.id) + 1);
        }
    }

    private getMapByYear(date: Date): ReportDataObjValue {
        let dataByYear: ReportDataObjValue = this.reportData[date.getFullYear()];
        if (!dataByYear) {
            dataByYear = {};
            this.reportData[date.getFullYear()] = dataByYear;
        }
        return dataByYear;
    }

    public get(date: Date): ReportModel[] {
        let dataByYear: ReportDataObjValue = this.reportData[date.getFullYear()];
        if (!dataByYear) {
            return [];
        }
        let dataByMonth: ReportModel[] = dataByYear[date.getMonth()];
        if (!dataByMonth) {
            return [];
        }
        return dataByMonth;
    }

    public remove(report: ReportModel): ReportStorageService {
        let reportsFiltered: ReportModel[] = this.get(ReportModel.getDate(report)).filter(r => r.id != report.id);
        if (reportsFiltered) {
            this.getMapByYear(ReportModel.getDate(report))[ReportModel.getDate(report).getMonth()] = reportsFiltered;
        }
        return this;
    }

    public putAll(date: Date, reports: ReportModel[]): ReportStorageService {
        this.getMapByYear(date)[date.getMonth()] = reports;
        return this;
    }

    public async save() {
        await this.storage.set(AppConstants.REPORTS_LIST_STORAGE_KEY, JSON.stringify(this.reportData));
    }
}
