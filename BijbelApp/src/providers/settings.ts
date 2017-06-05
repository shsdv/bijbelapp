import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
import {Synchronizer} from './synchronizer';

/*
  Generated class for the Settings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Settings {
  private cache: any = [];
  private settingsDB: any;
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

    return this.settingsDB.get(key).then(doc => {
      console.log("Value is: " + doc.value);
      return doc.value;
    }).catch(e => {
      console.log("Value is null");
      return null;
    });
  }
  setsetting(key: string, value: any) {
    console.log("Setting " + key + " to " + value);
    this.cache[key] = value;

    return this.settingsDB.get(key).then(doc => {
      doc.value = value;
      console.log("Updating to: " + doc);
      this.settingsDB.put(doc);
    }).catch(e => {
      let doc = {
        _id: key,
        value: value
      };
      console.log("Putting new doc: " + doc);
      this.settingsDB.put(doc);
    });
    //localStorage.setItem(key, JSON.stringify(value));
  }
  getDbUri(): Promise<string> {
    let username = this.getLoginNameForServer();
    let password = this.getPasswordForServer();
    return Promise.all([username, password]).then(result => {
      return 'https://bijbelapp.duckdns.org:5984/';
    });
  }
  getDbUriDifferentCredentials(username : string, password : string) : string {
    return 'https://' + username + ':' + password + '@bijbelapp.duckdns.org:5984/';
  }
  private usernameSettingStr: string = "username";
  private passwordSettingStr: string = "password";
  getLoginName(): Promise<string> {
    return this.getSetting(this.usernameSettingStr).then(name => {
      if (name == null) {
        return "anoniem";
      } else {
        return name;
      }
    });
  }
  getRealLoginName(): Promise<string> {
    return this.getSetting(this.usernameSettingStr).then(name => {
      if (name == null) {
        return "";
      } else {
        return name;
      }
    });
  }
   getLoginNameForServer(): Promise<string> {
    return this.getSetting(this.usernameSettingStr).then(name => {
      if (name == null) {
        return "wJvPUP";
      } else {
        return name;
      }
    });
  }
   getPasswordForServer(): Promise<string> {
    return this.getSetting(this.passwordSettingStr).then(pwd => {
      if (pwd == null) {
        return "bOlwofshNZuobBqmhF2bPgZb";
      } else {
        return pwd;
      }
    });
  }
  public setCredentials(username : string, password : string) {
    let p1 = this.setsetting(this.usernameSettingStr, username);
    let p2 = this.setsetting(this.passwordSettingStr, password);
    //Promise.all([p1, p2]).then(result => this.syncProvider.usernamePasswordChanged());
  }
  getRealPassword(): Promise<string> {
    return this.getSetting(this.passwordSettingStr).then(pwd => {
      if (pwd == null) {
        return "";
      } else {
        return pwd;
      }
    });
  }
}
