import React from "react";
import Navbar from "react-bootstrap/Navbar";

import Contest from "./Contest";

const App = () => {
  return (
    <div className="w-100 vh-100 pa3">
      <Navbar bg="white" sticky="top">
        <h1>Contest Advisor</h1>
      </Navbar>
      <Contest />
    </div>
  );
};

export default App;
