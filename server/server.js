class ServerControl {
    clientList = [];
    roomList = [];

    constructor(){

    }

    hasClient(clientName){
        if(!this.clientList.some(client => client.clientName === clientName)){
            return false;
        } else {
            return true;
        }
    }

    hasRoom(roomName){
        if(!this.roomList.some(room => room.roomName === roomName)){
            return false;
        } else {
            return true;
        }
    }

    addClient(client){
        let clientName = client.clientName;
        if(!this.hasClient(clientName)){
            this.clientList.push(client);
            return true;
        } 
    }

    removeClient(client){
        let clientName = client.clientName;
        let clientList = this.clientList.filter(client => client.clientName !== clientName)
        if(clientList != this.clientList){
            console.log("Client " + client.clientName + " removed.")
            this.clientList = clientList;
        } else {
            console.log("Client not found.")
        }
    }

    removeRoom(room){
        let roomName = room.roomName;
        this.roomList = this.roomList.filter(room => room.roomName !== roomName)
    }

    addRoom(room){
        let roomName = room.roomName;
        if(!this.hasRoom(roomName)){
            this.roomList.push(room);
        } 
    }

    getRoom(roomName){
        return this.roomList.find(room => room.roomName === roomName);
    }

    getClient(){

    }

    listRooms(){
        
    }

    listClients(){
    
    }
}

module.exports = {
    ServerControl
}