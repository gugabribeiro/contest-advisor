import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const history = useHistory();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      history.push("/contests");
    }
  }, [currentUser, history]);

  return <div className="w-100 pt3 ph4">Welcome to contest advisor</div>;
};

export default Home;
