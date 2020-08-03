import React from 'react';
import './App.css';
import './main.css';
import io from 'socket.io-client'
import { Stage, Text, Container, withFilters } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import Rectangle from './Rectangle'
import Button from './Button';
import Grid from './Grid';
import {AdvancedBloomFilter} from '@pixi/filter-advanced-bloom';

const palette = [0x352F44,0x2A2438, 0x411E8F, 0x310A5D]
const bgColor = palette[0];
const bgColor2 = palette[1];
const textColor = palette[2];
const textStroke = palette[3];

const Filters = withFilters(Container, {
  advancedBloom: AdvancedBloomFilter
})

const stageOptions = {
  width: 800,
  height: 700,
  options: {
    backgroundColor: bgColor
  }
}

const headerOptions = {
  width: 800,
  height: 125,
  options: {
    backgroundColor: bgColor
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      clientId: null,
      room: "",
      roomName: null,
      lastUpdate: null,
      socket: null,
      userList: null,
      roomList: null,
      error: "No Errors",
      status: false,
      state: null,
      jsxState: null,
      pixiState: null,
      type: null,
      X: "",
      O: "",
      opponent: null,
      winState: null
    }
  }

  connect = () => {
    if(this.state.username.length < 3) {
      this.setError("Your name must have 3 characters or more.");
      return;
    }

    if(this.state.room.length < 3){
      this.setError("Your room name must have 3 characters or more.");
      return;
    }

    if(this.state.status == false){
      let socket = io("http://localhost:3000");
      this.setState({socket: socket})
      socket.on('connect', () => {
        this.setState({status: this.state.socket.connected})
        // Room join
        socket.emit("join", {username: this.state.username, roomName: this.state.room})

        // Client initialization
        socket.on("init", data => {
          this.setState({clientId: data.clientId, roomName: data.roomName, lastUpdate: data.lastUpdate});
        })

        // Messages
        socket.on('message', message => {
          console.log(message)
        });

        socket.on('errorMessage', message => {
          this.setState({error: message})
        })

        // Listings
        socket.on("userList", list => {
          this.setUlist(list);
          console.log("Received user list.")
        })

        socket.on("roomList", list => {
          this.setRlist(list);
          console.log("Received room list.")
        })

        // Game Move
        socket.on("state", state => {
          this.setState({state: state})
          this.displayGrid();
          if(this.state.state.win){
            if(this.state.state.winner != "None"){
              this.drawWin();
            }
          }
        })

        socket.on("type", type => {
          if(type == "X"){
            this.setState({X: this.state.username})
          } else {
            this.setState({O: this.state.username})
          }
          this.setState({type: type})
        })

        socket.on("X", X => {
          this.setState({opponent: {name: X, type: "X"}})
          this.setState({X:X})
        })

        socket.on("O", O => {
          this.setState({opponent: {name: O, type: "O"}})
          this.setState({O:O})
        })

        socket.on("disconnect", () => {
          console.log("Disconnected from server. (Client)")
          this.setState({status: this.state.socket.connected})
        })
      })
    } else {
      this.setError("Already connected to server.")
    }
  }

  disconnect = () => {
    this.state.socket.disconnect();
  }

  setUsername = (event) => {
    let username = event.nativeEvent.target.value;
    this.setState({username: username})
  }

  setRoom = (event) => {
    let room = event.nativeEvent.target.value;
    this.setState({room: room});
  }

  setError = (error) => {;
    this.setState({error: error});
  }

  setUlist = (uList) => {
    this.setState({userList: uList});
  }

  setRlist = (rList) => {
    this.setState({roomList: rList});
  }

  getUserList = () => {
    this.state.socket.emit("userList")
  }

  getRoomList = () => {
    this.state.socket.emit("roomList")
  }

  selectMouseDown = (x, y) => {
    this.selectPosition(x,y)
  }

  drawWin = () => {
    let index = this.state.state.winType;
    let rect = null;
    let y;
    let x;
    let fill = 0x8f671e;
    let lineWH = 25;
    switch (index) {
      case 0:
        y = stageOptions.height/6 * 1;
        x = lineWH;
        rect = <Rectangle x={x} y={y - x/2} width={stageOptions.width - 2*x} height={lineWH} fill={fill}/>;
        break;
      case 1:
        y = stageOptions.height/6 * 3;
        x = lineWH;
        rect = <Rectangle x={x} y={y - x/2} width={stageOptions.width - 2*x} height={lineWH} fill={fill}/>;
        break;
      case 2:
        y = stageOptions.height/6 * 5;
        x = lineWH;
        rect = <Rectangle x={x} y={y - x/2} width={stageOptions.width - 2*x} height={lineWH} fill={fill} />;
        break;
      case 3: 
        x = stageOptions.width/6 * 1;
        y = lineWH;
        rect = <Rectangle x={x - y/2} y={y} width={lineWH} height={stageOptions.height - 2*y} fill={fill} />;
        break;
      case 4: 
        x = stageOptions.width/6 * 3;
        y = lineWH;
        rect = <Rectangle x={x - y/2} y={y} width={lineWH} height={stageOptions.height - 2*y} fill={fill} />;
        break;
      case 5: 
        x = stageOptions.width/6 * 5;
        y = lineWH;
        rect = <Rectangle x={x - y/2} y={y} width={lineWH} height={stageOptions.height - 2*y} fill={fill}/>;
        break;
      case 6: 
        y = stageOptions.height/6 * 1;
        x = lineWH;
        rect = <Rectangle x={x*2} y={y - x/2} width={stageOptions.width} height={lineWH} fill={fill} pivot={{x: -50, y: 100}} rotation={0.7}/>
        break;
      case 7: 
        x = stageOptions.width/6 * 5;
        y = lineWH;
        rect = <Rectangle x={x} y={y - lineWH} width={lineWH} height={stageOptions.height} fill={fill} pivot={{x: 175, y: 400}} rotation={0.8} />
        break;
    }
    this.setState({winState: rect})
  }

  selectMouseOver = (event) => {
    if(this.state.state.turn == this.state.type && !this.state.state.win){
      let graphic = event.currentTarget;
      let parent = graphic.parent;
      let text = parent.children[1];
      if(text.text == ""){
        let textStyle = new PIXI.TextStyle({ 
          fontFamily: 'Roboto, sans-serif',
          fontSize: 160,
          fontWeight: 'bold',
          fill: textColor, // gradient
          stroke: textStroke,
          strokeThickness: 2
        })
        text.alpha = 0.4;
        text.style = textStyle;
        text.text = this.state.type;
      }
    }
  }

  selectMouseOut = (event) => {
    let graphic = event.currentTarget;
    let parent = graphic.parent;
    let text = parent.children[1];
    if(text.alpha == 0.4){
      let graphic = event.currentTarget;
      let parent = graphic.parent;
      let text = parent.children[1];
      text.text = "";
    }
  }


  displayGrid = () => {
    let textStyle = new PIXI.TextStyle({
      fontFamily: 'Roboto, sans-serif',
      fontSize: 160,
      fontWeight: 'bold',
      fill: textColor, // gradient
      stroke: textStroke,
      strokeThickness: 2
    })

    let p = [];
    for(let i=1; i<10; i++){
      let x = 0;
      let y = 0;
      if(i<4){
        y = stageOptions.height/6 * 1;
      } else if(i < 7){
        y = stageOptions.height/6 * 3;
      } else {
        y = stageOptions.height/6 * 5;
      }
      if((i % 3) == 0){
        x = stageOptions.width/6 * 5;
      } else if((i % 3) == 1){
        x = stageOptions.width/6 * 1;
      } else {
        x = stageOptions.width/6 * 3;        
      }
      p.push({x: x, y:y})
    }

    let square = {x: 0, y: 0, h:stageOptions.height/3 - 25, w:stageOptions.width/3 - 25}
    square.x = - square.w / 2;
    square.y = - square.h / 2;
    

    let pixiGrid = (
      <Container>
        <Container position={[p[0].x,p[0].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(0,0)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[0][0]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[1].x,p[1].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(0,1)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[0][1]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[2].x,p[2].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(0,2)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[0][2]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[3].x,p[3].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(1,0)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[1][0]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[4].x,p[4].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(1,1)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[1][1]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[5].x,p[5].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(1,2)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[1][2]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[6].x,p[6].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(2,0)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[2][0]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[7].x,p[7].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(2,1)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[2][1]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
        <Container position={[p[8].x,p[8].y]}>
          <Button x={square.x} y={square.y} width={square.w} height={square.h} fill={bgColor} anchor={0.5}
            mouseDown={() => this.selectMouseDown(2,2)} mouseOut={this.selectMouseOut} mouseOver={this.selectMouseOver}
          />
          <Text x={0} y={0} text={this.state.state.board[2][2]} style={textStyle} anchor={0.5} alpha={1}/>
        </Container>
      </Container>
    )
    this.setState({pixiState: pixiGrid})
    }

  selectPosition = (x, y) => {
    if(this.state.type != null){
      if(!this.state.state.win){
        if(this.state.state.turn == this.state.type){
          if(this.state.state.board[x][y] == ""){
            this.state.socket.emit("move", {x, y});
          } else {
            console.log("Cannot move where a marker is!")
          }
        } else {
          console.log("Not your turn.")
        }
      } else {
        console.log("Game Ended.")
      }
    }
  }

  selectType = (type) => {
    this.state.socket.emit("type", type)
  }

  reset = () => {
    this.state.socket.emit("reset")
  }

  render(){
    let body = null;
    let input = null;
    let select = null;
    if(this.state.type == null){
      select = (
        <div>
          <button onClick={() => this.selectType("X")}>Select X</button>
          <button onClick={() => this.selectType("O")}>Select O</button>
        </div>
      )
    } 

    let base = (
        <div>
          <button onClick={() => this.connect()}>Connect</button>
          <br></br>
          <h2 id="error">{this.state.error}</h2>
        </div>
      )

    if(this.state.socket == null){
      input = (
        <div>
          <label>Username:</label>
          <input type="text" onChange={(e) => this.setUsername(e)}></input>
          <br></br>
          <label>Room:</label>
          <input type="text" onChange={(e) => this.setRoom(e)}></input>
          <br></br>
        </div>
      )
      body = (
        <div>
          {input}
          {base}
        </div>
        );
    } else {
      body = (
        <div>
          {base}
          {select}
          <button onClick={() => this.reset()}>Reset</button>
        </div>
      )
    }

    let headerStyle = new PIXI.TextStyle({
      fontFamily: 'Roboto, sans-serif',
      fontSize: 30,
      fontWeight: 'bold',
      fill: 0xFFFFFF
    })

    let pixiBody = (
      <Stage width={stageOptions.width} height={stageOptions.height + headerOptions.height} options={stageOptions.options}>
        <Filters advancedBloom={{threshold:1, quality:20}}>
          <Container position={[0,0]}>
            <Rectangle x={0} y={0} height={headerOptions.height} width={headerOptions.width} fill={bgColor2} />
            <Text x={0} y={0} text={"YOU: " + this.state.username + " (" + (this.state.type == null ? "" : this.state.type) + ")"} style={headerStyle} />
            <Text x={headerOptions.width/2} y={0} text={"VS"} anchor={0.5,0} style={headerStyle}/>
            <Text x={headerOptions.width - 300} y={0} text={"OPPONENT: " + (this.state.opponent == null ? "" : this.state.opponent.name) + " (" + (this.state.opponent == null ? "" : this.state.opponent.type) + ")" } style={headerStyle} anchor={0.5, 0}/>
            <Text x={0} y={headerOptions.height/3} text={"ROOM: " + this.state.room} style={headerStyle}/>
            <Text x={0} y={headerOptions.height/3 * 2} text={"Connection: " + this.state.status.toString()} style={headerStyle}/>
          </Container>
          </Filters>
          <Container position={[0, headerOptions.height]}>
            <Grid width={stageOptions.width} height={stageOptions.height}/>
            <Filters advancedBloom={{threshold:0.3}}> 
              {this.state.pixiState}
            </Filters>
            <Filters advancedBloom={{threshold:0.1}}>
              {this.state.winState}
            </Filters>
          </Container>
      </Stage>
    )

    return (
      <div className="App">
        <div style={{display: "flex", alignContent: "center", alignItems: "center"}}>
          {body}
          {pixiBody}
        </div>
      </div>
    );
  }
}


export default App;
