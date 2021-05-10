import React, { useState } from "react";
import { useHistory } from "react-router";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Navbar from "react-bootstrap/Navbar";

import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { currentUser, login, logout } = useAuth();

  const handleLoginOrLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentUser) {
        await logout();
        history.push("/");
      } else {
        await login();
        history.push("/contests");
      }
    } catch (err) {}
    setLoading(false);
  };

  return (
    <Navbar bg="light" expand="lg" fixed="sticky">
      <div className="w-100 flex flex-row items-center justify-between pa3">
        <div className="f2">Contest Advisor</div>
        {!currentUser ? (
          <Button disabled={loading} onClick={handleLoginOrLogout}>
            Login
          </Button>
        ) : (
          <Dropdown variant="secondary">
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {currentUser.email}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLoginOrLogout}>
                <div className="red">Logout</div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
