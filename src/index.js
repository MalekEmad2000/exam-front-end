import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate  persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
