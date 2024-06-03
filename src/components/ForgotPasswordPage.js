import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  const create = async (e) => {
    e.preventDefault();
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      console.error("Create error:", err);
      setError(err.errors ? err.errors[0].longMessage : err.toString());
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        setError("");
        navigate("/signed-in");
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.errors ? err.errors[0].longMessage : err.toString());
    }
  };

  return (
    <div style={{ margin: "auto", maxWidth: "500px" }}>
      <h1>Forgot Password?</h1>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        onSubmit={!successfulCreation ? create : reset}
      >
        {!successfulCreation && (
          <>
            <label htmlFor="email">Please provide your email address</label>
            <input
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button>Send password reset code</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
        {successfulCreation && (
          <>
            <label htmlFor="password">Enter your new password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="code">
              Enter the password reset code that was sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button>Reset</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
        {secondFactor && (
          <p>2FA is required, but this UI does not handle that</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
