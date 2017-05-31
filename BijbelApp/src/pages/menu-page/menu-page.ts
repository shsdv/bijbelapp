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
  level: any;
  scroller: string;
  automaticChange: boolean = false;
  dbname: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.level = 1;
    this.scroller = "100";
    this.pageTitle = navParams.get("title");
    this.dbname = navParams.get("dbname");
    this.menuService = new MenuItems(navParams.get("dbname"), navParams.get("startkey"), navParams.get("endkey"));
    if (navParams.get("newLevel")) {
      this.level = navParams.get("newLevel");
    }
  }
  ngAfterViewInit() {
    console.log(this.ListScroller);
    this.ListScroller.addScrollEventListener(this.listScrolled.bind(this));
  }
  listScrolled(event) {
    if (!this.automaticChange) {
      console.log("Listview scrolled");
      console.log(event.target);

      let middle = 100 - Math.round((event.target.scrollTop) / (event.target.scrollHeight - event.target.offsetHeight) * 100);
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
    item.newLevel = this.level + 1;

    if (!item.hasOwnProperty("dbname")) {
      item.dbname = this.dbname;
    }
    if (item.hasOwnProperty("nextIsContent") && item.nextIsContent == "1") {
      this.navCtrl.push(ContentPage, item);
    } else {
      this.navCtrl.push(MenuPage, item);
    }
  }


  showVal() {
    let scrollElement: HTMLDivElement = <HTMLDivElement>(document.getElementById('listScroll' + this.level).childNodes[0]);

    let scrollValue = Number(this.scroller);
    this.automaticChange = true;
    scrollElement.scrollTop = (100 - scrollValue) / 100 * (scrollElement.scrollHeight - scrollElement.offsetHeight);
    console.log(scrollElement);
    console.log(scrollElement.scrollTop);
  }
}
