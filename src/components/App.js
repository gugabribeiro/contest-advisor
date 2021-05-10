import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import Home from "./Home";
import Header from "./Header";
import Contest from "./Contest";
import NotFound from "./NotFound";
import Contests from "./Contests";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/contests/:id" component={Contest} />
          <PrivateRoute exact path="/contests" component={Contests} />
          <Route path="*" component={NotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
