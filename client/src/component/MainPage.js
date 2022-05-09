import React from "react";
import ReactDOM from "react-dom/client";
import apiAddress from "../globals/apiAddress";
import axios from "axios";

const MainPage = () => {
  const sendTestRequest = () => {
    axios
      .get(`${apiAddress}/`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return <button onClick={sendTestRequest}>Test Server Connection</button>;
};

export default MainPage;
