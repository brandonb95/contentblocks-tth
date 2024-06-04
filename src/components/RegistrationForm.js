import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";

const RegistrationForm = () => {
  const { client } = useClerk();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [signUp, setSignUp] = useState(null);

  // Make sure email is real
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Determine password strength
  const validatePasswordStrength = (password) => {
    let strength = "Weak";
    if (password.length > 7) {
      strength = "Medium";
    }
    if (
      password.length > 7 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      strength = "Strong";
    }
    setPasswordStrength(strength);
  };

  // Check to see if the fields are empty
  const validateForm = () => {
    let formErrors = {};

    if (!username) {
      formErrors.username = "Username is required";
    }

    if (!password) {
      formErrors.password = "Password is required";
    } else {
      validatePasswordStrength(password);
    }

    if (!email) {
      formErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      formErrors.email = "Email is not valid";
    }

    return formErrors;
  };

  // Handle the signup fields with proper info
  const handleSignUp = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        const signUpResponse = await client.signUp.create({
          emailAddress: email,
          password: password,
          username: username,
        });

        console.log("Sign-up created:", signUpResponse);

        if (signUpResponse.status === "missing_requirements") {
          await signUpResponse.prepareVerification({ strategy: "email_code" });
          setSignUp(signUpResponse);
          setShowVerification(true);
          setErrors({
            form: "Please check your email for the verification code.",
          });
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          setErrors({ form: message });
        } else {
          console.error(error);
          setErrors({
            form: "An unexpected error occurred during registration.",
          });
        }
      }
    } else {
      setErrors(formErrors);
    }
  };

  // Verify registration
  const handleVerification = async (e) => {
    e.preventDefault();
    if (!signUp) {
      setErrors({ form: "Sign-up object is missing." });
      return;
    }
    try {
      const verificationResponse = await signUp.attemptVerification({
        code: verificationCode,
      });
      console.log("Verification attempted:", verificationResponse);

      if (verificationResponse.status === "complete") {
        await client.setSession(verificationResponse.createdSessionId);
        window.location.reload(); // Or redirect to success page
      } else {
        setErrors({
          form: "Verification failed. Please check your email for the correct verification code.",
        });
      }
    } catch (error) {
      console.error(error);
      setErrors({ form: "An error occurred during verification." });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4 text-center">Register</h1>
      <form onSubmit={showVerification ? handleVerification : handleSignUp}>
        {!showVerification && (
          <>
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
                className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

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
                className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePasswordStrength(e.target.value);
                }}
                className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)] ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
              {password && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Strong"
                      ? "text-green-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>
          </>
        )}

        {showVerification && (
          <div className="mb-4">
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code:
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)]"
            />
          </div>
        )}

        {errors.form && (
          <p className="text-sm text-red-500 mt-1">{errors.form}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
        >
          {showVerification ? "Verify" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
