import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";

const RegistrationForm = ({ setShowRegistration }) => {
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
    <div className="max-w-md mx-auto mt-8 px-4 py-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Email field */}
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
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
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>

      {/* Back to login button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowRegistration(false)}
          className="text-sm text-blue-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
