import * as idb from './idb/index.js';

let db;
const DB_NAME = 'db';
const CHAT_STORE_NAME = 'chatData';
const ANNOTATION_STORE_NAME = 'annotationData';

/**
 * init two databases
 * stores the chat records and annotations
 */

async function initDatabase() {
    if (db == null) {
        db = await idb.openDB(DB_NAME, 2, {
            upgrade: function (upgradeDb, oldVersion, newVersion) {
                if (upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME) == null) {
                    let chatDataBase = upgradeDb.createObjectStore(CHAT_STORE_NAME,
                        {keyPath: 'id', autoIncrement: false});
                    chatDataBase.createIndex('roomID','id',{unique:true,multiEntry:true});
                }
                if (upgradeDb.objectStoreNames.contains(ANNOTATION_STORE_NAME) == null){
                    let annotationDataBase = upgradeDb.createObjectStore(ANNOTATION_STORE_NAME,
                        {keyPath:'id', autoIncrement: true});
                    annotationDataBase.createIndex('roomID','id',{unique:false,multiEntry:true});
                }

            }
        });

    }
    console.log('db is created');
}
window.initDatabase = initDatabase;


//abstract these functions
async function storeData(data, storeName){
    console.log('inserting: '+JSON.stringify(data));
    if (db == null){
        await initDatabase();
        console.log('db is created');
    }
    else if (db){
        try {
            let tx = await db.transaction(storeName, 'readwrite');
            let store = await tx.objectStore(storeName);
            let index = await store.index('roomID');

            //if the request roomID is exist, store the chatData to the IndexedDB into the right room
            let request = await index.getAll(IDBKeyRange.only(data.roomID));
            if (request.length > 0){
                store.put(data, request.roomID);
            }
            //else create a new record
            else{
                store.put(data);
            }
            await tx.done;


        }
        catch (error) {
            console.log('error to store');
        }
    }
}

async function getData(roomID, storeName){
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try{
            console.log('get the chatHistory '+ roomID );
            let tx = await db.transaction(storeName, 'readonly');
            let store = await tx.objectStore(storeName);
            let index = await store.index('roomID');

            let list = await index.getAll(IDBKeyRange.only(roomID));
            await tx.done;
            //set the array for chatHistory
            if (list.length > 0){
                return list;
            }
            else{
                console.log('error to get chat History')
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}



/**
 * store the chatData
 * @param chatData
 * @returns {Promise<void>}
 */
async function storeChatData(chatData) {
    await storeData(chatData, CHAT_STORE_NAME);

}
window.storeChatData = storeChatData;


/**
 * store the annotation data
 * @param annotationData
 * @returns {Promise<void>}
 */
async function storeAnnotationData(annotationData) {
    await storeData(annotationData, ANNOTATION_STORE_NAME);
}
window.storeAnnotationData = storeAnnotationData;



/**
 * get the chatData
 * @param roomID
 * @returns {Promise<void>}
 */
async function getChatData(roomID) {
    await getData(roomID, CHAT_STORE_NAME);

}
window.getChatData = getChatData;


/**
 *
 * @param roomID
 * @returns {Promise<any>}
 */
async function getAnnotationData(roomID) {
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try{
            console.log('get the chatHistory '+ roomID );
            let tx = await db.transaction(ANNOTATION_STORE_NAME, 'readonly');
            let store = await tx.objectStore(ANNOTATION_STORE_NAME);
            let index = await store.index('roomID');

            let list = await index.getAll(IDBKeyRange.only(roomID));
            await tx.done;
            //set the array for chatHistory
            if (list.length > 0){
                return list;
            }
            else{
                console.log('error to get chat History')
            }
        }
        catch (error) {
            console.log(error);
        }
    }

}
window.getAnnotationData = getAnnotationData;