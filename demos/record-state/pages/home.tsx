import React from 'react';
import Scroller from '../../../src/scroller';
import {getImageList} from '../fetch';
import {Link} from '@reach/router';
import {RouteProps} from '../../types';

const handleFetch = ({page, push}) => {
  getImageList({pageSize: 20})
      .then((list) => {
        push(list);
      });
};

const ListItem = ({id, url}) =>
  <div style={{height: 350, marginBottom: 10, backgroundColor: 'red'}}>
    <Link to={`/detail/${id}`} state={{url}}>
      <img src={url} />
    </Link>
  </div>;

const Home = (props: RouteProps) => (
  <Scroller
    averageHeight={350}
    element={ListItem}
    onFetch={handleFetch}/>
);

export default Home;
