import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/FeetHeatLogo.png";
import "./navbar.comp.css"
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';

const Navbar = ({ user, setToken, setUser, token }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user && !!token);
  }, [user, token]);

  return (
    <div className="navbar">
      <div className="navcont">
        <Link to="/" className="navcenter">
          {/* <img src={Logo} alt="Feet Heat Logo" /> */}LOGO
        </Link>
        <div className="navright">
          <div className="menuCont">
            <Link to="/" className="menuItem">
              HOME
            </Link>
            <Link to="/Products" className="menuItem">
              ALL SHOES
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/"
                  onClick={() => {
                    setToken("");
                    setUser(null);
                    localStorage.removeItem("token");
                  }}
                  className="menuItem"
                >
                  LOGOUT
                </Link>
                <Link to="/Cart" className="menuItem">
                  <ShoppingCartOutlined/>
                </Link>
              </>
            ) : (
              <>
                <Link to="/Login" className="menuItem">
                  SIGN IN
                </Link>
                <Link to="/Register" className="menuItem">
                  REGISTER
                </Link>
                <Link to="/Cart" className="menuItem">
                  <ShoppingCartOutlined/>
                </Link>
              </>
            )}
            {isLoggedIn && user?.isAdmin === true ? (
              <Link to="/admin" className="menuItem">
                ADMIN
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
