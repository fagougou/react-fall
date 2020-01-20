import React from 'react';
import {RouteProps} from '../../types';

const Detail = (props: RouteProps) => (
  <img src={props.location.state.url} />
);

export default Detail;
