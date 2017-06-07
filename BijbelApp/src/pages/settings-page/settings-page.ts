import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import {Loginregister} from '../loginregister/loginregister';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings-page',
  templateUrl: 'settings-page.html',
})
export class SettingsPage {
  loginName : Promise<string>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider : Settings ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ionViewDidEnter() {
        this.loginName = this.settingsProvider.getLoginName();
  }
  loginRegister() {
    this.navCtrl.push(Loginregister);
  }

}
