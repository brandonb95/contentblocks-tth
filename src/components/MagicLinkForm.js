import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";

const MagicLinkForm = ({ onSwitchMethod }) => {
  const { client } = useClerk();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.signIn.create({
        identifier: email,
        strategy: "email_link",
      });
      setMessage("If this email is registered, a magic link has been sent.");
    } catch (error) {
      setMessage("Error sending magic link.");
    }
  };

  return (
    <div className="magic-link-form">
      <h2>Magic Link Login</h2>
      <form onSubmit={handleMagicLinkSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Send Magic Link</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onSwitchMethod}>Switch to Login Form</button>
    </div>
  );
};

export default MagicLinkForm;
