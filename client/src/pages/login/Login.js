import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login/login.css";
import Navbar from "../../components/navbar/Navbar.comp";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const userData = await response.json();

      if (userData.error) {
        setError(userData.error.message);
        return;
      }

      
      alert("Welcome back " + `${username}` + "!");
      navigate("/Products");
    } catch (error) {
      console.error(error);
      setError("Error fetching user data. Please try again.");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      if (!data.token) {
        console.error("Invalid response format:", data);
        setError("An unexpected error occurred");
        return;
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);

      await fetchUser();

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    
    <div className="loginCont">
      <div className="loginCard">
        <h2>SIGN IN</h2>
        <form onSubmit={handleLogin}>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button type="submit">LOGIN</button>
          <div id="link">
            <Link to="/Register">REGISTER NEW ACCOUNT</Link>
          </div>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
    
  );
};

export default Login;
