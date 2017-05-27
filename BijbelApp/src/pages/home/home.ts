import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MenuPage } from '../menu-page/menu-page';
import {Tabs} from 'ionic-angular';
import { MenuItems } from '../../providers/menu-items';
@IonicPage()
@Component({
  templateUrl: 'home.html',
  selector: 'page-home'

})
export class HomePage {
  menuService : any;
  data : any;
   constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.menuService = new MenuItems("hoofdmenu");
      this.menuService.getMenuItems().then((data) => {
        this.data = data;
        console.log(data);
      });
    }
  
  ionViewDidLoad() {
   

  }

  
  openMenuPage(item){
    this.navCtrl.setRoot(MenuPage, item);
  }
}
