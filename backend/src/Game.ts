import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";
export class Game {
    public player1: WebSocket
    public player2: WebSocket;
    public board: Chess;
    public moves: string[];
    public startTime: Date
    public moveCount: number

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.moves = []
        this.startTime = new Date()
        this.moveCount = 0

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            playload: {
                color: "white"
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            playload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }) {

        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            console.log("player2 is not allowed to maeke move rigth now ");
            return
        }

        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("player1 is not allowed to maeke move rigth now ");
            return
        }

        try {
            this.board.move(move)
        } catch (error) {
            console.log(error);
        }

        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                playload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
        }

        if (this.board.moves().length % 2 == 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                playload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                playload: move
            }))
        }


        this.moveCount++
    }
}