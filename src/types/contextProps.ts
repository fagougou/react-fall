import ScrollerState from './scrollerState';

interface ContextProps {
  state: ScrollerState,
  update(state: ScrollerState): void
}

export default ContextProps;
