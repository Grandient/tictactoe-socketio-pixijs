class User {
    clientName = null;
    clientId = null;
    roomName = null;
    lastUpdate = null;
    socket = null;

    constructor(clientName, clientId, lastUpdate, socket) {
        this.clientName = clientName;
        this.clientId = clientId;
        this.lastUpdate = lastUpdate;
        this.socket = socket;
    }

    setRoom(roomName){
        this.roomName = roomName;
    }
    
}

module.exports = {
    User
}
