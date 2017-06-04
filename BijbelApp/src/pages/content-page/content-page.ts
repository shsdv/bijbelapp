import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Synchronizer } from '../../providers/synchronizer';

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
  dbname : string;
  startkey: string;
  endkey : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public syncProvider : Synchronizer) {
    this.dbname = navParams.get("dbname");
    this.startkey = navParams.get("startkey");
    this.endkey = navParams.get("endkey");
    
    this.pageTitle = navParams.get("contentTitle");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentPage');
    this.syncProvider.getItemsFromDb(this.dbname, this.startkey, this.endkey).then((data) => {
      this.verses = data;
      console.log(data);
    });
  }


}
