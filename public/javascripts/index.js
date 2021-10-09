let name = null;
let roomID = null;
let chat = null;
let online = null;

window.addEventListener(
    "load",
    function (event) {
        if (navigator.onLine) {
            online = true;
        } else {
            online = false;
        }
    },
    false
);

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
async function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    //@todo here is where you should initialise the socket operations as described in the lectures (room joining, chat message receipt etc.)
    if (online){
        chat = io.connect('/chat');
    }
    if (chat){
        initChatSocket();
    }

    if ('indexedDB' in window){
        await initDatabase();
    }
    else {
        console.log('The browser can not support indexedDB')
    }


    // The service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker is successfully applied');
            });
    }

}



/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomID = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomID;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    // @todo send the chat message
    if (chat) {
        chat.emit('chat', roomID, name, chatText);
        console.log(chatText + ' is sent');
    }
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomID = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //join the room
    if (chat) {
        chat.emit('create or join', roomID, name);
    }
    initCanvas('chat', imageUrl);
    hideLoginInterface(roomID, name);
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(userid,text) {
    if (text==='') return;
	let text2 = text;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
	
	paragraph.style.setProperty("margin",'0px', 'important');
	paragraph.style.setProperty("padding",'0px', 'important');
	
	
	let currentUser = document.getElementById('name').value;
    if(userid == currentUser){
		text = "<b>"+"Me"+":</b>" + text;
	}else{
		if(userid){
			text = "<b>"+userid+":</b>" + text;
		}
	}
	
	paragraph.innerHTML = text;
    history.appendChild(paragraph);
	
	
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    //create the chatData : roomID, userName and chat content
	if(!userid){
		userid = "";
	}
	
	let chatData = {roomID: document.getElementById("in_room").innerText,userName: userid , chat: text2};
	console.log("going to insert data:"+JSON.stringify(chatData));
    storeChatData(chatData).then();
    
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory(false,'<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId;
        if (userId === name) who = 'Me';
        writeOnHistory(userId, chatText);
    });
}

async function annotationData(room, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness) {
    let annotationData = {
        roomID: room,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        x1: x1,
        y1: y2,
        x2: x2,
        y2: y2,
        color: color,
        thickness: thickness,
    };
    await storeAnnotationData(annotationData);
}


/**
 * using ajax to communicate
 * @param url
 * @param data
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: async function (dataR) {
            let roomID = dataR.userInfo.room;
            await getChatData(roomID, (list) => {
                let loadData = list;
                if (loadData.length > 0) {
                    for (let i = 0; i < loadData.length; i++) {
						console.log("roomID:"+roomID);
						console.log(  "loadData[i].roomID:"+loadData[i].roomID);
						if(roomID == loadData[i].roomID){
							let content = loadData[i].chat ;
							let history = document.getElementById('history');
							let paragraph = document.createElement('p');
							paragraph.style.setProperty("margin",'0px', 'important');
							paragraph.style.setProperty("padding",'0px', 'important');
							
							let currentUser = document.getElementById('name').value;
							if(loadData[i].userName == currentUser){
								content = "<b>"+"Me"+":</b>" + content;
							}else{
								if(loadData[i].userName){
									content = "<b>"+loadData[i].userName+":</b>" + content;
								}
							}
							
							paragraph.innerHTML = content;
							
							history.appendChild(paragraph);
							history.scrollTop = history.scrollHeight;
						}
                    }
                }
            });
            //need to be fixed
            getAnnotationData(roomID,(list)=>{
                let annotationData = list;
                console.log("======");
                console.log(list);
                if (annotationData.length > 0){
                    let cvx = document.getElementById('canvas');
                    let ctx = cvx.getContext('2d');
                    for (let i = 0; i < annotationData.length; i++){
                        let obj = annotationData[i].annotation;
                        drawOnCanvas(ctx, obj.canvasWidth, obj.canvasHeight, obj.x1, obj.y1, obj.x2, obj.y2, obj.color, obj.thickness).then();
                    }

                }
            });


        },
        //When offline, the data need to be stored
        error: async function (response) {
            let roomID = dataR.userInfo.room;
            await getChatData(roomID, (list) => {
                let loadData = list;
                if (loadData.length > 0) {
                    for (let i = 0; i < loadData.length; i++) {
						if(roomID == loadData[i].roomID){
							let content = loadData[i].chat;
							let history = document.getElementById('history');
							let paragraph = document.createElement('p');
							paragraph.style.setProperty("margin",'0px', 'important');
							paragraph.style.setProperty("padding",'0px', 'important');
							
							let currentUser = document.getElementById('name').value;
							if(loadData[i].userName == currentUser){
								content = "<b>"+"Me"+":</b>" + content;
							}else{
								if(loadData[i].userName){
									content = "<b>"+loadData[i].userName+":</b>" + content;
								}
							}
							
							paragraph.innerHTML = content;
							history.scrollTop = history.scrollHeight;
							history.appendChild(paragraph);
						}
                    }
                }
            });

            //need to be fixed
            getAnnotationData(roomID,(list)=>{
                let annotationData = list;
                console.log("======");
                console.log(list);
                if (annotationData.length > 0){
                    let cvx = document.getElementById('canvas');
                    let ctx = cvx.getContext('2d');
                    for (let i = 0; i < annotationData.length; i++){
                        let obj = annotationData[i].annotation;
                        drawOnCanvas(ctx, obj.canvasWidth, obj.canvasHeight, obj.x1, obj.y1, obj.x2, obj.y2, obj.color, obj.thickness).then();
                    }

                }
            });
        }
    })
}

/**
 * to submit the form
 */
function onSubmit() {
    // The .serializeArray() method creates a JavaScript array of objects
    const formArray = $("form").serializeArray();
    let data = {};
    for (index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());

    sendAjaxQuery('/getUsersData', data);
    event.preventDefault();
}




