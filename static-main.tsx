import React from 'react';
import {createRoot} from 'react-dom/client';
import Budget from './app/budget';
import './app/globals.css';
import './app/budget.css';
import './app/months.css';
createRoot(document.getElementById('root')!).render(<Budget/>);
