import { PixiComponent } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const Button = PixiComponent('Button', {
    create: () => new PIXI.Graphics(),
    applyProps: (g, _, props) => {
      const { fill, x, y, width, height, mouseDown, mouseOver, mouseOut } = props
      g.interactive = true;
      g.buttonMode = true;
      g.on('mousedown', mouseDown)
       .on("mouseover", mouseOver)
       .on("mouseout", mouseOut)
      g.clear()
      g.beginFill(fill)
      g.drawRect(x, y, width, height)
      g.endFill()
    }
  })

export default Button;