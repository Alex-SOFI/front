import React from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import routes from './constants/routes';
import { lazyWithRetry } from './tools';

const ExpertPage = lazyWithRetry(() => import('./pages/ExpertPage'));

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key={routes.EXPERT} path={routes.EXPERT} element={<ExpertPage />} />,
    <Route
      key='*'
      path='*'
      element={<Navigate to={routes.EXPERT} replace />}
    />,
  ]),
);

const App = () => <RouterProvider router={router} />;

export default App;
