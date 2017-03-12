import { AppConstants } from '../../model/app-contants';
import { Settings } from '../../model/settings-model';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsType: string = 'general';
  settings: Settings = new Settings();

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public storage: Storage, public events: Events) {
    storage.get(AppConstants.SETTINGS_STORAGE_KEY).then((data) => {
      if (data) {
        this.settings = JSON.parse(data);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onConfirmClick() {
    console.log(JSON.stringify(this.settings));
    this.storage.set(AppConstants.SETTINGS_STORAGE_KEY, JSON.stringify(this.settings)).then(() => {
      this.navCtrl.popToRoot();
      this.events.publish(AppConstants.SETTINGS_STORAGE_KEY);
    });
  }

  onCancelClick(): void {
    this.navCtrl.popToRoot();
  }

}
