import { Component, ViewChild } from '@angular/core';
import { Platform, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuItems } from '../providers/menu-items';

import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu-page/menu-page';
import { SettingsPage } from '../pages/settings-page/settings-page';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  settingsPage:any = SettingsPage;
  data : any;
  menuService : MenuItems;
  @ViewChild("rootNavController") nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menuService = new MenuItems("hoofdmenu", "", "\uffff");
      this.menuService.getMenuItems().then((data) => {
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

