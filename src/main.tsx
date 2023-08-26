import "bootstrap/dist/css/bootstrap.css"
import "font-awesome/css/font-awesome.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ToastContainer theme="dark"/>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
)
