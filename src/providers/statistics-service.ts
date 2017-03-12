import { Events } from 'ionic-angular';
import { ReportUtils } from './report-utils';
import { AppConstants } from '../model/app-contants';
import { ReportModel } from '../model/report-model';
import { Settings } from '../model/settings-model';
import { ReportService } from './report.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


/*
  Generated class for the ReportService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StatisticsService {
  private settings: Settings;
  constructor(public storage: Storage, public reportService: ReportService,
    public events: Events) {
    console.log('Hello ReportService Provider');
    storage.get(AppConstants.SETTINGS_STORAGE_KEY).then((data) => {
      if (data) {
        this.settings = JSON.parse(data);
      }
    });

    events.subscribe(AppConstants.SETTINGS_STORAGE_KEY, () => {
      storage.get(AppConstants.SETTINGS_STORAGE_KEY).then((data) => {
        if (data) {
          this.settings = JSON.parse(data);
        }
      });
    })
  }

  /**
   * Return in minutes
   * @param monthlyReport 
   */
  calculatePerDayInMinutes(monthlyReport: ReportModel): number {
    let today = new Date();
    let totalInMinutes: number = ReportUtils.getHoursInMinutes(monthlyReport);
    let lastDayOfMonth: number = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let daysLeft: number = lastDayOfMonth - today.getDate() + 1;
    let hoursPerDay: number = 0;
    if (daysLeft > 0) {
      hoursPerDay = this.getHoursLeftInMinutes(monthlyReport) / daysLeft;
    }
    return hoursPerDay;
  }

  getHoursLeftInMinutes(monthlyReport: ReportModel): number {
    let hoursLeft: number = (this.getHoursTarget() * 60) - ReportUtils.getHoursInMinutes(monthlyReport);
    if (hoursLeft > 0) {
      return hoursLeft;
    } else {
      return 0;
    }
  }

  getHoursTarget(): number {
    if (this.settings) {
      return this.settings.general.hoursTarget;
    }
    return 0;
  }
}