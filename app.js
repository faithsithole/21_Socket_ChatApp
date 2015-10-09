// Set up Express
var express = require("express");
var app = express();

// Serve public folder
var path = require("path");
var publicPath = path.join(__dirname, "public");
var staticServer = express.static(publicPath);
app.use(staticServer);

// Start server
var envPort = process.env.PORT || 8080;
var server = app.listen(envPort);

// Piggyback the socket.io connection over the same server
var io = require("socket.io")(server);

// global variable that will store all usernames entered
var usernames = [];


// what runs when user connects
io.on("connection", function (socket) {
	console.log("new user has connected");

	// saves name of person who connects
	var myUserName;

	//receives username information after it is emitted from client side
	socket.on("prompt for username", function(username) {
		myUserName = username;
		usernames.push(username);

		//sends username to every client after registration
		io.emit("username list", usernames);
		console.log(usernames);
	});	

	//when user disconnects, I delete their name from the array of usernames
	socket.on("disconnect", function () {
		console.log(myUserName)
		var index = usernames.indexOf(myUserName);
		usernames.splice(index, 1);

		//sends username to every client
		io.emit("username list", usernames);
		console.log(usernames);
	});

	socket.on("client new chat message", function (username, formIDinputValue) {
		socket.broadcast.emit("server new chat message", username, formIDinputValue);
	})
});