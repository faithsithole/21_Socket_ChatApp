var socket = io();

socket.on("connect", function () {
	console.log("I have connected!!")
});

var username = prompt("What is your username?");

//elements from DOM
//wrap divs
var wrap = document.getElementById("wrap");
var userWrap = document.getElementById("user-wrap");
var userList = document.querySelector(".user-list");
var msgWrapDiv = document.getElementById("msg-wrap");

// //cloning msg template and its contents
var msgTemplate = document.querySelector(".msg-template");
msgWrapDiv.removeChild(msgTemplate);

//form
var formID = document.getElementById("msg-form");
var formIDinput = formID.elements["new-msg"];

//emits username information
socket.emit("prompt for username", username);

function userMessage (event) {
	event.preventDefault();
	var formIDinputValue = formIDinput.value;

	displayMessage(username, formIDinputValue);

	socket.emit("client new chat message", username, formIDinputValue);
	formIDinput.value = "";
}

formID.onsubmit = userMessage;

//listens for usernames as they are updated
socket.on("username list", function (usernames) {

	// clears list content before names are displayed
	userList.innerHTML = "";

	for (var i = 0; i < usernames.length; i = i + 1) {
		var name = usernames[i];
		var newUser = document.createElement("li");
		newUser.textContent = name;
		userList.appendChild(newUser);
		console.log(name);
	}
});

//listening for other users messages
socket.on("server new chat message", function (username, formIDinputValue) {
	displayMessage(username, formIDinputValue);
});

function displayMessage(username, formIDinputValue) {
	//cloning msg template and its contents
	var cloneMsgTemplate = msgTemplate.cloneNode(true);
	var msgDiv = cloneMsgTemplate.querySelector(".msg");
	var currentUserName = cloneMsgTemplate.querySelector(".username");
	var time = cloneMsgTemplate.querySelector(".time");
	msgWrapDiv.appendChild(cloneMsgTemplate);
	msgDiv.textContent = formIDinputValue;
	currentUserName.textContent = username;
}
