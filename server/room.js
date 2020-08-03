const {Game} = require('./game');

class Room {
    clientList = [];
    roomName = "";
    roomId = null;
    game = null;

    constructor(roomName){
        this.roomName = roomName;
        this.game = new Game();
    }

    addUser(client){
        let clientName = client.clientName;
        if(!this.clientList.some(client => client.clientName === clientName)){
            this.clientList.push(client);
            client.setRoom(this.roomName);
            return true;
        } else {
            return false;
        }
    }

    addGame(game){
        this.game = game;
    }

    hasGame(){
        if(this.game != null){
            return true;
        } else {
            return false;
        }
    }

}

module.exports = {
    Room
}

