// polyfills for IE
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'fast-text-encoding/text';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import './index.scss';
import App from './App';

const createHistory = require('history').createBrowserHistory;

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root'),
);
