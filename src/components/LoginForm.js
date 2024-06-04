import React from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordPage from "./ForgotPasswordPage";
import RegistrationForm from "./RegistrationForm";
import { atom, useAtom } from "jotai";

// Manage state of authentication processes
const usernameAtom = atom("");
const passwordAtom = atom("");
const errorsAtom = atom({});
const isRegisteringAtom = atom(false);
const emailAtom = atom("");
const isForgotPasswordAtom = atom(false);

const LoginForm = () => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const [username, setUsername] = useAtom(usernameAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [isRegistering, setIsRegistering] = useAtom(isRegisteringAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [isForgotPassword, setIsForgotPassword] = useAtom(isForgotPasswordAtom);
  const navigate = useNavigate();

  // Handle bad form inputs
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        await signIn.create({
          identifier: username,
          password,
        });
        window.location.reload(); // Reload the page after successful login
      } catch (error) {
        if (error.errors) {
          const errorMessage = error.errors[0].message;
          if (errorMessage === "No matching username or email address found.") {
            setErrors({ form: "Invalid username or password" });
          } else {
            setErrors({ form: errorMessage });
          }
        } else {
          setErrors({ form: "Invalid username or password" });
        }
      }
    } else {
      setErrors(formErrors);
    }
  };

  // Prop to pass to Registration page
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        await signUp.create({
          emailAddress: email,
          password,
        });
        await signUp.prepareEmailAddressVerification();
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

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLoginClick = () => {
    setIsForgotPassword(false);
  };

  return (
    <div className="max-w-md mx-auto px-8  bg-white border-2 border-black shadow-md rounded-md p-8 translate-y-2/4">
      {!isRegistering && !isForgotPassword ? (
        <>
          <h1 className="text-3xl font-semibold mb-4 text-center">Login</h1>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Email / Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)]  ${
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
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 focus:outline-none block w-full rounded-lg border-gray-300 shadow-[1px_1px_0px_0px_rgba(209,213,219)] border rounded-md   border-solid border-2 p-2 hover:border-purple-600 hover:shadow-[1px_1px_0px_0px_rgba(147,51,234)] focus:border-purple-600 focus:shadow-[1px_1px_0px_1px_rgba(147,51,234)]    ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
            >
              Login
            </button>
          </form>

          <div className="mt-2">
            <button
              onClick={() => setIsRegistering(true)}
              className="w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
            >
              No account? Register now
            </button>
          </div>
          <div className="mt-8">
            <Link
              onClick={handleForgotPasswordClick}
              className="w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
            >
              Forgot Password?
            </Link>
          </div>
        </>
      ) : isForgotPassword ? (
        <>
          <ForgotPasswordPage />
          <div className="mt-2">
            <button
              onClick={handleBackToLoginClick}
              className="w-full mt-12 py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
            >
              Back to Login
            </button>
          </div>
        </>
      ) : (
        <>
          <RegistrationForm
            // Pass props to RegistrationForm component
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            errors={errors}
            setErrors={setErrors}
            handleSignUpSubmit={handleSignUpSubmit}
          />

          <div className="mt-2">
            <button
              onClick={() => setIsRegistering(false)}
              className="mt-12 w-full py-2 px-4 border border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0)] text-sm font-medium text-white bg-purple-600 hover:shadow-[2px_2px_0px_0px_rgba(255,220,0,1)]"
            >
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;
