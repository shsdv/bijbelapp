import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MenuPage } from '../menu-page/menu-page';
import {Tabs} from 'ionic-angular';
import { Synchronizer } from '../../providers/synchronizer';
@IonicPage()
@Component({
  templateUrl: 'home.html',
  selector: 'page-home'

})
export class HomePage {
  data : any;
   constructor(public navCtrl: NavController, public navParams: NavParams, public syncProvider : Synchronizer) {
     this.syncProvider.getItemsFromDb("hoofdmenu", "", "\uffff").then((data) => {
        this.data = data;
        console.log(data);
      });
      this.syncProvider.checkServerID();
    }
    
  
  ionViewDidLoad() {
   

  }

  
  openMenuPage(item){
    this.navCtrl.setRoot(MenuPage, item);
  }
}
