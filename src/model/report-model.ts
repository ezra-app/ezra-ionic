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

export class ReportStorage {
    constructor(public storage?: Map<number, Map<number, ReportModel[]>>) {
        if (!this.storage) {
            this.storage = new Map<number, Map<number, ReportModel[]>>();
            console.log("Inicializei o storage");
        }
    }

}