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

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          <SignedOut>
            <LoginForm />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signed-in" element={<SignedInPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
