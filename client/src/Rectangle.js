import { PixiComponent } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const Rectangle = PixiComponent('Rectangle', {
    create: () => new PIXI.Graphics(),
    applyProps: (g, _, props) => {
      const { fill, x, y, width, height, pivot, rotation, anchor } = props
      
      g.clear()
      g.beginFill(fill)
      g.drawRect(x, y, width, height)
      g.endFill()

      if(anchor != null){
        g.anchor = anchor;
      }

      if(pivot != null){
        g.pivot.x = pivot.x;
        g.pivot.y = pivot.y;
      }

      if(rotation != null) {
        g.rotation = rotation;
      }
    }
  })

export default Rectangle;