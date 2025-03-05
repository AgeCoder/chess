import { WebSocket } from "ws"
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";


export class GameManger {
    public game: Game[];
    public pendingUser: WebSocket | null;
    public users: WebSocket[];

    constructor() {
        this.game = []
        this.pendingUser = null
        this.users = []
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.handleMessage(socket)
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket)
    }


    private handleMessage(socket: WebSocket) {
        socket.on('message', (data) => {

            const message = JSON.parse(data.toString())


            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket)
                    this.game.push(game)
                    this.pendingUser = null
                } else {
                    this.pendingUser = socket
                }
            }

            if (message.type == MOVE) {
                const game = this.game.find(game => game.player1 == socket || game.player2 == socket)
                if (game) {
                    game.makeMove(socket, message.move)
                }
            }
        })
    }


}