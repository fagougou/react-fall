import React, {useState} from 'react';
import ScrollContext from './context';
import ProviderProps from './types/providerProps';
import ScrollerState from './types/scrollerState';
import scrollerDefaultState from './scroller-default-state';
import isEqual from 'lodash/isEqual';

export const Provider = (
    {children,
    }: ProviderProps) => {
  const [state, setState] = useState(scrollerDefaultState);

  const handleUpdate = (s: ScrollerState) => {
    if (!isEqual(state, s)) {
      setState(s);
    }
  };

  return (
    <ScrollContext.Provider
      value={{
        state,
        update: handleUpdate,
      }}>
      {React.Children.only(children)}
    </ScrollContext.Provider>
  );
};

export default Provider;

