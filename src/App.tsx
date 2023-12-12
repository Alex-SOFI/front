import React from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import './App.css';
import logo from './logo.svg';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={
        <div className='App'>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className='App-link'
              href='https://reactjs.org'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn React
            </a>
          </header>
        </div>
      }
    />,
  ),
);

const App = () => <RouterProvider router={router} />;

export default App;
