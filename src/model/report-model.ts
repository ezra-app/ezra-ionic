export class ReportModel {
    id: string;
    hours: string = '0';
    minutes: string = '0';
    publications: string = '0';
    videos: string = '0';
    revisits: string = '0';
    studies: string = '0';
    month: string;
    day: string;
    year: string;
    selected?: boolean;

    setDate(date: Date) {
        this.month = date.getMonth().toString();
        this.day = date.getDate().toString();
        this.year = date.getFullYear().toString();
    }

    static getDate(model: ReportModel): Date {
        let date = new Date();
        date.setFullYear(parseInt(model.year));
        date.setDate(parseInt(model.day));
        date.setMonth(parseInt(model.month));
        return date;
    }
}

export class ReportStorage {
    constructor(public storage?: Map<number, Map<number, ReportModel[]>>) {
        if (!this.storage) {
            this.storage = new Map<number, Map<number, ReportModel[]>>();
            console.log("Inicializei o storage");
        }
    }

}