import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./component/MainPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>Hello, here are some birthdays!</div>
    <MainPage />
  </React.StrictMode>
);
