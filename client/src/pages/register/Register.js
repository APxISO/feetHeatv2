import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../register/register.css"

const Register = ({ fetchUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Confirm password does not match original password");
      return;
    }

    try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        setError(error);
        return;
      }

      const { token } = await response.json();

      if (!token) {
        console.error("Invalid response format:", { token });
        setError("An unexpected error occurred");
        return;
      }

      setToken(token);

      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      await fetchUser();
      alert("Registration successful!");
      navigate("/Products");

      setUsername("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="registerCont">
      <div className="registerCard">
        <h2>CREATE AN ACCOUNT</h2>
        <form onSubmit={handleRegister}>
          <input
            required
            minLength="5"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            required
            type="password"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <input
            required
            type="password"
            minLength="8"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="confirm password"
          />
          <div className="registerAgreement">
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </div>

          <button>REGISTER</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
