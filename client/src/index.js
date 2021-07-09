/*
 * @Author: Azhou
 * @Date: 2021-05-10 21:41:22
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-11 23:20:18
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';
import store from './redux/store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
