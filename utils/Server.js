const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

module.exports = {
	app,server,io,express,dotenv
}