//References
//https://www.youtube.com/watch?v=rxzOqP9YwmM : real time socket chat application.
//https://www.youtube.com/watch?v=cVYQEvP-_PA&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp&index=4 : mongodb connection
//https://www.youtube.com/watch?v=CrAU8xTHy4M&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp&index=9 : user registration
//https://www.youtube.com/watch?v=JtTHO29LLCY&feature=youtu.be : chat history retrieval

const socket = io('http://localhost:3000')

const messageContainer = document.getElementById('message-container')
//const messageContainer = document.getElementById('card-body msg_card_body')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

var date = new Date();
var hour; var min; var year; var month; var day; var name
var timeString = "";
var joined = false;
var messageCount = 0;

socket.emit('new-user')

socket.on('chat-message', data => {

    //gets the current time and passes it to a global variable "timeString"
    getTime()

    //Send a username, message, and time
    appendMessage(data.name, data.message, timeString)
    generateProfileAvatar(data.name, `user-icon${messageCount}`)
})

socket.on('user-connected', name => {

    name = name
    console.log('inside user-connected')
    //gets the current time and passes it to a global variable "timeString"
    getTime()
    //changes join state
    joined = true;
    //Send a username, message, and time
    appendMessage("notify", `${name} connected`, timeString)
})

//used tutorial and changed it to work with my code structure to retrieve all the messages when a user connects
socket.on('chat-history', data => {
    console.log('chat his '+ data.name)
    //Send all messages with username, message, and time
    $.each(data.docs, function(){
        
        console.log('chat his '+ this.username)
        if(this.username == data.name)
        {
            appendMessage("me", this.message_body, this.time)
            generateProfileAvatar("Me", `user-icon${messageCount}`)
        }
        else{
            console.log('man')
            appendMessage(this.username, this.message_body, this.time)
            generateProfileAvatar(this.username, `user-icon${messageCount}`)
        }
        
    })
})

socket.on('user-disconnected', name => {

    //gets the current time and passes it to a global variable "timeString"
    getTime()

    //Send a username, message, and time
    if(name === `null`){
        
    }
    else{
        appendMessage("notify", `${name} disconnected`, timeString)
    }
    
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value

    getTime()
    appendMessage("me", message, timeString)
    socket.emit('send-chat-message', message)
    socket.emit('store-chat-message', {message: message, time: timeString})
    messageInput.value = ''

    //Generate a profile avatar with username "Me", 
    //This method receives a username and a dynamically css id tag
    generateProfileAvatar("Me", `user-icon${messageCount}`)
})

function appendMessage(name, message, time) {

    //increase chatroom message count, currently used to create distinct css id tags
    //for the generate profile picture function
    //could be used for other things
    messageCount++

    //create message div 
    const messageElement = document.createElement('div')

    //create name display div
    const nameElement = document.createElement('div')
    //give div a css attribute
    nameElement.setAttribute("class", "img_cont_msg");

    //creates a child message div that is a child of the message div, it holds the message
    const actualElement = document.createElement('div')

    //creates a span that hold the time/date
    const timeElement = document.createElement('span')

    //logic that checks where the received message is from. Me? another user? or a notification?
    if (name == "me") {

        //if it's from me, assign specific css tags to divs containing message
        //bootstrap syntax used here
        //messages appear on the right
        messageElement.setAttribute("class", "d-flex justify-content-end mb-4");
        actualElement.setAttribute("class", "msg_cotainer_send");
        timeElement.setAttribute("class", "msg_time_send");

        //these create the canvas for the profile avatar to be generated
        const profileIconElement = document.createElement('canvas')
        profileIconElement.setAttribute("class", "user-icon");
        profileIconElement.setAttribute("id", `user-icon${messageCount}`);
        profileIconElement.setAttribute("width", 40);
        profileIconElement.setAttribute("height", 40);
        nameElement.append(profileIconElement)

    }
    else if (name == "notify") {

        //if it's a notification, assign specific css tags to divs containing message
        //bootstrap syntax used here
        //Notifications appear at the center
        messageElement.setAttribute("class", "d-flex justify-content-center mb-4");
        name = ''
        actualElement.setAttribute("class", "msg_cotainer_center");
        timeElement.setAttribute("class", "msg_time_center");
    }
    else {

        //if it's from another user, assign specific css tags to divs containing message
        //bootstrap syntax used here
        //messages appear on the left
        messageElement.setAttribute("class", "d-flex justify-content-start mb-4");
        actualElement.setAttribute("class", "msg_cotainer");
        timeElement.setAttribute("class", "msg_time");

        //these create the canvas for the profile avatar to be generated
        const profileIconElement = document.createElement('canvas')
        profileIconElement.setAttribute("class", "user-icon");
        profileIconElement.setAttribute("id", `user-icon${messageCount}`);
        profileIconElement.setAttribute("width", 40);
        profileIconElement.setAttribute("height", 40);
        nameElement.append(profileIconElement)
    }

    //enable this to show full usernames without styling, make sure to comment out the generateAvatar method
    //nameElement.innerText = name

    //assignment of text to the create divs, message and time
    actualElement.innerText = message
    timeElement.innerText = time;

    //makes the `time div` a child of the `child message div`
    actualElement.append(timeElement);

    //makes the `name div` a child of the `parent message div`
    messageElement.append(nameElement);

    //makes the `child message` div a child of the parent message div
    messageElement.append(actualElement);

    //makes the `parent message` div a child of the main message div
    messageContainer.append(messageElement);

}

//this function asks for the user's name on click
// function askForName() {

//     if (!joined) {

//         //get's the list element and highlights it, showing it is active
//         let clickedDiv = document.getElementById("room")
//         clickedDiv.setAttribute("class", "active")

//         //gets the chat window and makes the chat window visible
//         let chatDiv = document.getElementById("chat")
//         chatDiv.setAttribute("style", "visibility: visible;");

//         //prompts for name
//         name = prompt('What is your name?')

//         //if no name is entered or user clicks cancel
//         //Notifies the group of an anonymous user
//         if (name === `null`) {
//             name = "Anonymous User"
//         }

//         //changes join state
//         joined = true;

//         getTime()
//         appendMessage("notify", 'You joined', timeString)
//         socket.emit('new-user', name)
//     }

// }

//function that generates time when called
function getTime() {

    date = new Date();

    hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    year = date.getFullYear();

    month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    timeString = `${day}/${month}/${year} ${hour}:${min}`;

}

//this function enables the toggle menu for the disconnect feature
$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

//this function closes the menu when disconnect is clicked
$(document).ready(function () {
    $('#option').click(function () {
        $('.action_menu').toggle();
    });
});

//disconnects the user from  a chat
function disconnect() {

    //this actually does the disconnect
    socket.disconnect(true);

    //this gets the current time
    getTime()

    //sends the disconnection message into the chatroom a notification
    appendMessage("notify", `You disconnected`, timeString)

    //changes the state of the boolean keeping track of chatroom join
    joined = false;
}

// $(document).ready(function () {
//     var li = document.getElementsByTagName("li");

//     for (var i = 0; i < li.length; i++) {
//         li[i].addEventListener("click", askForName);
//     }
// });
