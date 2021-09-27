import * as idb from './idb/index.js';

let db;
const DB_NAME = 'db_data';
const STORE_NAME = 'data';

/**
 * init the databases
 * stores the chat records and annotations
 */

async function initDatabase() {
    if (db == null) {
        db = await idb.openDB(STORE_NAME, 2, {
            upgrade: function (upgradeDb, oldVersion, newVersion) {
                if (upgradeDb.objectStoreNames.contains(STORE_NAME) == null) {
                    let userDataDB = upgradeDb.createObjectStore(STORE_NAME,
                        {keyPath: "id", autoIncrement: true});
                    userDataDB.createIndex('imageUrl', 'imageUrl', {unique: false});
                    userDataDB.createIndex('roomID', 'roomID', {unique: false, autoIncrement: false});
                    userDataDB.createIndex('annotations', 'annotations', {unique: false});
                    userDataDB.createIndex('chat', 'chat', {unique: false});
                }
            }
        });
        console.log('db is created');
    }
}
window.initDatabase = initDatabase;

/**
 * add the image and room into database which init before.
 * @param data
 * @returns {Promise<void>}
 */
async function addDataintoDb(data) {
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try {
            let tx = await db.transaction(STORE_NAME, 'readwrite');
            let store = await tx.objectStore(STORE_NAME);

        }
        catch (error) {
            console.log(error);
        }
    }

}