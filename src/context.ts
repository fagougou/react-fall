import {createContext} from 'react';
import ContextProps from './types/contextProps';
import scrollerDefaultState from './scroller-default-state';

const ScrollContext = createContext<ContextProps>({
  state: scrollerDefaultState,
  update() {},
});

export default ScrollContext;
