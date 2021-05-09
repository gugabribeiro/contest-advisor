import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from "./Login";
import Contest from "./Contest";

const App = () => {
  return (
    <Router>
      <div className="w-100 vh-100 pa3">
        <Navbar bg="white" sticky="top">
          <h1>Contest Advisor</h1>
        </Navbar>
        <Route exact path="/" component={Login} />
        <Route exact path="/contests/:id" component={Contest} />
      </div>
    </Router>
  );
};

export default App;
