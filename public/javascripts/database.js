import * as idb from './idb/index.js';

let db;
const DB_NAME = 'db_data';
const STORE_NAME_1 = 'data_userChats';
const STORE_NAME_2 = 'data_annotations';

/**
 * init 2 databases
 * the first one stores the chat records
 * the second one stores the annotations (including the image)
 */

async function initDatabase() {
    if(db == null){
        db = await idb.openDB(STORE_NAME_1,2,{
            upgrade: function (upgradeDb,oldVersion, newVersion) {
                if (upgradeDb.objectStoreNames.contains(STORE_NAME_1) == null){
                    let userDataDB = upgradeDb.createObjectStore(STORE_NAME_1,{
                        keyPath: 'roomID',
                        autoIncrement: false
                    });
                    userDataDB.createIndex('roomID','roomID',{unique:true,multiEntry:true})
                }
                if (upgradeDb.objectStoreNames.contains(STORE_NAME_2) == null){
                    let userDataDB = upgradeDb.createObjectStore(STORE_NAME_2,{
                        keyPath: 'ID',
                        autoIncrement: true
                        });
                    userDataDB.createIndex('roomID','roomID',{unique:false,multiEntry:true})
                }

            }
        });
        console.log('db is created');
    }

}
window.initDatabase = initDatabase;