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
  menuService: MenuItems;
  items: any;
  onlySynct : Promise<boolean> = this.syncProvider.getOnlySynctAvailable();
  constructor(public navCtrl: NavController, public navParams: NavParams, public syncProvider: Synchronizer) {
    this.menuService = new MenuItems("hoofdmenu", "", "\uffff");
    this.syncProvider.isSynct("bijbel_sv").then(test => console.log(test));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncSettingsPage');
    this.menuService.getMenuItems().then((data) => {
      this.items = data;
      this.items.forEach(element => {
        element.menuItemsProvider = new MenuItems(element.dbname, "", "\uffff");
        element.menuItemsProvider.getMenuItems().then((data) => {
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
