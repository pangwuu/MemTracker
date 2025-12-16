import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import '@fontsource/roboto';

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <App />
  );
}