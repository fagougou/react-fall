import React from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/provider';
import {Router} from '@reach/router';
import Home from './pages/home';
import Detail from './pages/detail';
import './index.css';

const App = () => (
  <Provider>
    <Router>
      <Home path="/" />
      <Detail path="/detail/:id" />
    </Router>
  </Provider>
);

const root = document.createElement('div');
document.body.append(root);
ReactDOM.render(<App />, root);
