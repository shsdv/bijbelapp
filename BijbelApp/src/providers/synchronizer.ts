import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Settings } from './settings';
import PouchDB from 'pouchdb';
/*
  Generated class for the Synchronizer provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Synchronizer {
  private syncSettingKey: string = "syncDbs";
  private localdbs: any[] = [];
  private remotedbs: any[] = [];
  constructor(public settingsProvider: Settings) {
    console.log('Hello Synchronizer Provider');
    this.getSyncList().then(list => {
      list.forEach(dbname => {
        this.localdbs[dbname] = new PouchDB(dbname);
        let remote = this.settingsProvider.getDbUri() + dbname;

        this.remotedbs[dbname] = new PouchDB(remote);

        let options = {
          live: true,
          retry: true,
          continuous: true,
          Auth: {
            username: 'wJvPUP',
            password: 'bOlwofshNZuobBqmhF2bPgZb'
          }

        };

        this.localdbs[dbname].replicate.from(this.remotedbs[dbname], options);
      });
    });
  }

  getOnlySynctAvailable(): Promise<boolean> {
    return this.settingsProvider.getSetting("onlySynct").then(val => {
      if (val == null) {
        return true;
      }
      else {
        return val;
      }
    });
  }
  setOnlySynctAvailable(newValue: boolean) {
    this.settingsProvider.setsetting("onlySynct", newValue);
  }

  getSyncList(): Promise<string[]> {
    return this.settingsProvider.getSetting(this.syncSettingKey);
  }
  setSyncList(list: string[]) {
    return this.settingsProvider.setsetting(this.syncSettingKey, list);
  }

  isAvailable(dbname: string): Promise<boolean> {
    return this.getOnlySynctAvailable().then(onlySync => {
      if (onlySync) {
        return this.isSynct(dbname);
      } else {
        return true;
      }
    });
  }

  isSynct(dbname: string): Promise<boolean> {
    console.log("Checking if is synct db with name: " + dbname);
    return this.getSyncList().then(syncList => {

      console.log("Synclist is: " + syncList);
      if (syncList != null && syncList.indexOf(dbname) !== -1) {
        console.log(dbname + " is synct");
        return true;
      }
      else {
        console.log(dbname + " is not synct");
        return false;
      }
    });
  }
  setSyncOn(dbname: string) {
    this.isSynct(dbname).then(isSynct => {
      if (!isSynct) {
        this.getSyncList().then(list => {
          if (list == null) {
            list = [dbname];
          } else {
            list.push(dbname);
          }

          return this.setSyncList(list);
        });
      }
    });
  }

  setSyncOff(dbname: string) {
    this.isSynct(dbname).then(isSynct => {
      if (isSynct) {
        this.getSyncList().then(list => {
          list.splice(list.indexOf(dbname), 1);
          return this.setSyncList(list);
        });
      }
    });
  }
  toggleSync(dbname: string) {
    this.isSynct(dbname).then(isSynct => {
      if (isSynct) {
        return this.setSyncOff(dbname);
      } else {
        return this.setSyncOn(dbname);
      }
    });
  }

}
