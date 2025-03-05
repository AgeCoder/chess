import { GameManger } from './GameManger';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8008 });
const gameManger = new GameManger()


wss.on('connection', function connection(ws) {
    gameManger.addUser(ws)
    ws.on('close', () => { gameManger.removeUser(ws) })
});