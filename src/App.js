import React, { useReducer, useEffect } from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import Machines from './containers/Machines/Machines';
import Machine from './containers/Machine/Machine';
import { Context, reducer, initialState } from './store/store';

import './App.css';

const HeaderBar = () => (
  <div className='toolbar' role="banner">
    <img
      width="40"
      alt="Zeiss Logo"
      src="https://zhengxin-pub.cdn.bcebos.com/logopic/a4a785b745b89286fea0d12cf1a645b1_fullsize.jpg?x-bce-process=image/resize,m_lfit,w_200"
    />
    <span>Welcome</span>
  </div>
)
function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

  const listenWSMessage = () => {
    const wsClient = new WebSocket('ws://codingcase.zeiss.services/ws');
    wsClient.onmessage = e => {
      const messageData = JSON.parse(e.data);
      console.log('message=', messageData.payload);
      const data = messageData.payload;
      dispatch({ type: "UPDATE_EVENT", data })
    };
    wsClient.onclose = e => {
      console.log('wsclient onclose code:' + e.code + ',reason=' + e.reason);
      listenWSMessage();
    }
  }

  useEffect(() => {
    console.log('First Time')
    listenWSMessage()
  }, [])

  return (
    <Context.Provider value={{ store, dispatch }}>
      <div className='Main'>
        <HeaderBar />

        <div className='Container'>
          <div>
            <nav>
              <Link to="/machines">machines</Link>
            </nav>
          </div>

          <Routes>
            <Route path="/" element={<Machines />} />
            <Route path="/machines/:id" element={<Machine />} />
            <Route path="/machines" element={<Machines />} />
          </Routes>
        </div>
      </div>
    </Context.Provider>
  )
}

export default App;
