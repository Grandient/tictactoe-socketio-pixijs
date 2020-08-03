class Game {
    O = null;
    X = null;
    state = null;

    constructor(){
        this.state = {board: matrix(3), turn: "X", win: false, winType: null, winner: ""};
    }

    setX(client){
        if(client != this.O){
            this.X = client;
        } else {
            client.socket.emit("errorMessage", "X has already been selected!")
        }
    }

    setO(client){
        if(client != this.X){
            this.O = client;
        } else {
            client.socket.emit("errorMessage", "O has already been selected!")
        }
    }

    start() {
        this.state = {board: matrix(3), turn: "X", finished: "None", win: false};
    }

    ready(){
        if(this.X != null && this.O != null){
            return true;
        } else {
            return false;
        }
    }

    place(client, x, y, room){
        let board = this.state.board;
        if(!this.state.win){
            if(client.clientName === this.O.clientName && this.state.turn === "O"){
                if(board[x][y] != "O" && board[x][y] != "X"){
                    board[x][y] = "O";
                    this.state.board = board;
                    this.state.turn = "X";
                    this.checkWin();
                    client.socket.emit("state", this.state)
                    client.socket.broadcast.to(room.roomName).emit("state", this.state)
                } else {
                    client.socket.emit("errorMessage", "Cannot place a spot with a marker.")
                }
            } else if (client.clientName === this.X.clientName && this.state.turn === "X"){
                if(board[x][y] != "O" && board[x][y] != "X"){
                    board[x][y] = "X";
                    this.state.board = board;
                    this.state.turn = "O";
                    this.checkWin();
                    client.socket.emit("state", this.state)
                    client.socket.broadcast.to(room.roomName).emit("state", this.state)
                    
                } else {
                    client.socket.emit("errorMessage", "Cannot place a spot with a marker.")
                }
            } else {
                //client.socket.emit("errorMessage", "It is not your turn!")
            }
        } else {
            client.socket.emit("errorMessage", "The game has finished.")
        }
    }

    checkWin(){
        let horizontal = this.checkHorizontal();
        let vertical = this.checkVertical();
        let diagonal = this.checkDiagonal();
        var combined = horizontal.concat(vertical, diagonal);
        if(combined.includes("X")){
            this.state.win = true;
            this.state.winType = combined.indexOf("X")
            this.state.winner = "X"
            return true;
        } 

        if(combined.includes("O")) {
            this.state.win = true;
            this.state.winType = combined.indexOf("O")
            this.state.winner = "O";
            return true;
        } 

        let index = 0;
        for (var i = 0; i<3; i++){
            for (var j = 0; j<3; j++){
                if(this.state.board[i][j] != ""){
                    index++;
                }
            }
        }

        if(index == 9){
            this.state.win = true;
            this.state.winType = -1;
            this.state.winner = "None";
            return true;
        }
        return false;
    }

    checkHorizontal(){
        let board = this.state.board;
        let results = [];
        for (var i = 0; i < 3; i++){
            let line = [board[i][0], board[i][1], board[i][2]];
            let set = new Set(line)
            if(set.size == 1){
                if(set.has("X")){
                    results.push("X");
                } else if(set.has("O")) {
                    results.push("O");
                } else {
                    results.push(null);
                }
            } else {
                results.push(null);
            }
        }
        return results;
    }

    checkVertical(){
        let results = [];
        let board = this.state.board;
        for (var i = 0; i < 3; i++){
            let line = [board[0][i], board[1][i],board[2][i]];
            let set = new Set(line)
            if(set.size == 1){
                if(set.has("X")){
                    results.push("X");
                } else if(set.has("O")) {
                    results.push("O");
                } else {
                    results.push(null);
                }
            } else {
                results.push(null);
            }
        }
        return results;
    }

    checkDiagonal(){
        let board = this.state.board;
        let results = [];
        let line = [board[0][0], board[1][1], board[2][2]];
        let set = new Set(line)
        if(set.size == 1){
            if(set.has("X")){
                 results.push("X");
            } else if(set.has("O")) {
                results.push("O");
            } else {
                 results.push(null);
            } 
        } else {
            results.push(null);
        }
        let line2 = [board[0][2], board[1][1], board[2][0]];
        set = new Set(line2)
        if(set.size == 1){
            if(set.has("X")){
                results.push("X");
            } else if(set.has("O")) {
                results.push("O");
            } else {
                results.push(null);
            }
        } else {
            results.push(null);
        }
        return results;
    }
}

function matrix(n) {
    let mat = new Array(n);

    for (var i = 0; i < n; i++) {
        mat[i] = new Array(n);
    }

    for (var i = 0; i < n; i++){
        for (var j = 0; j < n; j++){
            mat[i][j] = "";
        }
    }
    return mat
}

  
module.exports = {
    Game
}