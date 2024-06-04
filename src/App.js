import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import LoginForm from "./components/LoginForm";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import SignedInPage from "./components/SignedInPage";
import MagicLinkCallback from "./components/MagicLinkCallback";

const App = () => {
  return (
    <Router>
      <div className="App bg-purple-600 w-screen h-screen">
        <header>
          <SignedOut>
            <LoginForm />
          </SignedOut>
          <SignedIn>
            <div className="max-w-md mx-auto px-8 text-center bg-white border-2 border-black shadow-md rounded-md p-8 translate-y-2/4">
              <h1 className="text-3xl font-semibold mb-4 text-center">
                User Profile
              </h1>
              <UserButton />
            </div>
          </SignedIn>
        </header>
        <Routes>
          <Route path="/magic-link-callback" element={<MagicLinkCallback />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signed-in" element={<SignedInPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
