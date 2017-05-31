import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuItems } from '../../providers/menu-items';

/**
 * Generated class for the ContentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-content-page',
  templateUrl: 'content-page.html',
})
export class ContentPage {
  verses: any;
  pageTitle : any;
  dataService: MenuItems;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dataService = new MenuItems(navParams.get("dbname"), navParams.get("startkey"), navParams.get("endkey"));
    this.pageTitle = navParams.get("contentTitle");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentPage');
    this.dataService.getMenuItems().then((data) => {
      this.verses = data;
      console.log(data);
    });
  }


}
