"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManger = void 0;
var message_1 = require("./message");
var Game_1 = require("./Game");
var GameManger = /** @class */ (function () {
    function GameManger() {
        this.game = [];
        this.pendingUser = null;
        this.users = [];
    }
    GameManger.prototype.addUser = function (socket) {
        this.users.push(socket);
        this.handleMessage(socket);
    };
    GameManger.prototype.removeUser = function (socket) {
        this.users = this.users.filter(function (user) { return user !== socket; });
    };
    GameManger.prototype.handleMessage = function (socket) {
        var _this = this;
        socket.on('message', function (data) {
            var message = JSON.parse(data.toString());
            if (message.type === message_1.INIT_GAME) {
                if (_this.pendingUser) {
                    var game = new Game_1.Game(_this.pendingUser, socket);
                    _this.game.push(game);
                    _this.pendingUser = null;
                }
                else {
                    _this.pendingUser = socket;
                }
            }
            if (message.type == message_1.MOVE) {
                var game = _this.game.find(function (game) { return game.player1 == socket || game.player2 == socket; });
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    };
    return GameManger;
}());
exports.GameManger = GameManger;
