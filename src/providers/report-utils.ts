import { ReportModel } from './../model/report-model';
import { Injectable } from '@angular/core';
import 'moment-duration-format';
import 'moment/locale/pt-br'
import * as moment from 'moment';

export class ReportUtils {
    public static formatHours(hours: string, minutes: string): string {
        if (!hours || hours == '') {
            hours = '0'
        }
        if (!minutes || minutes == '') {
            minutes = '0'
        }
        let formatedHour = moment.duration((parseInt(hours) * 60) + parseInt(minutes), "minutes").format("hh:mm");
        if (formatedHour.length == 2) {
            return '00:' + formatedHour;
        }
        return formatedHour;
    }

    public static formatDay(date: Date): string {
        moment.locale('pt-br');
        return moment(date).format('dddd, DD');
    }

    public static formatNumber(value: number): string {
        if (value == undefined || isNaN(value)) {
            return '0';
        } else {
            return value.toString();
        }
    }

    public static summaryReports(reports: ReportModel[]): ReportModel {
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
            return new ReportModel();
        }
    }

    private static sumAsNumber(...values: any[]): string {
        var result: number = 0;
        values.forEach(value => {
            if (value && !isNaN(value)) {
                result += parseInt(value);
            }
        });
        return result.toString();
    }

    public static formatShareMessage(report: ReportModel, date: Date): string {
        moment.locale('pt-br');
        let reportMessage = `Meu relatório ${moment(date).format('MMM YYYY')} :
        - Horas: ${this.formatHours(report.hours, report.minutes)}
        - Publicações: ${this.formatNumber(parseInt(report.publications))}
        - Vídeos: ${this.formatNumber(parseInt(report.videos))}
        - Revisitas:  ${this.formatNumber(parseInt(report.revisits))}
        - Estudos:  ${this.formatNumber(parseInt(report.studies))}
        `;
        return reportMessage;
    }
}