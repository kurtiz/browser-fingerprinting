import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {
    FpjsProvider
} from '@fingerprintjs/fingerprintjs-pro-react';
import SignUpPage from "./pages/SignUpPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "signup",
        element: <SignUpPage />
    },
    {
        path: "dashboard",
        element: <DashboardPage />
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <FpjsProvider
                loadOptions={{
                    apiKey: "yNLFqKVPw2pVy5Tzd4eP"
                }}>
                <RouterProvider router={router} />
            </FpjsProvider>
    </React.StrictMode>,
)
