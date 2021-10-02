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
                    let annotationDataBase = upgradeDb.createObjectStore(ANNO_STORE_NAME,
                        {keyPath:'id', autoIncrement: false});
                    annotationDataBase.createIndex('roomID','id',{unique:true,multiEntry:true});
                }

            }
        });

    }
    console.log('db is created');
}
window.initDatabase = initDatabase;


//@todo try to abstract these functions



/**
 * store the chatData
 * @param chatData
 * @returns {Promise<void>}
 */
async function storeChatData(chatData) {
    console.log('inserting: '+JSON.stringify(chatData));
    if (db == null){
        await initDatabase();
        console.log('db is created');
    }
    else if (db){
        try {
            let tx = await db.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('roomID');

            //if the request roomID is exist, store the chatData to the IndexedDB into the right room
            let request = await index.getAll(IDBKeyRange.only(chatData.roomID));
            if (request.length > 0){
                store.put(chatData, request.roomID);
            }
            //else create a new record
            else{
                store.put(chatData);
            }
            await tx.done;


        }
        catch (error) {
            console.log('error to store chat');
        }
    }

}
window.storeChatData = storeChatData;

async function storeAnnotationData(annotationData) {
    console.log('inserting: '+JSON.stringify(annotationData));
    if (db == null){
        await initDatabase();
        console.log('db is created');
    }
    else if (db){
        try {
            let tx = await db.transaction(ANNOTATION_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(ANNOTATION_STORE_NAME);
            let index = await store.index('roomID');

            //if the request roomID is exist, store the chatData to the IndexedDB into the right room
            let request = await index.getAll(IDBKeyRange.only(annotationData.roomID));
            if (request.length > 0){
                store.put(annotationData, request.roomID);
            }
            //else create a new record
            else{
                store.put(annotationData);
            }
            await tx.done;
        }
        catch (error) {
            console.log('error to store annotation');
        }
    }
}
window.storeAnnotationData = storeAnnotationData;

async function getChatData(roomID) {
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try{
            console.log('get the chatHistory '+ roomID );
            let tx = await db.transaction(CHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_STORE_NAME);
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
        }{

        }
    }

}
window.getChatData = getChatData;

async function getAnnotationData(roomID) {
    if (db == null){
        await initDatabase();
    }
    else if (db){
        try{
            console.log('get the annotation '+ roomID );
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
                console.log('error to get annotation history');
            }
        }
        catch (error) {
            console.log('error to get annotation history');
        }{

        }
    }

}
window.getAnnotationData = getAnnotationData;