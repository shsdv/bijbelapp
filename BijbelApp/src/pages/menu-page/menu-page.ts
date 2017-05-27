import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuItems } from '../../providers/menu-items';
import { ContentPage } from '../content-page/content-page';
/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu-page',
  templateUrl: 'menu-page.html',
})
export class MenuPage {
  pageTitle: any;
  items: any;
  menuService: MenuItems;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageTitle = navParams.get("title");
    this.menuService = new MenuItems(navParams.get("dbname"));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    this.menuService.getMenuItems().then((data) => {
      this.items = data;
      console.log(data);
    });
  }

  openPage(item){
    console.log(item);
    if(item.hasOwnProperty("dbname")){
      this.navCtrl.push(MenuPage, item);
    } else if(item.hasOwnProperty("contentDB")){
      this.navCtrl.push(ContentPage, item);
    }
  }
 
}
