import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router';
import './App.css';
import App from './App.jsx';
import '@fontsource/roboto';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <App />
);