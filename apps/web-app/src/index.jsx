import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {console.log('✅ ReactDOM root render called')}
    <div style={{position:'fixed',top:0,left:0,zIndex:9999,background:'#ff0',color:'#000',padding:'4px',fontWeight:'bold'}}>ReactDOM root render called</div>
    <App />
  </React.StrictMode>
);
