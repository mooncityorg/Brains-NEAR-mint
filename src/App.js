/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./css/App.scss";

import Header from "./components/Header";
import Main from "./components/Main";

import axios from "axios";
function App() {
  return (
    <>
      <Header />
      <div className="App" style={{ backgroundColor: "#333" }}>
        <Main />
      </div>
    </>
  );
}

export default App;
