import ItemProps from './itemProps';

interface ScrollerState {
  items: ItemProps[]
  index: number
  scrollTop: number
  page: number
  isControl: boolean
  isComplete: boolean
  loading: boolean
}

export default ScrollerState;
