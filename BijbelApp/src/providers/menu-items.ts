import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/*
  Generated class for the MenuItems provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class MenuItems {


  data: any;
  db: any;
  remote: any;
  startkey : string;
  endkey : string;
  constructor(databaseName: string, startkey: string, endkey: string) {
    this.startkey = startkey;
    this.endkey = endkey;
    /*this.db = new PouchDB(databaseName);

    this.remote = 'http://wJvPUP:bOlwofshNZuobBqmhF2bPgZb@185.107.212.121:5984/' + databaseName;

    let options = {
      //     live: true,
       //     retry: true,
       //     continuous: true

    };
    this.db.replicate.from(this.remote, options);*/

    this.db = new PouchDB('https://wJvPUP:bOlwofshNZuobBqmhF2bPgZb@185.107.212.121.xip.io:5984/' + databaseName);

  }

  getMenuItems() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      this.db.allDocs({
        startkey : this.startkey, 
        endkey : this.endkey,
        include_docs: true

      }).then((result) => {

        this.data = [];
        console.log(result);
        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

    });

  }

  handleChange(change) {
    console.log("Change: " + change);
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }

      //A document was added
      else {
        this.data.push(change.doc);
      }

    }
  }

}
