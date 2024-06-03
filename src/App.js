import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import SignedInPage from "./components/SignedInPage";
import "./App.css";

function App() {
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
          <Route path="/" element={<HomePage />} />
          <Route path="/signed-in" element={<SignedInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
