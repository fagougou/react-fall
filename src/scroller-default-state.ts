import ScrollerState from './types/scrollerState';

const scrollerDefaultState: ScrollerState = {
  items: [],
  index: 0,
  page: 1,
  scrollTop: 0,
  isControl: false,
  isComplete: false,
  loading: false,
  upperHolderHeight: 0,
  underHolderHeight: 0,
};

export default scrollerDefaultState;
