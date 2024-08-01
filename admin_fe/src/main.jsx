import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import './axiosConfig'
import axios from 'axios';

const container = document.getElementById('root');
const root = createRoot(container);
axios.defaults.baseURL = 'http://localhost:5000/api'
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
