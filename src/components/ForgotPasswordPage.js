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
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Forgot Password?
      </h1>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        onSubmit={create}
      >
        {!successfulCreation && (
          <>
            <label htmlFor="email" className="text-center">
              Enter your email address to access your account.
            </label>
            <input
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)]"
            />
            <button className="w-full mt-6 py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]">
              Send magic link
            </button>
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
