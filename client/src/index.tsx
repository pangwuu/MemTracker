import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import '@fontsource/roboto';

// used to get leaflet markers to render properly
const root = ReactDOM.createRoot(document.getElementById('root'));

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

