import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { atom } from "jotai";

const RegistrationForm = () => {
  const { client } = useClerk();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!username) {
      formErrors.username = "Username is required";
    }

    if (!password) {
      formErrors.password = "Password is required";
    }

    if (!email) {
      formErrors.email = "Email is required";
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        // Step 1: Initiate sign-up process
        const signUp = await client.signUp.create({ emailAddress: email });

        // Step 2: Prepare verification

        // Step 3: Attempt to complete verification
        await signUp.attemptCompletion({ username, password });

        // If verification is successful, set active session
        await client.setSession(signUp.createdSessionId);

        window.location.reload(); // Reload the page after successful registration
      } catch (error) {
        setErrors({
          form: error.errors
            ? error.errors[0].message
            : "Error during registration",
        });
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4 text-center">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Username field */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
              errors.username ? "border-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
