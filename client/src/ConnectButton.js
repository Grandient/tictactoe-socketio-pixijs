connectMouseDown = (g) => {
    let graphics = g.currentTarget
    let bound = graphics.getBounds();
    let fill = bgColor2;
    let lineWidth = 2;
    let point = {x: bound.x+lineWidth/2, y: bound.y+lineWidth/2};
    let height = bound.height-lineWidth;
    let width = bound.width-lineWidth;
    graphics.clear();
    graphics.lineStyle(lineWidth, textColor, 1);
    graphics.beginFill(fill)
    graphics.drawRect(0, 0, width, height)
    graphics.endFill()
    g.currentTarget = graphics;
    this.connect();
  }

  connectMouseOver = (g) => {
    let graphics = g.currentTarget
    let bound = graphics.getBounds();
    console.log(bound)
    let fill = bgColor2;
    let lineWidth = 2;
    let point = {x: bound.x, y: bound.y};
    console.log(point)
    let height = bound.height-lineWidth;
    let width = bound.width-lineWidth;
    graphics.clear();
    graphics.lineStyle(lineWidth, textColor, 1);
    graphics.beginFill(fill)
    graphics.drawRect(0, 0, width, height)
    graphics.endFill()
    g.currentTarget = graphics;
  }

  connectMouseOut = (g) => {
    let graphics = g.currentTarget
    let bound = graphics.getBounds();
    console.log(bound)
    let fill = bgColor2;
    let point = {x: bound.x, y: bound.y};
    let height = bound.height;
    let width = bound.width;
    graphics.clear();
    graphics.beginFill(fill)
    graphics.drawRect(0, 0, width, height)
    graphics.endFill()
    g.currentTarget = graphics;
  }