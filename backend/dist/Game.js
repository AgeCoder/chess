"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var chess_js_1 = require("chess.js");
var message_1 = require("./message");
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            playload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            playload: {
                color: "black"
            }
        }));
    }
    Game.prototype.makeMove = function (socket, move) {
        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            console.log("player2 is not allowed to maeke move rigth now ");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("player1 is not allowed to maeke move rigth now ");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                playload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
        }
        if (this.board.moves().length % 2 == 0) {
            this.player2.send(JSON.stringify({
                type: message_1.MOVE,
                playload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: message_1.MOVE
            }));
        }
        this.moveCount++;
    };
    return Game;
}());
exports.Game = Game;
