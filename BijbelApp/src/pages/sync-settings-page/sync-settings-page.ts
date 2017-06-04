import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuItems } from '../../providers/menu-items';
import { Synchronizer } from '../../providers/synchronizer';

/**
 * Generated class for the SyncSettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sync-settings-page',
  templateUrl: 'sync-settings-page.html',

})
export class SyncSettingsPage {
  items: any;
  onlySynct : Promise<boolean> = this.syncProvider.getOnlySynctAvailable();
  constructor(public navCtrl: NavController, public navParams: NavParams, public syncProvider: Synchronizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncSettingsPage');
    this.syncProvider.getItemsFromDb("hoofdmenu", "", "\uffff").then((data) => {
      this.items = data;
      this.items.forEach(element => {
        this.syncProvider.getItemsFromDb(element.dbname, "", "\uffff").then((data) => {
          element.subitems = data;
          data.forEach(doc => {
            doc.synct = this.syncProvider.isSynct(doc.dbname);
          });
        });
      });
    });
  }
  changeOnlySynct(event: any) {
    this.syncProvider.setOnlySynctAvailable(event.value);
  }
  changeVal(event: any, dbname: string) {
    if (event.value) {
      console.log("Turning on synchronisation for: " + dbname)
      this.syncProvider.setSyncOn(dbname);
    } else {
      console.log("Turning off synchronisation for: " + dbname)
      this.syncProvider.setSyncOff(dbname);

    }
  }
}
