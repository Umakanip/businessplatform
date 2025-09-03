import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Roles from "./components/Roles";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

import AuthContainer from "./components/AuthContainer";
import InvitationsList from "./components/profile";

import PaymentPage from "./components/Payment"; // Importing the PaymentPage component
import ConnectPage from "./components/Connect";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <Roles />
                <Pricing />
                <Footer />
              </>
            }
          />

          {/* Auth Container Page */}
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/invitation" element={<InvitationsList />} />

          {/* Payment Page */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/connect" element={<ConnectPage/>} />

          {/* Fallback 404 Page */}
          <Route
            path="*"
            element={
              <h1 className="text-white text-center mt-20 text-3xl">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
