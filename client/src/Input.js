import { PixiComponent } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const Input = PixiComponent('Input', {
    create: () => new PIXI.Text(),
    applyProps: (input,_ ,props ) => {
      const { standard, focused, disabled, onKeyDown } = props;
        input.interactive = true;
        

    }
  })

export default Input;