import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const { signIn } = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [switchToMagicLink, setSwitchToMagicLink] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};

    if (!username) {
      formErrors.username = "Username is required";
    }

    if (!password) {
      formErrors.password = "Password is required";
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        await signIn.create({
          identifier: username,
          password,
        });
        navigate("/signed-in");
      } catch (error) {
        setErrors({
          form: error.errors
            ? error.errors[0].message
            : "Invalid username or password",
        });
      }
    } else {
      setErrors(formErrors);
    }
  };

  if (switchToMagicLink) {
    return (
      <div>
        <p>Magic link method selected. Implement magic link login here.</p>
        <button onClick={() => setSwitchToMagicLink(false)}>
          Switch back to Username/Password
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username}</span>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {errors.form && <span style={{ color: "red" }}>{errors.form}</span>}
      </form>
      <div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <div>
        <button onClick={() => setSwitchToMagicLink(true)}>
          Switch to Magic Link
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
