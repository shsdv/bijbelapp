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
      if (list != null) {
        list.forEach(dbname => {
          this.synchronizeDb(dbname);
        });
      }
      this.synchronizeDb("hoofdmenu");
      this.getItemsFromDb("hoofdmenu", "", "\uffff").then(items => {
        items.forEach(element => {
          this.synchronizeDb(element.dbname);
        });
      });
    });
  }
  getItemsFromDb(dbname, startkey, endkey) : Promise<any[]> {
    return new Promise(resolve => {

      this.getDb(dbname).allDocs({
        startkey: startkey,
        endkey: endkey,
        include_docs: true

      }).then((result) => {

        let data = [];
        console.log(result);
        let docs = result.rows.map((row) => {
          data.push(row.doc);
        });

        resolve(data);
      }).catch((error) => {

        console.log(error);

      });
    });
  }
  destroyLocalDb(dbname) {
    let localDb = this.getOrCreateLocalDb(dbname);
    localDb.destroy().then(result => {
      console.log("Deleted: " + dbname);
      delete this.localdbs[dbname];
    }).catch(e => { console.log(e) });
  }
  synchronizeDb(dbname) {
    let localDb = this.getOrCreateLocalDb(dbname);
    let remoteDb = this.getOrMakeRemoteDb(dbname);
    console.log("Synchronizing db: " + dbname);
    console.log("Local db: " + this.localdbs[dbname]);
    console.log("Remote db: " + this.remotedbs[dbname]);
    let options = {
      live: true,
      retry: true,
      continuous: true,
    };
    localDb.replicate.from(remoteDb, options);
    console.log("Started syncing");
  }
  getOrCreateLocalDb(dbname) {
    if (this.localdbs.hasOwnProperty(dbname)) {
      return this.localdbs[dbname];
    } else {
      this.localdbs[dbname] = new PouchDB(dbname);
      return this.localdbs[dbname];
    }
  }
  getDb(dbname) {
    if (this.localdbs.hasOwnProperty(dbname)) {
      return this.localdbs[dbname];
    } else {
      return this.getOrMakeRemoteDb(dbname);
    }
  }

  getOrMakeRemoteDb(dbname) {
    if (!this.remotedbs.hasOwnProperty(dbname)) {
      let uri = this.settingsProvider.getDbUri() + dbname;
      console.log("Remote uri: "+ uri);
      this.remotedbs[dbname] = new PouchDB(uri);
    }
    return this.remotedbs[dbname];

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
          this.synchronizeDb(dbname);
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
          this.destroyLocalDb(dbname);
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
