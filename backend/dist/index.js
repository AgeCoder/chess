"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameManger_1 = require("./GameManger");
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 8008 });
var gameManger = new GameManger_1.GameManger();
wss.on('connection', function connection(ws) {
    gameManger.addUser(ws);
    ws.on('close', function () { gameManger.removeUser(ws); });
});
