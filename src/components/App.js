import React, { useEffect, useState } from "react";

import firebase from "firebase/app";
import { auth } from "../firebase";

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./Home";
import Contest from "./Contest";
import Contests from "./Contests";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
  };

  const logout = async () => {
    setLoading(true);
    await auth.signOut();
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="w-100 vh-100 pa3">
        <Navbar bg="white" sticky="top">
          <div className="w-100 flex flex-row items-center justify-between">
            <h2>Contest Advisor</h2>
            {loading ? (
              <Spinner animation="border" />
            ) : currentUser ? (
              <Dropdown variant="secondary">
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {currentUser.displayName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => logout()}>
                    <div className="red">Logout</div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="">
                <Button variant="primary" onClick={() => login()}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </Navbar>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          exact
          path="/contests"
          render={() => <Contests currentUser={currentUser} />}
        />
        <Route exact path="/contests/:id" component={Contest} />
      </div>
    </Router>
  );
};

export default App;
