import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";

const ForgotPasswordPage = () => {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const redirectUrl = "http://localhost:3000/magic-link-callback"; // Replace with your actual redirect URL

  if (!isLoaded) {
    return null;
  }

  const create = async (e) => {
    e.preventDefault();
    try {
      await signIn.create({
        strategy: "email_link",
        identifier: email,
        redirect_url: redirectUrl,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      console.error("Create error:", err);
      setError(err.errors ? err.errors[0].longMessage : err.toString());
    }
  };

  return (
    <div style={{ margin: "auto", maxWidth: "500px" }}>
      <h1>Forgot Password?</h1>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        onSubmit={create}
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
            <button>Send magic link</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
        {successfulCreation && (
          <p>A magic sign-in link has been sent to your email.</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
