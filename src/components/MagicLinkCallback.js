import React, { useState, useEffect } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const MagicLinkCallback = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [newPassword, setNewPassword] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        signIn
          .attemptFirstFactor({
            strategy: "email_link",
            code: token,
          })
          .then((result) => {
            if (result.status === "complete") {
              setSessionId(result.createdSessionId);
              setActive({ session: result.createdSessionId });
            } else {
              console.error("Sign-in failed:", result);
            }
          })
          .catch((err) => {
            console.error("Error during sign-in:", err);
          });
      }
    }
  }, [isLoaded, signIn, setActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sessionId) {
        await signIn.updatePassword({
          newPassword,
          sessionId,
        });
        navigate("/signed-in");
      } else {
        setError("Session not found. Please try again.");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.errors ? err.errors[0].longMessage : err.toString());
    }
  };

  return (
    <div style={{ margin: "auto", maxWidth: "500px" }}>
      {/* <h1>Set New Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Set Password</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form> */}
    </div>
  );
};

export default MagicLinkCallback;
