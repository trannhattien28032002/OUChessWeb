import React from "react";
import ReactDOM from "react-dom/client";
import App from "src/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastContainer } from "react-toastify";
import { ROOT_URL } from "src/config/ApiConstants";
import { io } from "socket.io-client";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export const socket = io(ROOT_URL, {
    autoConnect: false,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <App />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Provider>
    // {/* </React.StrictMode>, */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
