import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";

const LoginForm = ({ onSwitchMethod }) => {
  const { client } = useClerk();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  //   Check if the field is empty or not
  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    return errors;
  };

  //   Event Handler for submission
  const handleSubmit = async (e) => {
    // Prevent the form from defaulting to original behaviour
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await client.signIn.create({
        identifier: username,
        password: password,
      });
      setMessage("Login successful!");
    } catch (error) {
      setErrors({ form: "Invalid username or password" });
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {errors.form && <div className="error">{errors.form}</div>}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="links">
        <a href="/forgot-password">Forgot Password?</a>
        <button onClick={onSwitchMethod}>Use Magic Link</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
