import { Component, ViewChild } from '@angular/core';
import { Platform, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu-page/menu-page';
import { SettingsPage } from '../pages/settings-page/settings-page';
import { SyncSettingsPage } from '../pages/sync-settings-page/sync-settings-page';

import { Synchronizer } from '../providers/synchronizer';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  settingsPage:any = SettingsPage;
  syncSettingsPage: any = SyncSettingsPage;
  data : any;
  @ViewChild("rootNavController") nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public syncProvider : Synchronizer) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.syncProvider.getItemsFromDb("hoofdmenu", "", "\uffff").then((data) => {
        this.data = data;
        console.log(data);
      });
    });


  }

  openPage(page){
    this.nav.setRoot(page);
  }
  openMenuPage(item){
    this.nav.setRoot(MenuPage, item);
  }
}

