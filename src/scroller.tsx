import React, {useState, useEffect, useRef, useContext, useMemo,
  forwardRef,
  useReducer} from 'react';
import ScrollerProps from './types/scrollerProps';
import ScrollContext from './context';
import packItems from './utils/packItems';
import ScrollerState from './types/scrollerState';

const scrollerAction = {
  UPDATE_SOURCE: 'UPDATE_SOURCE',
  LOADING: 'LOADING',
  LOAD_MORE: 'LOAD_MORE',
  SCROLL: 'SCROLL',
  UPDATE_UPPER: 'UPDATE_UPPER',
  UPDATE_UNDER: 'UPDATE_UNDER',
};

type StateReducerType = (ScrollerState,
  action: {type: string, payload?: any}) => ScrollerState

const stateReducer: StateReducerType = (state, action) => {
  switch (action.type) {
    case scrollerAction.SCROLL:
      const {index, scrollTop} = action.payload;
      return {...state, index, scrollTop};
    case scrollerAction.UPDATE_SOURCE:
      const {isControl, items, isComplete} = action.payload;
      const list = packItems(items, state.items.length);
      const currentItems = state.page === 1 ? list : [...state.items, ...list];
      return {...state, loading: false,
        isControl, items: currentItems, isComplete};
    case scrollerAction.UPDATE_UPPER:
      return {...state, upperHolderHeight: action.payload};
    case scrollerAction.UPDATE_UNDER:
      return {...state, underHolderHeight: action.payload};
    case scrollerAction.LOADING:
      return {...state, loading: true};
    case scrollerAction.LOAD_MORE:
      return {...state, page: state.page + 1};
    default:
      return state;
  }
};

export const Scroller = ({
  averageHeight = 350,
  element: Element,
  length: customLength = 12,
  style = {},
  onFetch,
  upperRender,
  source,
  ...divProps
}: ScrollerProps, outRef) => {
  const [mounted, setMounted] = useState(false);
  const [length, setLength] = useState(0);
  const [topCount, setTopCount] = useState(0);
  const lastScrollTop = useRef(0);
  const contanierRef = useRef<HTMLDivElement | null>();
  const upperRenderRef = useRef<HTMLDivElement | null>(null);
  const lastItemsLength = useRef(0);
  const {state: stateStore, update: updateStore} = useContext(ScrollContext);
  const [state, dispatchState] = useReducer<StateReducerType>(
      stateReducer, stateStore);
  const {
    items,
    index,
    scrollTop,
    page,
    isControl,
    isComplete,
    loading,
    upperHolderHeight,
    underHolderHeight,
  } = state;
  const canFetchRef = useRef(!items.length);

  const activeItems = useMemo(
      () => items.slice(index, index + length),
      [items, index, length],
  );

  useEffect(() => {
    const height = index * averageHeight;
    dispatchState({
      type: scrollerAction.UPDATE_UPPER,
      payload: height > 0 ? height : 0,
    });
  }, [averageHeight, index]);

  useEffect(() => {
    const v = averageHeight * (items.length - length) - upperHolderHeight;
    const height = v > 0 ? v : 0;
    dispatchState({
      type: scrollerAction.UPDATE_UNDER,
      payload: height,
    });
  }, [averageHeight, items.length, length, upperHolderHeight]);

  // const upperHolderHeight = useMemo(() => averageHeight * index, [
  //   index,
  //   averageHeight,
  // ]);

  // const underHolderHight = useMemo(() => {
  //   const v = averageHeight * (items.length - index - length);
  //   return v >= 0 ? v : 0;
  // }, [averageHeight, items.length, index, length]);

  // update store
  useEffect(() => {
    updateStore(state);
  }, [state, updateStore]);

  // source data change
  useEffect(() => {
    if (!source) return;
    const noNewItem = lastItemsLength.current === source.length;
    dispatchState({
      type: scrollerAction.UPDATE_SOURCE,
      payload: {
        items: source,
        isComplete: noNewItem, isControl: true},
    });
    if (!noNewItem) {
      lastItemsLength.current = source.length;
    }
  }, [source]);

  // restore scroll position
  useEffect(() => {
    if (mounted) return;
    if (contanierRef.current) {
      contanierRef.current.scrollTop = scrollTop;
    }
    setMounted(true);
  }, [scrollTop, mounted]);

  // guess item count, visible count eg.
  useEffect(() => {
    if (customLength) {
      setLength(customLength);
      setTopCount(customLength * 0.2);
      return;
    }
    // if (items.length) {
    //   const len = Math.floor(items.length * 0.7);
    //   setLength(len);
    //   setTopCount(Math.floor(len * 0.2));
    // }
  }, [customLength]);

  useEffect(() => {
    if (!canFetchRef.current) return;
    dispatchState({type: scrollerAction.LOADING});

    const push = (data: []) => {
      const hasNewItem = data.length;
      dispatchState({
        type: scrollerAction.UPDATE_SOURCE,
        payload: {
          isComplete: !hasNewItem,
          items: data,
          isControl: false,
        },
      });
    };
    if (onFetch) {
      isControl ? onFetch() : onFetch({page, push});
      canFetchRef.current = false;
    }
  }, [isControl, onFetch, page]);

  useEffect(() => {
    if (!contanierRef.current) return;
    const cd = contanierRef.current;
    const onScroll = () => {
      if (!cd) return;
      const direction = cd.scrollTop - lastScrollTop.current > 0;
      if (
        direction &&
        !loading &&
        !isComplete &&
        cd.scrollTop + averageHeight * 3 > cd.scrollHeight - cd.clientHeight
      ) {
        dispatchState({type: scrollerAction.LOAD_MORE});
        canFetchRef.current = true;
      }

      // const upperRenderHeight = upperRenderRef.current ?
      // upperRenderRef.current.clientHeight : 0;
      const startIndex = Math.round(
          (cd.scrollTop - topCount * averageHeight) /
          averageHeight,
      );
      dispatchState({
        type: scrollerAction.SCROLL,
        payload: {
          index: startIndex >= 0 ? startIndex : 0, scrollTop: cd.scrollTop},
      });
      lastScrollTop.current = cd.scrollTop;
    };

    cd.addEventListener('scroll', onScroll);

    return () => cd.removeEventListener('scroll', onScroll);
  }, [averageHeight, loading, topCount, isComplete]);

  return (
    <div
      {...divProps}
      ref={(n) => {
        contanierRef.current = n;
        outRef && (outRef.current = n);
      }}
      style={{height: '100vh', overflow: 'auto', ...style}}>
      <div ref={upperRenderRef}>
        {upperRender && upperRender()}
      </div>
      <div style={{height: upperHolderHeight}} />
      {activeItems.map((item) => <Element key={item.index} {...item.data} />)}
      <div
        style={{
          height: underHolderHeight,
        }}
      />
    </div>
  );
};

export default forwardRef<any, ScrollerProps>(Scroller);
