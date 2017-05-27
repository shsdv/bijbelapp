import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuItems } from '../../providers/menu-items';
import { ContentPage } from '../content-page/content-page';
import { Scroll } from 'ionic-angular';

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
  @ViewChild(Scroll) ListScroller: Scroll;
  pageTitle: any;
  items: any;
  menuService: MenuItems;
  level : any;
  scroller : string;
  automaticChange: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.level = 1;
    this.scroller = "100";
    this.pageTitle = navParams.get("title");
    this.menuService = new MenuItems(navParams.get("dbname"));
    if(navParams.get("newLevel")){
      this.level = navParams.get("newLevel");
    }
  }
  ngAfterViewInit() {
    console.log(this.ListScroller);
        this.ListScroller.addScrollEventListener(this.listScrolled.bind(this));
    }
listScrolled(event){
  if(!this.automaticChange){
    console.log("Listview scrolled");
    let middle = 100- Math.round((event.target.scrollTop + event.target.offsetHeight*0.5)/event.target.scrollHeight*100);
    this.scroller = "" + middle;

  }
  console.log("Listview scrolling");
  this.automaticChange = false;


 // element.value = ""+ middle;
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    this.menuService.getMenuItems().then((data) => {
      this.items = data;
    });
  }

  openPage(item) {
    console.log(item);
    if (item.hasOwnProperty("dbname")) {
      item.newLevel = this.level + 1;
        this.navCtrl.push(MenuPage, item);
    } else if (item.hasOwnProperty("contentDB")) {
      this.navCtrl.push(ContentPage, item);
    }
  }

  showVal() {
    console.log("Scroller: " + this.scroller);
    let selectingId = Math.round((this.items.length - 1) * (100 - Number(this.scroller)) / 100);
    let element = document.getElementById("id-" +this.level + '-' + selectingId);
    console.log(element);
    console.log("id-" + selectingId);
    if (element) {
      console.log("Scrolling");
      this.automaticChange = true;
      element.scrollIntoView();

    }

  }
}
