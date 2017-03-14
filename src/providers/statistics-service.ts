import { Events } from 'ionic-angular';
import { ReportUtils } from './report-utils';
import { AppConstants } from '../model/app-contants';
import { ReportModel } from '../model/report-model';
import { Settings, WeekSettings } from '../model/settings-model';
import { ReportService } from './report.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';


@Injectable()
export class StatisticsService {
  settings: Settings = new Settings();
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
    // let daysInMonth: number = moment().daysInMonth();
    // let daysInMonth: number = this.getEffectiveDaysInMonth(today.getMonth());
    let daysLeft: number = this.getEffectiveDaysInMonth(today.getMonth());
    // let daysLeft: number = daysInMonth - today.getDate() + 1;
    let hoursPerDay: number = 0;
    if (daysLeft > 0) {
      hoursPerDay = this.getHoursLeftInMinutes(monthlyReport) / daysLeft;
    }
    return hoursPerDay;
  }

  getEffectiveDaysInMonth(month: number): number {
    let daysInMonth: number = moment().daysInMonth();
    let effectiveDaysOfWeek: number[] = this.getEffectiveDaysOfWeek();

    if (effectiveDaysOfWeek.length > 0) {
      let date = moment();
      let effectiveDays = 0;
      for (let i = moment().toDate().getDate(); i <= daysInMonth; i++) {
        if (effectiveDaysOfWeek.indexOf(date.weekday()) >= 0) {
          effectiveDays++;
        }
        date = date.add(1, 'day');
      }

      if (effectiveDays > 0) {
        return effectiveDays;
      } else {
        return 1;
      }
    } else {
      return daysInMonth - new Date().getDate() + 1;
    }

  }

  getEffectiveDaysOfWeek(): number[] {
    let weekSettings: WeekSettings = this.settings.general.weekSettings;
    let weekDays: number[] = [];
    if (weekSettings.sunday)
      weekDays.push(0);
    if (weekSettings.monday)
      weekDays.push(1);
    if (weekSettings.tuesday)
      weekDays.push(2);
    if (weekSettings.wednesday)
      weekDays.push(3);
    if (weekSettings.thursday)
      weekDays.push(4);
    if (weekSettings.friday)
      weekDays.push(5);
    if (weekSettings.saturday)
      weekDays.push(6);

    return weekDays;
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