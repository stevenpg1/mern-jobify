import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import App from './App.jsx'
import './index.css'

//FOR DEMONSTRATION PURPOSES START
//import customFetch from './utils/customFetch.js';
//const resp = await customFetch.get('/test');
//console.log(resp);
//FOR DEMONSTRATION PURPOSES END

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer position='top-center' />
  </React.StrictMode>,
)
