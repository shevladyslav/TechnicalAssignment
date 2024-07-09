import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import Books from './pages/Books';
import BookDetail from './pages/BookDetail';

import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Books />,
      },
      {
        path: ":bookId/",
        element: <BookDetail />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
