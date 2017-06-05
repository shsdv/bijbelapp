import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import request from 'request';
import { AlertController } from 'ionic-angular';
import PouchDB from 'pouchdb';
/**
 * Generated class for the Loginregister page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-loginregister',
  templateUrl: 'loginregister.html',
})
export class Loginregister {
  username: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider: Settings, private alertCtrl: AlertController) {
    this.settingsProvider.getRealLoginName().then(username => this.username = username);
    this.settingsProvider.getRealPassword().then(password => this.password = password);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Loginregister');
  }

  login() {
    console.log("Loggin in user " + this.username + " with " + this.password);
    let uri = "https://bijbelapp.duckdns.org/login.php";
    var self = this;
    request.post(uri,
      { form: { email: this.username, password: this.password } },
      function (error, response, body) {
        console.log(response);
        if (!error && response.statusCode == 200 && body == "OK") {
          self.saveCredentials();
        } else {
          self.giveError(response.body);
        }
      });
  }
  register() {
    console.log("Register user " + this.username + " with " + this.password);
    let uri = "https://bijbelapp.duckdns.org/register.php";
    var self = this;
    request.post(uri,
      { form: { email: this.username, password: this.password } },
      function (error, response, body) {
        console.log(response);
        if (!error && response.statusCode == 200 && body == "OK") {
          self.saveCredentials();
        } else {
          self.giveError(response.body);
        }
      });

  }
  giveError(errorMessage) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  saveCredentials() {
    this.settingsProvider.setCredentials(this.username, this.password);
    let alert = this.alertCtrl.create({
      title: 'Geslaagd',
      subTitle: "De inlogggevens zijn aangepast!",
      buttons: [{
        text: 'Ok', handler: () => {
          let navTransition = alert.dismiss();
          navTransition.then(() => {
            this.navCtrl.pop();
          });

          return false;
        }
      }]
    });
    alert.present();
  }
}
