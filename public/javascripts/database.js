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
    if (!db) {
        db = await idb.openDB(DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
                    let chatDataBase = upgradeDb.createObjectStore(CHAT_STORE_NAME,
                        {keyPath: 'id', autoIncrement: true});
                    //create the indexes of chat database
                    chatDataBase.createIndex('roomID','id',{unique:false,multiEntry:true});
                    chatDataBase.createIndex('chat','id',{unique:false,multiEntry:true});
                    chatDataBase.createIndex('name','id',{unique:false,multiEntry:true});
                }
                if (!upgradeDb.objectStoreNames.contains(ANNOTATION_STORE_NAME)){
                    let annotationDataBase = upgradeDb.createObjectStore(ANNOTATION_STORE_NAME,
                        {keyPath:'id', autoIncrement: true});
                    //create the indexes of annotation database
                    annotationDataBase.createIndex('roomID','id',{unique:false,multiEntry:true});
                    annotationDataBase.createIndex('annotation','id',{unique:false,multiEntry:true});
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

        let tx = await db.transaction(storeName, 'readwrite');
        let store = await tx.objectStore(storeName);
        let index = await store.index('roomID');
        console.log(index);
        let userName = await store.index('name');
        //console.log(chatData);
        //if the request roomID is exist, store the chatData to the IndexedDB into the right room
        let request = await index.getAll();
        if (request.length > 0){
            store.put(data, request.roomID);
            //store.put(data, request.name);
        }
        //else create a new record
        else{
            store.put(data);
        }
        await tx.done;
    }
}

async function getData(roomID, storeName,callback){
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try{
            console.log('get the chatHistory '+ roomID );
            let tx = await db.transaction(storeName, 'readonly');
            let store = await tx.objectStore(storeName);
            let index = await store.index('roomID');

            let list = await index.getAll();
            console.log(list.length);
            await tx.done;
            //set the array for chatHistory
            if (list.length > 0){
                callback(list);
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
async function getChatData(roomID,callback) {
    await getData(roomID, CHAT_STORE_NAME,callback);

}
window.getChatData = getChatData;


/**
 *
 * @param roomID
 * @returns {Promise<any>}
 */
async function getAnnotationData(roomID,callback) {
    await getData(roomID,ANNOTATION_STORE_NAME,callback);

}
window.getAnnotationData = getAnnotationData;
