import React, {useRef} from 'react';
import ScrollContext from './context';
import ProviderProps from './types/providerProps';
import ScrollerState from './types/scrollerState';
import scrollerDefaultState from './scroller-default-state';

export const Provider = (
    {children,
    }: ProviderProps) => {
  const stateRef = useRef<ScrollerState>(scrollerDefaultState);

  const handleUpdate = (state: ScrollerState) => {
    stateRef.current = state;
  };

  return (
    <ScrollContext.Provider
      value={{
        state: stateRef.current,
        update: handleUpdate,
      }}>
      {React.Children.only(children)}
    </ScrollContext.Provider>
  );
};

export default Provider;

