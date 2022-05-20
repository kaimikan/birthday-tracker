import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./component/MainPage";
import "./styles/styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <header className="header">
      <div className="content-container">
        <div className="header__content">
          <h3 className="header__title">Bday Tracker</h3>
        </div>
      </div>
    </header>
    <MainPage />
  </React.StrictMode>
);
