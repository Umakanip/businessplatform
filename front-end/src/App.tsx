import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import Sidebar from "./components/Sidebar/Sidebar";
import AuthContainer from "./components/Pages/AuthContainer";
import InvitationsList from "./components/Pages/profile";
import PaymentPage from "./components/Pages/Payment";
import ConnectPage from "./components/Pages/Connect";

// Pages
import Home from "./components/Pages/Home";

// Idea Holder
import IdeaHolderDashboard from "./pages/ideaHolder/Dashboard";
import Connections from "./pages/ideaHolder/Connections";
import Subscription from "./pages/ideaHolder/Subscription";
import NotificationsIH from "./pages/ideaHolder/Notifications";
import ProfileIH from "./pages/ideaHolder/Profile";
import SettingsIH from "./pages/ideaHolder/Settings";

// Investor
import InvestorDashboard from "./pages/investor/Dashboard";
import Investments from "./pages/investor/Investments";
import NotificationsInv from "./pages/investor/Notifications";
import ProfileInv from "./pages/investor/Profile";
import SettingsInv from "./pages/investor/Settings";

// Common

const App: React.FC = () => {
  // Hardcoded role for now (later from auth)
  const role: "idea-holder" | "investor" = "idea-holder";

  return (
    <Router>
      <MainLayout role={role} />
    </Router>
  );
};

// Layout Component
const MainLayout: React.FC<{ role: "idea-holder" | "investor" }> = ({ role }) => {
  const location = useLocation();

  // Show sidebar only inside dashboard routes
  const showSidebar =
    location.pathname.startsWith("/ih/") || location.pathname.startsWith("/inv/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {showSidebar && <Sidebar role={role} />}

      <div className={`flex-1 ${showSidebar ? "ml-64" : ""} p-6`}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth / Other Pages */}
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/invitation" element={<InvitationsList />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/connect" element={<ConnectPage />} />

          {/* Idea Holder Routes */}
          <Route path="/ih/dashboard" element={<IdeaHolderDashboard />} />
          <Route path="/ih/connections" element={<Connections />} />
          <Route path="/ih/subscription" element={<Subscription />} />
          <Route path="/ih/notifications" element={<NotificationsIH />} />
          <Route path="/ih/profile" element={<ProfileIH />} />
          <Route path="/ih/settings" element={<SettingsIH />} />

          {/* Investor Routes */}
          <Route path="/inv/dashboard" element={<InvestorDashboard />} />
          <Route path="/inv/investments" element={<Investments />} />
          <Route path="/inv/notifications" element={<NotificationsInv />} />
          <Route path="/inv/profile" element={<ProfileInv />} />
          <Route path="/inv/settings" element={<SettingsInv />} />

          {/* Common */}
          {/* <Route path="/logout" element={<Logout />} /> */}

          {/* 404 */}
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
    </div>
  );
};

export default App;
