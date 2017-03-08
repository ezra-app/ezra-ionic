export class Settings {
    general: GeneralSettings = new GeneralSettings();
    share: ShareSettings = new ShareSettings();
}

export class ShareSettings {
    useEmail: boolean;
    userWhatsapp: boolean;
    email: string;
}

export class GeneralSettings {
    publisherType: string;
    hoursTarget: number;
    weekSettings: WeekSettings = new WeekSettings();
}

export class WeekSettings {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
}