import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MenuPage } from '../menu-page/menu-page';
import {Tabs} from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'home.html',
  selector: 'page-home'

})
export class HomePage {

   constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
   

  }
}
