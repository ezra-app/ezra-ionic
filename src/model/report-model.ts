export class ReportModel {
    id: string;
    hours: string = '0';
    minutes: string = '0';
    publications: string = '0';
    videos: string = '0';
    revisits: string = '0';
    studies: string = '0';
    date: Date = new Date();
    selected?: boolean;
}