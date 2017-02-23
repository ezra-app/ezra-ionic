import { AppConstants } from './../model/app-contants';
import { Injectable } from '@angular/core';
import { ReportModel } from './../model/report-model';
import { Storage } from '@ionic/storage';

@Injectable()
export class ReportStorageService {
    private reportData: Map<number, Map<number, ReportModel[]>> = new Map<number, Map<number, ReportModel[]>>();

    constructor(public storage: Storage) {
        this.load();
    }

    public async load(): Promise<ReportStorageService> {
        return await this.storage.get(AppConstants.REPORTS_LIST_STORAGE_KEY).then(data => {
            if (data) {
                this.reportData = data;
            }
            return this;
        });
    }

    public put(report: ReportModel): ReportStorageService {
        let dataByYear: Map<number, ReportModel[]> = this.getMapByYear(report.date);
        let dataByMonth: ReportModel[] = dataByYear.get(report.date.getMonth());
        if (!dataByMonth) {
            dataByMonth = [];
            dataByYear.set(report.date.getMonth(), dataByMonth);
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

    private getMapByYear(date: Date): Map<number, ReportModel[]> {
        let dataByYear: Map<number, ReportModel[]> = this.reportData.get(date.getFullYear());
        if (!dataByYear) {
            dataByYear = new Map<number, ReportModel[]>();
            this.reportData.set(date.getFullYear(), dataByYear);
        }
        return dataByYear;
    }

    public get(date: Date): ReportModel[] {
        let dataByYear: Map<number, ReportModel[]> = this.reportData.get(date.getFullYear());
        if (!dataByYear) {
            return [];
        }
        let dataByMonth: ReportModel[] = dataByYear.get(date.getMonth());
        if (!dataByMonth) {
            return [];
        }
        return dataByMonth;
    }

    public remove(report: ReportModel): ReportStorageService {
        let reportsFiltered: ReportModel[] = this.get(report.date).filter(r => r.id != report.id);
        if (reportsFiltered && reportsFiltered.length > 0) {
            this.reportData.get(report.date.getFullYear()).set(report.date.getMonth(), reportsFiltered);
        }
        return this;
    }

    public putAll(date: Date, reports: ReportModel[]): ReportStorageService {
        this.getMapByYear(date).set(date.getMonth(), reports);
        return this;
    }

    public async save() {
        await this.storage.set(AppConstants.REPORTS_LIST_STORAGE_KEY, this.reportData);
    }

}
