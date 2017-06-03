import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/*
  Generated class for the Settings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Settings {
  private cache: any = [];
  private settingsDB : any;
  constructor() {
    console.log('Hello Settings Provider');
    this.settingsDB = new PouchDB("settings");
  }
  getSetting(key: string): Promise<any> {
    console.log("loading setting: " + key);

    if (this.cache != null && this.cache.hasOwnProperty(key)) {
      console.log("Value is in cache: " + this.cache[key]);
      return Promise.resolve(this.cache[key]);
    }
    /*
    let value = localStorage.getItem(key);
    console.log("Value is " + value);
    let realVal = null;
    if (value != null) {
      let realVal =  JSON.parse(value);
    }
    
    this.cache[key] = realVal;
    return realVal;*/

    return this.settingsDB.get(key).then( doc => {
      console.log("Value is: " + doc.value);
      return doc.value;
    }).catch ( e => {
      console.log("Value is null");
      return null;
    });
  }
  setsetting(key: string, value: any) {
    console.log("Setting " + key + " to " + value);
    this.settingsDB.get(key).then(doc => {
      doc.value = value;
      console.log("Updating to: " + doc);
      this.settingsDB.put(doc);
    }).catch(e => {
      let doc = {
        _id : key,
        value : value
      };
      console.log("Putting new doc: " + doc);
      this.settingsDB.put(doc);
    });
    //localStorage.setItem(key, JSON.stringify(value));
    this.cache[key] = value;
  }
  getDbUri(){
    return 'http://wJvPUP:bOlwofshNZuobBqmhF2bPgZb@185.107.212.121:5984/';
  }
}
