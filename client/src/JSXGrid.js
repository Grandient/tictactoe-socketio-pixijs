const jsxGrid = (
  <div className="grid">
    <div className="row">
      <div onClick={() => this.selectPosition(0,0)} className="col">{this.state.state.board[0][0]}</div>
      <div onClick={() => this.selectPosition(0,1)} className="col">{this.state.state.board[0][1]}</div>
      <div onClick={() => this.selectPosition(0,2)} className="col">{this.state.state.board[0][2]}</div>
    </div>
    <div className="row">
      <div onClick={() => this.selectPosition(1,0)} className="col">{this.state.state.board[1][0]}</div>
      <div onClick={() => this.selectPosition(1,1)} className="col">{this.state.state.board[1][1]}</div>
      <div onClick={() => this.selectPosition(1,2)} className="col">{this.state.state.board[1][2]}</div>
    </div>
    <div className="row">
      <div onClick={() => this.selectPosition(2,0)} className="col">{this.state.state.board[2][0]}</div>
      <div onClick={() => this.selectPosition(2,1)} className="col">{this.state.state.board[2][1]}</div>
      <div onClick={() => this.selectPosition(2,2)} className="col">{this.state.state.board[2][2]}</div>
    </div>
  </div>
)